function Url(id, params) {
    params = params || {};

    //Properties
    this.id = id;
    this.type = URL;
    this.backgroundColor = params.backgroundColor || defaultValues.url.backgroundColor;
    this.color = params.color || defaultValues.url.color;
    this.opacity = params.opacity || defaultValues.url.opacity;
    this.hoverOpacity = params.hoverOpacity || defaultValues.url.hoverOpacity;
    this.username = params.username || defaultValues.username;
    this.datetime = params.datetime || (new Date()).toJSON();
    this.link = params.link || "";

    //HTML elements
    var input = {
        textNodes: params && params.jsonSelection ? params.jsonSelection.textNodes : null,
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity
    }
    this.objSelection = new TextSelection(this.id + '_Selection', this.type, input);

    this.menu = new ContextMenu(document.body, false);
    this.menu.addMenuItem(this.id + '_delete', 'MenuOptDelete', function(e) { noteContainer.deleteItem(this.id); }.bind(this), false, true);
    this.menu.addMenuItem(this.id + '_copyText', 'MenuOptCopyText', function(e) { noteContainer.copyText(this.id); }.bind(this), false, true);
    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', this.backgroundColor, function(newValue) {
        this.update({ backgroundColor: newValue });
    }.bind(this), true, true);
    this.menu.addMenuItemWithInput(this.id + '_color', 'MenuOptChangeColor', 'color', this.color, function(newValue) {
        this.update({ color: newValue });
    }.bind(this), false, true);
    this.menu.addMenuItem(this.id + "_updateLink", "MenuOptUpdateLink", this.updateLink.bind(this), true, true);


    //Events
    this.menu.bindElemList(this.objSelection.getNodelistReference());
    //this.objSelection.addEventListener('click', this.openLink.bind(this));
    var nodeList = this.objSelection.getNodelistReference();
    for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].addEventListener('click', this.openLink.bind(this));
    }

    if (Object.keys(params).length === 0 && params.constructor === Object && this.link == "") {
        this.updateLink();
    } else {
        this.refreshLink(this.link);
    }
}

Url.prototype.update = function(json) {
    this.backgroundColor = json.backgroundColor || this.backgroundColor;
    this.color = json.color || this.color;
    this.opacity = json.opacity || this.opacity;
    this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
    this.username = json.username || this.username;
    this.datetime = json.datetime || this.datetime;
    if (json.link != null) {
        this.refreshLink(json.link);
    }


    this.objSelection.update(json);

    if (!json.readOnly) {
        noteContainer.updateItem(this);
    }
}

Url.prototype.delete = function() {
    this.objSelection.delete();
}

Url.prototype.getNodeReference = function() {
    return this.menu.getNodeReference();
}

Url.prototype.refreshLink = function(newLink) {
    if (newLink != '') {
        this.link = newLink || this.link;
    } else {
        this.link = '';
    }
    if (this.objSelection) {
        if (this.link == "") {
            this.objSelection.addClass("BrokenLink");
        } else {
            this.objSelection.removeClass("BrokenLink");
        }
    }
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

    this.refreshLink(newLink);

    if (this.objSelection)
        noteContainer.updateItem(this);
}

Url.prototype.openLink = function() {
    if (this.link != "") {
        window.open(this.link);
    } else {
        this.updateLink();
    }
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

Url.prototype.highlightItem = function(state) {
    this.objSelection.highlightItem(state)
}

Url.prototype.getTextToCopy = function() {
    var text = this.objSelection.getTextToCopy()
    if (this.link && this.link != "") {
        text += " <" + this.link + ">"
    }
    return text;
}

Url.check = function() {
    return TextSelection.check();
}


var dummy = 0;
dummy;