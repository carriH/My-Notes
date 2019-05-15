function createNewMenuEntry(id, name) {
    var newMenuItem = document.createElement("li");
    newMenuItem.id = id;

    //newMenuItem.classList.add(BASECLASS);
    newMenuItem.classList.add('contextMenu-item');
    var button = document.createElement("button");
    button.type = "button";
    //button.classList.add(BASECLASS);
    button.classList.add("contextMenu-btn");
    menuText = document.createElement("span");
    //menuText.classList.add(BASECLASS);
    menuText.classList.add("contextMenu-text");
    menuText.appendChild(document.createTextNode(browser.i18n.getMessage(name) || name));
    button.appendChild(menuText);
    newMenuItem.appendChild(button);
    return newMenuItem;
}

function createNewSeparator() {
    var separator = document.createElement("li");
    //separator.classList.add(BASECLASS);
    separator.classList.add("contextMenu-separator");
    return separator;
}


function ContextMenu(owner, bind) {
    this.parentNode = owner;
    if (!bind == false) {
        this.bindElement(this.parentNode);
    }
    document.getElementsByTagName('body')[0].addEventListener("mousedown", this.hideMenu.bind(this), false);
    this.menuItemList = document.createElement("ul");
    this.menuItemList.id = /*config.menuId +*/ '_menuItemList';
    this.menuItemList.classList.add(BASECLASS);
    this.menuItemList.classList.add('contextMenu');
    this.showMenuItem = [];
    this.menuItems = [];
    //this.parentNode.appendChild(this.menuItemList);
    document.body.appendChild(this.menuItemList);
    //this.showMenu = false;

    //return this.menu;
}

ContextMenu.prototype.bindElement = function(elem) {
    elem.addEventListener("contextmenu", this.showMenu.bind(this));
}

ContextMenu.prototype.bindElemList = function(elemList) {
    for (var elem in elemList) {
        this.bindElement(elemList[elem]);
    }
}

ContextMenu.prototype.addMenuItem = function(id, name, action, separator, active, tooltip) {
    if (separator) {
        this.menuItemList.appendChild(createNewSeparator());
    }
    var newMenuItem = createNewMenuEntry(id, name);

    //newMenuItem.addEventListener('click', action, true);
    newMenuItem.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.currentTarget.classList.contains('contextMenu-item')) {
            this.menuItemList.classList.remove("show-contextMenu");
            action();
        }
    }.bind(this), false);
    this.menuItemList.appendChild(newMenuItem);
    this.showMenuItem.push({ check: active, tooltip: tooltip });
    this.menuItems.push(newMenuItem);
}

ContextMenu.prototype.updateActivationMenuItem = function(name, check, tooltip) {
    var i = 0;
    while (i < this.menuItems.length && this.menuItems[i].textContent != (browser.i18n.getMessage(name) || name)) {
        i++;
    }
    if (i < this.menuItems.length) {
        this.showMenuItem[i].check = check;
        this.showMenuItem[i].tooltip = tooltip;
    }
}

ContextMenu.prototype.addMenuItemWithInput = function(id, name, inputType, defaultValue, action, separator, active, tooltip) {
    if (separator) {
        this.menuItemList.appendChild(createNewSeparator());
    }

    var newMenuItem = createNewMenuEntry(id, name);

    newMenuItem.addEventListener('click', function(e) {
        if (e.currentTarget.classList.contains('contextMenu-item')) {
            this.menuItemList.classList.remove("show-contextMenu");
            var menuInput = document.createElement("input");
            menuInput.type = inputType;
            menuInput.value = defaultValue;
            menuInput.style.visibility = "hidden";
            menuInput.addEventListener("change", function(e) {
                action(this.value);
                defaultValue = this.value;
            }, true);
            this.menuItemList.appendChild(menuInput);
            menuInput.click();
            this.menuItemList.removeChild(menuInput);
        }
    }.bind(this), true);

    this.menuItemList.appendChild(newMenuItem);
    this.showMenuItem.push({ check: active, tooltip: tooltip });
    this.menuItems.push(newMenuItem);
}

ContextMenu.prototype.getNodeReference = function() {
    return this.menuItemList;
}

ContextMenu.prototype.showMenu = async function(e) {
    var that = this;

    function activateOption(enable, index) {
        if (enable) {
            that.menuItems[index].classList.add('contextMenu-item');
            that.menuItems[index].classList.remove('contextMenu-item-disabled');
            that.menuItems[index].title = '';
        } else {
            that.menuItems[index].classList.remove('contextMenu-item');
            that.menuItems[index].classList.add('contextMenu-item-disabled');
            //this.menuItems[i].classList.add('contextMenu-item');
            var tooltip = that.showMenuItem[index].tooltip;
            that.menuItems[index].title = browser.i18n.getMessage(tooltip) || tooltip;
        }
    }
    e.stopPropagation();
    e.preventDefault();
    for (var i = 0; i < this.showMenuItem.length; i++) {
        var result = typeof(this.showMenuItem[i].check) === "boolean" ? this.showMenuItem[i].check : this.showMenuItem[i].check();
        if (typeof result.then == 'function') {
            await result.then((active) => {
                activateOption(active, i);
            });
        } else {
            activateOption(result, i);
        }
    }
    this.menuItemList.style.top = (e.clientY + window.pageYOffset) + 'px';
    if (e.clientX + window.pageXOffset + this.menuItemList.clientWidth > document.body.offsetWidth) {
        this.menuItemList.style.left = (e.clientX + window.pageXOffset + document.body.offsetWidth - this.menuItemList.clientWidth - e.clientX) + 'px'
    } else {
        this.menuItemList.style.left = (e.clientX + window.pageXOffset) + 'px';
    }

    this.menuItemList.classList.add("show-contextMenu");

}

ContextMenu.prototype.hideMenu = function(e) {
    if (this.menuItemList.classList.contains("show-contextMenu")) {
        var position = this.menuItemList.getBoundingClientRect();
        if (!(position.top <= e.clientY &&
                e.clientY <= position.bottom &&
                position.left <= e.clientX &&
                e.clientX <= position.right)) {
            this.menuItemList.classList.remove("show-contextMenu");
        }
    }
}


ContextMenu.prototype.addHoverEvent = function(elem) {
    var that = this;
    elem.addEventListener('mouseover', function(e) {
        that.showMenu = true;
        //that.button.style.display = 'inline';

    }, true);
    elem.addEventListener('mouseout', function(e) {
        that.showMenu = false;
        setTimeout(function() {
            if (!that.showMenu) {
                that.button.style.display = 'none';
                that.menuItemList.style.display = 'none';
            }
        }, 1000);
    })
}

ContextMenu.prototype.delete = function() {
    this.button.parentNode.removeChild(this.button);
}

ContextMenu.prototype.removeClass = function(oldClass) {
    this.button.classList.remove(oldClass);
}

ContextMenu.prototype.addClass = function(newClass) {
    if (!this.button.classList.contains(newClass))
        this.button.classList.add(newClass);
}



var dummy = 0;
dummy;