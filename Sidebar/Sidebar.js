const dateFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
}

var backgroundScript

browser.runtime.getBackgroundPage().then((background) => {
    backgroundScript = background;
});


function addToSidebar(item) {
    if (!elemList[item.id]) {
        elemList[item.id] = new SidebarElem(item);
        elemListNode.appendChild(elemList[item.id].getNodeReference());
        elemList[item.id].addEvents(backgroundScript);
        elemList[item.id].addMenu(elemListPosition);
    } else {
        elemList[item.id].update(item);
    }
}

function removeFromSide(id) {
    if (elemList[id]) {
        elemListNode.removeChild(elemList[id].getNodeReference());
        delete elemList[id];
    }

    elemList.forEach(function(item) {
        item.updateRelativePosition(elemListPosition);
    });
}

function reportError(id, message) {
    if (id && elemList[id]) {
        elemList[id].reportError(message);
    }
}

function loadItemsToSidebar() {
    elemList.forEach(function(elem) {
        elemListNode.removeChild(elem.getNodeReference());
    })
    elemList = [];

    var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
    gettingActiveTab.then((tabs) => {
        var url = tabs[0].url;
        backgroundScript.loadListFromStorage(url).then((listItems) => {
            for (var i in listItems) {
                addToSidebar(listItems[i]);
                backgroundScript.executeTabAction("checkElem", listItems[i]);
            }

        });
    });
}

var elemList = new Array(0);
var elemListNode = document.getElementById("anotations")
var elemListPosition = elemListNode.getBoundingClientRect();

document.addEventListener("click", (e) => {
        var openMenu = 0;
        var menu = document.getElementById("menu");
        if (e.target.classList.contains("menuItem")) {
            var option = e.target.id;
            switch (option) {
                case "exportCurrent":
                    exportItemsFromCurrentPages();
                    break;
                case "exportAll":
                    exportItemsFromAllPages();
                    break;
                case "importFile":
                    importXmlFile();
                    break;
                case "deleteCurrent":
                    deleteItemsFromCurrentPage();
                    break;
                case "deleteAll":
                    deleteItemsFromAllPages();
                    break;
            }
        } else if (e.target.id == "menuIcon" || (e.target.parentElement && e.target.parentElement.id == "menuIcon")) {
            if (menu.style.display != "block")
                openMenu = 1;
        }

        menu.style.display = (openMenu == 1 ? "block" : "none");
    }

)


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