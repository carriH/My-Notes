function Crossout(id, params) {
    params = params || {};

    //Properties
    this.id = id;
    this.type = CROSSOUT;
    this.backgroundColor = params.backgroundColor || defaultValues.crossout.backgroundColor;
    this.color = params.color || defaultValues.crossout.color;
    this.opacity = params.opacity || defaultValues.crossout.opacity;
    this.hoverOpacity = params.hoverOpacity || defaultValues.crossout.hoverOpacity;
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

Crossout.prototype.update = function(json) {
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

Crossout.prototype.delete = function() {
    this.objSelection.delete();
}

Crossout.prototype.getNodeReference = function() {
    return this.menu.getNodeReference();
}

Crossout.prototype.toJSon = function() {
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

Crossout.prototype.highlightItem = function(state) {
    this.objSelection.highlightItem(state)
}

Crossout.prototype.getTextToCopy = function() {
    return this.objSelection.getDescription();
}

Crossout.check = function() {
    return TextSelection.check();
}

var dummy = 0;
dummy;