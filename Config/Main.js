var backgroundScript;

function translateRec(node) {
    if (node.attributes) {
        for (var j = 0; j < node.attributes.length; j++) {
            var atValue = node.attributes[j].value.trim();
            if (atValue.match(/__MSG_(\w+)__/g)) {
                node.attributes[j].value = browser.i18n.getMessage(atValue.substring(6, atValue.length - 2));
            }
        }
    }
    for (var i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeType == 3) {
            var textValue = node.childNodes[i].textContent.trim();
            if (textValue.match(/__MSG_(\w+)__/g))
                node.childNodes[i].textContent = browser.i18n.getMessage(textValue.substring(6, textValue.length - 2));
        } else if (node.childNodes[i].nodeType == 1) {
            translateRec(node.childNodes[i])
        }
    }
}

function i18nToHtml() {
    //Localize by replacing __MSG_***__ meta tags
    var nodesToTranslate = document.getElementsByClassName('i18n');
    for (var i = 0; i < nodesToTranslate.length; i++) {
        translateRec(nodesToTranslate[i]);
    }
}

function showMessage(message, color) {
    if (!color) {
        color = "black";
    }
    document.getElementById("outputMessage").style.color = color;
    document.getElementById("outputMessage").innerText = message;
    setTimeout(function() { document.getElementById("outputMessage").innerText = ""; }, 2000);
}

function showTab(evt, tab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tab).classList.add("active");
    evt.currentTarget.classList.add("active");
}

//FIRST LOAD


browser.runtime.getBackgroundPage().then((background) => {
    backgroundScript = background;
    loadColors();
    loadShortcuts();
});

document.getElementById("save").addEventListener("click", saveColors, true);
document.getElementById("cancel").addEventListener("click", loadColors, true);
document.getElementById("reset").addEventListener("click", restoreDefault, true);
document.getElementById("tabShortcuts").addEventListener("click", (event) => { showTab(event, "Shortcuts") }, true);
document.getElementById("tabColors").addEventListener("click", (event) => { showTab(event, "Colors") }, true);
document.getElementById("tabManual").addEventListener("click", (event) => { showTab(event, "Manual") }, true);
document.getElementById("saveShortcuts").addEventListener("click", saveShortcuts, true);
document.getElementById("cancelShortcuts").addEventListener("click", loadShortcuts, true);
document.getElementById("resetShortcuts").addEventListener("click", restoreShortcuts, true);

i18nToHtml();