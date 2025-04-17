const list = document.getElementById("list");
const listTitle = document.getElementById("list-title");
let currentId = 0;

/**
 * Creates a new todo item or subitem.
 * @param {string} [task=""] - The task description.
 * @param {boolean} [checked=false] - Whether the item is checked.
 * @param {boolean} [isSubItem=false] - Whether the item is a subitem.
 * @param {HTMLElement|null} [parentDiv=null] - The parent element for subitems.
 * @returns {HTMLElement|undefined} - The created item element.
 */
function createItem(task = "", checked = false, isSubItem = false, parentDiv = null) {
    if (!task) task = prompt(isSubItem ? "New subitem:" : "New item:");
    if (!task) return;

    const itemId = `listItem${currentId++}`;

    const item = document.createElement("div");
    item.id = itemId;
    item.className = isSubItem ? "todo-subitem" : "todo-item";

    const itemContent = document.createElement("div");
    itemContent.className = "todo-item-content";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    checkbox.addEventListener("change", save);

    const label = document.createElement("label");
    label.setAttribute("translate", "no");
    label.textContent = " " + task;

    const btnDiv = document.createElement("div");
    btnDiv.className = "button-div";

    if (!isSubItem) {
        const addSubItemBtn = document.createElement("button");
        addSubItemBtn.className = "icon-button add-subitem-button";
        addSubItemBtn.textContent = "add";
        addSubItemBtn.title = "Add Subitem";
        addSubItemBtn.setAttribute("translate", "no");
        addSubItemBtn.onclick = () => createItem("", false, true, item);

        btnDiv.appendChild(addSubItemBtn);
    }

    const editBtn = document.createElement("button");
    editBtn.className = "icon-button edit-button";
    editBtn.textContent = "edit";
    editBtn.title = "Edit";
    editBtn.setAttribute("translate", "no");
    editBtn.onclick = () => updateItem(itemId);

    const delBtn = document.createElement("button");
    delBtn.className = "icon-button delete-button";
    delBtn.textContent = "delete";
    delBtn.title = "Delete";
    delBtn.setAttribute("translate", "no");
    delBtn.onclick = () => deleteItem(itemId);

    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(delBtn);

    itemContent.appendChild(checkbox);
    itemContent.appendChild(label);
    itemContent.appendChild(btnDiv);

    item.appendChild(itemContent);

    if (isSubItem && parentDiv) {
        let subItemContainer = parentDiv.querySelector(".subitem-container");
        if (!subItemContainer) {
            subItemContainer = document.createElement("div");
            subItemContainer.className = "subitem-container";
            parentDiv.appendChild(subItemContainer);
        }
        subItemContainer.appendChild(item);
    } else {
        list.appendChild(item);
    }

    if (!isLoading) {
        save();
    }

    return item;
}
/**
 * Updates the text of an existing todo item.
 * @param {string} id - The ID of the item to update.
 */
function updateItem(id) {
    const item = document.getElementById(id);
    const label = item.querySelector("label");
    const newText = prompt("Edit item:", label.textContent.trim());
    if (newText !== null) {
        label.textContent = " " + newText;
    }
    save();
}

/**
 * Deletes a todo item by its ID.
 * @param {string} id - The ID of the item to delete.
 */
function deleteItem(id) {
    const item = document.getElementById(id);
    item.remove();
    save();
}

/**
 * Saves the current state of the todo list to localStorage.
 */
function save() {
    let markdown = "";
    const items = list.querySelectorAll(".todo-item");

    items.forEach(item => {
        const checkbox = item.querySelector("input[type='checkbox']");
        const label = item.querySelector("label").textContent.trim();
        markdown += checkbox.checked ? `- [x] ${label}\n` : `- [ ] ${label}\n`;

        const subItems = item.querySelectorAll(".todo-subitem");
        subItems.forEach(subItem => {
            const subCheckbox = subItem.querySelector("input[type='checkbox']");
            const subLabel = subItem.querySelector("label").textContent.trim();
            markdown += subCheckbox.checked ? `    - [x] ${subLabel}\n` : `    - [ ] ${subLabel}\n`;
        });
    });

    localStorage.setItem("todoMarkdown", markdown);
    localStorage.setItem("todoTitle", listTitle.value);

    updateWindowTitle(listTitle.value);
    updateProgressBar();
}

let isLoading = false;

/**
 * Loads the todo list from localStorage and populates the UI.
 */
function load() {
    isLoading = true;

    const savedTitle = localStorage.getItem("todoTitle");
    if (savedTitle) {
        listTitle.value = savedTitle;
    }

    const markdown = localStorage.getItem("todoMarkdown");
    if (!markdown) {
        isLoading = false;
        return;
    }

    const lines = markdown.trim().split("\n");
    let currentParent = null;

    lines.forEach(line => {
        const match = line.match(/^( {4})?- \[(x| )\] (.+)/);
        if (match) {
            const isSubItem = !!match[1];
            const checked = match[2] === "x";
            const task = match[3];

            if (isSubItem && currentParent) {
                createItem(task, checked, true, currentParent);
            } else {
                currentParent = createItem(task, checked);
            }
        }
    });

    updateProgressBar();
    isLoading = false;
}

/**
 * Sorts the main todo items alphabetically and their subitems as well.
 */
