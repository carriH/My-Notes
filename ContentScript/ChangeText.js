function ChangeText(id, params) {
    params = params || {};

    //Properties
    this.id = id;
    this.type = CHANGETEXT;
    this.selectionBackgroundColor = params.selectionBackgroundColor || defaultValues.changeText.selectionBackgroundColor;
    this.selectionColor = params.selectionColor || defaultValues.changeText.selectionColor;
    this.backgroundColor = params.backgroundColor || defaultValues.changeText.backgroundColor;
    this.color = params.color || defaultValues.changeText.color;
    this.selectionOpacity = params.selectionOpacity || defaultValues.changeText.selectionOpacity;
    this.selectionHoverOpacity = params.selectionHoverOpacity || defaultValues.changeText.selectionHoverOpacity;
    this.opacity = params.opacity || defaultValues.changeText.opacity;
    this.hoverOpacity = params.hoverOpacity || defaultValues.changeText.hoverOpacity;
    this.username = params.username || defaultValues.username;
    this.datetime = params.datetime || (new Date()).toJSON();

    //HTML element
    this.changeTextContainer = document.createElement("div");
    this.changeTextContainer.id = "changeText_" + this.id;
    //this.changeTextContainer.classList.add(BASECLASS);
    this.changeTextContainer.classList.add(CHANGETEXT);

    var input = {
        textNodes: params && params.textChanged ? params.textChanged.textNodes : null,
        backgroundColor: this.selectionBackgroundColor,
        color: this.selectionColor,
        opacity: this.selectionOpacity,
        hoverOpacity: this.selectionHoverOpacity
    }
    this.objSelection = new TextSelection(this.id + '_Selection', this.type, input);

    if (!params.newText) {
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

        params.newText = {
            top: window.pageYOffset + top + 10,
            left: window.pageXOffset + left - 10
        }
    }
    var color = {
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity
    }
    this.objTextBox = new TextBox(this.id + '_textBox', this.type + '_textBox', params.newText, color);
    this.changeTextContainer.appendChild(this.objTextBox.getNodeReference());

    this.arrow = document.createElement("span");
    this.arrow.id = this.id + '_arrow';
    //this.arrow.classList.add(BASECLASS);
    this.arrow.classList.add('changetextArrow');
    this.arrow.style.top = (params.newText.top - 15) + 'px';
    this.arrow.style.left = (params.newText.left + 5) + 'px';
    this.arrow.style.position = 'absolute';
    this.arrow.style.color = this.color;
    this.arrow.innerText = '\u25B2';
    this.changeTextContainer.appendChild(this.arrow);

    this.menu = new ContextMenu(this.changeTextContainer, true);
    this.menu.addMenuItem(this.id + '_delete', 'menuOptDelete', function(e) { noteContainer.deleteItem(this.id); }.bind(this), false, true);
    this.menu.addMenuItem(this.id + '_copyText', 'MenuOptCopyText', function(e) { noteContainer.copyText(this.id); }.bind(this), false, true);
    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', this.backgroundColor, function(newValue) {
        this.update({ backgroundColor: newValue });
    }.bind(this), true, true);
    this.menu.addMenuItemWithInput(this.id + '_textColor', 'MenuOptChangeColor', 'color', this.color, function(newValue) {
        this.update({ color: newValue });
    }.bind(this), false, true);
    this.menu.addMenuItemWithInput(this.id + '_selectionColor', 'MenuOptChangeSelectionBackgroundColor', 'color', this.selectionBackgroundColor, function(newValue) {
        this.update({ selectionBackgroundColor: newValue });
    }.bind(this), false, true);
    this.menu.addMenuItemWithInput(this.id + '_decoratorColor', 'MenuOptChangeSelectionTextColor', 'color', this.selectionColor, function(newValue) {
        this.update({ selectionColor: newValue });
    }.bind(this), false, true);

    //Events
    this.objTextBox.activateSavingText(function() { noteContainer.updateItem(this) }.bind(this));
    this.objTextBox.activateMovingResizing(function() { noteContainer.updateItem(this) }.bind(this), { top: false, move: false });
    this.menu.bindElemList(this.objSelection.getNodelistReference());
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

    this.objTextBox.update(json.TextBox, json);
    this.objSelection.update({
        backgroundColor: json.selectionBackgroundColor,
        color: json.selectionColor,
        opacity: json.selectionOpacity,
        hoverOpacity: json.selectionHoverOpacity
    });
    if (json.color) {
        this.arrow.style.color = json.color;
    }

    if (!json.readOnly) {
        noteContainer.updateItem(this);
    }
}

ChangeText.prototype.getNodeReference = function() {
    return this.changeTextContainer;
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

ChangeText.check = function() {
    return TextSelection.check();
}

var dummy = 0;
dummy;