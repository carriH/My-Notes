function Audio(id) {
    this.id = id;
    this.type = AUDIO;
    this.backgroundColor = defaultValues.player.backgroundColor; //STICKY_COLOR;
    this.color = defaultValues.player.color; //STICKY_TEXT_COLOR;
    this.opacity = defaultValues.player.opacity;
    this.hoverOpacity = defaultValues.player.hoverOpacity;
    this.username = defaultValues.username;
    this.datetime = (new Date()).toJSON();
    this.description = "Audio"
}

Audio.prototype.update = function(props) {
    this.backgroundColor = props.backgroundColor || this.backgroundColor;
    this.color = props.color || this.color;
    this.opacity = props.opacity || this.opacity;
    this.hoverOpacity = props.hoverOpacity || this.hoverOpacity;
    this.username = props.username || this.username;
    this.datetime = props.datetime || this.datetime;
    this.objMedia.update(props);
    noteContainer.updateItem(this);

}

Audio.prototype.create = function(json) {
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function saveChanges() {
        this.menu.movePosition(this.objMedia.getMenuPos())
        noteContainer.updateItem(this);
    }

    var jsonMedia = { audio: true, video: false }

    if (json) {
        this.backgroundColor = json.backgroundColor || this.backgroundColor;
        this.color = json.color || this.color;
        this.opacity = json.opacity || this.opacity;
        this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
        this.username = json.username || this.username;
        this.datetime = json.datetime || this.datetime;
        jsonMedia = json.media || jsonMedia;
    }

    this.audioContainer = document.createElement('div');

    this.objMedia = new Media(jsonMedia);

    this.objMedia.draw(this.id, AUDIO, this.backgroundColor, this.color, this.opacity, this.hoverOpacity, saveChanges.bind(this));

    this.objMedia.activateMovingResizing(saveChanges.bind(this));

    var menuPos = this.objMedia.getMenuPos();
    var menuConfig = {
        menuId: this.id + '_menu',
        menuClass: 'audioMenu',
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

    var node = this.objMedia.getNodeReference();
    this.menu.addHoverEvent(node);

    this.audioContainer.appendChild(node);
    this.audioContainer.appendChild(this.menu.getNodeReference());

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

var dummy = 0;
dummy;