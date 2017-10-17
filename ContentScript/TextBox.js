const MARGIN = 4;
const MIN_HEIGHT = 100;
const MIN_WIDTH = 200;

function TextBox(json) {
    this.menuPosX = 0;
    this.menuPosY = 0;

    if (!json) {
        json = {};
    }
    this.text = json.text || "";
    this.top = parseFloat(json.top || mouseCoord.y);
    this.left = parseFloat(json.left || mouseCoord.x);
    this.width = parseFloat(json.width || MIN_WIDTH);
    this.height = parseFloat(json.height || MIN_HEIGHT);
}

TextBox.prototype.update = function(props) {
    this.text = props.text || this.text;
    this.left = parseFloat(props.left || this.left);
    this.top = parseFloat(props.top || this.top);
    this.width = parseFloat(props.width || this.width);
    this.height = parseFloat(props.height || this.height);

    this.box.style.top = this.top + "px";
    this.box.style.left = this.left + "px";
    this.box.style.width = this.width + "px";
    this.box.style.height = this.height + "px";
    this.textArea.value = this.text;

    if (props.backgroundColor)
        this.box.style.backgroundColor = props.backgroundColor;
    if (props.color)
        this.textArea.style.color = props.color;

}

TextBox.prototype.applyBoxOpacity = function(level) {
    var color = window.getComputedStyle(this.box, null).getPropertyValue('background-color').match(/\d+(.\d+)?/g);
    var newColor = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + level + ")";
    this.box.style.backgroundColor = newColor;
}

TextBox.prototype.draw = function(id, className, backgroundColor, color, opacity, hoverOpacity) {
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

    this.box = document.createElement('div');
    this.box.id = id;
    this.box.className = 'textBox ' + className;
    var rgbColor = hexToRgb(backgroundColor);
    this.box.style.backgroundColor = "rgba(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ", " + opacity + ")";
    this.box.style.top = this.top + "px";
    this.box.style.left = this.left + "px";
    this.box.style.width = this.width + "px";
    this.box.style.height = this.height + "px";
    this.box.addEventListener("mouseover", function() { this.applyBoxOpacity(hoverOpacity); }.bind(this), true);
    this.box.addEventListener("mouseout", function() { this.applyBoxOpacity(opacity); }.bind(this), true);

    this.menuPosX = this.left - 20;
    this.menuPosY = this.top;

    this.textArea = document.createElement('textarea');
    this.textArea.id = id + '_Text';
    this.textArea.className = 'textBoxText';
    this.textArea.value = this.text;
    this.textArea.style.color = color;
    this.box.appendChild(this.textArea);
}

TextBox.prototype.getMenuPos = function() {
    return {
        x: this.menuPosX,
        y: this.menuPosY
    }
}

TextBox.prototype.getNodeReference = function() {
    return this.box;
}

TextBox.prototype.toJSon = function() {
    return {
        text: this.text,
        left: this.left,
        top: this.top,
        width: this.width,
        height: this.height
    };

}

