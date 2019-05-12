const dateFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
}

const BASECLASS = "MyNotes";

var backgroundScript


browser.runtime.getBackgroundPage().then((background) => {
    backgroundScript = background;
});

//this.menu = new ContextMenu(document.getElementById("menuIcon"));
//this.menu.addMenuItem('exportCurrent', 'MenuOptExportCurrent', exportItemsFromCurrentPages(), false, true);
//this.menu.addMenuItem('exportAll', 'MenuOptExportAll', exportItemsFromAllPages(), false, true);
//this.menu.addMenuItem('importFile', 'MenuOptImport', importXmlFile(), false, true);
//this.menu.addMenuItem('copyAll', 'MenuOptCopyAll', copyItems(), true, true);
//this.menu.addMenuItem('deleteCurrent', 'MenuOptDeleteCurrent', deleteItemsFromCurrentPage(), true, true);
//this.menu.addMenuItem('deleteAll', 'MenuOptDeleteAll', deleteItemsFromAllPages(), false, true);
var menu = null;

function currentPageHasNotes() {
    var check = new Promise(function(resolve, reject) {
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            if (tabs[0] && elemList[tabs[0].url]) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, e => {
            reject("Error getting current tab. " + e);
        });
    });
    return check;
}

document.getElementById("menuIcon").addEventListener("click", function(e) {
        if (menu == null) {
            menu = new ContextMenu(document.getElementById("menuIcon"), true);
            menu.addMenuItem('exportCurrent', 'MenuOptExportCurrent', exportItemsFromCurrentPages, false, currentPageHasNotes, 'PageWithoutNotesMsg');
            menu.addMenuItem('exportAll', 'MenuOptExportAll', exportItemsFromAllPages, false, true);
            menu.addMenuItem('importFile', 'MenuOptImport', importXmlFile, false, true);
            menu.addMenuItem('copyAll', 'MenuOptCopyAll', copyItems, true, true);
            menu.addMenuItem('deleteCurrent', 'MenuOptDeleteCurrent', deleteItemsFromCurrentPage, true, currentPageHasNotes, 'PageWithoutNotesMsg');
            menu.addMenuItem('deleteAll', 'MenuOptDeleteAll', deleteItemsFromAllPages, false, true);
        }
        menu.showMenu(e)
    }

);


function addToSidebar(item, itemName) {
    if (!elemList[itemName]) {
        elemList[itemName] = new SidebarPage(item, itemName);
        elemListNode.appendChild(elemList[itemName].getNodeReference());
        elemList[itemName].addEvents();
        changeActivePage();
        //elemList[item.id].addEvents(backgroundScript);
        //elemList[item.id].addMenu(elemListPosition);
    } else if (item.stickies) {
        elemList[itemName].update(item);
    } else {
        elemList[itemName].addItem(item);
    }
}

function removeFromSide(id, url) {
    if (elemList[url]) {
        var isEmpty;
        if (id) {
            isEmpty = elemList[url].removeItem(id);
        } else {
            isEmpty = elemList[url].removeAll();
        }
        if (isEmpty) {
            elemListNode.removeChild(elemList[url].getNodeReference());
            delete elemList[url];
        }
    }
}

function reportError(id, url, message) {
    if (id && elemList[url]) {
        elemList[url].reportError(id, message);
    }
}

function loadItemsToSidebar() {
    backgroundScript.loadAllFromStorage().then((content) => {
        for (var elem in content) {
            if (content[elem].stickies) {
                addToSidebar(content[elem], elem);
                if (elem != prevUrl) {
                    elemList[elem].collapse();
                }
            }
        }
        changeActivePage();
    });
}

function changeActivePage() {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        var url = tabs[0].url;


        if (url != prevUrl) {
            if (elemList[prevUrl]) {
                elemList[prevUrl].collapse();
            }
        }
        if (elemList[url]) {
            elemList[url].expand();
            if (elemList[url].getNodeReference() != elemListNode.firstChild) {
                elemListNode.insertBefore(elemList[url].getNodeReference(), elemListNode.firstChild);
            }
            prevUrl = url;
        }

    });
}

var elemList = new Array(0);
var elemListNode = document.getElementById("anotations");
var elemListPosition = elemListNode.getBoundingClientRect();
var prevUrl = "";


browser.tabs.onActivated.addListener(loadItemsToSidebar);


function translateRec(node) {
    if (node.attributes) {
        for (var j = 0; j < node.attributes.length; j++) {
            var atValue = node.attributes[j].value.trim();
            if (atValue.match(/__MSG_(\w+)__/g)) {
                node.attributes[j].value = browser.i18n.getMessage(atValue.substring(6, atValue.length - 2));
            }
        }
    }
    for (var i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeType == 3) {
            var textValue = node.childNodes[i].textContent.trim();
            if (textValue.match(/__MSG_(\w+)__/g))
                node.childNodes[i].textContent = browser.i18n.getMessage(textValue.substring(6, textValue.length - 2));
        } else if (node.childNodes[i].nodeType == 1) {
            translateRec(node.childNodes[i])
        }
    }
}

function i18nToHtml() {
    //Localize by replacing __MSG_***__ meta tags
    var nodesToTranslate = document.getElementsByClassName('i18n');
    for (var i = 0; i < nodesToTranslate.length; i++) {
        translateRec(nodesToTranslate[i]);
    }
}

i18nToHtml();