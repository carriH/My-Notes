function ChangeText(id) {
    this.id = id;
    this.type = CHANGETEXT;
    this.selectionBackgroundColor = defaultValues.changeText.selectionBackgroundColor; // CHANGETEXT_SELECTION_COLOR;
    this.selectionColor = defaultValues.changeText.selectionColor; //CHANGETEXT_SELECTION_DECORATOR_COLOR;
    this.backgroundColor = defaultValues.changeText.backgroundColor; //CHANGETEXT_BACKGROUND_COLOR;
    this.color = defaultValues.changeText.color; //CHANGETEXT_TEXT_COLOR;
    this.selectionOpacity = defaultValues.changeText.selectionOpacity; //CHANGETEXT_OPACITY;
    this.selectionHoverOpacity = defaultValues.changeText.selectionHoverOpacity; //CHANGETEXT_HOVER_OPACITY;
    this.opacity = defaultValues.changeText.opacity;
    this.hoverOpacity = defaultValues.changeText.hoverOpacity;
    this.username = defaultValues.username;
    this.datetime = (new Date()).toJSON();
    //this.textChanged = new TextSelection(id + "_Selection", "changetextSelection");
    //this.newText = new TextBox(id);
}

ChangeText.prototype.create = function(json) {

    function saveChanges() {
        noteContainer.updateItem(this);
    }

    var jsonSelection;
    var jsonTextbox;
    if (json) {
        this.id = json.id || this.id;
        this.selectionBackgroundColor = json.selectionBackgroundColor || this.selectionBackgroundColor;
        this.selectionColor = json.selectionColor || this.selectionColor;
        this.backgroundColor = json.backgroundColor || this.backgroundColor;
        this.color = json.color || this.color;
        this.selectionOpacity = json.selectionOpacity || this.selectionOpacity;
        this.selectionHoverOpacity = json.selectionHoverOpacity || this.selectionHoverOpacity;
        this.opacity = json.opacity || this.opacity;
        this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
        this.username = json.username || this.username;
        this.datetime = json.datetime || this.datetime;
        jsonSelection = json.textChanged;
        jsonTextbox = json.newText;
    }
    this.objSelection = new TextSelection(jsonSelection);
    this.objSelection.draw(this.id + '_Selection', this.type + '_Selection', this.selectionBackgroundColor, this.selectionColor, this.selectionOpacity, this.selectionHoverOpacity);

    if (!jsonTextbox) {
        var top = 0;
        var left = 0;
        var nodeList = this.objSelection.getNodelistReference()
        for (var node in nodeList) {
            var selBounding = nodeList[node].getBoundingClientRect();
            if (selBounding.bottom > top) {
                top = selBounding.bottom;
                left = selBounding.right;
            } else if (selBounding.bottom = top && selBounding.right > left) {
                left = selBounding.right;
            }
        }

        jsonTextbox = {
            top: window.pageYOffset + top + 10,
            left: window.pageXOffset + left - 10
        }
    }

    this.objTextBox = new TextBox(jsonTextbox);
    this.objTextBox.draw(this.id + '_textBox', CHANGETEXT + '_textBox', this.backgroundColor, this.color, this.opacity, this.hoverOpacity);
    this.objTextBox.activateSavingText(saveChanges.bind(this));
    this.objTextBox.activateMovingResizing(saveChanges.bind(this), { top: false, move: false });

    this.arrow = document.createElement("span");
    this.arrow.id = this.id + '_arrow';
    this.arrow.className = 'changetextArrow'
    this.arrow.style.top = (jsonTextbox.top - 15) + 'px';
    this.arrow.style.left = (jsonTextbox.left + 5) + 'px';
    this.arrow.style.position = 'absolute';
    this.arrow.style.color = this.color;
    this.arrow.innerText = '\u25B2';

    this.changeTextContainer = document.createElement("div");
    this.changeTextContainer.id = "changeText_" + this.id;
    this.changeTextContainer.className = CHANGETEXT;

    this.changeTextContainer.appendChild(this.objTextBox.getNodeReference());
    this.changeTextContainer.appendChild(this.arrow);

    var menuPos = this.objSelection.getMenuPos();
    var menuConfig = {
        menuId: this.id + '_menu',
        menuClass: CHANGETEXT + '_Menu',
        top: menuPos.y,
        left: menuPos.x
    }

    this.menu = new Menu(menuConfig);
    this.menu.addMenuItem(this.id + '_delete', 'menuOptDelete', function(e) { noteContainer.deleteItem(this.id); }.bind(this));
    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', this.backgroundColor, function(newValue) {
        this.update({ backgroundColor: newValue });
    }.bind(this));
    this.menu.addMenuItemWithInput(this.id + '_textColor', 'MenuOptChangeColor', 'color', this.color, function(newValue) {
        this.update({ color: newValue });
    }.bind(this));
    this.menu.addMenuItemWithInput(this.id + '_selectionColor', 'MenuOptChangeSelectionBackgroundColor', 'color', this.selectionBackgroundColor, function(newValue) {
        this.update({ selectionBackgroundColor: newValue });
    }.bind(this));
    this.menu.addMenuItemWithInput(this.id + '_decoratorColor', 'MenuOptChangeSelectionTextColor', 'color', this.selectionColor, function(newValue) {
        this.update({ selectionColor: newValue });
    }.bind(this));
    this.menu.addMenuItem(this.id + '_copyText', 'MenuOptCopyText', function(e) { noteContainer.copyText(this.id); }.bind(this));

    this.menu.addHoverEvent(this.objTextBox.getNodeReference());
    var nodeList = this.objSelection.getNodelistReference();
    for (var i in nodeList) {
        this.menu.addHoverEvent(nodeList[i]);
    }
    this.changeTextContainer.appendChild(this.menu.getNodeReference());
    return this.changeTextContainer;
}

