document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "k") { // Ctrl + K - add new item
        event.preventDefault();
        createItem();
        return false;
    }
});