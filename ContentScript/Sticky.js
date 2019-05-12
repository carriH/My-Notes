function Sticky(id, params) {
    params = params || {};

    //Properties
    this.id = id;
    this.type = STICKY;
    this.backgroundColor = params.backgroundColor || defaultValues.sticky.backgroundColor; //STICKY_COLOR;
    this.color = params.color || defaultValues.sticky.color; //STICKY_TEXT_COLOR;
    this.opacity = params.opacity || defaultValues.sticky.opacity;
    this.hoverOpacity = params.hoverOpacity || defaultValues.sticky.hoverOpacity;
    this.username = params.username || defaultValues.username;
    this.datetime = params.datetime || (new Date()).toJSON();

    //HTML elements
    this.stickyContainer = document.createElement('div');
    var color = {
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity
    }
    this.objTextBox = new TextBox('Sticky_' + this.id, this.type, params.textBox, color);
    this.stickyContainer.appendChild(this.objTextBox.getNodeReference());

    this.menu = new ContextMenu(this.stickyContainer, true);
    this.menu.addMenuItem(this.id + '_delete', 'MenuOptDelete', function(e) { noteContainer.deleteItem(this.id); }.bind(this), false, true);
    this.menu.addMenuItem(this.id + '_copyText', 'MenuOptCopyText', function(e) { noteContainer.copyText(this.id); }.bind(this), false, true);
    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', this.backgroundColor, function(newValue) {
        this.update({ backgroundColor: newValue });
    }.bind(this), true, true);
    this.menu.addMenuItemWithInput(this.id + '_textColor', 'MenuOptChangeColor', 'color', this.color, function(newValue) {
        this.update({ color: newValue });
    }.bind(this), false, true);

    //Events
    this.objTextBox.activateMovingResizing(function() { noteContainer.updateItem(this) }.bind(this));
    this.objTextBox.activateSavingText(function() { noteContainer.updateItem(this) }.bind(this));
}

Sticky.prototype.update = function(props) {
    this.backgroundColor = props.backgroundColor || this.backgroundColor;
    this.color = props.color || this.color;
    this.opacity = props.opacity || this.opacity;
    this.hoverOpacity = props.hoverOpacity || this.hoverOpacity;
    this.username = props.username || this.username;
    this.datetime = props.datetime || this.datetime;
    this.objTextBox.update(props.textBox, props);


    if (!props.readOnly) {
        noteContainer.updateItem(this);
    }
}

Sticky.prototype.delete = function() {
    this.stickyContainer.parentNode.removeChild(this.stickyContainer);
}

Sticky.prototype.getNodeReference = function() {
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

Sticky.prototype.highlightItem = function(state) {
    this.objTextBox.highlightItem(state)
}

Sticky.prototype.getTextToCopy = function() {
    return this.objTextBox.getTextToCopy();
}

Sticky.check = function() {
    return TextBox.check();
}

var dummy = 0;
dummy;