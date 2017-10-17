const MENU = "material-icons menu"

function Menu(config) {
    this.button = document.createElement("span");
    this.button.id = config.menuId;
    this.button.className = MENU + ' ' + config.menuClass;
    this.button.style.top = config.top + 'px';
    this.button.style.left = config.left + 'px';
    this.button.textContent = 'menu'
    this.button.addEventListener("mouseover", this.onHover, true);
    this.menuItemList = document.createElement("ul");
    this.menuItemList.id = config.menuId + '_menuItemList';
    this.menuItemList.className = 'menuItemList';
    this.button.appendChild(this.menuItemList);
    this.showMenu = false;

    this.addHoverEvent(this.button);
    var that = this;
    this.button.addEventListener('click', function(e) {
        if (that.menuItemList.style.display == 'block') {
            that.menuItemList.style.display = 'none';
        } else
            that.menuItemList.style.display = 'block';
    });
    this.addHoverEvent(this.menuItemList);
    //return this.menu;
}

Menu.prototype.addMenuItem = function(id, name, action) {
    var newMenuItem = document.createElement("li");
    newMenuItem.id = id;
    newMenuItem.className = 'menuItem';
    newMenuItem.innerText = browser.i18n.getMessage(name) || name;

    newMenuItem.addEventListener('click', action, true);
    newMenuItem.addEventListener('click', function(e) { this.button.style.display = 'none' }.bind(this), true);
    this.menuItemList.appendChild(newMenuItem);
}

Menu.prototype.addMenuItemWithInput = function(id, name, inputType, defaultValue, action) {
    var newMenuItem = document.createElement("li");
    newMenuItem.id = id;
    newMenuItem.className = 'menuItem';
    newMenuItem.innerText = browser.i18n.getMessage(name) || name;

    newMenuItem.addEventListener('click', function(e) {
        var menuInput = document.createElement("input");
        menuInput.type = inputType;
        menuInput.value = defaultValue;
        menuInput.style.visibility = "hidden";
        menuInput.addEventListener("change", function(e) {
            action(this.value);
            defaultValue = this.value;
        }, true);
        this.button.appendChild(menuInput);
        menuInput.click();
        this.button.removeChild(menuInput);
    }.bind(this), true);

    newMenuItem.addEventListener('click', function(e) { this.button.style.display = 'none' }.bind(this), true);
    this.menuItemList.appendChild(newMenuItem);
}

Menu.prototype.getNodeReference = function() {
    return this.button;
}

Menu.prototype.addHoverEvent = function(elem) {
    var that = this;
    elem.addEventListener('mouseover', function(e) {
        that.showMenu = true;
        that.button.style.display = 'inline';

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

Menu.prototype.movePosition = function(newPos) {
    this.button.style.top = newPos.y + 'px';
    this.button.style.left = newPos.x + 'px';
}

Menu.prototype.delete = function() {
    this.button.parentNode.removeChild(this.button);
}

Menu.prototype.clearMenuItem = function() {
    while (this.menuItemList.firstChild) {
        this.menuItemList.removeChild(this.menuItemList.firstChild);
    }
}

Menu.prototype.removeClass = function(oldClass) {
    this.button.classList.remove(oldClass);
}

Menu.prototype.addClass = function(newClass) {
    if (!this.button.classList.contains(newClass))
        this.button.classList.add(newClass);
}

var dummy = 0;
dummy;