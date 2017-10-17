var configOptions = null;

function applyBackgroundOpacity(elem, level) {
    var color = window.getComputedStyle(elem, null).getPropertyValue('background-color').match(/\d+(.\d+)?/g);
    var newColor = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + level + ")";

    elem.style.backgroundColor = newColor;
}

//EVENTS

function stickyEvent(eventType) {
    if (eventType == 0) {
        applyBackgroundOpacity(document.getElementById("sticky"), configOptions.sticky.opacity);
    } else {
        applyBackgroundOpacity(document.getElementById("sticky"), configOptions.sticky.hoverOpacity);
    }
}

function underlineEvent(eventType) {
    if (eventType == 0) {
        applyBackgroundOpacity(document.getElementById("underline"), configOptions.underline.opacity);
    } else {
        applyBackgroundOpacity(document.getElementById("underline"), configOptions.underline.hoverOpacity);
    }
}

function crossoutEvent(eventType) {
    if (eventType == 0) {
        applyBackgroundOpacity(document.getElementById("crossout"), configOptions.crossout.opacity);
    } else {
        applyBackgroundOpacity(document.getElementById("crossout"), configOptions.crossout.hoverOpacity);
    }
}

function highlightEvent(eventType) {
    if (eventType == 0) {
        applyBackgroundOpacity(document.getElementById("highlight"), configOptions.highlight.opacity);
    } else {
        applyBackgroundOpacity(document.getElementById("highlight"), configOptions.highlight.hoverOpacity);
    }
}

function changeTextEvent(eventType) {
    if (eventType == 0) {
        applyBackgroundOpacity(document.getElementById("changeText"), configOptions.changeText.opacity);
        applyBackgroundOpacity(document.getElementById("changeTextSelection"), configOptions.changeText.selectionOpacity);
    } else {
        applyBackgroundOpacity(document.getElementById("changeText"), configOptions.changeText.hoverOpacity);
        applyBackgroundOpacity(document.getElementById("changeTextSelection"), configOptions.changeText.selectionHoverOpacity);
    }
}

function urlEvent(eventType) {
    if (eventType == 0) {
        applyBackgroundOpacity(document.getElementById("url"), configOptions.url.opacity);
    } else {
        applyBackgroundOpacity(document.getElementById("url"), configOptions.url.hoverOpacity);
    }
}

function playerEvent(eventType) {
    if (eventType == 0) {
        applyBackgroundOpacity(document.getElementById("player"), configOptions.player.opacity);
        applyBackgroundOpacity(document.getElementById("hideBtn"), configOptions.player.opacity);
    } else {
        applyBackgroundOpacity(document.getElementById("player"), configOptions.player.hoverOpacity);
        applyBackgroundOpacity(document.getElementById("hideBtn"), configOptions.player.hoverOpacity);
    }
}

//UPDATE VALUES
function stickyValues(values) {
    document.getElementById("sticky").style.backgroundColor = values.backgroundColor;
    document.getElementById("stickyText").style.color = values.color;
    applyBackgroundOpacity(document.getElementById("sticky"), values.opacity);
}

function underlineValues(values) {
    document.getElementById("underline").style.backgroundColor = values.backgroundColor;
    document.getElementById("underline").style.color = values.color;
    applyBackgroundOpacity(document.getElementById("underline"), values.opacity);
}

function crossoutValues(values) {
    document.getElementById("crossout").style.backgroundColor = values.backgroundColor;
    document.getElementById("crossout").style.color = values.color;
    applyBackgroundOpacity(document.getElementById("crossout"), values.opacity);
}

function highlightValues(values) {
    document.getElementById("highlight").style.backgroundColor = values.backgroundColor;
    document.getElementById("highlight").style.color = values.color;
    applyBackgroundOpacity(document.getElementById("highlight"), values.opacity);
}

function changeTextValues(values) {
    document.getElementById("changeText").style.backgroundColor = values.backgroundColor;
    document.getElementById("changeTextText").style.color = values.color;
    applyBackgroundOpacity(document.getElementById("changeText"), values.opacity);
    document.getElementById("changeTextSelection").style.backgroundColor = values.selectionBackgroundColor;
    document.getElementById("changeTextSelection").style.color = values.selectionColor;
    applyBackgroundOpacity(document.getElementById("changeTextSelection"), values.selectionOpacity);
}

function urlValues(values) {
    document.getElementById("url").style.backgroundColor = values.backgroundColor;
    document.getElementById("url").style.color = values.color;
    applyBackgroundOpacity(document.getElementById("url"), values.opacity);
}

var styleSheet;