TextBox.prototype.activateMovingResizing = function(action, options) {
    var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

    if (!options) {
        options = {};
    }

    options.top = options.top == null || options.top;
    options.bottom = options.bottom == null || options.bottom;
    options.left = options.left == null || options.left;
    options.right = options.right == null || options.right;
    options.move = options.move == null || options.move;

    var onMouseMove = function(event) {
        posX = event.clientX + window.content.pageXOffset - that.left;
        posY = event.clientY + window.content.pageYOffset - that.top;

        onLeftEdge = (posX < MARGIN && options.left);
        onRightEdge = (posX > that.width - MARGIN && options.right);
        onTopEdge = (posY < MARGIN && options.top);
        onBottomEdge = (posY > that.height - MARGIN && options.bottom);

        if ((onLeftEdge && onTopEdge) || (onRightEdge && onBottomEdge))
            that.textArea.style.cursor = "nw-resize";
        else if ((onLeftEdge && onBottomEdge) || (onRightEdge && onTopEdge))
            that.textArea.style.cursor = "ne-resize";
        else if (onTopEdge || onBottomEdge)
            that.textArea.style.cursor = "n-resize";
        else if (onLeftEdge || onRightEdge)
            that.textArea.style.cursor = "e-resize";
        else
            that.textArea.style.cursor = "";

    }

    var onMouseDown = function(event) {

        var onResize = function(event) {
            var currMouse = {
                x: event.clientX + window.content.pageXOffset,
                y: event.clientY + window.content.pageYOffset
            }

            if (onRightEdge) {
                var currentWidth = currMouse.x - prevMouse.x + that.box.offsetWidth;
                if (currentWidth >= MIN_WIDTH) {
                    that.box.style.width = currentWidth + 'px';
                }
            }
            if (onBottomEdge) {
                var currentHeight = currMouse.y - prevMouse.y + that.box.offsetHeight;
                if (currentHeight > MIN_HEIGHT) {
                    that.box.style.height = currentHeight + 'px';
                }
            }
            if (onLeftEdge) {
                var currentWidth = prevMouse.x - currMouse.x + that.box.offsetWidth;
                if (currentWidth >= MIN_WIDTH) {
                    that.box.style.width = currentWidth + 'px';
                    that.box.style.left = currMouse.x + 'px';
                }
            }

            if (onTopEdge) {
                var currentHeight = prevMouse.y - currMouse.y + that.box.offsetHeight;
                if (currentHeight > MIN_HEIGHT) {
                    that.box.style.height = currentHeight + 'px';
                    that.box.style.top = currMouse.y + 'px';
                }
            }

            prevMouse.x = currMouse.x;
            prevMouse.y = currMouse.y;
            event.stopPropagation();
            event.preventDefault();
        };
        var onMove = function(event) {
            that.box.style.left = event.clientX + window.content.pageXOffset - posX + "px";
            that.box.style.top = event.clientY + window.content.pageYOffset - posY + "px";
            event.stopPropagation();
            event.preventDefault();
        };

        var onMouseUp = function(event) {
            var newValues = that.box.getBoundingClientRect();
            if (
                (that.top != newValues.top + window.content.pageYOffset) ||
                (that.left != newValues.left + window.content.pageXOffset) ||
                (that.height != newValues.height) ||
                (that.width != newValues.width)
            ) {
                that.top = newValues.top + window.content.pageYOffset;
                that.left = newValues.left + window.content.pageXOffset;
                that.height = newValues.height;
                that.width = newValues.width;

                that.menuPosX = that.left - 20;
                that.menuPosY = that.top;
                action();
            }
            if (onLeftEdge || onRightEdge || onTopEdge || onBottomEdge)
                document.removeEventListener('mousemove', onResize, true);
            else
                document.removeEventListener('mousemove', onMove, true);
            document.removeEventListener('mouseup', onMouseUp, true);
            event.stopPropagation();
            event.preventDefault();
        }

        //calculate the position of the mouse inside the note
        var prevMouse = mouseCoord;
        if (onLeftEdge || onRightEdge || onTopEdge || onBottomEdge)
            document.addEventListener('mousemove', onResize, true);
        else if (options.move)
            document.addEventListener('mousemove', onMove, true);
        document.addEventListener('mouseup', onMouseUp, true);
    };

    var that = this;
    this.box.addEventListener("mousemove", onMouseMove, true);
    this.box.addEventListener("mousedown", onMouseDown, true);
}

TextBox.prototype.getText = function() {
    return this.textArea.value;
}

TextBox.prototype.getDescription = function() {
    return this.textArea.value;
}

TextBox.prototype.activateSavingText = function(action) {
    var onBlur = function(event) {
        if (that.text != that.textArea.value) {
            that.text = that.textArea.value;
            action();
        }
    }

    var that = this;
    this.textArea.addEventListener("blur", onBlur, true);
}

TextBox.prototype.delete = function() {
    this.sticky.parentNode.removeChild(this.sticky);
}

TextBox.prototype.highlightItem = function(state) {
    if (state == 'hover') {
        this.box.classList.add('highlightElem');
        var nodeTop = this.box.getBoundingClientRect().top + window.content.pageYOffset;;
        window.scrollTo(0, nodeTop - (window.innerHeight / 2));
    } else {
        this.box.classList.remove('highlightElem');
    }
}

var dummy = 0;
dummy;