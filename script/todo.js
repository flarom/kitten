const listContainer = document.getElementById("list");
const listTitle = document.getElementById("list-title");

const todoItem = {
    name: "",           // item name
    description: "",    // item description
    completed: false,   // determines if the todo item is checked
    tags: [],           // array of tags
    childItems: [],     // array of child todoItems
}

const tag = {
    name: "",   // tag name
    icon: "",   // icon
}

const icons = [
    "star", "search", "home", "favorite", "bedtime", "pill", "priority_high", "celebration", "bookmark", "today", "mail", "call", "shopping_cart", "sell", "work", "location_on"
]

let todoList = [];
let tags = [];

//#region CRUD
    //#region CRUD TODO ITEMS
    async function createTodoItem(name, description = "", tags = [], childItems = []) {
        if (!name) {
            name = await promptString("New item name:");
        }
        if (!name) return;

        const newItem = {
            name,
            description,
            completed: false,
            childItems,
            tags
        };
        todoList.push(newItem);

        save(true);

        return newItem;
    }
    
    function readTodoItem(name) {
        return todoList.find(item => item.name === name);
    }
    
    function updateTodoItem(name, updates) {
        const item = todoList.find(item => item.name === name);
        if (!item) return null;
    
        Object.assign(item, updates);

        save(true);

        return item;
    }
    
    function deleteTodoItem(name) {
        const index = todoList.findIndex(item => item.name === name);
        if (index !== -1) {
            const removed = todoList.splice(index, 1);
            return removed[0];
        }

        save(true);

        return null;
    }
    //#endregion
    //#region CRUD TAGS
    function createTag(name, icon) {
        const tagExists = tags.some(tag => tag.name === name);
        if (tagExists) return null;
    
        const newTag = { name, icon };
        tags.push(newTag);

        save();

        return newTag;
    }
    
    function readTag(name) {
        return tags.find(tag => tag.name === name);
    }
    
    function updateTag(name, updates) {
        const tag = tags.find(tag => tag.name === name);
        if (!tag) return null;
    
        Object.assign(tag, updates);

        save();

        return tag;
    }
    
    function deleteTag(name) {
        const index = tags.findIndex(tag => tag.name === name);
        if (index !== -1) {
            const removed = tags.splice(index, 1);
            return removed[0];
        }

        save();

        return null;
    }
    //#endregion
//#endregion

//#region LOCAL STORAGE
function save(update = false) {
    localStorage.setItem("kitten_todoListTitle", listTitle.value);
    localStorage.setItem("kitten_todoList", JSON.stringify(todoList));
    localStorage.setItem("kitten_tags", JSON.stringify(tags));
    console.info("SAVED TODO LIST TITLE\n" + localStorage.getItem("kitten_todoListTitle"));
    console.info("SAVED TODO ITEMS\n" + localStorage.getItem("kitten_todoList"));
    console.info("SAVED TAGS\n" + localStorage.getItem("kitten_tags"));

    updateWindowTitle(listTitle.value);

    if (update) {
        renderTodoList();
    }
}

function load() {
    const savedTitle = localStorage.getItem("kitten_todoListTitle");
    const savedList = localStorage.getItem("kitten_todoList");
    const savedTags = localStorage.getItem("kitten_tags");
    
    if (savedTitle) listTitle.value = savedTitle;
    if (savedList) todoList = JSON.parse(savedList);
    if (savedTags) tags = JSON.parse(savedTags);
}

function clearListData() {
    localStorage.removeItem("kitten_todoListTitle");
    localStorage.removeItem("kitten_todoList");
    window.open('index.html', '_this');
}

function clearTagsData() {
    localStorage.removeItem("kitten_tags");
    window.open('index.html', '_this');
}
//#endregion

