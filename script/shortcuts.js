document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "k") { // Ctrl + K - add new item
        event.preventDefault();
        createItem();
    }
    if (event.ctrlKey && event.key === "u") { // Ctrl + U - move selection top
        event.preventDefault();
        moveCheckedToTop();
    }
    if (event.ctrlKey && event.key === "y") { // Ctrl + Y - move selection down
        event.preventDefault();
        moveUncheckedToTop();
    }
    if (event.ctrlKey && event.key === "i") { // Ctrl + I - sort alpha
        event.preventDefault();
        sortItemsAlphabetically();
    }
});