Personal Video Library

A lightweight, browser-based application for collecting, previewing, watching, and exporting video links from YouTube, Instagram, and other websites.

The application is designed for personal use. Instead of maintaining separate video lists for different platforms, you can import links from a text file or add them individually. The links appear as cards in a grid, and supported videos can be opened in an in-page player.

Table of Contents
Project Overview
Features
Technologies
Project Structure
Requirements
Installation and Setup
HTML Requirements
How to Use
Video Playback
Link Management
Exporting Links
Design and Theme
Technical Implementation
Limitations
Troubleshooting
Privacy and Security
Future Improvements
1. Project Overview

Personal Video Library is a frontend-only web application that organizes video URLs into a visual grid.

The application provides a simple interface with three main areas:

Navigation: Contains navigation links and an Export button.
Main content: Contains the text-file upload control, URL input form, and video-card grid.
Footer: Displays the owner and year.

The application uses JavaScript to process links, create cards dynamically, open supported videos in an in-page modal, remove links, and export the current list.

No backend server or database is required for the current implementation.

2. Features
Link importing
Upload a .txt file containing multiple video URLs.
Read one URL per line.
Ignore empty lines.
Ignore lines beginning with #.
Validate URL formats.
Reject duplicate URLs already present in the current list.
Display an import summary showing added, duplicate, and invalid links.

Example input file:

https://www.instagram.com/reel/DaR621qi_K3/
https://www.instagram.com/reel/Dem3trBhfIU/
https://www.youtube.com/shorts/97FPfWJZ0v4

Manual link entry
Enter a video URL into the input field.
Submit the form to add a new card.
Reject invalid or duplicate links.
Clear the input field after a successful addition.
Dynamic video grid
Generate a card for each accepted URL.
Display the platform name or website hostname.
Display YouTube thumbnails when available.
Use a clean placeholder for Instagram links.
Open the selected card in an in-page modal.
Remove individual cards from the grid.
In-page video player
Play supported YouTube videos and Shorts using an embedded YouTube player.
Display Instagram posts and Reels using Instagram's official embed endpoint.
Keep the player inside a modal rather than immediately navigating away from the application.
Provide a close button and support closing with the Escape key.
Provide a fullscreen button when the browser supports fullscreen mode.
Export
Export all currently stored links into a downloadable .txt file.
Preserve their insertion order.
Exclude links that have been removed.
Export one URL per line.
User interface
Dark theme.
Navy-blue backgrounds and surfaces.
Flame-red accents.
Responsive modal layout.
Basic keyboard accessibility for video cards.
3. Technologies

The application uses standard frontend technologies.

Technology	Purpose
HTML5	Page structure and forms
CSS3	Layout, dark theme, cards, and modal styling
JavaScript	Link management, imports, embeds, and exports
DOM API	Dynamic creation and removal of elements
Blob API	Generating downloadable text files
URL API	URL validation and download URLs
YouTube embed player	Playback of supported YouTube videos
Instagram embed endpoint	Playback of supported Instagram posts and Reels
Live Server	Local development and testing

No frontend framework or package manager is required for the current version.

4. Project Structure

A recommended project structure is:

personal-video-library/
├── index.html
├── style.css
├── script.js
└── README.md

index.html

Contains the page structure, including navigation, upload controls, input form, grid container, and footer.

style.css

Contains the main application theme and layout styles.

script.js

Contains the application logic, including:

URL validation and platform detection.
Link importing and duplicate prevention.
Dynamic card creation.
YouTube thumbnail loading.
In-page video modal.
Fullscreen handling.
Link removal.
TXT export.

The current JavaScript implementation injects additional styles for the cards and modal into the document. Those styles do not have to be duplicated in style.css.

README.md

Contains project documentation and setup instructions.

5. Requirements

You need:

A modern web browser, such as Chrome, Edge, or Firefox.
A code editor, such as Visual Studio Code.
Visual Studio Code's Live Server extension, or another local HTTP server.
An internet connection for remote video embeds and thumbnails.

No Node.js installation or build process is required for this frontend-only version.

6. Installation and Setup
Step 1: Create the project folder

Create a folder named personal-video-library.

Add the following files:

index.html
style.css
script.js
README.md