//#region FILE MANAGEMENT
function exportJson() {
    const data = {
        title: listTitle.value || "todo",
        todoList,
        tags
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.title}.kitten.json`;
    a.click();
}

function importJson() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.todoList && data.tags) {
                    todoList = data.todoList;
                    tags = data.tags;
                    listTitle.value = data.title || "";
                    save(true);
                } else {
                    alert("invalid file");
                }
            } catch (err) {
                alert("Failed to import file");
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

function exportMd() {
    const title = `# ${listTitle.value || "todo"}\n`;

    function renderItem(item, depth = 0) {
        const prefix = "    ".repeat(depth);
        const checkbox = item.completed ? "[x]" : "[ ]";
        let line = `${prefix}- ${checkbox} ${item.name}\n`;
        if (item.childItems && item.childItems.length > 0) {
            for (const child of item.childItems) {
                line += renderItem(child, depth + 1);
            }
        }
        return line;
    }

    let content = title;
    for (const item of todoList) {
        content += renderItem(item);
    }

    const blob = new Blob([content], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${listTitle.value || "todo"}.md`;
    a.click();
}
//#endregion

//#region TODO TO HTML
async function renderTodoList() {
    listContainer.innerHTML = "";

    function createItemElement(item, isSubitem = false, parentIndex = "") {
        const itemId = `listItem${Math.floor(Math.random() * 1000000)}`; // random id
        const wrapper = document.createElement("div");
        wrapper.className = isSubitem ? "todo-subitem" : "todo-item";
        wrapper.id = itemId;

        const content = document.createElement("div");
        content.className = "todo-item-content";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;
        checkbox.onchange = () => {
            item.completed = checkbox.checked;
            save();
            renderTodoList();
        };

        const label = document.createElement("label");
        label.textContent = item.name;
        label.setAttribute("translate", "no");

        const buttonDiv = document.createElement("div");
        buttonDiv.className = "button-div";

        if (!isSubitem) {
            const addBtn = document.createElement("button");
            addBtn.className = "icon-button add-subitem-button";
            addBtn.title = "Add Subitem";
            addBtn.setAttribute("translate", "no");
            addBtn.textContent = "add";
            addBtn.onclick = async () => {
                const subName = await promptString("New subitem name");
                if (subName) {
                    item.childItems.push({
                        name: subName,
                        description: "",
                        completed: false,
                        childItems: [],
                        tags: []
                    });
                    save();
                    renderTodoList();
                }
            };
            buttonDiv.appendChild(addBtn);
        }

        const editBtn = document.createElement("button");
        editBtn.className = "icon-button edit-button";
        editBtn.title = "Edit";
        editBtn.setAttribute("translate", "no");
        editBtn.textContent = "edit";
        editBtn.onclick = async () => {
            const newName = await promptString("New name:", item.name);
            if (newName !== null) {
                item.name = newName;
                save();
                renderTodoList();
            }
        };

        const delBtn = document.createElement("button");
        delBtn.className = "icon-button delete-button";
        delBtn.title = "Delete";
        delBtn.setAttribute("translate", "no");
        delBtn.textContent = "delete";
        delBtn.onclick = () => {
            if (isSubitem) {
                const parentItem = todoList[parentIndex];
                parentItem.childItems = parentItem.childItems.filter(child => child !== item);
            } else {
                todoList = todoList.filter(i => i !== item);
            }
            save();
            renderTodoList();
        };

        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(delBtn);

        content.appendChild(checkbox);
        content.appendChild(label);
        content.appendChild(buttonDiv);
        wrapper.appendChild(content);

        if (item.childItems && item.childItems.length > 0 && !isSubitem) {
            const subContainer = document.createElement("div");
            subContainer.className = "subitem-container";

            item.childItems.forEach((subItem) => {
                const subElement = createItemElement(subItem, true, todoList.indexOf(item));
                subContainer.appendChild(subElement);
            });

            wrapper.appendChild(subContainer);
        }

        return wrapper;
    }

    todoList.forEach(item => {
        const element = createItemElement(item);
        listContainer.appendChild(element);
    });

    updateProgressBar();
}

function updateProgressBar() {
    const pb = document.getElementById('progress-bar');
    const counts = getTodoCounts();
    const done = counts.totalParentCheckedItems;
    const total = counts.totalParentItems;

    if (pb && total > 0) {
        const percent = (done / total) * 100;
        pb.style.width = `${percent}%`;
        pb.title = `${percent.toFixed(2)}%`;
    } else if (pb) {
        pb.style.width = `0%`;
        pb.title = `0%`;
    }
}

function updateWindowTitle(title){
    if(title != ""){
        document.title = `${title} - Kitten`;
    } else {
        document.title = "Kitten";
    }
}
//#endregion

//#region STATISTICS
function getTodoCounts() {
    let totalItems = 0;
    let totalCheckedItems = 0;
    let totalUncheckedItems = 0;

    let totalParentItems = todoList.length;
    let totalParentCheckedItems = 0;
    let totalParentUncheckedItems = 0;

    let totalChildItems = 0;
    let totalChildCheckedItems = 0;
    let totalChildUncheckedItems = 0;

    for (const item of todoList) {
        totalItems++;
        if (item.completed) {
            totalCheckedItems++;
            totalParentCheckedItems++;
        } else {
            totalUncheckedItems++;
            totalParentUncheckedItems++;
        }

        for (const child of item.childItems) {
            totalItems++;
            totalChildItems++;
            if (child.completed) {
                totalCheckedItems++;
                totalChildCheckedItems++;
            } else {
                totalUncheckedItems++;
                totalChildUncheckedItems++;
            }
        }
    }

    return {
        totalItems,
        totalCheckedItems,
        totalUncheckedItems,
        totalParentItems,
        totalParentCheckedItems,
        totalParentUncheckedItems,
        totalChildItems,
        totalChildCheckedItems,
        totalChildUncheckedItems
    };
}
//#endregion

//#region LIST EDIT
function orderByAlpha() {
    function sortItems(items) {
        items.sort((a, b) => a.name.localeCompare(b.name));
        items.forEach(item => {
            if (item.childItems && item.childItems.length > 0) {
                sortItems(item.childItems);
            }
        });
    }

    sortItems(todoList);
    save(true);
}

function groupChecked() {
    function sortByChecked(items) {
        items.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? -1 : 1;
        });
        items.forEach(item => {
            if (item.childItems && item.childItems.length > 0) {
                sortByChecked(item.childItems);
            }
        });
    }

    sortByChecked(todoList);
    save();
    renderTodoList();
}

function groupUnchecked() {
    function sortByUnchecked(items) {
        items.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });
        items.forEach(item => {
            if (item.childItems && item.childItems.length > 0) {
                sortByUnchecked(item.childItems);
            }
        });
    }

    sortByUnchecked(todoList);
    save();
    renderTodoList();
}

function deleteHighest() {
    const first = document.querySelector("#list > .todo-item");
    if (!first) return;

    const label = first.querySelector("label");
    if (!label) return;

    const name = label.textContent.trim();
    deleteTodoItem(name);
    save(true);
}

function deleteLowest() {
    const all = document.querySelectorAll("#list > .todo-item");
    if (all.length === 0) return;

    const last = all[all.length - 1];
    const label = last.querySelector("label");
    if (!label) return;

    const name = label.textContent.trim();
    deleteTodoItem(name);
    save(true);
}
//#endregion