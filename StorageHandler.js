var latestItem;

function getNextId() {
    ++latestItem;
    browser.storage.local.set({ latestItem: { id: latestItem } });
    return latestItem;
}

async function saveListToStorage(url, noteList) {
    await browser.storage.local.get([url]).then((currentStickies) => {
        var updatedStickies = {};
        if (!currentStickies[url]) {
            updatedStickies.stickies = {};
        } else {
            updatedStickies = currentStickies[url];
        }
        updatedStickies.stickies = Object.assign(updatedStickies.stickies, noteList);
        browser.storage.local.set({
            [url]: updatedStickies
        });
    });

}

function deleteFromStorage(url, id) {
    browser.storage.local.get([url]).then((currentStickies) => {
        var updatedStickies = {};
        if (!currentStickies[url]) {
            updatedStickies.stickies = {};
        } else {
            updatedStickies = currentStickies[url];
        }
        if (id) {
            delete updatedStickies.stickies[id];
        }
        if (!id || Object.keys(updatedStickies.stickies).length === 0) {
            browser.storage.local.remove(url);
        } else {
            browser.storage.local.set({
                [url]: updatedStickies
            });
        }
    });
}

function saveToStorage(url, elem) {
    browser.storage.local.get([url]).then((currentStickies) => {
        var updatedStickies = {};
        if (!currentStickies[url]) {
            updatedStickies.stickies = {};
        } else {
            updatedStickies = currentStickies[url];
        }
        updatedStickies.stickies[elem.id] = elem;
        browser.storage.local.set({
            [url]: updatedStickies
        });
    });
}

function saveTitleToStorage(url, title) {
    browser.storage.local.get([url]).then((currentStickies) => {
        currentStickies[url].title = title;
        browser.storage.local.set({
            [url]: currentStickies[url]
        });
    });
}

function loadListFromStorage(url) {
    var list = new Promise(function(resolve, reject) {
        browser.storage.local.get(url).then(results => {
            if (results[url]) {
                resolve(results[url].stickies);
            } else {
                resolve(null);
            }
        }, e => {
            reject("Error getting values from local storage. " + e);
        });
    });
    return list;
}

function loadAllFromStorage() {
    var list = new Promise(function(resolve, reject) {
        browser.storage.local.get(null).then(results => {
            if (results) {

                resolve(results);
            } else {
                resolve(null);
            }
        }, e => {
            reject("Error getting values from local storage. " + e);
        });
    });
    return list;
}

function loadFromStorage(url, tabIndex) {
    browser.storage.local.get(url).then(results => {
        if (results[url]) {
            for (note in results[url].stickies) {
                sendMessage({
                    index: tabIndex
                }, {
                    option: "loadItem",
                    item: results[url].stickies[note]
                });
            }
        }
    }, e => {
        console.log("Error getting values from local storage. " + e);
    });
}

function loadConfigOptions() {
    var configOptions = new Promise(function(resolve, reject) {
        browser.storage.local.get("configuration").then(configOptions => {
            if (configOptions.configuration) {
                resolve(configOptions.configuration);
            } else {
                resolve(defaultConfigOptions());
            }
        }, e => {
            reject("Error getting config values. " + e);
        });
    });
    return configOptions;

}

function saveConfigOptions(opt) {
    browser.storage.local.set({
        configuration: opt
    }).then(() => {
        sendMessage({}, {
            option: "defaultValues",
            value: opt
        });
    });
}

function defaultConfigOptions() {
    return {
        username: 'user',
        sticky: {
            backgroundColor: '#fefe9e',
            color: '#000000',
            opacity: 1,
            hoverOpacity: 1
        },
        underline: {
            backgroundColor: '#b0daaf',
            color: '#000000',
            opacity: 0.2,
            hoverOpacity: 0.5
        },
        crossout: {
            backgroundColor: '#ff0000',
            color: '#000000',
            opacity: 0.2,
            hoverOpacity: 0.5
        },
        highlight: {
            backgroundColor: '#ffff00',
            color: '#000000',
            opacity: 0.5,
            hoverOpacity: 1
        },
        changeText: {
            backgroundColor: '#eaddaa',
            color: '#000000',
            opacity: 1,
            hoverOpacity: 1,
            selectionBackgroundColor: '#cdae32',
            selectionColor: '#000000',
            selectionOpacity: 0.2,
            selectionHoverOpacity: 0.5
        },
        url: {
            backgroundColor: '#b5cee8',
            color: '#1b26bc',
            opacity: 0.2,
            hoverOpacity: 0.5
        },
        player: {
            backgroundColor: '#48455c',
            color: '#d2d2d2',
            opacity: 1,
            hoverOpacity: 1
        }
    };
}

//Initialize item index
browser.storage.local.get("latestItem").then(last => {
    if ((!last.latestItem) || (isNaN(last.latestItem.id))) {
        latestItem = 10000;
    } else {
        latestItem = last.latestItem.id;
    }
});