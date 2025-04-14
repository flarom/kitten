const list = document.getElementById("list");
const listTitle = document.getElementById("list-title");
let currentId = 0;

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

    save();
    return item;
}
function updateItem(id) {
    const item = document.getElementById(id);
    const label = item.querySelector("label");
    const newText = prompt("Edit item:", label.textContent.trim());
    if (newText !== null) {
        label.textContent = " " + newText;
    }
    save();
}

function deleteItem(id) {
    const item = document.getElementById(id);
    item.remove();
    save();
}

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
}

function load() {
    const savedTitle = localStorage.getItem("todoTitle");
    if (savedTitle) {
        listTitle.value = savedTitle;
    }

    const markdown = localStorage.getItem("todoMarkdown");
    if (!markdown) return;

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
}

function sortItemsAlphabetically() {
    const items = Array.from(list.querySelectorAll(".todo-item"));

    items.sort((a, b) => {
        const textA = a.querySelector("label").textContent.trim().toLowerCase();
        const textB = b.querySelector("label").textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    list.innerHTML = "";
    items.forEach(item => list.appendChild(item));
    save();
}

function moveCheckedToTop() {
    const items = Array.from(list.querySelectorAll(".todo-item"));
    const checkedItems = items.filter(item => item.querySelector("input[type='checkbox']").checked);
    const uncheckedItems = items.filter(item => !item.querySelector("input[type='checkbox']").checked);

    list.innerHTML = "";
    checkedItems.forEach(item => list.appendChild(item));
    uncheckedItems.forEach(item => list.appendChild(item));
    save();
}

function moveUncheckedToTop() {
    const items = Array.from(list.querySelectorAll(".todo-item"));
    const checkedItems = items.filter(item => item.querySelector("input[type='checkbox']").checked);
    const uncheckedItems = items.filter(item => !item.querySelector("input[type='checkbox']").checked);

    list.innerHTML = "";
    uncheckedItems.forEach(item => list.appendChild(item));
    checkedItems.forEach(item => list.appendChild(item));
    save();
}

function clearTasks() {
    localStorage.removeItem("todoMarkdown");
    localStorage.removeItem("todoTitle");
    window.open('index.html', '_self').focus();
}

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

function getTotalItems() {
    return list.querySelectorAll(".todo-item").length;
}

function getCompletedItems() {
    return list.querySelectorAll(".todo-item input[type='checkbox']:checked").length;
}

function getIncompleteItems() {
    return list.querySelectorAll(".todo-item input[type='checkbox']:not(:checked)").length;
}

load();