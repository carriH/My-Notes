const ERROR_BACKGROUND_COLOR = '#ff0000';
const ERROR_COLOR = "#ffffff";
const ERROR_TEXT_DECORATION = "line-through";

function SidebarElem(item) {
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
}

SidebarElem.prototype.update = function(item) {
    //this.node.textContent = "Id: " + item.id;
    this.node.title = item.description;
    this.node.style.background = item.backgroundColor;
    this.node.style.color = item.color;
}

SidebarElem.prototype.getNodeReference = function() {
    return this.nodeContainer;
}

SidebarElem.prototype.addEvents = function(backgroundScript) {
    function onHover() {
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

    this.node.addEventListener('mouseover', onHover.bind(this), true);
    this.node.addEventListener('mouseout', onOut.bind(this), true);
}

SidebarElem.prototype.addMenu = function(parentElemPos) {
    function rgbToHex(rgbColor) {
        var color = rgbColor.match(/\d+(.\d+)?/g);
        return '#' +
            ('0' + parseInt(color[0]).toString(16)).slice(-2) +
            ('0' + parseInt(color[1]).toString(16)).slice(-2) +
            ('0' + parseInt(color[2]).toString(16)).slice(-2);
    }

    var bounding = this.node.getBoundingClientRect();
    var menuConfig = {
        menuId: this.node.id + '_menu',
        menuClass: 'sidebarMenu' //,
            //top: bounding.top - parentElemPos.top + 3,
            //left: bounding.left - parentElemPos.left + 3
    }

    this.menu = new Menu(menuConfig);
    this.updateRelativePosition(parentElemPos);
    this.menu.addHoverEvent(this.node);
    this.nodeContainer.appendChild(this.menu.getNodeReference());
    this.menu.addMenuItem(this.node.id + '_delete', 'MenuOptDelete', function(e) {
        backgroundScript.sendMessage({
            currentWindow: true,
            active: true
        }, {
            option: "deleteItem",
            id: this.node.id
        });
    }.bind(this));


    var hexColor = rgbToHex(window.getComputedStyle(this.node, null).getPropertyValue('background-color'));
    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', hexColor, function(newValue) {
        backgroundScript.sendMessage({
            currentWindow: true,
            active: true
        }, {
            option: "applyChanges",
            id: this.node.id,
            backgroundColor: newValue
        });
    }.bind(this));


    hexColor = rgbToHex(window.getComputedStyle(this.node, null).getPropertyValue('color'))

    this.menu.addMenuItemWithInput(this.id + '_textColor', 'MenuOptChangeColor', 'color', hexColor, function(newValue) {
        backgroundScript.sendMessage({
            currentWindow: true,
            active: true
        }, {
            option: "applyChanges",
            id: this.node.id,
            color: newValue
        });
    }.bind(this));
}

SidebarElem.prototype.reportError = function(message) {
    this.node.style.backgroundColor = ERROR_BACKGROUND_COLOR;
    this.node.style.color = ERROR_COLOR;
    this.node.style.textDecoration = ERROR_TEXT_DECORATION;
    this.node.title = message;

    this.menu.clearMenuItem();
    this.menu.addMenuItem(this.node.id + '_delete', 'MenuOptDelete', function(e) {
        backgroundScript.sendMessage({
            currentWindow: true,
            active: true
        }, {
            option: "deleteItem",
            id: this.node.id
        });
    }.bind(this));
}

SidebarElem.prototype.updateRelativePosition = function(parentElemPos) {
    var bounding = this.node.getBoundingClientRect();
    var newPos = {
        x: bounding.left - parentElemPos.left + 2,
        y: bounding.top + (bounding.height / 2) - parentElemPos.top - 7
    }
    this.menu.movePosition(newPos);
}