const MARGIN = 4;
const MIN_HEIGHT = 100;
const MIN_WIDTH = 200;

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

function TextBox(id, className, textParams, params) {
    params = params || {};
    textParams = textParams || {};

    //Properties
    this.text = textParams.text || "";
    this.top = textParams.top || parseFloat(mouseCoord.y);
    this.left = textParams.left || parseFloat(mouseCoord.x);
    this.width = textParams.width || parseFloat(MIN_WIDTH);
    this.height = textParams.height || parseFloat(MIN_HEIGHT);
    this.backgroundColor = params.backgroundColor || '#ffffff';
    this.color = params.color || '#000000';
    this.opacity = params.opacity || 1;
    this.hoverOpacity = params.hoverOpacity || 1;

    //HTML elements
    this.box = document.createElement('div');
    this.box.id = id;
    this.box.classList.add(BASECLASS);
    this.box.classList.add(TEXTBOXCLASS);
    this.box.classList.add(className);
    this.textArea = document.createElement('textarea');
    this.textArea.id = id + '_Text';
    this.textArea.classList.add(BASECLASS);
    this.textArea.classList.add(TEXTBOXTEXTCLASS);
    this.box.appendChild(this.textArea);

    //Events
    this.box.addEventListener("mouseover", this.applyBoxOpacity.bind(this), true);
    this.box.addEventListener("mouseout", this.applyBoxOpacity.bind(this), true);

    this.box.addEventListener("keypress", function(e) { e.stopPropagation(); });
    this.box.addEventListener("keydown", function(e) { e.stopPropagation(); });
    this.box.addEventListener("keyup", function(e) { e.stopPropagation(); });

    this.draw();
    //Initialize values if provided
    //if (params) {
    //    this.update(params.textBox, params)
    //}
}

TextBox.prototype.update = function(textBox, color) {
    if (color) {
        this.backgroundColor = color.backgroundColor || this.backgroundColor;
        this.color = color.color || this.color;
        this.opacity = color.opacity || this.opacity;
        this.hoverOpacity = color.hoverOpacity || this.hoverOpacity;
    }

    if (textBox) {
        this.text = textBox.text || this.text;
        this.left = parseFloat(textBox.left || this.left);
        this.top = parseFloat(textBox.top || this.top);
        this.width = parseFloat(textBox.width || this.width);
        this.height = parseFloat(textBox.height || this.height);
    }
    this.draw();
}

TextBox.prototype.applyBoxOpacity = function(e) {
    var rgbColor = hexToRgb(this.backgroundColor);
    if (e && e.type == "mouseover") {
        this.box.style.backgroundColor = "rgba(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ", " + this.hoverOpacity + ")";
    } else {
        this.box.style.backgroundColor = "rgba(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ", " + this.opacity + ")";
    }
}

TextBox.prototype.draw = function() {
    this.box.style.top = this.top + "px";
    this.box.style.left = this.left + "px";
    this.box.style.width = this.width + "px";
    this.box.style.height = this.height + "px";
    this.textArea.value = this.text;
    this.textArea.style.color = this.color;

    this.applyBoxOpacity();
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
        posX = event.clientX + window.pageXOffset - that.left;
        posY = event.clientY + window.pageYOffset - that.top;

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
                x: event.clientX + window.pageXOffset,
                y: event.clientY + window.pageYOffset
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
            that.box.style.left = event.clientX + window.pageXOffset - posX + "px";
            that.box.style.top = event.clientY + window.pageYOffset - posY + "px";
            event.stopPropagation();
            event.preventDefault();
        };

        var onMouseUp = function(event) {
            var newValues = that.box.getBoundingClientRect();
            if (
                (that.top != newValues.top + window.pageYOffset) ||
                (that.left != newValues.left + window.pageXOffset) ||
                (that.height != newValues.height) ||
                (that.width != newValues.width)
            ) {
                that.top = newValues.top + window.pageYOffset;
                that.left = newValues.left + window.pageXOffset;
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
        var nodeTop = this.box.getBoundingClientRect().top + window.pageYOffset;;
        window.scrollTo(0, nodeTop - (window.innerHeight / 2));
    } else {
        this.box.classList.remove('highlightElem');
    }
}

TextBox.prototype.getTextToCopy = function() {
    return this.textArea.value;
}

TextBox.prototype.getDescription = function() {
    return this.textArea.value;
}

TextBox.check = function() {
    return { valid: mouseCoord.x != 0 || mouseCoord.y != 0 };
}

var dummy = 0;
dummy;