ChangeText.prototype.update = function(json) {
    this.backgroundColor = json.backgroundColor || this.backgroundColor;
    this.color = json.color || this.color;
    this.selectionBackgroundColor = json.selectionBackgroundColor || this.selectionBackgroundColor;
    this.selectionColor = json.selectionColor || this.selectionColor;
    this.backgroundColor = json.backgroundColor || this.backgroundColor;
    this.color = json.color || this.color;
    this.selectionOpacity = json.selectionOpacity || this.selectionOpacity;
    this.selectionHoverOpacity = json.selectionHoverOpacity || this.selectionHoverOpacity;
    this.opacity = json.opacity || this.opacity;
    this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
    this.username = json.username || this.username;
    this.datetime = json.datetime || this.datetime;

    this.objTextBox.update(json);
    this.objSelection.update({
        backgroundColor: json.selectionBackgroundColor,
        color: json.selectionColor,
        opacity: json.selectionOpacity,
        hoverOpacity: json.selectionHoverOpacity
    });
    this.objSelection.applySelectionOpacity(this.selectionOpacity);
    if (json.color) {
        this.arrow.style.color = json.color;
    }

    noteContainer.updateItem(this);
}

ChangeText.prototype.toJSon = function() {
    var description = this.objSelection.getDescription() + ' -> ' + this.objTextBox.getDescription();
    return {
        type: CHANGETEXT,
        id: this.id,
        description: description,
        username: this.username,
        datetime: this.datetime,
        backgroundColor: this.backgroundColor,
        color: this.color,
        selectionBackgroundColor: this.selectionBackgroundColor,
        selectionColor: this.selectionColor,
        selectionOpacity: this.selectionOpacity,
        selectionHoverOpacity: this.selectionHoverOpacity,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity,
        textChanged: this.objSelection.toJSon(),
        newText: this.objTextBox.toJSon()
    };

}

ChangeText.prototype.delete = function() {
    this.objSelection.delete();
    this.changeTextContainer.parentNode.removeChild(this.changeTextContainer);
}

ChangeText.prototype.highlightItem = function(state) {
    this.objSelection.highlightItem(state);
    this.objTextBox.highlightItem(state);
}

ChangeText.prototype.getTextToCopy = function() {
    return this.objTextBox.getTextToCopy();
}

var dummy = 0;
dummy;