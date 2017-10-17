function Video(id) {
    this.id = id;
    this.type = AUDIO;
    this.top = mouseCoord.y;
    this.left = mouseCoord.x;
    this.backgroundColor = defaultValues.sticky.backgroundColor; //STICKY_COLOR;
    this.color = defaultValues.sticky.color; //STICKY_TEXT_COLOR;
    this.opacity = defaultValues.sticky.opacity;
    this.hoverOpacity = defaultValues.sticky.hoverOpacity;
    this.username = defaultValues.username;
    this.datetime = (new Date()).toJSON();
}

Video.prototype.update = function(props) {
    this.backgroundColor = props.backgroundColor || this.backgroundColor;
    this.color = props.color || this.color;
    this.opacity = props.opacity || this.opacity;
    this.hoverOpacity = props.hoverOpacity || this.hoverOpacity;
    this.username = json.username || this.username;
    this.datetime = json.datetime || this.datetime;
    this.objMedia.update(props);
    noteContainer.updateItem(this);

}

Video.prototype.create = function(json) {
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
        this.menu.movePosition(this.objTextBox.getMenuPos())
        noteContainer.updateItem(this);
    }

    if (json) {
        this.top = json.top || this.top;
        this.left = json.left || this.left;
        this.backgroundColor = json.backgroundColor || this.backgroundColor;
        this.color = json.color || this.color;
        this.opacity = json.opacity || this.opacity;
        this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;
        this.username = json.username || this.username;
        this.datetime = json.datetime || this.datetime;
    }

    this.audioContainer = document.createElement('div');
    this.audioContainer.id = this.id;
    this.audioContainer.className = AUDIO + ' textBox';
    var rgbColor = hexToRgb(this.backgroundColor);
    this.audioContainer.style.backgroundColor = "rgba(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ", " + this.opacity + ")";
    this.audioContainer.style.top = this.top + "px";
    this.audioContainer.style.left = this.left + "px";
    this.audioContainer.style.width = this.width + "px";
    this.audioContainer.style.height = this.height + "px";
    this.audioContainer.style.color = this.color;

    this.objMedia = new Media({ audio: true, video: true });

    this.audioContainer.appendChild(this.objMedia.draw());
    //this.objTextBox.activateMovingResizing(saveChanges.bind(this));
    //this.objTextBox.activateSavingText(saveChanges.bind(this));


    //var menuPos = this.objMedia.getMenuPos();
    //var menuConfig = {
    //    menuId: this.id + '_menu',
    //    menuClass: 'audioMenu',
    //    top: menuPos.y,
    //    left: menuPos.x
    //}
    //this.menu = new Menu(menuConfig);
    //this.menu.addMenuItem(this.id + '_delete', 'MenuOptDelete', function(e) { noteContainer.deleteItem(this.id); }.bind(this));
    //this.menu.addMenuItemWithInput(this.id + '_backgroundColor', 'MenuOptChangeBackgroundColor', 'color', this.backgroundColor, function(newValue) {
    //    this.update({ backgroundColor: newValue });
    //}.bind(this));
    //this.menu.addMenuItemWithInput(this.id + '_textColor', 'MenuOptChangeColor', 'color', this.color, function(newValue) {
    //    this.update({ color: newValue });
    //}.bind(this));

    //this.menu.addHoverEvent(node);

    //this.audioContainer.appendChild(this.menu.getNodeReference());

    return this.audioContainer;
}

Video.prototype.toJSon = function() {
    return {
        type: STICKY,
        id: this.id,
        //description: this.objTextBox.getDescription(),
        username: this.username,
        datetime: this.datetime,
        backgroundColor: this.backgroundColor,
        color: this.color,
        opacity: this.opacity,
        hoverOpacity: this.hoverOpacity //,
            //textBox: this.objMedia.toJSon()
    };

}

Video.prototype.delete = function() {
    this.audioContainer.parentNode.removeChild(this.audioContainer);
}

Video.prototype.highlightItem = function(state) {
    this.objMedia.highlightItem(state)
}

var dummy = 0;
dummy;