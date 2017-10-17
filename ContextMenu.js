/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated(n) {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item " + n + " created successfully");
    }
}

/*
Called when the item has been removed.
We'll just log success here.
*/
function onRemoved() {
    console.log("Item removed successfully");
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
    console.log(`Error: ${error}`);
}

/*
Create all the context menu items.
*/
function loadContextMenu() {
    browser.contextMenus.create({
        type: "normal",
        id: "audio",
        title: browser.i18n.getMessage("contextMenuItemAddAudioNote"),
        contexts: ["all"]
    }, onCreated(browser.i18n.getMessage("contextMenuItemAddAudioNote")));

    browser.contextMenus.create({
        type: "normal",
        id: "video",
        title: browser.i18n.getMessage("contextMenuItemAddVideoNote"),
        contexts: ["all"]
    }, onCreated(browser.i18n.getMessage("contextMenuItemAddVideoNote")));

    browser.contextMenus.create({
        type: "normal",
        id: "sticky",
        title: browser.i18n.getMessage("contextMenuItemAddStickyNote"),
        contexts: ["all"]
    }, onCreated(browser.i18n.getMessage("contextMenuItemAddStickyNote")));

    browser.contextMenus.create({
        type: "normal",
        id: "url",
        title: browser.i18n.getMessage("ContextMenuItemUrl"),
        contexts: ["selection"]
    }, onCreated(browser.i18n.getMessage("ContextMenuItemUrl")));

    browser.contextMenus.create({
        type: "normal",
        id: "changeText",
        title: browser.i18n.getMessage("ContextMenuItemChangeText"),
        contexts: ["selection"]
    }, onCreated(browser.i18n.getMessage("ContextMenuItemChangeText")));

    browser.contextMenus.create({
        type: "normal",
        id: "highlight",
        title: browser.i18n.getMessage("ContextMenuItemHighlight"),
        contexts: ["selection"]
    }, onCreated(browser.i18n.getMessage("ContextMenuItemHighlight")));

    browser.contextMenus.create({
        type: "normal",
        id: "underline",
        title: browser.i18n.getMessage("ContextMenuItemUnderline"),
        contexts: ["selection"]
    }, onCreated(browser.i18n.getMessage("ContextMenuItemUnderline")));

    browser.contextMenus.create({
        type: "normal",
        id: "crossout",
        title: browser.i18n.getMessage("ContextMenuItemCrossout"),
        contexts: ["selection"]
    }, onCreated(browser.i18n.getMessage("ContextMenuItemCrossout")));
}


/*
Toggle checkedState, and update the menu item's title
appropriately.

Note that we should not have to maintain checkedState independently like
this, but have to because Firefox does not currently pass the "checked"
property into the event listener.
*/
function updateCheckUncheck() {
    checkedState = !checkedState;
    if (checkedState) {
        browser.contextMenus.update("check-uncheck", {
            title: browser.i18n.getMessage("contextMenuItemUncheckMe"),
        });
    } else {
        browser.contextMenus.update("check-uncheck", {
            title: browser.i18n.getMessage("contextMenuItemCheckMe"),
        });
    }
}

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.contextMenus.onClicked.addListener(function(info, tab) {
    sendMessage({
        active: true,
        currentWindow: true
    }, {
        option: "newItem",
        type: info.menuItemId,
        id: getNextId()
    });
});


function InjectCode() {
    function onError(error) {
        console.log(`Error: ${error}`);
    }


    browser.tabs.executeScript({
        file: "ContentScript/TextSelection.js"
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/Menu.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/Sticky.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/Highlight.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/Underline.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/Crossout.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/ChangeText.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/TextBox.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/Url.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/Audio.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/Video.js" })
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/Media.js" })
    }).then(() => {
        browser.tabs.insertCSS({ file: "ContentScript/PageModifier.css" });
    }).then(() => {
        browser.tabs.executeScript({ file: "ContentScript/PageModifier.js" })
    });
}
browser.webNavigation.onCompleted.addListener(details => {
    if (details.frameId !== 0) {
        return;
    }
    InjectCode();
});