var mouseCoord = {
    x: 0,
    y: 0
}

//ELEM TYPES
const STICKY = "sticky";
const HIGHLIGHT = "highlight";
const UNDERLINE = "underline";
const CROSSOUT = "crossout";
const CHANGETEXT = "changeText";
const URL = "url";
const AUDIO = "audio";
const VIDEO = "video";
const BASECLASS = "MyNotes"

var defaultValues = null;

//CONTAINER
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var noteContainer = (function() {
    var divContainer = document.createElement('div');
    document.getElementsByTagName("body")[0].appendChild(divContainer);
    var stickies = {};

    function sendSaveMessage(jsonObj) {
        jsonObj.action = "save";
        jsonObj.url = window.location.href;
        browser.runtime.sendMessage(jsonObj);
    }

    function sendErrorMessage(jsonObj) {
        jsonObj.action = "error";
        jsonObj.url = window.location.href;
        browser.runtime.sendMessage(jsonObj);
    }

    function newElem(id, type, params) {
        var newElem = null;
        switch (type) {
            case STICKY:
                newElem = new Sticky(id, params);
                break;
            case HIGHLIGHT:
                newElem = new Highlight(id, params);
                break;
            case UNDERLINE:
                newElem = new Underline(id, params);
                break;
            case CROSSOUT:
                newElem = new Crossout(id, params);
                break;
            case CHANGETEXT:
                newElem = new ChangeText(id, params);
                break;
            case URL:
                newElem = new Url(id, params);
                break;
            case AUDIO:
                newElem = new Audio(id, params);
                break;
            case VIDEO:
                newElem = new Video(id, params);
                break;
        }
        return newElem;
    }

    return {
        newItem: function(id, type) {
            var newItem = newElem(id, type);

            //var newNode = newItem.create();
            var newNode = newItem.getNodeReference();
            if (newNode) {
                divContainer.appendChild(newNode);
            }
            stickies[id] = newItem;
            sendSaveMessage(newItem.toJSon());
            return;
        },
        loadItem: function(item) {
            try {
                if (stickies && stickies[item.id]) {
                    stickies[item.id].update(item)
                } else {
                    var newItem = newElem(item.id, item.type, item);
                    //var newNode = newItem.create(item);
                    var newNode = newItem.getNodeReference();
                    if (newNode) {
                        divContainer.appendChild(newNode);
                    }
                    stickies[item.id] = newItem;
                }
            } catch (e) {
                if (!item) {
                    item = {};
                }
                sendErrorMessage({
                    id: item.id,
                    message: e.message
                });
            }
            return;
        },
        updateItem: function(item) {
            stickies[item.id] = item;
            sendSaveMessage(item.toJSon());
            return;
        },
        deleteItem: function(id, temporal) {
            try {
                var item = stickies[id];
                item.delete();
                delete stickies[id];
            } catch (e) {}
            if (!temporal)
                browser.runtime.sendMessage({ id: id, action: "delete", url: window.location.href });
            return;
        },
        deleteAll: function(temporal) {
            for (var i in stickies) {
                noteContainer.deleteItem(stickies[i].id, temporal);
            }
            return;
        },
        highlightItem: function(id, state) {
            if (stickies[id]) {
                stickies[id].highlightItem(state);
            }
            return;
        },
        applyChanges: function(json) {
            stickies[json.id].update(json);
            return;
        },
        saveFile: function(text) {
            var a = document.createElement("a");
            var file = new Blob([text], { type: "text/xml" });
            var url = URL.createObjectURL(file);
            a.href = url;
            a.download = "ExportFile.xml";
            divContainer.appendChild(a);
            a.click();
            setTimeout(function() {
                divContainer.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
            return;
        },
        loadFile: function() {

            var fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.style.visibility = "hidden";
            fileInput.addEventListener("change", function(e) {

                var file = e.target.files[0]; // FileList object
                // Only process image files.
                if (!file.type.match("text/xml")) {
                    window.alert("Invalid input file.");
                    return;
                }

                var reader = new FileReader();
                reader.onload = function(e) {
                        browser.runtime.sendMessage({ text: reader.result, action: "loadFile" });
                    }
                    // Read in the image file as a data URL.
                reader.readAsText(file);

            }, true);
            divContainer.appendChild(fileInput);
            fileInput.click();
            return;
        },
        checkElem: function(elem) {
            if (!stickies[elem.id]) {
                noteContainer.loadItem(elem);
            }
            return;
        },
        copyText: function(elem) {

            var onCopy = function(event) {
                var text = ""
                var addNewLine = false;
                if (!elem) {
                    for (var i in stickies) {
                        if (addNewLine) {
                            text += "\n";
                            addNewLine = false;
                        }
                        if (stickies[i].getTextToCopy) {
                            text += stickies[i].getTextToCopy();
                            addNewLine = true;
                        }
                    }
                } else if (stickies[elem].getTextToCopy) {
                    text = stickies[elem].getTextToCopy();
                }

                event.clipboardData.setData("text/plain", text);
                event.stopPropagation();
                event.preventDefault();
                document.removeEventListener("copy", onCopy)
            }

            document.addEventListener("copy", onCopy, true);
            document.execCommand("copy");
        }
    }
})();

var watchClickPosition = (function(event) {
    mouseCoord.x = event.clientX + window.pageXOffset;
    mouseCoord.y = event.clientY + window.pageYOffset;
});

document.removeEventListener('mousedown', watchClickPosition);
document.addEventListener('mousedown', watchClickPosition, true);

function messageHandler(request, sender, sendResponse) {
    switch (request.option) {
        case "newItem":
            //noteContainer.newNote(request.id);
            noteContainer.newItem(request.id, request.type);
            break;
        case "loadItem":
            noteContainer.loadItem(request.item);
            break;
        case "deleteItem":
            noteContainer.deleteItem(request.id);
            break;
        case "cleanUpItem":
            noteContainer.deleteItem(request.id, true);
            break;
        case "deleteAll":
            //noteContainer.highlight(request.id);
            noteContainer.deleteAll(0);
            break;
        case "applyChanges":
            noteContainer.applyChanges(request);
            break;
        case "saveFile":
            noteContainer.saveFile(request.file);
            break;
        case "loadFile":
            noteContainer.loadFile();
            break;
        case "highlight":
            noteContainer.highlightItem(request.id, request.state);
            break;
        case "defaultValues":
            defaultValues = request.value;
            break;
        case "checkElem":
            noteContainer.checkElem(request.id);
            break;
        case "copyText":
            noteContainer.copyText(request ? request.id : null);
            break;
        case "ping":
            noteContainer.deleteAll(1);
            browser.runtime.sendMessage({ action: "syncLoad" });
            return Promise.resolve("pong");
            break;
    }
    return;
}

browser.runtime.onMessage.addListener(messageHandler);


var icons = document.createElement('link');
icons.rel = 'stylesheet';
icons.href = browser.extension.getURL('../Fonts/MaterialIcons.css');
document.body.appendChild(icons);
icons = document.createElement('link');

var style = document.createElement('style');
document.body.appendChild(style);

browser.runtime.sendMessage({ action: "syncLoad" });