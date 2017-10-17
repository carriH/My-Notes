function Sticky(id) {
    this.id = id;
    this.type = STICKY;
    this.backgroundColor = defaultValues.sticky.backgroundColor; //STICKY_COLOR;
    this.color = defaultValues.sticky.color; //STICKY_TEXT_COLOR;
    this.opacity = defaultValues.sticky.opacity;
    this.hoverOpacity = defaultValues.sticky.hoverOpacity;
    this.username = defaultValues.username;
    this.datetime = (new Date()).toJSON();
}

Sticky.prototype.update = function(props) {
    this.backgroundColor = props.backgroundColor || this.backgroundColor;
    this.color = props.color || this.color;
    this.opacity = props.opacity || this.opacity;
    this.hoverOpacity = props.hoverOpacity || this.hoverOpacity;
    this.username = props.username || this.username;
    this.datetime = props.datetime || this.datetime;
    this.objTextBox.update(props);
    noteContainer.updateItem(this);

}

Sticky.prototype.create = function(json) {

    function saveChanges() {
        this.menu.movePosition(this.objTextBox.getMenuPos())
        noteContainer.updateItem(this);
    }
    var jsonTextbox;
    this.stickyContainer = document.createElement('div');

    if (json) {
        this.backgroundColor = json.backgroundColor || this.backgroundColor;
        this.color = json.color || this.color;
        this.opacity = json.opacity || this.opacity;
        this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
        this.username = json.username || this.username;
        this.datetime = json.datetime || this.datetime;
        jsonTextbox = json.textBox;
    }

    this.objTextBox = new TextBox(jsonTextbox);
    this.objTextBox.draw('Sticky_' + this.id, STICKY, this.backgroundColor, this.color, this.opacity, this.hoverOpacity);
    this.objTextBox.activateMovingResizing(saveChanges.bind(this));
    this.objTextBox.activateSavingText(saveChanges.bind(this));


    var menuPos = this.objTextBox.getMenuPos();
    var menuConfig = {
        menuId: this.id + '_menu',
        menuClass: 'stickyMenu',
        top: menuPos.y,
        left: menuPos.x
    }
    this.menu = new Menu(menuConfig);
    this.menu.addMenuItem(this.id + '_delete', 'MenuOptDelete', function(e) { noteContainer.deleteItem(this.id); }.bind(this));
    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', this.backgroundColor, function(newValue) {
        this.update({ backgroundColor: newValue });
    }.bind(this));
    this.menu.addMenuItemWithInput(this.id + '_textColor', 'MenuOptChangeColor', 'color', this.color, function(newValue) {
        this.update({ color: newValue });
    }.bind(this));

    var node = this.objTextBox.getNodeReference();
    this.menu.addHoverEvent(node);

    this.stickyContainer.appendChild(node);
    this.stickyContainer.appendChild(this.menu.getNodeReference());

    return this.stickyContainer;
}

Sticky.prototype.toJSon = function() {
    return {
        type: STICKY,
        id: this.id,
        description: this.objTextBox.getDescription(),
        username: this.username,
        datetime: this.datetime,
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity,
        textBox: this.objTextBox.toJSon()
    };

}

Sticky.prototype.delete = function() {
    this.stickyContainer.parentNode.removeChild(this.stickyContainer);
}

Sticky.prototype.highlightItem = function(state) {
    this.objTextBox.highlightItem(state)
}

var dummy = 0;
dummy;