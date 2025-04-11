document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "q") { // Ctrl + Q - new
        event.preventDefault();
        createItem();
        return false;
    }
});