document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "k") { // Ctrl + K - add new item
        event.preventDefault();
        createTodoItem();
    }
    else if (event.altKey && event.key === "k") { // Alt + K - add new unamed item
        event.preventDefault();
        createTodoItem("New item");
    }
    else if (event.key === "F2") { // F2 - rename document
        const listTitle = document.getElementById("list-title");
        listTitle.focus();
    }
    else if (event.ctrlKey && event.key === "u") { // Ctrl + U - move selection top
        event.preventDefault();
        groupChecked();
    }
    else if (event.ctrlKey && event.key === "y") { // Ctrl + Y - move selection down
        event.preventDefault();
        groupUnchecked();
    }
    else if (event.ctrlKey && event.key === "i") { // Ctrl + I - sort alpha
        event.preventDefault();
        orderByAlpha();
    }
    else if (event.shiftKey && event.key === "Delete") { // Shift + Delete - delete first list item
        event.preventDefault();
        deleteHighest();
    }
    else if (event.ctrlKey && event.key === "Delete") { // Ctrl + Delete - delete all list items
        event.preventDefault();
        deleteAll();
    }
    else if (event.key === "Delete") { // Delete - delete last list item
        event.preventDefault();
        deleteLowest();
    }
    else if (event.ctrlKey && event.key === "s") { // Ctrl + S - save
        event.preventDefault();
        exportJson();
    }
    else if (event.ctrlKey && event.key === "o") { // Ctrl + O - open
        event.preventDefault();
        importJson();
    }
    else if (event.key === "/") { // / - shortcuts
        event.preventDefault();
        showShortcuts();
    }
    else if (event.altKey && event.key === "t") { // Alt + T - manage tags
        event.preventDefault();
        showTagsManager();
    }
});

async function showShortcuts(){
    promptMessage(`
    <h1 style='display:flex;align-items:center;gap:10px'><span class="large-icon">keyboard_keys</span>Keyboard Shortcuts</h1>
    <table>
        <tr><th></th><th>Shortcut</th>                           <th>Action</th></tr>
        <tr><td><kbd>Ctrl</kbd>+<kbd>S</kbd></td>       <td>Save file as .kitten.json</td></tr>
        <tr><td><kbd>Ctrl</kbd>+<kbd>O</kbd></td>       <td>Open .kitten.json document</td></tr>
        <tr><td><kbd>Ctrl</kbd>+<kbd>K</kbd></td>       <td>Add new item</td></tr>
        <tr><td><kbd>Alt</kbd>+<kbd>K</kbd></td>        <td>Add new item without name prompt</td></tr>
        <tr><td><kbd>Delete</kbd></td>                  <td>Deletes the first item of the list</td></tr>
        <tr><td><kbd>Shift</kbd>+<kbd>Delete</kbd></td> <td>Deletes the last item of the list</td></tr>
        <tr><td><kbd>Ctrl</kbd>+<kbd>I</kbd></td>       <td>Order list alphabetically</td></tr>
        <tr><td><kbd>Ctrl</kbd>+<kbd>U</kbd></td>       <td>Group selected items on the top</td></tr>
        <tr><td><kbd>Ctrl</kbd>+<kbd>Y</kbd></td>       <td>Group unsenected items in the top</td></tr>
        <tr><td><kbd>Alt</kbd>+<kbd>T</kbd></td>        <td>Manage tags</td></tr>
        <tr><td><kbd>/</kbd></td>                       <td>Show shortcuts</td></tr>
        <tr><td><kbd>F2</kbd></td>                      <td>Rename document</td></tr>
    </table>
    `);
}