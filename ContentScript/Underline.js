function Underline(id, params) {
    params = params || {};

    //Properties
    this.id = id;
    this.type = UNDERLINE;
    this.backgroundColor = params.backgroundColor || defaultValues.underline.backgroundColor;
    this.color = params.color || defaultValues.underline.color;
    this.opacity = params.opacity || defaultValues.underline.opacity;
    this.hoverOpacity = params.hoverOpacity || defaultValues.underline.hoverOpacity;
    this.username = params.username || defaultValues.username;
    this.datetime = params.datetime || (new Date()).toJSON();

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

    //Events
    this.menu.bindElemList(this.objSelection.getNodelistReference());
}

Underline.prototype.update = function(json) {
    this.backgroundColor = json.backgroundColor || this.backgroundColor;
    this.color = json.color || this.color;
    this.opacity = json.opacity || this.opacity;
    this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
    this.username = json.username || this.username;
    this.datetime = json.datetime || this.datetime;

    this.objSelection.update(json);

    if (!json.readOnly) {
        noteContainer.updateItem(this);
    }
}

Underline.prototype.delete = function() {
    this.objSelection.delete();
}

Underline.prototype.getNodeReference = function() {
    return this.menu.getNodeReference();
}

Underline.prototype.toJSon = function() {
    return {
        type: this.type,
        id: this.id,
        description: this.objSelection.getDescription(),
        username: this.username,
        datetime: this.datetime,
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity,
        jsonSelection: this.objSelection.toJSon()
    };

}

Underline.prototype.highlightItem = function(state) {
    this.objSelection.highlightItem(state)
}

Underline.prototype.getTextToCopy = function() {
    return this.objSelection.getTextToCopy();
}

Underline.check = function() {
    return TextSelection.check();
}

var dummy = 0;
dummy;