function sortItemsAlphabetically() {
    const items = Array.from(list.querySelectorAll(".todo-item"));

    items.sort((a, b) => {
        const textA = a.querySelector("label").textContent.trim().toLowerCase();
        const textB = b.querySelector("label").textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    list.innerHTML = "";
    items.forEach(item => {
        sortSubItems(item);
        list.appendChild(item);
    });
    save();
}

/**
 * Moves all checked items to the top of the list.
 */
function moveCheckedToTop() {
    const items = Array.from(list.querySelectorAll(".todo-item"));

    items.forEach(sortSubItemsByCheckStatus);

    const checkedItems = items.filter(item => item.querySelector("input[type='checkbox']").checked);
    const uncheckedItems = items.filter(item => !item.querySelector("input[type='checkbox']").checked);

    list.innerHTML = "";
    [...checkedItems, ...uncheckedItems].forEach(item => list.appendChild(item));

    save();
}

/**
 * Moves all unchecked items to the top of the list.
 */
function moveUncheckedToTop() {
    const items = Array.from(list.querySelectorAll(".todo-item"));

    items.forEach(sortSubItemsByCheckStatus);

    const checkedItems = items.filter(item => item.querySelector("input[type='checkbox']").checked);
    const uncheckedItems = items.filter(item => !item.querySelector("input[type='checkbox']").checked);

    list.innerHTML = "";
    [...uncheckedItems, ...checkedItems].forEach(item => list.appendChild(item));

    save();
}

/**
 * Sorts the subitems of a parent item by their checked status.
 * @param {HTMLElement} parentItem - The parent item containing subitems.
 */
function sortSubItemsByCheckStatus(parentItem) {
    const subContainer = parentItem.querySelector(".subitem-container");
    if (!subContainer) return;

    const subItems = Array.from(subContainer.querySelectorAll(".todo-subitem"));

    const checked = subItems.filter(item => item.querySelector("input[type='checkbox']").checked);
    const unchecked = subItems.filter(item => !item.querySelector("input[type='checkbox']").checked);

    subContainer.innerHTML = "";
    [...checked, ...unchecked].forEach(item => subContainer.appendChild(item));
}

/**
 * Sorts the subitems of a parent item alphabetically.
 * @param {HTMLElement} parentItem - The parent item containing subitems.
 */
function sortSubItems(parentItem) {
    const subContainer = parentItem.querySelector(".subitem-container");
    if (!subContainer) return;

    const subItems = Array.from(subContainer.querySelectorAll(".todo-subitem"));

    subItems.sort((a, b) => {
        const textA = a.querySelector("label").textContent.trim().toLowerCase();
        const textB = b.querySelector("label").textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    subContainer.innerHTML = "";
    subItems.forEach(subItem => subContainer.appendChild(subItem));
}

/**
 * Clears all tasks from the todo list and localStorage.
 */
function clearTasks() {
    localStorage.removeItem("todoMarkdown");
    localStorage.removeItem("todoTitle");
    window.open('index.html', '_self').focus();
}

/**
 * Exports the todo list as a Markdown file.
 */
function exportTasks() {
    const markdown = localStorage.getItem("todoMarkdown");
    const title = localStorage.getItem("todoTitle") || "My Todo List";

    if (!markdown) {
        alert("There are no tasks to export");
        return;
    }

    const blob = new Blob([`# ${title}\n\n${markdown}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}.md`;
    a.click();

    URL.revokeObjectURL(url);
}

/**
 * Imports tasks from a Markdown file.
 * @param {Event} event - The file input change event.
 */
function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const lines = content.split("\n");

        list.innerHTML = "";

        lines.forEach(line => {
            const match = line.match(/- \[(x| )\] (.+)/);
            if (match) {
                const checked = match[1] === "x";
                const task = match[2];
                createItem(task, checked);
            }
        });

        save();
        window.open('index.html', '_self').focus();
    };

    reader.readAsText(file);
}

/**
 * Gets the counts of various todo item categories.
 * @returns {object} - An object containing counts for all requested categories.
 */
function getTodoCounts() {
    const allItems = list.querySelectorAll(".todo-item, .todo-subitem");
    const allCheckedItems = list.querySelectorAll(".todo-item input[type='checkbox']:checked, .todo-subitem input[type='checkbox']:checked");
    const allUncheckedItems = list.querySelectorAll(".todo-item input[type='checkbox']:not(:checked), .todo-subitem input[type='checkbox']:not(:checked)");

    const parentItems = list.querySelectorAll(".todo-item");
    const parentCheckedItems = list.querySelectorAll(".todo-item input[type='checkbox']:checked");
    const parentUncheckedItems = list.querySelectorAll(".todo-item input[type='checkbox']:not(:checked)");

    const childItems = list.querySelectorAll(".todo-subitem");
    const childCheckedItems = list.querySelectorAll(".todo-subitem input[type='checkbox']:checked");
    const childUncheckedItems = list.querySelectorAll(".todo-subitem input[type='checkbox']:not(:checked)");

    return {
        totalItems: allItems.length,
        totalCheckedItems: allCheckedItems.length,
        totalUncheckedItems: allUncheckedItems.length,
        totalParentItems: parentItems.length,
        totalParentCheckedItems: parentCheckedItems.length,
        totalParentUncheckedItems: parentUncheckedItems.length,
        totalChildItems: childItems.length,
        totalChildCheckedItems: childCheckedItems.length,
        totalChildUncheckedItems: childUncheckedItems.length
    };
}

/**
 * Updates the window title
 * @param {title} - The title to be set. 
 */
function updateWindowTitle(title){
    if(title != ""){
        document.title = `${title} - Kitten`;
    } else {
        document.title = "Kitten";
    }
}

function updateProgressBar() {
    const pb = document.getElementById('progress-bar');
    const total = getTodoCounts().totalParentItems;
    const done = getTodoCounts().totalParentCheckedItems;

    if (pb && total > 0) {
        const percent = (done / total) * 100;
 
        pb.style.width = `${percent}%`;
    } else {
        pb.style.width = `0%`;
    }
}

load();