function playerValues(values) {

    function addCSSRule(selector, rules, index) {
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(styleSheet);
            styleSheet = document.styleSheets[document.styleSheets.length - 1];
        }

        for (var i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText == selector) {
                styleSheet.cssRules[i].style = rules;
                return;
            }
        }

        if ("insertRule" in styleSheet) {
            styleSheet.insertRule(selector + "{" + rules + "}", index);
        } else if ("addRule" in styleSheet) {
            styleSheet.addRule(selector, rules, index);
        }
    }

    document.getElementById("player").style.backgroundColor = values.backgroundColor;
    document.getElementById("hideBtn").style.backgroundColor = values.backgroundColor;

    document.getElementById("player").style.color = values.color;
    document.getElementById("hideBtn").style.color = values.color;
    document.getElementById("progressBar").style.color = values.color;
    addCSSRule('#' + document.getElementById("progressBar").id + '::-moz-progress-bar', 'background-color: ' + values.color);
    addCSSRule('#' + document.getElementById("volumen").id + '::-moz-range-thumb', 'background-color: ' + values.color);
    addCSSRule('#' + document.getElementById("volumen").id + '::-moz-range-track', 'background-color: ' + values.color);

    applyBackgroundOpacity(document.getElementById("player"), values.opacity);
    applyBackgroundOpacity(document.getElementById("hideBtn"), values.opacity);
}


