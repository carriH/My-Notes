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
    var activeTab = document.getElementById(tab)
    activeTab.classList.add("active");
    var childNodes = activeTab.getElementsByClassName("section");
    document.getElementById("prev").style.visibility = "hidden";
    document.getElementById("next").style.visibility = childNodes.length > 1 ? "" : "hidden";
    var activeNodes = activeTab.getElementsByClassName("section active");

    for (var node of activeNodes) {
        node.classList.remove("active");
    }
    childNodes[0].classList.add("active");
    evt.currentTarget.classList.add("active");
}

function getCurrentSection() {
    var currentTab = document.getElementsByClassName("tabcontent active")[0];
    return currentTab.getElementsByClassName("section active")[0];
}

function prevScreen(e) {
    var currentSection = getCurrentSection();
    currentSection.previousElementSibling.classList.add("active");
    currentSection.classList.remove("active");
    document.getElementById("next").style.visibility = "";
    if (!currentSection.previousElementSibling.previousElementSibling) {
        document.getElementById("prev").style.visibility = "hidden";
    }

}

function nextScreen(e) {
    var currentSection = getCurrentSection();
    currentSection.nextElementSibling.classList.add("active");
    currentSection.classList.remove("active");
    document.getElementById("prev").style.visibility = "";
    if (!currentSection.nextElementSibling.nextElementSibling) {
        document.getElementById("next").style.visibility = "hidden";
    }
}

document.getElementById("tabIntroduction").addEventListener("click", (event) => { showTab(event, "Introduction") }, true);
document.getElementById("tabNoteCreation").addEventListener("click", (event) => { showTab(event, "NoteCreation") }, true);
document.getElementById("tabSidebar").addEventListener("click", (event) => { showTab(event, "Sidebar") }, true);
document.getElementById("tabContextMenu").addEventListener("click", (event) => { showTab(event, "ContextMenu") }, true);
document.getElementById("tabOptions").addEventListener("click", (event) => { showTab(event, "Options") }, true);
document.getElementById("prev").addEventListener("click", prevScreen);
document.getElementById("next").addEventListener("click", nextScreen);