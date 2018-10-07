const FINDING_SELECTION = 0;
const HIGHLIGHTING_TEXT = 1;
const END_SELECTION = 2;
const DEFAULT_TEXT_DECORATION_COLOR = 'black';

function TextSelection(id, className, params) {
    params = params || {};

    //Properties
    this.id = id;
    this.className = className;
    this.menuPosY;
    this.menuPosX;
    this.backgroundColor = params.backgroundColor || '#ffffff';
    this.color = params.color || '#000000';
    this.opacity = params.opacity || 1;
    this.hoverOpacity = params.hoverOpacity || 1;
    this.textNodes = new Array(0);
    this.selectionNodes = new Array(0);

    //HTML elements --> on initializeSelection

    //Events --> on initializeSelection

    this.initializeSelection(params);
    this.draw();
}

TextSelection.prototype.initializeSelection = function(input) {
    //Create an XMLPath with the selected text, making possible to identify the selected text next time it is loaded.
    function makeXPath(node, currentPath) {
        /* this should suffice in HTML documents for selectable nodes, XML with namespaces needs more code */
        currentPath = currentPath || '';

        switch (node.nodeType) {
            case 3:
            case 4:
                return makeXPath(node.parentNode, 'text()[' + (document.evaluate('preceding-sibling::text()', node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) + ']');
            case 1:
                return makeXPath(node.parentNode, node.nodeName + '[' + (document.evaluate('preceding-sibling::' + node.nodeName, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) + ']' + (currentPath ? '/' + currentPath : ''));
            case 9:
                return '/' + currentPath;
            default:
                return '';
        }
    }

    //Surround with a DIV the part of the text included in the selection.
    function surroundRange(range) {
        //HTML elements
        var newNode = document.createElement("div");
        newNode.id = that.id;
        newNode.className = 'selection ' + that.className;
        range.surroundContents(newNode);

        //Events
        newNode.addEventListener("mouseover", that.applySelectionOpacity.bind(that), true);
        newNode.addEventListener("mouseout", that.applySelectionOpacity.bind(that), true);

        that.selectionNodes.push(newNode);
    }
    //Split the selection in a list of different base elements with the selected.
    function splitRange(selectionRange) {
        var treeWalker = document.createTreeWalker(selectionRange.commonAncestorContainer,
            NodeFilter.SHOW_ALL);
        var status = FINDING_SELECTION;
        var currentNode = treeWalker.currentNode;
        var rangeArray = new Array(0)
        while (currentNode && status != END_SELECTION) {
            if (currentNode.nodeType <= 3) {
                switch (status) {
                    case FINDING_SELECTION:
                        if (selectionRange.startContainer == currentNode) {
                            var newRange = document.createRange();
                            newRange.setStart(currentNode, selectionRange.startOffset);
                            if (selectionRange.endContainer == selectionRange.startContainer) {
                                newRange.setEnd(currentNode, selectionRange.endOffset);
                                status = END_SELECTION;
                            } else {
                                newRange.setEnd(currentNode, currentNode.length);
                                status = HIGHLIGHTING_TEXT;
                            }
                            rangeArray.push(newRange);
                        }
                        break;
                    case HIGHLIGHTING_TEXT:
                        var newRange = document.createRange();
                        newRange.setStart(currentNode, 0);
                        if (selectionRange.endContainer == currentNode) {
                            newRange.setEnd(currentNode, selectionRange.endOffset);
                            status = END_SELECTION;
                        } else {
                            newRange.setEnd(currentNode, currentNode.length);
                        }
                        rangeArray.push(newRange);
                        break;
                }
            }
            currentNode = treeWalker.nextNode();
        }
        for (var i = 0; i < rangeArray.length; i++) {
            surroundRange(rangeArray[i]);
        }
    }

    //Get different textNodes found in the selection
    if (input && input.textNodes) {
        this.textNodes = this.textNodes.concat(input.textNodes);
    } else {
        var userSelection = window.getSelection();
        for (var i = 0; i < userSelection.rangeCount; i++) {
            var currentRange = userSelection.getRangeAt(i);
            this.textNodes.push({
                startNodeXPath: makeXPath(currentRange.startContainer),
                startOffset: currentRange.startOffset,
                endNodeXPath: makeXPath(currentRange.endContainer),
                endOffset: currentRange.endOffset
            });
        }
    }

    var that = this;
    for (var i = 0; i < this.textNodes.length; i++) {
        var curr = this.textNodes[i];
        var range = document.createRange();
        range.setStart(document.evaluate(curr.startNodeXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(curr.startOffset));
        range.setEnd(document.evaluate(curr.endNodeXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(curr.endOffset));
        splitRange(range);
    }
}

TextSelection.prototype.applySelectionOpacity = function(e) {
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
    var rgbColor = hexToRgb(this.backgroundColor);
    var newColor;
    if (e && e.type == "mouseover") {
        newColor = "rgba(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ", " + this.hoverOpacity + ")";
    } else {
        newColor = "rgba(" + rgbColor.r + ", " + rgbColor.g + ", " + rgbColor.b + ", " + this.opacity + ")";
    }

    for (var i = 0; i < this.selectionNodes.length; i++) {
        this.selectionNodes[i].style.backgroundColor = newColor;
    }
}

TextSelection.prototype.draw = function() {

    for (var i = 0; i < this.selectionNodes.length; i++) {
        this.selectionNodes[i].style.color = this.color;
    }
    this.applySelectionOpacity();
}

TextSelection.prototype.update = function(json) {
    this.backgroundColor = json.backgroundColor || this.backgroundColor;
    this.color = json.color || this.color;
    this.opacity = json.opacity || this.opacity;
    this.hoverOpacity = json.hoverOpacity || this.hoverOpacity;

    this.draw();
}

TextSelection.prototype.removeClass = function(className) {
    for (var i = 0; i < this.selectionNodes.length; i++) {
        this.selectionNodes[i].classList.remove(className);
    }
}

TextSelection.prototype.addClass = function(className) {
    for (var i = 0; i < this.selectionNodes.length; i++) {
        if (!this.selectionNodes[i].classList.contains(className))
            this.selectionNodes[i].classList.add(className);
    }
}

TextSelection.prototype.getMenuPos = function() {
    return {
        x: this.menuPosX,
        y: this.menuPosY
    }
}

TextSelection.prototype.getNodelistReference = function() {
    return this.selectionNodes;
}

TextSelection.prototype.toJSon = function() {
    return {
        textNodes: this.textNodes
    };

}

TextSelection.prototype.delete = function() {
    for (var selection in this.selectionNodes) {
        var parent = this.selectionNodes[selection].parentNode;
        while (this.selectionNodes[selection].firstChild) {
            parent.insertBefore(this.selectionNodes[selection].firstChild, this.selectionNodes[selection]);
        }
        parent.removeChild(this.selectionNodes[selection]);
        parent.normalize();
    }
}

TextSelection.prototype.highlightItem = function(state) {
    if (state == 'hover') {
        for (var i in this.selectionNodes) {
            this.selectionNodes[i].classList.add('highlightElem');
        }
        var nodeTop = this.selectionNodes[0].getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo(0, nodeTop - (window.innerHeight / 2));
    } else {
        for (var i in this.selectionNodes) {
            this.selectionNodes[i].classList.remove('highlightElem');
        }
    }
}

TextSelection.prototype.getTextToCopy = function() {
    var textToCopy = "";
    for (var i in this.selectionNodes) {
        textToCopy += this.selectionNodes[i].textContent;
    }
    return textToCopy;
}

TextSelection.prototype.getDescription = function() {
    var description = '';
    for (var i in this.selectionNodes) {
        description += this.selectionNodes[i].innerText;
    }
    return description;
}

var dummy = 0;
dummy;