//FIRST LOAD
function loadControls() {
    document.getElementById("username").value = configOptions.username;

    var sticky = configOptions.sticky;

    document.getElementById("stickyBackgroundColor").value = sticky.backgroundColor;
    document.getElementById("stickyBackgroundColorText").value = sticky.backgroundColor;

    document.getElementById("stickyColor").value = sticky.color;
    document.getElementById("stickyColorText").value = sticky.color;

    document.getElementById("stickyOpacity").value = sticky.opacity * 100;
    document.getElementById("stickyOpacityText").value = sticky.opacity * 100;

    document.getElementById("stickyHoverOpacity").value = sticky.hoverOpacity * 100;
    document.getElementById("stickyHoverOpacityText").value = sticky.hoverOpacity * 100;

    stickyValues(sticky);

    var underline = configOptions.underline;

    document.getElementById("underlineBackgroundColor").value = underline.backgroundColor;
    document.getElementById("underlineBackgroundColorText").value = underline.backgroundColor;

    document.getElementById("underlineColor").value = underline.color;
    document.getElementById("underlineColorText").value = underline.color;

    document.getElementById("underlineOpacity").value = underline.opacity * 100;
    document.getElementById("underlineOpacityText").value = underline.opacity * 100;

    document.getElementById("underlineHoverOpacity").value = underline.hoverOpacity * 100;
    document.getElementById("underlineHoverOpacityText").value = underline.hoverOpacity * 100;

    underlineValues(underline);

    var crossout = configOptions.crossout;

    document.getElementById("crossoutBackgroundColor").value = crossout.backgroundColor;
    document.getElementById("crossoutBackgroundColorText").value = crossout.backgroundColor;

    document.getElementById("crossoutColor").value = crossout.color;
    document.getElementById("crossoutColorText").value = crossout.color;

    document.getElementById("crossoutOpacity").value = crossout.opacity * 100;
    document.getElementById("crossoutOpacityText").value = crossout.opacity * 100;

    document.getElementById("crossoutHoverOpacity").value = crossout.hoverOpacity * 100;
    document.getElementById("crossoutHoverOpacityText").value = crossout.hoverOpacity * 100;

    crossoutValues(crossout);

    var highlight = configOptions.highlight;

    document.getElementById("highlightBackgroundColor").value = highlight.backgroundColor;
    document.getElementById("highlightBackgroundColorText").value = highlight.backgroundColor;

    document.getElementById("highlightColor").value = highlight.color;
    document.getElementById("highlightColorText").value = highlight.color;

    document.getElementById("highlightOpacity").value = highlight.opacity * 100;
    document.getElementById("highlightOpacityText").value = highlight.opacity * 100;

    document.getElementById("highlightHoverOpacity").value = highlight.hoverOpacity * 100;
    document.getElementById("highlightHoverOpacityText").value = highlight.hoverOpacity * 100;

    highlightValues(highlight);

    var changeText = configOptions.changeText;

    document.getElementById("changeTextBackgroundColor").value = changeText.backgroundColor;
    document.getElementById("changeTextBackgroundColorText").value = changeText.backgroundColor;
    document.getElementById("changeTextSelectionBackgroundColor").value = changeText.selectionBackgroundColor;
    document.getElementById("changeTextSelectionBackgroundColorText").value = changeText.selectionBackgroundColor;

    document.getElementById("changeTextColor").value = changeText.color;
    document.getElementById("changeTextColorText").value = changeText.color;
    document.getElementById("changeTextSelectionColor").value = changeText.selectionColor;
    document.getElementById("changeTextSelectionColorText").value = changeText.selectionColor;

    document.getElementById("changeTextOpacity").value = changeText.opacity * 100;
    document.getElementById("changeTextOpacityText").value = changeText.opacity * 100;
    document.getElementById("changeTextSelectionOpacity").value = changeText.selectionOpacity * 100;
    document.getElementById("changeTextSelectionOpacityText").value = changeText.selectionOpacity * 100;

    document.getElementById("changeTextHoverOpacity").value = changeText.hoverOpacity * 100;
    document.getElementById("changeTextHoverOpacityText").value = changeText.hoverOpacity * 100;
    document.getElementById("changeTextSelectionHoverOpacity").value = changeText.selectiHonoverOpacity * 100;
    document.getElementById("changeTextSelectionHoverOpacityText").value = changeText.selectionHoverOpacity * 100;

    changeTextValues(changeText);

    var url = configOptions.url;

    document.getElementById("urlBackgroundColor").value = url.backgroundColor;
    document.getElementById("urlBackgroundColorText").value = url.backgroundColor;

    document.getElementById("urlColor").value = url.color;
    document.getElementById("urlColorText").value = url.color;

    document.getElementById("urlOpacity").value = url.opacity * 100;
    document.getElementById("urlOpacityText").value = url.opacity * 100;

    document.getElementById("urlHoverOpacity").value = url.hoverOpacity * 100;
    document.getElementById("urlHoverOpacityText").value = url.hoverOpacity * 100;

    urlValues(url);

    var player = configOptions.player;

    document.getElementById("playerBackgroundColor").value = player.backgroundColor;
    document.getElementById("playerBackgroundColorText").value = player.backgroundColor;

    document.getElementById("playerColor").value = player.color;
    document.getElementById("playerColorText").value = player.color;

    document.getElementById("playerOpacity").value = player.opacity * 100;
    document.getElementById("playerOpacityText").value = player.opacity * 100;

    document.getElementById("playerHoverOpacity").value = player.hoverOpacity * 100;
    document.getElementById("playerHoverOpacityText").value = player.hoverOpacity * 100;

    playerValues(player);

    document.getElementById("sticky").addEventListener("mouseover", function() { stickyEvent(1) }, true);
    document.getElementById("sticky").addEventListener("mouseout", function() { stickyEvent(0) }, true);

    document.getElementById("stickyBackgroundColor").addEventListener("change", function() {
        document.getElementById("stickyBackgroundColorText").value = document.getElementById("stickyBackgroundColor").value;
        configOptions.sticky.backgroundColor = document.getElementById("stickyBackgroundColor").value;
        stickyValues(configOptions.sticky);
    }, true);
    document.getElementById("stickyBackgroundColorText").addEventListener("change", function() {
        if (document.getElementById("stickyBackgroundColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("stickyBackgroundColor").value = document.getElementById("stickyBackgroundColorText").value;
            configOptions.sticky.backgroundColor = document.getElementById("stickyBackgroundColorText").value;
            stickyValues(configOptions.sticky);
            document.getElementById("stickyBackgroundColorText").setCustomValidity("");
        } else {
            document.getElementById("stickyBackgroundColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("stickyColor").addEventListener("change", function() {
        document.getElementById("stickyColorText").value = document.getElementById("stickyColor").value;
        configOptions.sticky.color = document.getElementById("stickyColor").value;
        stickyValues(configOptions.sticky);
    }, true);
    document.getElementById("stickyColorText").addEventListener("change", function() {
        if (document.getElementById("stickyColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("stickyColor").value = document.getElementById("stickyColorText").value;
            configOptions.sticky.color = document.getElementById("stickyColorText").value;
            stickyValues(configOptions.sticky);
            document.getElementById("stickyColorText").setCustomValidity("");
        } else {
            document.getElementById("stickyColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("stickyOpacity").addEventListener("change", function() {
        document.getElementById("stickyOpacityText").value = document.getElementById("stickyOpacity").value;
        configOptions.sticky.opacity = document.getElementById("stickyOpacity").value / 100;
        stickyValues(configOptions.sticky);
    }, true);
    document.getElementById("stickyOpacityText").addEventListener("change", function() {
        if (document.getElementById("stickyOpacityText").validity.valid) {
            document.getElementById("stickyOpacity").value = document.getElementById("stickyOpacityText").value;
            configOptions.sticky.opacity = document.getElementById("stickyOpacityText").value / 100;
            stickyValues(configOptions.sticky);
        }
    }, true);
    document.getElementById("stickyHoverOpacity").addEventListener("change", function() {
        document.getElementById("stickyHoverOpacityText").value = document.getElementById("stickyHoverOpacity").value;
        configOptions.sticky.hoverOpacity = document.getElementById("stickyHoverOpacity").value / 100;
        stickyValues(configOptions.sticky);
    }, true);
    document.getElementById("stickyHoverOpacityText").addEventListener("change", function() {
        if (document.getElementById("stickyHoverOpacityText").validity.valid) {
            document.getElementById("stickyHoverOpacity").value = document.getElementById("stickyHoverOpacityText").value;
            configOptions.sticky.hoverOpacity = document.getElementById("stickyHoverOpacityText").value / 100;
            stickyValues(configOptions.sticky);
        }
    }, true);

    document.getElementById("underline").addEventListener("mouseover", function() { underlineEvent(1) }, true);
    document.getElementById("underline").addEventListener("mouseout", function() { underlineEvent(0) }, true);

    document.getElementById("underlineBackgroundColor").addEventListener("change", function() {
        document.getElementById("underlineBackgroundColorText").value = document.getElementById("underlineBackgroundColor").value;
        configOptions.underline.backgroundColor = document.getElementById("underlineBackgroundColor").value;
        underlineValues(configOptions.underline);
    }, true);
    document.getElementById("underlineBackgroundColorText").addEventListener("change", function() {
        if (document.getElementById("underlineBackgroundColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("underlineBackgroundColor").value = document.getElementById("underlineBackgroundColorText").value;
            configOptions.underline.backgroundColor = document.getElementById("underlineBackgroundColorText").value;
            underlineValues(configOptions.underline);
            document.getElementById("underlineBackgroundColorText").setCustomValidity("");
        } else {
            document.getElementById("underlineBackgroundColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("underlineColor").addEventListener("change", function() {
        document.getElementById("underlineColorText").value = document.getElementById("underlineColor").value;
        configOptions.underline.color = document.getElementById("underlineColor").value;
        underlineValues(configOptions.underline);
    }, true);
    document.getElementById("underlineColorText").addEventListener("change", function() {
        if (document.getElementById("underlineColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("underlineColor").value = document.getElementById("underlineColorText").value;
            configOptions.underline.color = document.getElementById("underlineColorText").value;
            underlineValues(configOptions.underline);
            document.getElementById("underlineColorText").setCustomValidity("");
        } else {
            document.getElementById("underlineColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("underlineOpacity").addEventListener("change", function() {
        document.getElementById("underlineOpacityText").value = document.getElementById("underlineOpacity").value;
        configOptions.underline.opacity = document.getElementById("underlineOpacity").value / 100;
        underlineValues(configOptions.underline);
    }, true);
    document.getElementById("underlineOpacityText").addEventListener("change", function() {
        if (document.getElementById("underlineOpacityText").validity.valid) {
            document.getElementById("underlineOpacity").value = document.getElementById("underlineOpacityText").value;
            configOptions.underline.opacity = document.getElementById("underlineOpacityText").value / 100;
            underlineValues(configOptions.underline);
        }
    }, true);
    document.getElementById("underlineHoverOpacity").addEventListener("change", function() {
        document.getElementById("underlineHoverOpacityText").value = document.getElementById("underlineHoverOpacity").value;
        configOptions.underline.hoverOpacity = document.getElementById("underlineHoverOpacity").value / 100;
        underlineValues(configOptions.underline);
    }, true);
    document.getElementById("underlineHoverOpacityText").addEventListener("change", function() {
        if (document.getElementById("underlineHoverOpacityText").validity.valid) {
            document.getElementById("underlineHoverOpacity").value = document.getElementById("underlineHoverOpacityText").value;
            configOptions.underline.hoverOpacity = document.getElementById("underlineHoverOpacityText").value / 100;
            underlineValues(configOptions.underline);
        }
    }, true);

    document.getElementById("crossout").addEventListener("mouseover", function() { crossoutEvent(1) }, true);
    document.getElementById("crossout").addEventListener("mouseout", function() { crossoutEvent(0) }, true);

    document.getElementById("crossoutBackgroundColor").addEventListener("change", function() {
        document.getElementById("crossoutBackgroundColorText").value = document.getElementById("crossoutBackgroundColor").value;
        configOptions.crossout.backgroundColor = document.getElementById("crossoutBackgroundColor").value;
        crossoutValues(configOptions.crossout);
    }, true);
    document.getElementById("crossoutBackgroundColorText").addEventListener("change", function() {
        if (document.getElementById("crossoutBackgroundColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("crossoutBackgroundColor").value = document.getElementById("crossoutBackgroundColorText").value;
            configOptions.crossout.backgroundColor = document.getElementById("crossoutBackgroundColorText").value;
            crossoutValues(configOptions.crossout);
            document.getElementById("crossoutBackgroundColorText").setCustomValidity("");
        } else {
            document.getElementById("crossoutBackgroundColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("crossoutColor").addEventListener("change", function() {
        document.getElementById("crossoutColorText").value = document.getElementById("crossoutColor").value;
        configOptions.crossout.color = document.getElementById("crossoutColor").value;
        crossoutValues(configOptions.crossout);
    }, true);
    document.getElementById("crossoutColorText").addEventListener("change", function() {
        if (document.getElementById("crossoutColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("crossoutColor").value = document.getElementById("crossoutColorText").value;
            configOptions.crossout.color = document.getElementById("crossoutColorText").value;
            crossoutValues(configOptions.crossout);
            document.getElementById("crossoutColorText").setCustomValidity("");
        } else {
            document.getElementById("crossoutColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("crossoutOpacity").addEventListener("change", function() {
        document.getElementById("crossoutOpacityText").value = document.getElementById("crossoutOpacity").value;
        configOptions.crossout.opacity = document.getElementById("crossoutOpacity").value / 100;
        crossoutValues(configOptions.crossout);
    }, true);
    document.getElementById("crossoutOpacityText").addEventListener("change", function() {
        if (document.getElementById("crossoutOpacityText").validity.valid) {
            document.getElementById("crossoutOpacity").value = document.getElementById("crossoutOpacityText").value;
            configOptions.crossout.opacity = document.getElementById("crossoutOpacityText").value / 100;
            crossoutValues(configOptions.crossout);
        }
    }, true);
    document.getElementById("crossoutHoverOpacity").addEventListener("change", function() {
        document.getElementById("crossoutHoverOpacityText").value = document.getElementById("crossoutHoverOpacity").value;
        configOptions.crossout.hoverOpacity = document.getElementById("crossoutHoverOpacity").value / 100;
        crossoutValues(configOptions.crossout);
    }, true);
    document.getElementById("crossoutHoverOpacityText").addEventListener("change", function() {
        if (document.getElementById("crossoutHoverOpacityText").validity.valid) {
            document.getElementById("crossoutHoverOpacity").value = document.getElementById("crossoutHoverOpacityText").value;
            configOptions.crossout.hoverOpacity = document.getElementById("crossoutHoverOpacityText").value / 100;
            crossoutValues(configOptions.crossout);
        }
    }, true);

    document.getElementById("highlight").addEventListener("mouseover", function() { highlightEvent(1) }, true);
    document.getElementById("highlight").addEventListener("mouseout", function() { highlightEvent(0) }, true);

    document.getElementById("highlightBackgroundColor").addEventListener("change", function() {
        document.getElementById("highlightBackgroundColorText").value = document.getElementById("highlightBackgroundColor").value;
        configOptions.highlight.backgroundColor = document.getElementById("highlightBackgroundColor").value;
        highlightValues(configOptions.highlight);
    }, true);
    document.getElementById("highlightBackgroundColorText").addEventListener("change", function() {
        if (document.getElementById("highlightBackgroundColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("highlightBackgroundColor").value = document.getElementById("highlightBackgroundColorText").value;
            configOptions.highlight.backgroundColor = document.getElementById("highlightBackgroundColorText").value;
            highlightValues(configOptions.highlight);
            document.getElementById("highlightBackgroundColorText").setCustomValidity("");
        } else {
            document.getElementById("highlightBackgroundColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("highlightColor").addEventListener("change", function() {
        document.getElementById("highlightColorText").value = document.getElementById("highlightColor").value;
        configOptions.highlight.color = document.getElementById("highlightColor").value;
        highlightValues(configOptions.highlight);
    }, true);
    document.getElementById("highlightColorText").addEventListener("change", function() {
        if (document.getElementById("highlightColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("highlightColor").value = document.getElementById("highlightColorText").value;
            configOptions.highlight.color = document.getElementById("highlightColorText").value;
            highlightValues(configOptions.highlight);
            document.getElementById("highlightColorText").setCustomValidity("");
        } else {
            document.getElementById("highlightColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("highlightOpacity").addEventListener("change", function() {
        document.getElementById("highlightOpacityText").value = document.getElementById("highlightOpacity").value;
        configOptions.highlight.opacity = document.getElementById("highlightOpacity").value / 100;
        highlightValues(configOptions.highlight);
    }, true);
    document.getElementById("highlightOpacityText").addEventListener("change", function() {
        if (document.getElementById("highlightOpacityText").validity.valid) {
            document.getElementById("highlightOpacity").value = document.getElementById("highlightOpacityText").value;
            configOptions.highlight.opacity = document.getElementById("highlightOpacityText").value / 100;
            highlightValues(configOptions.highlight);
        }
    }, true);
    document.getElementById("highlightHoverOpacity").addEventListener("change", function() {
        document.getElementById("highlightHoverOpacityText").value = document.getElementById("highlightHoverOpacity").value;
        configOptions.highlight.hoverOpacity = document.getElementById("highlightHoverOpacity").value / 100;
        highlightValues(configOptions.highlight);
    }, true);
    document.getElementById("highlightHoverOpacityText").addEventListener("change", function() {
        if (document.getElementById("highlightHoverOpacityText").validity.valid) {
            document.getElementById("highlightHoverOpacity").value = document.getElementById("highlightHoverOpacityText").value;
            configOptions.highlight.hoverOpacity = document.getElementById("highlightHoverOpacityText").value / 100;
            highlightValues(configOptions.highlight);
        }
    }, true);

    document.getElementById("changeText").addEventListener("mouseover", function() { changeTextEvent(1) }, true);
    document.getElementById("changeText").addEventListener("mouseout", function() { changeTextEvent(0) }, true);

    document.getElementById("changeTextBackgroundColor").addEventListener("change", function() {
        document.getElementById("changeTextBackgroundColorText").value = document.getElementById("changeTextBackgroundColor").value;
        configOptions.changeText.backgroundColor = document.getElementById("changeTextBackgroundColor").value;
        changeTextValues(configOptions.changeText);
    }, true);
    document.getElementById("changeTextBackgroundColorText").addEventListener("change", function() {
        if (document.getElementById("changeTextBackgroundColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("changeTextBackgroundColor").value = document.getElementById("changeTextBackgroundColorText").value;
            configOptions.changeText.backgroundColor = document.getElementById("changeTextBackgroundColorText").value;
            changeTextValues(configOptions.changeText);
            document.getElementById("changeTextBackgroundColorText").setCustomValidity("");
        } else {
            document.getElementById("changeTextBackgroundColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("changeTextColor").addEventListener("change", function() {
        document.getElementById("changeTextColorText").value = document.getElementById("changeTextColor").value;
        configOptions.changeText.color = document.getElementById("changeTextColor").value;
        changeTextValues(configOptions.changeText);
    }, true);
    document.getElementById("changeTextColorText").addEventListener("change", function() {
        if (document.getElementById("changeTextColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("changeTextColor").value = document.getElementById("changeTextColorText").value;
            configOptions.changeText.color = document.getElementById("changeTextColorText").value;
            changeTextValues(configOptions.changeText);
            document.getElementById("changeTextColorText").setCustomValidity("");
        } else {
            document.getElementById("changeTextColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("changeTextOpacity").addEventListener("change", function() {
        document.getElementById("changeTextOpacityText").value = document.getElementById("changeTextOpacity").value;
        configOptions.changeText.opacity = document.getElementById("changeTextOpacity").value / 100;
        changeTextValues(configOptions.changeText);
    }, true);
    document.getElementById("changeTextOpacityText").addEventListener("change", function() {
        if (document.getElementById("changeTextOpacityText").validity.valid) {
            document.getElementById("changeTextOpacity").value = document.getElementById("changeTextOpacityText").value;
            configOptions.changeText.opacity = document.getElementById("changeTextOpacityText").value / 100;
            changeTextValues(configOptions.changeText);
        }
    }, true);
    document.getElementById("changeTextHoverOpacity").addEventListener("change", function() {
        document.getElementById("changeTextHoverOpacityText").value = document.getElementById("changeTextHoverOpacity").value;
        configOptions.changeText.hoverOpacity = document.getElementById("changeTextHoverOpacity").value / 100;
        changeTextValues(configOptions.changeText);
    }, true);
    document.getElementById("changeTextHoverOpacityText").addEventListener("change", function() {
        if (document.getElementById("changeTextHoverOpacityText").validity.valid) {
            document.getElementById("changeTextHoverOpacity").value = document.getElementById("changeTextHoverOpacityText").value;
            configOptions.changeText.hoverOpacity = document.getElementById("changeTextHoverOpacityText").value / 100;
            changeTextValues(configOptions.changeText);
        }
    }, true);

    document.getElementById("changeTextSelection").addEventListener("mouseover", function() { changeTextEvent(1) }, true);
    document.getElementById("changeTextSelection").addEventListener("mouseout", function() { changeTextEvent(0) }, true);

    document.getElementById("changeTextSelectionBackgroundColor").addEventListener("change", function() {
        document.getElementById("changeTextSelectionBackgroundColorText").value = document.getElementById("changeTextSelectionBackgroundColor").value;
        configOptions.changeText.selectionBackgroundColor = document.getElementById("changeTextSelectionBackgroundColor").value;
        changeTextValues(configOptions.changeText);
    }, true);
    document.getElementById("changeTextSelectionBackgroundColorText").addEventListener("change", function() {
        if (document.getElementById("changeTextSelectionBackgroundColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("changeTextSelectionBackgroundColor").value = document.getElementById("changeTextSelectionBackgroundColorText").value;
            configOptions.changeText.selectioBbackgroundColor = document.getElementById("changeTextSelectionBackgroundColorText").value;
            changeTextValues(configOptions.changeText);
            document.getElementById("changeTextSelectionBackgroundColorText").setCustomValidity("");
        } else {
            document.getElementById("changeTextSelectionBackgroundColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("changeTextSelectionColor").addEventListener("change", function() {
        document.getElementById("changeTextSelectionColorText").value = document.getElementById("changeTextSelectionColor").value;
        configOptions.changeText.selectionColor = document.getElementById("changeTextSelectionColor").value;
        changeTextValues(configOptions.changeText);
    }, true);
    document.getElementById("changeTextSelectionColorText").addEventListener("change", function() {
        if (document.getElementById("changeTextSelectionColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("changeTextSelectionColor").value = document.getElementById("changeTextSelectionColorText").value;
            configOptions.changeText.selectionColor = document.getElementById("changeTextSelectionColorText").value;
            changeTextValues(configOptions.changeText);
            document.getElementById("changeTextSelectionColorText").setCustomValidity("");
        } else {
            document.getElementById("changeTextSelectionColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("changeTextSelectionOpacity").addEventListener("change", function() {
        document.getElementById("changeTextSelectionOpacityText").value = document.getElementById("changeTextSelectionOpacity").value;
        configOptions.changeText.selectionOpacity = document.getElementById("changeTextSelectionOpacity").value / 100;
        changeTextValues(configOptions.changeText);
    }, true);
    document.getElementById("changeTextSelectionOpacityText").addEventListener("change", function() {
        if (document.getElementById("changeTextSelectionOpacityText").validity.valid) {
            document.getElementById("changeTextSelectionOpacity").value = document.getElementById("changeTextSelectionOpacityText").value;
            configOptions.changeText.selectionOpacity = document.getElementById("changeTextSelectionOpacityText").value / 100;
            changeTextValues(configOptions.changeText);
        }
    }, true);
    document.getElementById("changeTextSelectionHoverOpacity").addEventListener("change", function() {
        document.getElementById("changeTextSelectionHoverOpacityText").value = document.getElementById("changeTextSelectionHoverOpacity").value;
        configOptions.changeText.selectionHoverOpacity = document.getElementById("changeTextSelectionHoverOpacity").value / 100;
        changeTextValues(configOptions.changeText);
    }, true);
    document.getElementById("changeTextSelectionHoverOpacityText").addEventListener("change", function() {
        if (document.getElementById("changeTextSelectionHoverOpacityText").validity.valid) {
            document.getElementById("changeTextSelectionHoverOpacity").value = document.getElementById("changeTextSelectionHoverOpacityText").value;
            configOptions.changeText.selectionHoverOpacity = document.getElementById("changeTextSelectionHoverOpacityText").value / 100;
            changeTextValues(configOptions.changeText);
        }
    }, true);

    document.getElementById("url").addEventListener("mouseover", function() { urlEvent(1) }, true);
    document.getElementById("url").addEventListener("mouseout", function() { urlEvent(0) }, true);

    document.getElementById("urlBackgroundColor").addEventListener("change", function() {
        document.getElementById("urlBackgroundColorText").value = document.getElementById("urlBackgroundColor").value;
        configOptions.url.backgroundColor = document.getElementById("urlBackgroundColor").value;
        urlValues(configOptions.url);
    }, true);
    document.getElementById("urlBackgroundColorText").addEventListener("change", function() {
        if (document.getElementById("urlBackgroundColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("urlBackgroundColor").value = document.getElementById("urlBackgroundColorText").value;
            configOptions.url.backgroundColor = document.getElementById("urlBackgroundColorText").value;
            urlValues(configOptions.url);
            document.getElementById("urlBackgroundColorText").setCustomValidity("");
        } else {
            document.getElementById("urlBackgroundColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("urlColor").addEventListener("change", function() {
        document.getElementById("urlColorText").value = document.getElementById("urlColor").value;
        configOptions.url.color = document.getElementById("urlColor").value;
        urlValues(configOptions.url);
    }, true);
    document.getElementById("urlColorText").addEventListener("change", function() {
        if (document.getElementById("urlColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("urlColor").value = document.getElementById("urlColorText").value;
            configOptions.url.color = document.getElementById("urlColorText").value;
            urlValues(configOptions.url);
            document.getElementById("urlColorText").setCustomValidity("");
        } else {
            document.getElementById("urlColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("urlOpacity").addEventListener("change", function() {
        document.getElementById("urlOpacityText").value = document.getElementById("urlOpacity").value;
        configOptions.url.opacity = document.getElementById("urlOpacity").value / 100;
        urlValues(configOptions.url);
    }, true);
    document.getElementById("urlOpacityText").addEventListener("change", function() {
        if (document.getElementById("urlOpacityText").validity.valid) {
            document.getElementById("urlOpacity").value = document.getElementById("urlOpacityText").value;
            configOptions.url.opacity = document.getElementById("urlOpacityText").value / 100;
            urlValues(configOptions.url);
        }
    }, true);
    document.getElementById("urlHoverOpacity").addEventListener("change", function() {
        document.getElementById("urlHoverOpacityText").value = document.getElementById("urlHoverOpacity").value;
        configOptions.url.hoverOpacity = document.getElementById("urlHoverOpacity").value / 100;
        urlValues(configOptions.url);
    }, true);
    document.getElementById("urlHoverOpacityText").addEventListener("change", function() {
        if (document.getElementById("urlHoverOpacityText").validity.valid) {
            document.getElementById("urlHoverOpacity").value = document.getElementById("urlHoverOpacityText").value;
            configOptions.url.hoverOpacity = document.getElementById("urlHoverOpacityText").value / 100;
            urlValues(configOptions.url);
        }
    }, true);

    document.getElementById("player").addEventListener("mouseover", function() { playerEvent(1) }, true);
    document.getElementById("player").addEventListener("mouseout", function() { playerEvent(0) }, true);

    document.getElementById("playerBackgroundColor").addEventListener("change", function() {
        document.getElementById("playerBackgroundColorText").value = document.getElementById("playerBackgroundColor").value;
        configOptions.player.backgroundColor = document.getElementById("playerBackgroundColor").value;
        playerValues(configOptions.player);
    }, true);
    document.getElementById("playerBackgroundColorText").addEventListener("change", function() {
        if (document.getElementById("playerBackgroundColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("playerBackgroundColor").value = document.getElementById("playerBackgroundColorText").value;
            configOptions.player.backgroundColor = document.getElementById("playerBackgroundColorText").value;
            playerValues(configOptions.player);
            document.getElementById("playerBackgroundColorText").setCustomValidity("");
        } else {
            document.getElementById("playerBackgroundColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("playerColor").addEventListener("change", function() {
        document.getElementById("playerColorText").value = document.getElementById("playerColor").value;
        configOptions.player.color = document.getElementById("playerColor").value;
        playerValues(configOptions.player);
    }, true);
    document.getElementById("playerColorText").addEventListener("change", function() {
        if (document.getElementById("playerColorText").value.match(/^#([0-9a-f]{3}){1,2}$/i)) {
            document.getElementById("playerColor").value = document.getElementById("playerColorText").value;
            configOptions.player.color = document.getElementById("playerColorText").value;
            playerValues(configOptions.player);
            document.getElementById("playerColorText").setCustomValidity("");
        } else {
            document.getElementById("playerColorText").setCustomValidity(browser.i18n.getMessage("InvalidColorMsg"));
        }
    }, true);
    document.getElementById("playerOpacity").addEventListener("change", function() {
        document.getElementById("playerOpacityText").value = document.getElementById("playerOpacity").value;
        configOptions.player.opacity = document.getElementById("playerOpacity").value / 100;
        playerValues(configOptions.player);
    }, true);
    document.getElementById("playerOpacityText").addEventListener("change", function() {
        if (document.getElementById("playerOpacityText").validity.valid) {
            document.getElementById("playerOpacity").value = document.getElementById("playerOpacityText").value;
            configOptions.player.opacity = document.getElementById("playerOpacityText").value / 100;
            playerValues(configOptions.player);
        }
    }, true);
    document.getElementById("playerHoverOpacity").addEventListener("change", function() {
        document.getElementById("playerHoverOpacityText").value = document.getElementById("playerHoverOpacity").value;
        configOptions.player.hoverOpacity = document.getElementById("playerHoverOpacity").value / 100;
        playerValues(configOptions.player);
    }, true);
    document.getElementById("playerHoverOpacityText").addEventListener("change", function() {
        if (document.getElementById("playerHoverOpacityText").validity.valid) {
            document.getElementById("playerHoverOpacity").value = document.getElementById("playerHoverOpacityText").value;
            configOptions.player.hoverOpacity = document.getElementById("playerHoverOpacityText").value / 100;
            playerValues(configOptions.player);
        }
    }, true);

    document.getElementById("save").addEventListener("click", saveOptions, true);
    document.getElementById("cancel").addEventListener("click", loadOptions, true);
    document.getElementById("reset").addEventListener("click", restoreDefault, true);
}

var backgroundScript;

function loadOptions(e) {
    if (e) {
        e.preventDefault();
    }
    backgroundScript.loadConfigOptions().then((opt) => {
        configOptions = opt;
        loadControls();
    });
}

function saveOptions(e) {
    if (document.getElementById("formOptions").checkValidity()) {
        configOptions.username = document.getElementById("username").value;
        backgroundScript.saveConfigOptions(configOptions);
        showMessage(browser.i18n.getMessage("OptionsSavedMsg"), "green");
    } else {
        showMessage(browser.i18n.getMessage("OptionsValidationErrorMsg"), "red");
    }
    e.preventDefault();
}

function restoreDefault() {
    configOptions = backgroundScript.defaultConfigOptions();
    loadControls();
    showMessage(browser.i18n.getMessage("DefautlValueMsg"))
}

function showMessage(message, color) {
    if (!color) {
        color = "black";
    }
    document.getElementById("outputMessage").style.color = color;
    document.getElementById("outputMessage").innerText = message;
    setTimeout(function() { document.getElementById("outputMessage").innerText = ""; }, 2000);
}

browser.runtime.getBackgroundPage().then((background) => {
    backgroundScript = background;
    loadOptions();
});

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

i18nToHtml();