const list = document.getElementById("list");
const listTitle = document.getElementById("list-title");
let currentId = 0;

function createItem(task = "", checked = false) {
    if (!task) task = prompt("New item:");
    if (!task) return;

    const itemId = `listItem${currentId++}`;

    const item = document.createElement("div");
    item.id = itemId;
    item.className = "todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    checkbox.addEventListener("change", save);

    const label = document.createElement("label");
    label.textContent = " " + task;

    const btnDiv = document.createElement("div");
    btnDiv.className = "button-div";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-button pencil-rotate-on-hover";
    editBtn.textContent = "edit";
    editBtn.title = "Edit";
    editBtn.onclick = () => updateItem(itemId);

    const delBtn = document.createElement("button");
    delBtn.className = "icon-button delete-button";
    delBtn.textContent = "delete";
    delBtn.title = "Delete";
    delBtn.onclick = () => deleteItem(itemId);

    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(delBtn);

    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(btnDiv);

    list.appendChild(item);
    save();
}

function updateItem(id) {
    const item = document.getElementById(id);
    const label = item.querySelector("label");
    const newText = prompt("Editar item:", label.textContent.trim());
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
    });

    localStorage.setItem("todoMarkdown", markdown);
    localStorage.setItem("todoTitle", listTitle.value);
    localStorage.setItem("todoMarkdown", markdown);
}

function load() {
    const savedTitle = localStorage.getItem("todoTitle");
    if (savedTitle) {
        listTitle.value = savedTitle;
    }

    const markdown = localStorage.getItem("todoMarkdown");
    if (!markdown) return;

    const lines = markdown.trim().split("\n");

    lines.forEach(line => {
        const match = line.match(/- \[(x| )\] (.+)/);
        if (match) {
            const checked = match[1] === "x";
            const task = match[2];
            createItem(task, checked);
        }
    });
}

load();