Step 2: Configure the HTML

Ensure that the HTML includes the following element IDs because the JavaScript depends on them:

HTML
<input type="file" id="fileUpload" accept=".txt">

<form id="inputForm">
    <input
        type="url"
        id="textInput"
        placeholder="Enter a video URL"
        required
    >
    <button type="submit">Add Link</button>
</form>

<div id="dataGrid"></div>

<button type="button" id="exportButton">Export</button>


These are the minimum relevant elements, not a complete replacement for the page layout.

Step 3: Link the CSS and JavaScript

Inside the HTML document's <head> section, include:

HTML
<link rel="stylesheet" href="style.css">


Before the closing </body> tag, include:

HTML
<script src="script.js"></script>


Ensure the paths match the actual file locations.

Step 4: Start Live Server

In Visual Studio Code:

Open the project folder.
Open index.html.
Right-click the editor.
Select Open with Live Server.
Use the browser page opened by Live Server.

Using an HTTP server is preferable to opening the file directly through a file:// URL.

Step 5: Test the application

Try the following:

Add a YouTube Shorts URL.
Click the generated card.
Confirm that the video opens in the modal.
Add an Instagram Reel URL.
Check whether the Reel is available for embedding.
Import a .txt file containing several URLs.
Remove a card.
Click Export and inspect the downloaded text file.
7. HTML Requirements

The JavaScript expects these IDs to exist:

ID	Purpose
inputForm	Form for submitting a URL
fileUpload	Text-file upload input
textInput	URL entry field
exportButton	Button that exports all current links
dataGrid	Container for dynamically generated cards

If any of these IDs are missing or spelled differently, the script logs an error and stops initialization.

The navigation links can use placeholder destinations such as #. Their actual navigation behavior is separate from the video management logic.

The footer can display:

Owner: XXX | Year 2026


Replace XXX with the desired owner label.

8. How to Use
Add one video
Copy the video URL.
Paste it into the input field.
Click the submit button.
A card appears in the grid.
Click the card to open the in-page player.
Import several videos
Create a plain-text file.
Add one URL per line.
Save the file with a .txt extension.
Use the file upload control.
Review the import summary.

Blank lines and comment lines beginning with # are ignored.

Watch a video

Click the video card. The application opens a modal overlay containing the relevant embedded player.

For supported videos, use the embedded player's controls to play, pause, seek, adjust volume, or access additional playback options.

Use the modal's close button or press Escape to close the player.

Remove a video

Click the Remove button on the card.

The card is removed from the grid, and the corresponding URL is removed from the in-memory collection. Removed URLs are not included in the next export.

Export the collection

Click Export in the navigation area.

The browser downloads a file named:

video-links.txt


The file contains one URL per line.

9. Video Playback
YouTube

The application recognizes common YouTube URL formats, including:

youtube.com/watch?v=VIDEO_ID
youtube.com/shorts/VIDEO_ID
youtube.com/embed/VIDEO_ID
youtu.be/VIDEO_ID
Supported YouTube live-video URL formats.

The video ID is extracted from the URL and used to construct an embedded player URL.

A thumbnail is requested from YouTube's thumbnail service. If the thumbnail cannot be loaded, the card remains usable.

The embedded player uses YouTube's youtube-nocookie.com domain in the earlier implementation. If the current implementation uses youtube.com/embed/, playback is subject to YouTube's embed policies and configuration.

Some videos may not be embeddable because of the uploader's settings, copyright restrictions, age restrictions, regional availability, or other platform policies.

Instagram

The application recognizes Instagram post URLs in these formats:

/reel/POST_ID/
/p/POST_ID/
/tv/POST_ID/

The script builds an Instagram embed URL and displays it in an iframe inside the modal.

This avoids rendering the large Instagram embed block in every grid card. The grid itself uses a neutral placeholder.

However, Instagram controls its own embedded content. Depending on the post, account, browser, and platform policies, the embed may display:

A sign-in prompt.
An unavailable-post message.
An error.
An embed that does not play.
A restricted or removed post.

The application cannot reliably remove those platform-controlled messages or bypass authentication requirements.

Other websites

The application accepts valid HTTP and HTTPS URLs from other websites. However, accepting a URL does not mean the site supports embedded playback.

