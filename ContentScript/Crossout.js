function Crossout(id) {
    this.id = id;
    this.selection = new Array(0);
    this.type = CROSSOUT;
    this.selectionNodes = new Array(0);
    this.backgroundColor = defaultValues.crossout.backgroundColor;
    this.color = defaultValues.crossout.color;
    this.opacity = defaultValues.crossout.opacity;
    this.hoverOpacity = defaultValues.crossout.hoverOpacity;
    this.username = defaultValues.username;
    this.datetime = (new Date()).toJSON();
}



Crossout.prototype.create = function(json) {
    var jsonSelection;

    if (json) {
        this.id = json.id || this.id;
        this.backgroundColor = json.backgroundColor || this.backgroundColor;
        this.color = json.color || this.color;
        this.opacity = json.opacity || this.opacity;
        this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
        this.username = json.username || this.username;
        this.datetime = json.datetime || this.datetime;
        jsonSelection = json.jsonSelection;
    }

    this.objSelection = new TextSelection(jsonSelection);
    this.objSelection.draw(this.id + '_Selection', this.type, this.backgroundColor, this.color, this.opacity, this.hoverOpacity);

    var menuPos = this.objSelection.getMenuPos();
    var menuConfig = {
        menuId: this.id + '_menu',
        menuClass: 'crossoutMenu',
        top: menuPos.y,
        left: menuPos.x
    }

    this.menu = new Menu(menuConfig);
    this.menu.addMenuItem(this.id + '_delete', 'MenuOptDelete', function(e) { noteContainer.deleteItem(this.id); }.bind(this));

    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', this.backgroundColor, function(newValue) {
        this.update({ backgroundColor: newValue });
    }.bind(this));
    this.menu.addMenuItemWithInput(this.id + '_color', 'MenuOptChangeColor', 'color', this.color, function(newValue) {
        this.update({ color: newValue });
    }.bind(this));

    var nodeList = this.objSelection.getNodelistReference();
    for (var node in nodeList) {
        this.menu.addHoverEvent(nodeList[node]);
    }

    return this.menu.getNodeReference();
}

Crossout.prototype.update = function(json) {
    this.backgroundColor = json.backgroundColor || this.backgroundColor;
    this.color = json.color || this.color;
    this.opacity = json.opacity || this.opacity;
    this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
    this.username = json.username || this.username;
    this.datetime = json.datetime || this.datetime;

    this.objSelection.update(json);
    noteContainer.updateItem(this);
    this.objSelection.applySelectionOpacity(this.opacity);
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

Crossout.prototype.delete = function() {
    this.menu.delete();
    this.objSelection.delete();
}

Crossout.prototype.highlightItem = function(state) {
    this.objSelection.highlightItem(state)
}

var dummy = 0;
dummy;