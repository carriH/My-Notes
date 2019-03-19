# My-Notes
My notes is a Firefox extension that allows you to add annotations inside a web page. It provides mainly 3 different kinds of annotations:

- **Sticky notes:** Add colorful notes anywhere on the page and write whatever you want inside. Move or rescale your notes however you want.
- **Multimedia annotations:** Record audio or video messages and put them wherever you want on the page. You can change the player size, move it and even hide it (an icon that identify the type of annotation will be shown instead). 
- **Text highlighting:** Select any text on the page and makes it highlighted with these annotations by changing its format (cross out, underline, bold). Link the text with any web site or add change text annotations.

NOTE: Please, remember to reboot the brwoser after installing the addon for its proper functioning.

## Using the extension

In order to create a new note in a page, you only have to follow these steps:
1- Wait till the page is completelly loaded (if not, the creation of the note may not work as expected).
2- If you want to add an sticky note or a multimedia note, right click in the point you want to add it. If you want to add a text highlighting note, select the desired text and right click.
3- In the context menu, go to the option "My notes" and select the annotation type you want to create.

### Types of notes:

There are different types of notes that can be added, and each type has some particular caracteristics:
- **Sticky notes:** Creates a rectangle of text in the selected point of the page. It can be moved by dragging it with the mouse and resized by putting the mouse in the borders (and corners) and dragging them (there are a minimum limit for the with and heigth of that annotations). In order to write text, just click inside the note and start to write. Changes are saved when the annotation is moved to a new position, when the resizing operation is over or when it looses the focus.
- **Audio notes:** Creates an audio note in the selected point of the page. When it is created, this note is shown as a microphone icon. Clicking on it the icon will turn red and it will start to record. Clicking it again will stop the record and will make the icon to change to a musical note. After an audio is recorded, clicking on the icon will show/hide the player. The icon (or the player) can be moved to any place of the page by dragging it. The player can be resized (only horizontally) by dragging its edges, but it has a minimum limit.
- **Video notes:** Creates a video note in the selected point of the page. When it is created, this note is shown as a cam icon. Clicking on it the icon will turn red and it will start to record. Clicking it again will stop the record and will make the icon to change to a movie frame. After a video is recorded, clicking on the icon will show/hide the player. The icon (or the player) can be moved to any place of the page by dragging it. The player can be resized by dragging its edges, but it has a minimum limit (Note: the height of the player will not change when resizing the note vertically. This will only affect to the video).
- **Highlight text notes:** Adds a background color to the selected text. This kind of annotation cannot be resized or moved.
- **Underline text notes:** Underlines the selected text and adds a background color. This kind of annotation cannot be resized or moved.
- **crossout text notes:** Crossouts the selected text and adds a background color. This kind of annotation cannot be resized or moved.
- **URL text notes:** Puts in bold and underlines the selected text, changes the text color and Adds a background color. When this annotation is added, a new popup is opened asking for the URL that will be linked with the note. Write the correct URL (including de protocol, e.g. "HTTP" or "HTTPS") or cancel if you still don´t want to add an URL (there is an option to update the URL in the context menu of the note). If an URL is added, when the mouse hovers the note, the pointer will change to a hand, and the link can be opened by clicking on the note with left button. If the URL is not added, the mouse will change to an arrow and, if you clicks on the note, the popup to add a correct URL will be shown. This kind of annotation cannot be resized or moved.
- **Change text notes:** Adds a background color to the selected text and a rectangle of text under the selected text. You can write what you want in that rectangle of text. That rectangle of text can be resized by dragging any border (except border on top). It cannot be moved.

### Sidebar:

This extension provides a sidebar that shows all the pages with annotations. By default, the list of notes in each page will be shown collapsed, but it can be expanded by clicking the `+` icon. When the active page has annotations, it will be shown the first in the list in the sidebar, and will automatically be expanded showing all the notes. When a note cannot be loaded in a page, its format in the sidebar will change (background color will change to red, color will change to white and tooltip will change to the exception raised when trying to load the note). By default, the name of the page will be the URL of the page, but it can be changed by clicking on it with left button and writting the new name.