For unsupported sites, the modal displays a message and provides a link to the original video.

Support for other providers requires provider-specific embed handling or an accessible video source.

10. Link Management
In-memory collection

The application uses a JavaScript Set to store URLs:

const links = new Set();


This provides uniqueness and preserves insertion order.

Duplicate detection

A URL that already exists in the collection is not added a second time.

The current implementation compares normalized URL strings. Different URLs pointing to the same underlying video may still be treated as separate entries.

For example, query parameters or alternate URL formats may cause the same video to be stored more than once.

URL validation

The application validates that a submitted URL:

Can be parsed as a URL.
Uses HTTP or HTTPS.
Has an expected structure for supported YouTube and Instagram formats.

This is basic client-side validation. It does not guarantee that a video exists or is accessible.

Data persistence

The current version stores the collection only in memory.

Consequently:

Refreshing the page clears the collection.
Closing the tab clears the collection.
Imported links are not automatically saved.
Exporting the collection is the current way to retain a copy.

A future version could use browser storage to preserve links between sessions.

11. Exporting Links

The export process uses the browser's Blob and object URL APIs.

The application:

Converts the current collection into newline-separated text.
Creates a plain-text Blob.
Generates a temporary download URL.
Triggers a browser download.
Removes the temporary download element.
Releases the temporary URL.

The export contains the current links, not video files.

No video content is downloaded by this feature.

If the collection is empty, the application displays a message instead of downloading an empty file.

12. Design and Theme

The visual design uses a dark navy-blue background with flame-red accents.

Representative colors include:

Color	Hex value	Use
Dark navy	#080D18	Main dark surfaces
Navy blue	#111D33	Modal toolbar and panels
Blue-gray	#1C2D4A	Secondary controls
Slate blue	#263957	Borders and outlines
Flame red	#FF3B30	Primary accent and remove buttons
Soft red	#FF665D	Accent text
Light gray-blue	#9EACC2	Secondary text
White	#FFFFFF	Main text

The interface uses contrast to distinguish controls from the background. The modal is layered above the page using a high z-index.

The modal layout adjusts to smaller screens, while the embedded player fills the available content area.

13. Technical Implementation
Dynamic DOM creation

Cards are created using JavaScript DOM methods such as document.createElement() and appendChild().

Text content is inserted with textContent rather than interpreting imported URLs as HTML. This reduces the risk of HTML injection from link data.

Embedded playback

Video playback is provided through iframes.

The iframe receives a platform-specific URL and relevant attributes, such as:

title
allow
allowFullscreen
referrerPolicy

Embedded pages remain subject to the browser's same-origin policy, content security restrictions, and provider rules.

Modal behavior

The modal:

Opens when a card is selected.
Clears any previous player before loading another.
Prevents background scrolling while open.
Closes with its close button.
Closes when the backdrop is clicked.
Closes with the Escape key.
Restores focus to the previous element when possible.
Fullscreen

The fullscreen button uses the browser Fullscreen API to request fullscreen for the modal content.

Fullscreen behavior depends on browser support and permissions. Embedded player controls may also provide their own fullscreen functionality.

File upload

The selected text file is read locally through the browser's File API.

The contents are processed line by line. The application does not upload the text file to a backend server.

Lazy loading

YouTube thumbnails use the image element's loading="lazy" attribute.

The current card implementation does not need to create an iframe for every card because the actual player is created only when a card is opened. This reduces the number of active embedded players in the grid.

14. Limitations

The current application is a lightweight link manager, not a universal video downloader or streaming proxy.

Important limitations include:

No guaranteed universal embedding: Each website decides whether its content can be embedded.
Instagram restrictions: Authentication, post privacy, removed content, and embed policies may prevent playback.
YouTube restrictions: Some videos cannot be played outside YouTube.
No offline playback: Video playback generally requires an internet connection.
No backend: The application does not synchronize data across devices.
No automatic persistence: Links are lost on refresh unless exported.
No video downloading: Exporting links does not download the media.
No universal metadata extraction: Titles, descriptions, and preview images are not guaranteed for every platform.
No automatic duplicate resolution: Different URLs for the same underlying video may be treated as separate entries.
Browser-dependent fullscreen: Some environments may restrict fullscreen behavior.
Third-party dependencies: Embedded content and thumbnails depend on remote services remaining available.

