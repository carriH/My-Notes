function Audio(id, params) {
    params = params || { media: { audio: true, video: false } };

    //Properties
    this.id = id;
    this.type = AUDIO;
    this.backgroundColor = params.backgroundColor || defaultValues.player.backgroundColor; //STICKY_COLOR;
    this.color = params.color || defaultValues.player.color; //STICKY_TEXT_COLOR;
    this.opacity = params.opacity || defaultValues.player.opacity;
    this.hoverOpacity = params.hoverOpacity || defaultValues.player.hoverOpacity;
    this.username = params.username || defaultValues.username;
    this.datetime = params.datetime || (new Date()).toJSON();
    this.description = "Audio"

    //HTML elements
    this.audioContainer = document.createElement('div');
    var color = {
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity
    }
    this.objMedia = new Media(this.id, params.media, color, function() { noteContainer.updateItem(this) }.bind(this));
    this.audioContainer.appendChild(this.objMedia.getNodeReference());

    this.menu = new ContextMenu(this.audioContainer, true);
    this.menu.addMenuItem(this.id + '_delete', 'MenuOptDelete', function(e) { noteContainer.deleteItem(this.id); }.bind(this), false, true);
    this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', this.backgroundColor, function(newValue) {
        this.update({ backgroundColor: newValue });
    }.bind(this), true, true);
    this.menu.addMenuItemWithInput(this.id + '_textColor', 'MenuOptChangeColor', 'color', this.color, function(newValue) {
        this.update({ color: newValue });
    }.bind(this), false, true);

    //Events
    this.objMedia.activateMovingResizing(function() { noteContainer.updateItem(this); }.bind(this));

}

Audio.prototype.update = function(props) {
    this.backgroundColor = props.backgroundColor || this.backgroundColor;
    this.color = props.color || this.color;
    this.opacity = props.opacity || this.opacity;
    this.hoverOpacity = props.hoverOpacity || this.hoverOpacity;
    this.username = props.username || this.username;
    this.datetime = props.datetime || this.datetime;
    this.objMedia.update(props.media, props);

    if (!props.readOnly) {
        noteContainer.updateItem(this);
    }

}

Audio.prototype.getNodeReference = function() {
    return this.audioContainer;
}

Audio.prototype.toJSon = function() {
    return {
        type: AUDIO,
        id: this.id,
        description: this.description,
        username: this.username,
        datetime: this.datetime,
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity,
        media: this.objMedia.toJSon()
    };

}

Audio.prototype.delete = function() {
    this.audioContainer.parentNode.removeChild(this.audioContainer);
}

Audio.prototype.highlightItem = function(state) {
    this.objMedia.highlightItem(state)
}

Audio.prototype.getTextToCopy = function() {

    return "";
}

var dummy = 0;
dummy;