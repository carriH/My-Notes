function Url(id) {
    this.id = id;
    this.selection = new Array(0);
    this.type = URL;
    this.selectionNodes = new Array(0);
    this.backgroundColor = defaultValues.url.backgroundColor;
    this.color = defaultValues.url.color;
    this.opacity = defaultValues.url.opacity;
    this.hoverOpacity = defaultValues.url.hoverOpacity;
    this.username = defaultValues.username;
    this.datetime = (new Date()).toJSON();
}

Url.prototype.create = function(json) {
    var jsonSelection;

    if (json) {
        this.id = json.id || this.id;
        this.backgroundColor = json.backgroundColor || this.backgroundColor;
        this.color = json.color || this.color;
        this.opacity = json.color || this.color;
        this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
        this.username = json.username || this.username;
        this.datetime = json.datetime || this.datetime;
        this.link = json.link || this.link;
        jsonSelection = json.jsonSelection;
    } else
        this.updateLink();

    this.objSelection = new TextSelection(jsonSelection);
    this.objSelection.draw(this.id + '_Selection', this.type, this.backgroundColor, this.color, this.opacity, this.hoverOpacity);

    var menuPos = this.objSelection.getMenuPos();
    var menuConfig = {
        menuId: this.id + '_menu',
        menuClass: this.link ? 'urlLinkMenu' : 'urlBrokenLinkMenu',
        top: menuPos.y,
        left: menuPos.x
    }

    this.menu = new Menu(menuConfig);
    this.menu.addMenuItem(this.id + '_delete', 'MenuOptDelete', function(e) { noteContainer.deleteItem(this.id); }.bind(this));

    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', this.backgroundColor, function(newValue) {
        this.update({ backgroundColor: newValue });
    }.bind(this));
    this.menu.addMenuItemWithInput(this.id + '_decoratorColor', 'MenuOptChangeColor', 'color', this.color, function(newValue) {
        this.update({ color: newValue });
    }.bind(this));

    this.menu.addMenuItem(this.id + "_updateLink", "MenuOptUpdateLink", this.updateLink.bind(this));

    var nodeList = this.objSelection.getNodelistReference();
    for (var i = 0; i < nodeList.length; i++) {
        this.menu.addHoverEvent(nodeList[i]);
        nodeList[i].addEventListener('click', this.openLink.bind(this));
    }



    return this.menu.getNodeReference();
}

Url.prototype.updateLink = function() {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i');
    var newLink = this.link || 'http://';
    newLink = prompt(browser.i18n.getMessage("MsgEnterURL"), newLink);
    while (!pattern.test(newLink) && (newLink != null) && (newLink != '')) {
        newLink = prompt(browser.i18n.getMessage("MsgErrURL"), newLink);
    }

    if (newLink != '') {
        this.link = newLink || this.link;
    } else {
        this.link = '';
    }
    if (this.menu) {
        this.menu.removeClass(this.link ? "urlBrokenLinkMenu" : "urlLinkMenu");
        this.menu.addClass(this.link ? "urlLinkMenu" : "urlBrokenLinkMenu");
    }
    if (this.objSelection)
        noteContainer.updateItem(this);
}

Url.prototype.openLink = function() {
    if (this.link != "") {
        window.open(this.link);
    } else {
        alert("Invalid link.");
    }
}

Url.prototype.update = function(json) {
    this.backgroundColor = json.backgroundColor || this.backgroundColor;
    this.color = json.color || this.color;
    this.username = json.username || this.username;
    this.datetime = json.datetime || this.datetime;
    this.link = json.link || this.link;

    this.objSelection.update(json);
    noteContainer.updateItem(this);
    this.objSelection.applySelectionOpacity(this.opacity);
}

Url.prototype.toJSon = function() {
    return {
        type: this.type,
        id: this.id,
        description: this.objSelection.getDescription(),
        link: this.link,
        username: this.username,
        datetime: this.datetime,
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity,
        jsonSelection: this.objSelection.toJSon()
    };

}

Url.prototype.delete = function() {
    this.menu.delete();
    this.objSelection.delete();
}

Url.prototype.highlightItem = function(state) {
    this.objSelection.highlightItem(state)
}


var dummy = 0;
dummy;