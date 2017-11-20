const FINDING_SELECTION = 0;
const HIGHLIGHTING_TEXT = 1;
const END_SELECTION = 2;
const DEFAULT_TEXT_DECORATION_COLOR = 'black';

function TextSelection(json) {
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

    this.menuPosY;
    this.menuPosX;
    this.selectionNodes = new Array(0);
    this.textNodes = new Array(0);

    if (json) {
        this.textNodes = this.textNodes.concat(json.textNodes);
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
}

TextSelection.prototype.applySelectionOpacity = function(level) {
    var color = window.getComputedStyle(this.selectionNodes[0], null).getPropertyValue('background-color').match(/\d+(.\d+)?/g);
    var newColor = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + level + ")";

    for (var node in this.selectionNodes) {
        this.selectionNodes[node].style.backgroundColor = newColor;
    }
}

TextSelection.prototype.draw = function(id, className, backgroundColor, color, opacity, hoverOpacity) {
    function drawRange(range) {
        var newNode = document.createElement("div");
        newNode.id = id;
        newNode.className = 'selection ' + className;
        newNode.style.backgroundColor = backgroundColor;
        newNode.style.color = color || DEFAULT_TEXT_DECORATION_COLOR;

        newNode.addEventListener("mouseover", function() { that.applySelectionOpacity(hoverOpacity); }, true);
        newNode.addEventListener("mouseout", function() { that.applySelectionOpacity(opacity); }, true);
        range.surroundContents(newNode);

        that.selectionNodes.push(newNode);

        var selectionBounding = newNode.getBoundingClientRect();
        if (!that.menuPosX || that.menuPosY < selectionBounding.top) {
            that.menuPosY = selectionBounding.top;
            that.menuPosX = selectionBounding.left;
        } else if ((that.menuPosY - 10 < selectionBounding.top) && (that.menuPosX > selectionBounding.left)) {
            that.menuPosX = selectionBounding.left;
        }
    }

    function splitRange(selectionRange) {
        var treeWalker = document.createTreeWalker(selectionRange.commonAncestorContainer,
            NodeFilter.SHOW_ALL);
        var status = FINDING_SELECTION;
        var currentNode = treeWalker.currentNode;
        var rangeArray = new Array(0);

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
            drawRange(rangeArray[i]);
        }

    }

    var rangeArr = Array(0);
    for (var i = 0; i < this.textNodes.length; i++) {
        var curr = this.textNodes[i];
        var range = document.createRange();
        range.setStart(document.evaluate(curr.startNodeXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(curr.startOffset));
        range.setEnd(document.evaluate(curr.endNodeXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(curr.endOffset));
        rangeArr.push(range);
    }
    var that = this;
    for (var i = 0; i < rangeArr.length; i++) {
        splitRange(rangeArr[i]);
    }
    this.menuPosX += window.pageXOffset - 20;
    this.menuPosY += window.pageYOffset;
    this.applySelectionOpacity(opacity);

}

TextSelection.prototype.update = function(json) {
    this.backgroundColor = json.backgroundColor || this.backgroundColor;
    this.color = json.color || this.color;

    for (var i in this.selectionNodes) {
        this.selectionNodes[i].style.backgroundColor = this.backgroundColor;
        this.selectionNodes[i].style.color = this.color;
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

TextSelection.prototype.getDescription = function() {
    var description = '';
    for (var i in this.selectionNodes) {
        description += this.selectionNodes[i].innerText;
    }
    return description;
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

var dummy = 0;
dummy;