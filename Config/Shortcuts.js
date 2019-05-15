var keyRegex = /^([A-Za-zñÑ0-9]|F1[0-2]*|F[2-9]|Comma|Period|Home|End|PageUp|PageDown|Space|Insert|Delete|Up|Down|Left|Right)$/g;
var lastKey;
var transformKey = {
    "Control": "Ctrl",
    "ArrowUp": "Up",
    "ArrowDown": "Down",
    "ArrowLeft": "Left",
    "ArrowRight": "Right",
    ",": "Comma",
    ".": "Period",
    " ": "Space"
}

function loadShortcuts() {
    browser.commands.getAll().then((commands) => {
        var commandList = document.getElementById("formShortcuts");
        for (command of commands) {
            var text = document.getElementById(command.name + "Text");
            if (!text) {
                var commandContainer = document.createElement("div");
                commandContainer.id = command.name + "Div";
                var label = document.createElement("label");
                label.innerText = browser.i18n.getMessage(("contextMenuItem" + command.name)) + ":";
                label.id = command.name + "Label";
                commandContainer.appendChild(label);
                text = document.createElement("input");
                text.type = "text";
                text.id = command.name + "Text";
                commandContainer.appendChild(text);
                commandContainer.appendChild(document.createElement("br"));
                errorText = document.createElement("text");
                errorText.id = command.name + "Log";
                errorText.classList.add("logText");
                commandContainer.appendChild(errorText);
                commandList.appendChild(commandContainer);
                (function(log) {
                    text.addEventListener("keydown", function(e) { checkKeyPressed(e, log); }, true);
                })(errorText);

                text.addEventListener("change", checkKeyCombination, true);
            }
            text.value = command.shortcut;
            text.setCustomValidity("");

        }
    });
}

function saveShortcuts(e) {
    if (document.getElementById("formShortcuts").checkValidity()) {
        browser.commands.getAll().then((commands) => {
            for (command of commands) {
                command.shortcut = document.getElementById(command.name + "Text").value;
                browser.commands.update(command);
            }
        })
        showMessage(browser.i18n.getMessage("ShortcutsSavedMsg"), "green");
    } else {
        showMessage(browser.i18n.getMessage("ShortcutsValidationErrorMsg"), "red");
    }
    if (e)
        e.preventDefault();
}

function restoreShortcuts() {
    browser.commands.getAll().then((commands) => {
        for (var command of commands) {
            browser.commands.reset(command.name);
        }

    }).then(() => {
        loadShortcuts();
        showMessage(browser.i18n.getMessage("ShortcutsSavedMsg"), "green");
    });
}

function checkKeyCombination(e) {
    var currentKeys = e.target.value.split("+");
    var valid = true;

    if ((currentKeys.length != 2) && (currentKeys.length != 3)) {
        valid = false;
    } else if (!(["Ctrl", "Alt", "Meta"].includes(currentKeys[0]))) {
        valid = false;
    } else if (currentKeys[1].match(keyRegex)) {
        if (currentKeys.length == 3) {
            valid = false;
        }
    } else if (["Ctrl", "Alt", "Shift", "Meta"].includes(currentKeys[1])) {
        if ((currentKeys.length == 2)) {
            valid = false;
        } else if (!currentKeys[2].match(keyRegex)) {
            valid = false;
        }
    }
    e.target.setCustomValidity(valid ? "" : browser.i18n.getMessage("InvalidColorMsg"));
}

function checkKeyPressed(e, logError) {
    e.preventDefault();
    var modifiers = ["Control", "Alt", "Shift", "Meta"];
    if (e.key == lastKey) {
        return;
    }
    if ((e.shiftKey && e.key != "Shift") ||
        (e.ctrlKey && e.key != "Control") ||
        (e.metaKey && e.key != "Meta") ||
        (e.altKey && e.key != "Alt")) {
        logError.innerText = browser.i18n.getMessage("msgOneKeyAtOnce");
        return;
    }
    var keyPressed = transformKey[e.key] || e.key;
    logError.innerText = "";
    lastKey = e.key;
    var currentKeys = e.target.value.split("+");

    if ((e.altKey || e.ctrlKey || e.metaKey) &&
        (currentKeys.length >= 3 || (currentKeys.length == 2))
    ) {
        e.target.value = "";
        currentKeys = [""];
    }
    var valid = true;



    switch (currentKeys.length) {
        case 1:
            if (currentKeys[0] == "") {
                if ((e.altKey || e.ctrlKey || e.metaKey)) {
                    e.target.value = keyPressed;
                } else {
                    valid = false;
                }
            } else if ((e.altKey || e.ctrlKey || e.shiftKey || e.metaKey)) {
                e.target.value += "+" + keyPressed;
            } else if (keyPressed.match(keyRegex)) {
                e.target.value += "+" + keyPressed.charAt(0).toUpperCase() + keyPressed.slice(1);
            } else {
                valid = false;
            }
            break;
        case 2:
            if (keyPressed.match(keyRegex) && modifiers.includes(currentKeys[1])) {
                e.target.value += "+" + keyPressed.charAt(0).toUpperCase() + keyPressed.slice(1);
            } else {
                valid = false;
            }
            break;
        default:
            valid = false;
            break;
    }
    if (!valid) {
        logError.innerText = browser.i18n.getMessage("msgInvalidKey");
        setTimeout(function() { logError.innerText = ""; }, 2000);
    }
    var event = new Event("change");
    e.target.dispatchEvent(event);

}