const ERROR_BACKGROUND_COLOR = '#ff0000';
const ERROR_COLOR = "#ffffff";
const ERROR_TEXT_DECORATION = "line-through";

function SidebarElem(item, URL) {
    this.nodeContainer = document.createElement("div");
    this.node = document.createElement("div");
    this.node.className = "anotationItem " + item.type;
    this.node.id = item.id;
    this.type = item.type;
    var date = new Date(item.datetime);
    var lang = browser.i18n.getUILanguage().replace("_", "-");
    this.node.appendChild(document.createTextNode(item.username + " - " + date.toLocaleDateString(lang, dateFormatOptions)));
    this.node.title = item.description;
    this.node.style.background = item.backgroundColor;
    this.node.style.color = item.color;
    this.nodeContainer.appendChild(this.node);
    this.URL = URL;
    this.enabled = true;
}

SidebarElem.prototype.update = function(item) {
    //this.node.textContent = "Id: " + item.id;
    if (this.enabled) {
        this.node.title = item.description || this.node.title;
        this.node.style.background = item.backgroundColor || this.node.style.background;
        this.node.style.color = item.color || this.node.style.color;
        this.node.style.textDecoration = 'none';
    }
}

SidebarElem.prototype.getNodeReference = function() {
    return this.nodeContainer;
}

function onHover() {
    var newPos = this.nodeContainer.getBoundingClientRect();
    //newPos.y -= 34;
    //this.menu.movePosition(newPos);
    backgroundScript.sendMessage({
        active: true,
        currentWindow: true
    }, {
        option: "highlight",
        id: this.node.id,
        state: 'hover'
    });
}

function onOut() {
    backgroundScript.sendMessage({
        active: true,
        currentWindow: true
    }, {
        option: "highlight",
        id: this.node.id,
        state: 'out'
    });
}

SidebarElem.prototype.addEvents = function() {

    this.node.addEventListener('mouseover', onHover.bind(this), true);
    this.node.addEventListener('mouseout', onOut.bind(this), true);
}

SidebarElem.prototype.removeEvents = function() {
    this.node.removeEventListener('mouseover', onHover);
    this.node.removeEventListener('mouseout', onOut);
}

SidebarElem.prototype.pageIsOpened = function() {
    //var tabs = browser.tabs.query({ url: this.id });
    if (!this.enabled)
        return false;

    var url = this.URL;
    var check = new Promise(function(resolve, reject) {
        browser.tabs.query({ url: url }).then((tabs) => {
            if (tabs && tabs.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, e => {
            reject("Error getting values from local storage. " + e);
        });
    });
    return check;

}

SidebarElem.prototype.addMenu = function(parentElemPos) {
    function rgbToHex(rgbColor) {
        var color = rgbColor.match(/\d+(.\d+)?/g);
        return '#' +
            ('0' + parseInt(color[0]).toString(16)).slice(-2) +
            ('0' + parseInt(color[1]).toString(16)).slice(-2) +
            ('0' + parseInt(color[2]).toString(16)).slice(-2);
    }

    if (this.menu) {
        if (!this.nodeContainer.contains(this.menu.getNodeReference())) {
            this.nodeContainer.appendChild(this.menu.getNodeReference());
        }
        return;
    }

    this.menu = new ContextMenu(this.node, true);

    this.menu.addMenuItem(this.node.id + '_delete', 'MenuOptDelete', function(e) {
        backgroundScript.sendMessage({
            url: this.URL
        }, {
            option: "deleteItem",
            id: this.node.id
        });
    }.bind(this), false, true);

    var color = this.node.style['background-color'];
    var hexColor = '#000000';
    if (color) {
        color = w3color(color);
        if (color.valid) {
            hexColor = color.toHexString();
        }
    }
    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', hexColor, function(newValue) {
        backgroundScript.sendMessage({
            url: this.URL
        }, {
            option: "applyChanges",
            id: this.node.id,
            backgroundColor: newValue
        });
    }.bind(this), false, this.pageIsOpened.bind(this), "PageOpenedMsg");

    color = this.node.style['color'];
    if (color) {
        color = w3color(color);
        if (color.valid) {
            hexColor = color.toHexString();
        }
    }
    this.menu.addMenuItemWithInput(this.id + '_textColor', 'MenuOptChangeColor', 'color', hexColor, function(newValue) {
        console.log(newValue);
        backgroundScript.sendMessage({
            url: this.URL
        }, {
            option: "applyChanges",
            id: this.node.id,
            color: newValue
        });
    }.bind(this), false, this.pageIsOpened.bind(this), "PageOpenedMsg");


    this.menu.addMenuItem(this.node.id + '_copyText', 'MenuOptCopyText', function(e) {
        backgroundScript.sendMessage({
            url: this.URL
        }, {
            option: "copyText",
            id: this.node.id
        });
    }.bind(this), false, this.pageIsOpened.bind(this), "PageOpenedMsg");

}

SidebarElem.prototype.reportError = function(message) {
    this.node.style.backgroundColor = ERROR_BACKGROUND_COLOR;
    this.node.style.color = ERROR_COLOR;
    this.node.style.textDecoration = ERROR_TEXT_DECORATION;
    this.node.title = message;
    this.enabled = false;
    this.menu.updateActivationMenuItem('MenuOptChangeBackgroundColor', false, "errElemMsg");
    this.menu.updateActivationMenuItem('MenuOptChangeColor', false, "errElemMsg");
    this.menu.updateActivationMenuItem('MenuOptCopyText', false, "errElemMsg");
}

SidebarElem.prototype.isDisabled = function() {
    return !this.enabled
}