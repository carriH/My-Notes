function escapeXmlChars(str) {
    if (typeof(str) == "string")
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    else
        return str;
}

function unescapeXmlChars(str) {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

//function stickiesToXml(stickyList) {
//    var xml = "";
//    for (id in stickyList) {
//        var sticky = stickyList[id];
//        xml += '<sticky><text>' + escapeXmlChars(sticky.text) + '</text>';
//        xml += '<left>' + sticky.left + '</left>';
//        xml += '<top>' + sticky.top + '</top>';
//        xml += '<width>' + sticky.width + '</width>';
//        xml += '<height>' + sticky.height + '</height>';
//        xml += '<color>' + sticky.color + '</color></sticky>';
//    }
//    return xml;
//}

function saveXmlFile(text) {
    var a = document.createElement("a");
    var file = new Blob([text], { type: "text/xml" });
    var url = URL.createObjectURL(file);
    a.href = url;
    a.download = "ExportFile.xml";
    elemListNode.appendChild(a);
    a.click();
    setTimeout(function() {
        elemListNode.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function importXmlFile() {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.visibility = "hidden";
    fileInput.addEventListener("change", function(e) {

        var file = e.target.files[0]; // FileList object
        // Only process image files.
        if (!file.type.match("text/xml")) {
            window.alert("Invalid input file.");
            return;
        }

        var reader = new FileReader();
        reader.onload = function(e) {
                backgroundScript.loadFile(reader.result);
            }
            // Read in the image file as a data URL.
        reader.readAsText(file);

    }, true);
    document.getElementById("anotations").appendChild(fileInput);
    fileInput.click();
    document.getElementById("anotations").removeChild(fileInput);
}

function jSonToXml(json) {
    var xml = '';

    for (var prop in json) {
        if (!json.hasOwnProperty(prop)) {
            continue;
        }

        if (json[prop] == undefined)
            continue;

        if (Array.isArray(json[prop])) {
            for (var i = 0; i < json[prop].length; i++) {
                xml += "<" + prop + ">";
                xml += jSonToXml(new Object(json[prop][i]));
                xml += "</" + prop + ">";
            }
        } else if (typeof json[prop] == "object") {
            xml += "<" + prop + ">";
            xml += jSonToXml(new Object(json[prop]));
            xml += "</" + prop + ">";
        } else {
            xml += "<" + prop + ">";
            xml += escapeXmlChars(json[prop]);
            xml += "</" + prop + ">";
        }
    }

    return xml;
}

function exportItemsFromPage(url) {
    var xmlOutput = '<?xml version="1.0" encoding="utf-8"?><anotationsExport><page url="' + escapeXmlChars(url) + '">';
    browser.storage.local.get([url]).then((currentStickies) => {

        if (currentStickies[url]) {
            //xmlOutput += stickiesToXml(currentStickies[url].stickies);
            var items = currentStickies[url].stickies
            for (i in items) {
                delete items[i].id;
                xmlOutput += "<item>" + jSonToXml(items[i]) + "</item>";
            }
        }
        xmlOutput += '</page></anotationsExport>';

        //Download the xml file
        saveXmlFile(xmlOutput);
    });
}

function exportItemsFromCurrentPages() {
    var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
    gettingActiveTab.then((tabs) => {
        exportItemsFromPage(tabs[0].url);
    });
}

function exportItemsFromAllPages() {
    browser.storage.local.get().then((allStickies) => {
        var xmlOutput = '<?xml version="1.0" encoding="utf-8"?><stickiesExport>';
        for (page in allStickies) {
            if (allStickies[page].stickies) {
                xmlOutput += '<page url="' + escapeXmlChars(page) + '">';
                //xmlOutput += stickiesToXml(allStickies[page].stickies);
                var items = allStickies[page].stickies
                for (i in items) {
                    delete items[i].id;
                    xmlOutput += "<item>" + jSonToXml(items[i]) + "</item>";
                }
                xmlOutput += '</page>';
            }
        }
        xmlOutput += '</stickiesExport>';
        saveXmlFile(xmlOutput);
    });

}



function deleteItemsFromCurrentPage() {
    var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
    gettingActiveTab.then((tabs) => {
        deleteItemsFromPage(tabs[0].url);

        loadItemsToSidebar();
    });
}

function deleteItemsFromPage(page) {
    backgroundScript.sendMessage({
        url: page
    }, {
        option: 'deleteAll'
    });
    browser.storage.local.remove(page);
    removeFromSide(null, page);
}

function deleteItemsFromAllPages() {
    browser.storage.local.get().then((allStickies) => {
        for (page in allStickies) {
            if (page != "latestItem") {
                console.log(page);
                deleteItemsFromPage(page);
            }
        }
        loadItemsToSidebar();
    });
}

function copyItems(page) {
    var query = page ? { url: page } : { active: true, currentWindow: true };
    backgroundScript.sendMessage(query, {
        option: 'copyText'
    });

}