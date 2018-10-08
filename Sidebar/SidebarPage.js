function SidebarPage(page, pageName) {
    this.id = pageName;
    this.nodeContainer = document.createElement("details");
    this.title = document.createElement("summary");
    this.titleText = document.createElement("input");
    this.titleText.type = "text";
    this.titleText.className = "pageTitle"
    this.titleText.value = page.title ? page.title : pageName;
    this.titleText.title = this.titleText.value
    this.activePage = false;
    this.URL = pageName;

    this.title.appendChild(this.titleText);
    //this.title.appendChild(document.createTextNode(pageName));
    this.nodeContainer.appendChild(this.title);
    var annotations = [];
    if (page.stickies) {
        annotations = page.stickies;
    } else if (page.id) {
        annotations[page.id] = page;
    }
    this.noteList = [];
    for (var note in annotations) {
        this.addItem(annotations[note])
    }

    this.menu = new ContextMenu(this.title, true);
    this.menu.addMenuItem('openLink', 'MenuOptOpenLink', this.openLink.bind(this), false, this.linkIsOpenable.bind(this), "InvalidUrlMsg");
    this.menu.addMenuItem('deletePage', 'MenuOptDeletePage', this.delete.bind(this), false, true);
    this.menu.addMenuItem('exportCurrent', 'MenuOptExportCurrent', this.exportPage.bind(this), false, true);
    this.menu.addMenuItem('copyAll', 'MenuOptCopyAll', this.copyAllText.bind(this), false, this.pageIsOpened.bind(this), "PageOpenedMsg");
    this.menu.addMenuItem('reload', 'MenuOptReloadPage', this.reload.bind(this), true, this.pageIsOpened.bind(this), "PageOpenedMsg");
}

SidebarPage.prototype.openLink = function() {
    window.open(this.id);
}

SidebarPage.prototype.reload = function() {
    this.removeAll();
    backgroundScript.loadListFromStorage(this.URL).then(page => {
        this.titleText.value = page.title || this.URL;
        var elemList = page.stickies;
        for (var id in elemList) {
            this.addItem(elemList[id]);
            backgroundScript.sendMessage({ url: this.URL }, { option: "loadItem", item: elemList[id] })
        }
    });
}

SidebarPage.prototype.linkIsOpenable = function() {
    if ((this.id.match(/^chrome:/i)) ||
        (this.id.match(/^javascript:/i)) ||
        (this.id.match(/^data:/i)) ||
        (this.id.match(/^file:/i)) ||
        (this.id.match(/^about:/i))) {
        return false;
    } else {
        return true;
    }
}

SidebarPage.prototype.pageIsOpened = function() {
    var url = this.URL;
    var check = new Promise(function(resolve, reject) {
        browser.tabs.query({ url: url }).then((tabs) => {
            if (tabs && tabs.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, e => {
            reject("Error getting values from local storage. " + e);
        });
    });
    return check;
}

SidebarPage.prototype.update = function(page) {
    var annotations = page.stickies;
    this.titleText.value = page.title || this.URL;
    for (var i in annotations) {
        this.addItem(annotations[i]);
    }
}

SidebarPage.prototype.addItem = function(item) {
    if (this.noteList[item.id]) {
        this.noteList[item.id].update(item);
    } else {
        var newNote = new SidebarElem(item, this.URL);
        this.nodeContainer.appendChild(newNote.getNodeReference());
        this.noteList[item.id] = newNote;
        newNote.addEvents(backgroundScript);
        newNote.addMenu(this.nodeContainer.getBoundingClientRect());
    }
}

SidebarPage.prototype.removeItem = function(id) {
    if (this.noteList[id]) {
        this.nodeContainer.removeChild(this.noteList[id].getNodeReference());
        delete this.noteList[id];
        return (Object.values(this.noteList).length === 0);
    }
}

SidebarPage.prototype.removeAll = function() {
    for (i in this.noteList) {
        this.nodeContainer.removeChild(this.noteList[i].getNodeReference());
        delete this.noteList[i];
    }
    return (Object.values(this.noteList).length === 0);
}

SidebarPage.prototype.delete = function() {
    deleteItemsFromPage(this.id);
}

SidebarPage.prototype.exportPage = function() {
    exportItemsFromPage(this.id);
}

SidebarPage.prototype.copyAllText = function() {
    copyItems(this.id);
}

SidebarPage.prototype.expand = function() {
    this.nodeContainer.setAttribute("open", "");
    for (var id in this.noteList) {
        this.noteList[id].addEvents(backgroundScript);
        if (this.noteList[id].isDisabled()) {
            backgroundScript.sendMessage({ active: true }, { option: "checkElem", id: id })
        }
    }
    this.activePage = true;
}

SidebarPage.prototype.collapse = function() {
    this.nodeContainer.removeAttribute("open");
    for (var i in this.noteList) {
        this.noteList[i].removeEvents();
    }
    this.activePage = false;
}

SidebarPage.prototype.getNodeReference = function() {
    return this.nodeContainer;
}

SidebarPage.prototype.addEvents = function() {
    function onClick(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function onFocus(e) {
        this.titleText.style.border = "1px solid black";
        this.titleText.select();
    }

    function onBlur(e) {
        this.titleText.style.border = "none";
        this.titleText.title = this.titleText.value;
        backgroundScript.executeTabAction("saveTitle", {
            url: this.id,
            title: this.titleText.value
        });

    }

    this.titleText.addEventListener("click", onClick, true);
    this.titleText.addEventListener("focus", onFocus.bind(this), true);
    this.titleText.addEventListener("blur", onBlur.bind(this), true);
}

SidebarPage.prototype.reportError = function(id, message) {
    this.noteList[id].reportError(message);
}