A frontend-only application cannot guarantee that every provider will play every video directly inside the page without sign-in.

15. Troubleshooting
The application reports missing HTML elements

Cause: One or more required IDs are missing or misspelled.

Solution: Check that the HTML contains inputForm, fileUpload, textInput, exportButton, and dataGrid.

Clicking a YouTube card does not play the video

Possible causes:

The video ID is invalid.
The video is private or removed.
Embedding is disabled by the uploader.
The video is restricted by region, age, or account settings.
The browser or network blocks the embed.

Solution: Test another publicly embeddable video and inspect the browser console for errors.

YouTube displays error 153

This error can relate to missing or invalid HTTP Referer or equivalent client identification information required by YouTube's embedded player.

Possible solutions:

Run the project through Live Server or another local HTTP server rather than opening the HTML directly.
Check that the browser is not blocking relevant requests.
Check whether browser privacy extensions or network policies are interfering.
Verify the embed URL and iframe configuration.

The precise cause can vary by browser and deployment environment.

Instagram displays a sign-in screen

Cause: Instagram controls access to its embedded content.

Solution: Test with a publicly accessible post that permits embedding. If Instagram requires authentication, the frontend cannot reliably force the post to play without that requirement.

Instagram shows an unavailable-post message

The post may have been removed, made private, restricted, or made unavailable for embedding. Verify that the post is accessible and that its URL is correct.

Cards appear but thumbnails are missing

The video may not have an available thumbnail, or the browser may be unable to retrieve it.

The card should still be clickable because playback is opened separately from the thumbnail.

The TXT upload does not work

Check that:

The file extension is .txt.
The file contains one URL per line.
Each URL begins with https:// or http://.
Supported YouTube and Instagram URLs use recognizable formats.
Export does not download a file

Check the browser's download settings and whether downloads are being blocked. Ensure at least one link exists in the grid.

The modal does not enter fullscreen

Check browser support, fullscreen permissions, and whether the page is being displayed in a restricted iframe. You can also try the embedded player's fullscreen control.

Changes do not appear after saving JavaScript

Save all modified files, refresh the Live Server tab, and inspect the browser's developer console for syntax errors.

16. Privacy and Security

The current implementation is designed to operate locally in the browser.

Uploaded TXT files are read using browser APIs.
The link collection is stored in memory.
Exported text is generated locally.
No custom backend is required.
Imported URLs should still be treated as untrusted input.

When an embedded player is opened, the browser contacts the relevant third-party provider. YouTube, Instagram, and other providers may receive connection information and other data according to their own policies.

The application does not bypass provider authentication, private-post restrictions, or content-protection mechanisms.

For improved privacy, avoid importing confidential URLs or links containing sensitive access tokens, and review the privacy policies of any third-party video provider you use.

17. Future Improvements

Potential future enhancements include:

Persistent storage: Save links using localStorage or IndexedDB.
Collections: Organize links into categories or playlists.
Search: Filter the grid by platform, title, or URL.
Sorting: Sort by date added, platform, or custom order.
Drag-and-drop import: Drop a TXT file directly into the page.
Import preview: Review and edit links before adding them.
Improved duplicate detection: Normalize known tracking parameters and compare platform video IDs.
Custom labels: Add personal titles and notes to each link.
Grid controls: Change card size and the number of columns.
Persistent preferences: Remember the preferred grid layout and theme.
Better accessibility: Add focus trapping in the modal and more comprehensive keyboard controls.
Provider adapters: Implement dedicated embed handlers for additional video platforms.
Backup and restore: Export and import a structured JSON collection containing links and metadata.
Error indicators: Show clearer card-level statuses when a preview or embedded player fails.

Any future implementation should continue to respect the restrictions and embedding policies of the respective video platforms.

License and Usage

This is a personal-use frontend project. No specific open-source license is assigned by this README.

If you distribute the application, review the licenses and usage terms of any third-party code or services you add. Embedded media remains subject to the original provider's terms.

Project status: Functional frontend baseline.

Owner: XXX

Year: 2026