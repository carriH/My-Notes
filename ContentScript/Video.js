function Video(id, params) {
    params = params || { media: { audio: true, video: true } };

    //Properties
    this.id = id;
    this.type = VIDEO;
    this.backgroundColor = params.backgroundColor || defaultValues.player.backgroundColor; //STICKY_COLOR;
    this.color = params.color || defaultValues.player.color; //STICKY_TEXT_COLOR;
    this.opacity = params.opacity || defaultValues.player.opacity;
    this.hoverOpacity = params.hoverOpacity || defaultValues.player.hoverOpacity;
    this.username = params.username || defaultValues.username;
    this.datetime = params.datetime || (new Date()).toJSON();
    this.description = "Video"

    //HTML elements
    this.videoContainer = document.createElement('div');
    var color = {
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity
    }
    this.objMedia = new Media(this.id, params.media, color, function() { noteContainer.updateItem(this) }.bind(this));
    this.videoContainer.appendChild(this.objMedia.getNodeReference());

    this.menu = new ContextMenu(this.videoContainer, true);
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

Video.prototype.update = function(props) {
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

Video.prototype.getNodeReference = function() {
    return this.videoContainer;
}

Video.prototype.toJSon = function() {
    return {
        type: VIDEO,
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

Video.prototype.delete = function() {
    this.videoContainer.parentNode.removeChild(this.videoContainer);
}

Video.prototype.highlightItem = function(state) {
    this.objMedia.highlightItem(state)
}

Video.prototype.getTextToCopy = function() {

    return "";
}

Video.check = function() {
    return Media.check();
}

var dummy = 0;
dummy;