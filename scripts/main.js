"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inputForm");
    const fileInput = document.getElementById("fileUpload");
    const textInput = document.getElementById("textInput");
    const exportButton = document.getElementById("exportButton");
    const grid = document.getElementById("dataGrid");

    if (!form || !fileInput || !textInput || !exportButton || !grid) {
        console.error("Missing required HTML elements.");
        return;
    }

    const links = new Set();
    let activeCard = null;
    let previousFocus = null;

    const style = document.createElement("style");

    style.textContent = `
        .grid-item {
            min-width: 0;
            cursor: pointer;
        }

        .video-title {
            overflow-wrap: anywhere;
            margin-bottom: 12px;
        }

        .video-preview {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            overflow: hidden;
            background: #080d18;
            border: 1px solid #263957;
            border-radius: 8px;
        }

        .video-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .preview-placeholder {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            background: linear-gradient(145deg, #172742, #080d18);
            color: white;
            text-align: center;
        }

        .preview-platform {
            color: #ff665d;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .preview-play {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: #ff3b30;
            border-radius: 50%;
            font-size: 20px;
        }

        .preview-hint {
            color: #9eacc2;
            font-size: 12px;
        }

        .video-actions {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin-top: 12px;
        }

        .video-link, .remove-link {
            padding: 8px 12px;
            border: 1px solid #263957;
            border-radius: 6px;
            font-size: 12px;
            text-decoration: none;
            cursor: pointer;
        }

        .video-link {
            color: white;
            background: #1c2d4a;
        }

        .remove-link {
            color: white;
            background: #ff3b30;
        }

        .video-modal {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: none;
            justify-content: center;
            align-items: center;
            padding: 55px 16px 16px;
            background: rgba(0, 0, 0, 0.95);
        }

        .video-modal.is-open {
            display: flex;
        }

        .video-modal-content {
            display: flex;
            flex-direction: column;
            width: min(1100px, 100%);
            height: min(82vh, 850px);
            min-height: 280px;
            overflow: hidden;
            background: #080d18;
            border: 1px solid #263957;
            border-radius: 10px;
        }

        .video-modal-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            background: #111d33;
            color: white;
        }

        .video-modal-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .video-modal-button, .video-modal-close {
            padding: 9px 12px;
            color: white;
            background: #263957;
            border: 0;
            border-radius: 5px;
            cursor: pointer;
        }

        .video-modal-close {
            position: absolute;
            top: 10px;
            right: 14px;
            padding: 5px 12px;
            background: #ff3b30;
            font-size: 24px;
        }

        .video-modal-player {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            min-height: 0;
            background: black;
        }

        .video-modal-player iframe {
            width: 100%;
            height: 100%;
            border: 0;
        }

        .video-modal-message {
            padding: 28px;
            color: white;
            text-align: center;
            line-height: 1.6;
        }

        .video-modal-message a {
            color: #ff665d;
        }

        @media (max-width: 600px) {
            .video-modal-content {
                height: 75vh;
            }
        }
    `;

    document.head.appendChild(style);

    const modal = document.createElement("div");
    modal.className = "video-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
        <button class="video-modal-close"
                type="button"
                aria-label="Close video">&times;</button>
        <div class="video-modal-content">
            <div class="video-modal-toolbar">
                <span class="video-modal-label">Video player</span>
                <button class="video-modal-button fullscreen-button"
                        type="button">Fullscreen</button>
            </div>
            <div class="video-modal-player"></div>
        </div>
    `;

    document.body.appendChild(modal);

    const modalContent = modal.querySelector(".video-modal-content");
    const modalPlayer = modal.querySelector(".video-modal-player");
    const modalLabel = modal.querySelector(".video-modal-label");
    const closeButton = modal.querySelector(".video-modal-close");
    const fullscreenButton = modal.querySelector(".fullscreen-button");

    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

        function getYouTubeId(value) {
        try {
            const url = new URL(value);
            const host = url.hostname.toLowerCase()
                .replace(/^www\./, "")
                .replace(/^m\./, "");

            if (host === "youtu.be") {
                return url.pathname.split("/").filter(Boolean)[0] || null;
            }

            if (
                host === "youtube.com" ||
                host === "youtube-nocookie.com" ||
                host.endsWith(".youtube.com")
            ) {
                if (url.pathname === "/watch") {
                    return url.searchParams.get("v");
                }

                const match = url.pathname.match(
                    /^\/(?:embed|shorts|live|v)\/([^/?]+)/
                );

                return match ? match[1] : null;
            }
        } catch {
            return null;
        }

        return null;
    }

    function getInstagramPath(url) {
        const match = url.pathname.match(
            /^\/(reel|p|tv)\/([A-Za-z0-9_-]+)\/?/
        );

        return match ? `/${match[1]}/${match[2]}/` : null;
    }

    function normalizeUrl(value) {
        try {
            const url = new URL(value.trim());

            if (!["http:", "https:"].includes(url.protocol)) {
                return null;
            }

            const host = url.hostname.toLowerCase()
                .replace(/^www\./, "");

            if (
                host === "instagram.com" ||
                host.endsWith(".instagram.com")
            ) {
                if (!getInstagramPath(url)) return null;
            }

            if (
                host === "youtube.com" ||
                host.endsWith(".youtube.com") ||
                host === "youtube-nocookie.com" ||
                host === "youtu.be"
            ) {
                const id = getYouTubeId(url.href);
                if (!id || !/^[\w-]{11}$/.test(id)) return null;
            }

            return url.href;
        } catch {
            return null;
        }
    }

    function getPlatform(url) {
        const host = new URL(url).hostname.toLowerCase()
            .replace(/^www\./, "");

        if (getYouTubeId(url)) return "YouTube";

        if (
            host === "instagram.com" ||
            host.endsWith(".instagram.com")
        ) {
            return "Instagram";
        }

        return host;
    }

    function addLink(value) {
        const url = normalizeUrl(value);

        if (!url || links.has(url)) return false;

        links.add(url);

        const platform = getPlatform(url);
        const card = createElement("article", "grid-item");
        card.dataset.url = url;
        card.tabIndex = 0;
        card.setAttribute("role", "button");

        const heading = createElement("h3", "video-title", platform);
        const preview = createElement("div", "video-preview");
        const placeholder = createElement("div", "preview-placeholder");

        placeholder.append(
            createElement("div", "preview-platform", platform),
            createElement("div", "preview-play", "▶"),
            createElement("div", "preview-hint", "Click to watch")
        );

        preview.appendChild(placeholder);

        const youtubeId = getYouTubeId(url);

        if (youtubeId) {
            const image = document.createElement("img");
            image.src =
                `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`;
            image.alt = "YouTube thumbnail";
            image.loading = "lazy";

            image.addEventListener("error", () => image.remove(), {
                once: true
            });

            preview.prepend(image);
        }

        const actions = createElement("div", "video-actions");

        const openLink = createElement("a", "video-link", "Open original");
        openLink.href = url;
        openLink.target = "_blank";
        openLink.rel = "noopener noreferrer";
        openLink.addEventListener("click", event => event.stopPropagation());

        const removeButton = createElement("button", "remove-link", "Remove");
        removeButton.type = "button";

        removeButton.addEventListener("click", event => {
            event.stopPropagation();

            if (activeCard === card) closeModal();

            links.delete(url);
            card.remove();
        });

        actions.append(openLink, removeButton);
        card.append(heading, preview, actions);

        card.addEventListener("click", () => openModal(card, url));

        card.addEventListener("keydown", event => {
            if (event.target !== card) return;

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModal(card, url);
            }
        });

        grid.appendChild(card);
        return true;
    }

        function openModal(card, url) {
        activeCard = card;
        previousFocus = document.activeElement;
        modalLabel.textContent = getPlatform(url);
        modalPlayer.replaceChildren();

        const youtubeId = getYouTubeId(url);

        if (youtubeId) {
            const iframe = document.createElement("iframe");
            const params = new URLSearchParams({
                autoplay: "1",
                playsinline: "1",
                rel: "0"
            });

            iframe.src =
                `https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?${params}`;
            iframe.title = "YouTube video player";
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; " +
                "gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";

            modalPlayer.appendChild(iframe);
        } else {
            const parsed = new URL(url);
            const host = parsed.hostname.toLowerCase()
                .replace(/^www\./, "");

            if (
                host === "instagram.com" ||
                host.endsWith(".instagram.com")
            ) {
                const path = getInstagramPath(parsed);

                if (path) {
                    const iframe = document.createElement("iframe");
                    iframe.src = `https://www.instagram.com${path}embed/`;
                    iframe.title = "Instagram Reel";
                    iframe.allow =
                        "autoplay; encrypted-media; picture-in-picture; web-share";
                    iframe.allowFullscreen = true;
                    iframe.referrerPolicy = "strict-origin-when-cross-origin";

                    modalPlayer.appendChild(iframe);
                } else {
                    showMessage("Unsupported Instagram link.");
                }
            } else {
                showMessage(
                    "This website does not support an embedded player.",
                    url
                );
            }
        }

        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function showMessage(message, url) {
        const box = createElement("div", "video-modal-message");
        box.appendChild(createElement("p", "", message));

        if (url) {
            const link = createElement("a", "", "Open original video");
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            box.appendChild(link);
        }

        modalPlayer.appendChild(box);
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modalPlayer.replaceChildren();
        document.body.style.overflow = "";

        const focusTarget = previousFocus;
        activeCard = null;
        previousFocus = null;

        if (focusTarget && focusTarget.isConnected) {
            focusTarget.focus();
        }
    }

    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });

    fullscreenButton.addEventListener("click", async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await modalContent.requestFullscreen();
            }
        } catch (error) {
            console.error("Fullscreen unavailable:", error);
            alert("Fullscreen is unavailable in this browser.");
        }
    });
        fileInput.addEventListener("change", async () => {
        const file = fileInput.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".txt")) {
            alert("Please upload a .txt file.");
            fileInput.value = "";
            return;
        }

        try {
            const content = await file.text();
            let added = 0;
            let duplicates = 0;
            let invalid = 0;

            for (const line of content.split(/\r?\n/)) {
                const value = line.trim();

                if (!value || value.startsWith("#")) continue;

                const url = normalizeUrl(value);

                if (!url) {
                    invalid++;
                } else if (links.has(url)) {
                    duplicates++;
                } else if (addLink(url)) {
                    added++;
                }
            }

            alert(
                "Import complete!\n" +
                `Added: ${added}\n` +
                `Duplicates: ${duplicates}\n` +
                `Invalid links: ${invalid}\n` +
                `Total links: ${links.size}`
            );
        } catch (error) {
            console.error("Import failed:", error);
            alert("Could not read the selected file.");
        } finally {
            fileInput.value = "";
        }
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        const value = textInput.value.trim();

        if (!value) {
            alert("Please enter a link.");
            return;
        }

        if (!normalizeUrl(value)) {
            alert("Please enter a valid supported video URL.");
            return;
        }

        if (!addLink(value)) {
            alert("This link already exists in the grid.");
            return;
        }

        textInput.value = "";
        textInput.focus();
    });

    exportButton.addEventListener("click", () => {
        if (links.size === 0) {
            alert("There are no links to export.");
            return;
        }

        const blob = new Blob(
            [Array.from(links).join("\n")],
            { type: "text/plain;charset=utf-8" }
        );

        const downloadUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = downloadUrl;
        downloadLink.download = "video-links.txt";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    });
});