On the top left side of the sidebar there are a menu with different actions:
- **Export current page:** Create an XML file with all the notes in current page. This option will be active only if current page has annotations.
- **Export all:** Create an XML file with all the notes in all the pages.
- **Import XML:** Import the notes from an XML file.
- **Copy all (opened pages):** Copy all the text of all the annotations. It only affect to pages that are opened.
- **Delete current page:** Delete all the annotations from current page. This option will be active only if current page has annotations.
- **Delete all pages:** Delete all the annotations.

### Context menu:

Each element of the extension has a context menu with different actions:

#### Context menu in Annotations (inside the page):
- **Change text color:** Change the text color of the note. When clicking on this option a popup to pick the new color will be opened. If a new color is selected, the text color of the note (and the reference in the sidebar) will change. If it is a multimedia note, this color will be applied to the icons and controls. If it is a changetext note, this color will be applied into the text box.
- **Change background color:** Change the background color of the note. When clicking on this option a popup to pick the new color will be opened. If a new color is selected, the background color of the note (and the reference in the sidebar) will change. If it is a changetext note, this color will be applied into the text box.
- **Change selection text color:**  Change the text color of the selection. This option only is avaliable in change text annotations (use the option "Change text color" in the other notes). This change won´t affect to the reference of the note in the sidebar.
- **Change selection background color:** Change the background color of the selection. This option only is avaliable in change text annotations (use the option "Change background color" in the other notes). This change won´t affect to the reference of the note in the sidebar.
- **Delete item:** Delete permanently the annotation from the page (this operation cannot be undone). WARNING: in text annotations, if there are more than one annotation in same HTML element and one of them is deleted, the rest of the annotations may dissappear. This is caused by the way how the annotations are saved. 
- **Copy text:** Copy the text of the note. This option has different effects depending on the type of annotation:
    - Sticky note: Copy the text written inside the note.
    - Multimedia note: Not available.
    - Change text: Copy the text of the text box.
    - Selection notes: Copy the highlighted text.
- **Edit URL:** This option only is available in URL notes. It opens a popup to change the URL of the annotation.

#### Context menu in page name (in sidebar):
- **Open URL:** Open the page in a new tab. Due to security restrictions of WebExtension, special pages (pages like "about:", "file:" or "javascript:") cannot be opened. 
- **Delete page:** Delete all the notes of the page.
- **Export page:** Export all the notes of the page into an XML file.
- **Copy all:** Copy the text of all the notes in the page. This option is available only when the page is opened.
- **Reload annotations:** Reload the annotations in the page. If an annotation has failed when trying to be opened, this option will solve the issue (if the pro5blem is temporal)

#### Context menu in annotations (in sidebar):
- **Delete item:** Delete the element from the page. It works like the same option of the annotation inside the page.
- **Change background color:** Change the background color of the note. It works like the same option of the annotation inside the page, but only is available when the page is opened.
- **Change text color:** Change the text color of the note. It works like the same option of the annotation inside the page, but only is available when the page is opened.
- **Copy text:** Copy the text of the note. It works like the same option of the annotation inside the page, but only is available when the page is opened.

### Extension options:

Accessing to the extension options will allow you to customize the extension. It will let you change the default color and opacity of each annotation. In this page you can to change too the name that will be added as author of the notes. Options won´t be saved till you press the button "Save". Use the button "Default values" to recover the values assigned by default.

## Changelog:

Version 2.0.0:

- Show all pages with annotations in sidebar. Now, each annotation is shown inside its page.
    - Default name of each page is the url of the page, but it can be changed by clicking with left button.
    - New options can be executed from each page element. They are accessible by a context menu (click right button over the name of the page).
- All hamburguer menus have been changed by context menus (in sidebar and inside the page).
- UI and icons have been redesigned. 
- Fixed sidebar icon (it was not shown in previous version).


Version 2.0.1:

- Fixed issue that causes the addon to fail when adding comments to a new page.
