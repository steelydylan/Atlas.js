var language;
$(function () {
    language = window.localStorage.getItem("language");
    if (language && language == "English") {
        document.getElementById("Japanese").style.display = "none";
        document.getElementById("English").style.display = "block";
    }
});
function Display(no) {
    if (no == "Japanese") {
        document.getElementById("Japanese").style.display = "block";
        document.getElementById("English").style.display = "none";
        window.localStorage.setItem("language", "Japanese");
        language = "Japanese";
    } else if (no == "English") {
        document.getElementById("Japanese").style.display = "none";
        document.getElementById("English").style.display = "block";
        window.localStorage.setItem("language", "English");
        language = "English";
    }
};