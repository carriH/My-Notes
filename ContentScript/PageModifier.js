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

var defaultValues = null;

//CONTAINER
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var noteContainer = (function() {
    var divContainer = document.createElement('div');
    document.getElementsByTagName("body")[0].appendChild(divContainer);
    var stickies = {};

    function sendSaveMessage(jsonObj) {
        jsonObj.action = "save";
        browser.runtime.sendMessage(jsonObj);
    }

    function sendErrorMessage(jsonObj) {
        jsonObj.action = "error";
        browser.runtime.sendMessage(jsonObj);
    }

    function newElem(id, type) {
        var newElem = null;
        switch (type) {
            case STICKY:
                newElem = new Sticky(id);
                break;
            case HIGHLIGHT:
                newElem = new Highlight(id);
                break;
            case UNDERLINE:
                newElem = new Underline(id);
                break;
            case CROSSOUT:
                newElem = new Crossout(id);
                break;
            case CHANGETEXT:
                newElem = new ChangeText(id);
                break;
            case URL:
                newElem = new Url(id);
                break;
            case AUDIO:
                newElem = new Audio(id);
                break;
            case VIDEO:
                newElem = new Video(id);
                break;
        }
        return newElem;
    }

    return {
        newItem: function(id, type) {
            var newItem = newElem(id, type);

            var newNode = newItem.create();
            if (newNode) {
                divContainer.appendChild(newNode);
            }
            stickies[id] = newItem;
            sendSaveMessage(newItem.toJSon());
            return;
        },
        loadItem: function(item) {
            try {
                var newItem = newElem(item.id, item.type);
                var newNode = newItem.create(item);
                if (newNode) {
                    divContainer.appendChild(newNode);
                }
                stickies[item.id] = newItem;
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
        deleteItem: function(id) {
            try {
                var item = stickies[id];
                item.delete();
                delete stickies[id];
            } catch (e) {}
            browser.runtime.sendMessage({ id: id, action: "delete" });
            return;
        },
        deleteAll: function() {
            for (var i in stickies) {
                noteContainer.deleteItem(stickies[i].id);
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
        }


    }
})();

var watchClickPosition = (function(event) {
    mouseCoord.x = event.clientX + window.content.pageXOffset;
    mouseCoord.y = event.clientY + window.content.pageYOffset;
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
        case "deleteAll":
            //noteContainer.highlight(request.id);
            noteContainer.deleteAll();
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