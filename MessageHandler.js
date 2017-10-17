function executeTabAction(action, params) {
    var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
    gettingActiveTab.then((tabs) => {
        var url = tabs[0].url;

        var sidebar;
        try {

            sidebar = browser.extension.getViews({ type: "sidebar" });
        } catch (ex) {
            console.log("Error while accessing sidebar. " + ex);
        }

        switch (action) {
            case "save":
                saveToStorage(url, params);
                if (sidebar && sidebar[0]) {
                    sidebar[0].addToSidebar(params);
                }
                break;
            case "syncLoad":
                loadContextMenu();
                loadConfigOptions().then((opt) => {
                    sendMessage({
                        index: tabs[0].index
                    }, {
                        option: "defaultValues",
                        value: opt
                    });
                    loadFromStorage(url, tabs[0].index);
                });
                if (sidebar && sidebar[0]) {
                    sidebar[0].loadItemsToSidebar();
                }
                break;
            case "delete":
                deleteFromStorage(url, params.id);
                if (sidebar && sidebar[0]) {
                    sidebar[0].removeFromSide(params.id);
                }
                break;
            case "checkElem":
                sendMessage({
                    index: tabs[0].index
                }, {
                    option: "checkElem",
                    id: params
                })
                break;
            case "elemError":
                if (sidebar && sidebar[0]) {
                    sidebar[0].reportError(params.id, params.message);
                }
        }
    });

}

function escapeXmlChars(str) {
    if (typeof(str) == "string")
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    else
        return str;
}

function unescapeXmlChars(str) {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = unescapeXmlChars(attribute.nodeValue);
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = unescapeXmlChars(xml.nodeValue);
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    } else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    } else {
        obj = "";
    }
    return obj;
}

function loadFile(file) {
    xmlDoc = new DOMParser().parseFromString(file, 'text/xml');
    var pages = xmlDoc.getElementsByTagName("page");
    for (i = 0; i < pages.length; i++) {
        var url = pages[i].getAttribute("url");
        var items = pages[i].getElementsByTagName("item");
        var listItems = {};
        for (j = 0; j < items.length; j++) {
            var newItem = xmlToJson(items[j]);
            newItem.id = getNextId();
            listItems[newItem.id] = newItem;
            sendMessage({ url: url }, { option: 'loadItem', item: newItem });
        }

        saveListToStorage(url, listItems);
    }
    try {

        sidebar = browser.extension.getViews({ type: "sidebar" });
        sidebar[0].loadItemsToSidebar();
    } catch (ex) {
        console.log("Error while accessing sidebar. " + ex);
    }
}

function messageHandler(request) {
    var action = request.action;
    delete request.action;
    switch (action) {
        case "syncLoad": //Sometimes items weren´t loaded due to a null reference exception. Seems that sometimes this operation is executed befor finishing the loading of the js (it shouldn´t as this operation is synced but seems that it doesn´t work fine. This is a double check to ensure that all the items won´t be loaded till this script has been loaded) 
            executeTabAction("syncLoad");
            break;
        case "delete":
        case "save":
            executeTabAction(action, request);
            break;
        case "error":
            console.log(request.message);
            if (request.id) {
                executeTabAction("elemError", request);
            }

            break;
        case "loadFile":
            loadFile(request);
            break;
    }
}

function sendMessage(tabQuery, message) {
    var gettingActiveTab = browser.tabs.query(tabQuery);
    gettingActiveTab.then((tabs) => {
        for (var i = 0; i < tabs.length; i++) {
            var sendMsg = browser.tabs.sendMessage(tabs[i].id, message);

            sendMsg.catch((e) => {
                InjectCode();
                sendMsg;
            });


        }
    });
}


browser.runtime.onMessage.addListener(messageHandler);