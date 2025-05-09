//#region todo book
let todoBook = {
    lists: [],

    createList: function(title, color = "#000000", warp = false) {
        const id = generateUniqueId(this.lists);
        this.lists.push({
            id,
            title,
            color,
            items: []
        });
        save();

        if (warp) {window.open(`list.html?list=${id}`, '_self')}
    },

    deleteList: function(id) {
        this.lists = this.lists.filter(list => list.id !== id);
        save();
    },

    renameList: function(id, newTitle) {
        const list = this.lists.find(list => list.id === id);
        if (list) list.title = newTitle;
        save();
    },

    recolorList: function(id, newColor) {
        const list = this.lists.find(list => list.id === id);
        if (list) list.color = newColor;
        save();
    },

    exportBook: function(filename = "kittentodobook") {
        const dataStr = JSON.stringify({ KittenTodoBook: { lists: this.lists } }, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.cat`;
        a.click();
    },

    importBook: function(rewrite = false) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".cat";
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
    
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const json = JSON.parse(reader.result);
                    const newLists = json.KittenTodoBook?.lists;
                    if (!Array.isArray(newLists)) return;
    
                    if (rewrite) {
                        this.lists = [];
                    }
    
                    newLists.forEach(list => {
                        const uniqueId = generateUniqueId(this.lists);
                        list.id = uniqueId;
                        this.lists.push(list);
                    });
    
                    save();
                    this.renderTodoBook();
                } catch (e) {
                    console.error("invalid file");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },    

    exportMdBook: function(filename = "kittentodobook") {
        let md = `#${filename}\n`;
        for (const list of this.lists) {
            md += `## ${list.title}\n`;
            for (const item of list.items) {
                md += this.generateMdItem(item, 0);
            }
        }

        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.md`;
        a.click();
    },

    generateMdItem: function(item, depth = 0) {
        let line = "    ".repeat(depth);
        line += `- [${item.checked === "true" ? "x" : " "}] ${item.name}\n`;
        if (Array.isArray(item.subitems)) {
            for (const sub of item.subitems) {
                line += this.generateMdItem(sub, depth + 1);
            }
        }
        return line;
    },

    renderTodoBook: function(filteredLists = null) {
        const container = document.getElementById("todoBook");
        if (!container) return;
    
        container.innerHTML = "";
    
        const listsToRender = filteredLists ?? this.lists;
    
        if (!listsToRender.length) {
            container.innerHTML = `
                <div class='placeholder-graphic'>
                    <img src='resource/placeholder2.png'>
                    <h2 style="color: var(--highlight-color)">Nothing planned</h2>
                    <p>Tap the <kbd>+</kbd> and let’s get things rolling!</p>
                </div>
            `;
            return;
        }
    
        for (const list of listsToRender) {
            const listDiv = document.createElement("div");
            listDiv.className = "todo-book-item";
            listDiv.style.borderLeftColor = list.color;
    
            const titleDiv = document.createElement("div");
            titleDiv.className = "title-div";
            const items = list.items || [];
            const total = items.length;
            const done = items.filter(item => item.checked === true || item.checked === "true").length;
            const percent = total > 0 ? (done / total) * 100 : 0;

            const h3 = document.createElement("h3");
            h3.setAttribute("translate", "no");
            h3.textContent = list.title.trim() === "" ? "Untitled" : list.title;

            const progressWrapper = document.createElement("div");
            progressWrapper.className = "progress-wrapper";

            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";
            progressBar.style.width = `${percent}%`;
            progressBar.style.backgroundColor = list.color;
            progressBar.title = `${percent.toFixed(2)}% (${done}/${total})`;

            progressWrapper.appendChild(progressBar);

            titleDiv.appendChild(h3);
            titleDiv.appendChild(progressWrapper);
    
            const btnDiv = document.createElement("div");
            btnDiv.className = "todo-book-item-buttons";

            const addBtn = document.createElement("button");
            addBtn.className = "icon-button add-button";
            addBtn.textContent = "add";
            addBtn.onclick = async (e) => {
                e.stopPropagation();
                const name = await promptString("New item:");
                if (!name) return;
            
                list.items = list.items || [];
                const id = generateUniqueId(list.items);
            
                list.items.push({
                    id,
                    name,
                    checked: false,
                    subitems: []
                });
                showSnackBar("Item added", "add_task")
                save();
                this.renderTodoBook(filteredLists);
            };
            btnDiv.appendChild(addBtn);
    
            const editBtn = document.createElement("button");
            editBtn.className = "icon-button edit-button";
            editBtn.textContent = "edit";
            editBtn.onclick = async (e) => {
                e.stopPropagation();
                const result = await promptListUpdate(list.title, list.color);
                if (result) {
                    list.title = result.title;
                    list.color = result.color;
                    save();
                    this.renderTodoBook(filteredLists);
                }
            };
            btnDiv.appendChild(editBtn);

    
            const menuWrapper = document.createElement("div");
            menuWrapper.className = "dropdown";

            const menuBtn = document.createElement("button");
            menuBtn.className = "icon-button dropdown-btn";
            menuBtn.setAttribute("translate", "no");
            menuBtn.textContent = "more_vert";
            menuBtn.onclick = (e) => {
                e.stopPropagation();
                toggleDropdown(`list-menu-${list.id}`);
            };

            const menuContent = document.createElement("div");
            menuContent.className = "dropdown-content menu";
            menuContent.id = `list-menu-${list.id}`;

            const deleteButton = document.createElement("button");
            deleteButton.className = "text-button";
            deleteButton.innerHTML = `<span class="icon" translate="no">delete</span>Delete`;

            deleteButton.onclick = async (e) => {
                e.stopPropagation();
                const skipConfirmation = e.shiftKey;
                if (skipConfirmation || await promptConfirm(`Sure you want to delete "${list.title}"?`)) {
                    this.lists = this.lists.filter(l => l.id !== list.id);
                    save();
                    this.renderTodoBook();
                    showSnackBar("Item deleted", "delete");
                }
            };

            menuContent.appendChild(deleteButton);
            

            menuWrapper.appendChild(menuBtn);
            menuWrapper.appendChild(menuContent);
            
            btnDiv.appendChild(editBtn);
            btnDiv.appendChild(menuWrapper);
    
            listDiv.appendChild(titleDiv);
            listDiv.appendChild(btnDiv);
    
            listDiv.onclick = () => {
                window.open(`list.html?list=${list.id}`, "_self");
            };
    
            container.appendChild(listDiv);
        }
    },

    getStat: function () {
        const listCount = this.lists.length;
    
        const jsonStr = JSON.stringify(this);
        const byteSize = new Blob([jsonStr]).size;
    
        let sizeString;
        if (byteSize < 1024 * 1024) {
            sizeString = (byteSize / 1024).toFixed(2) + "Kb";
        } else {
            sizeString = (byteSize / (1024 * 1024)).toFixed(2) + "Mb";
        }
    
        return {
            listCount,
            estimatedSize: sizeString
        };
    },

    deleteBook: function() {
        this.lists = [];
        save();
        window.open('index.html', '_self');
    },

    generateList: async function(prompt, color = "#50d3ff") {
        try {
            const items = await genTodoList(prompt);
            const id = generateUniqueId(this.lists);
            const newList = {
                id,
                title: prompt,
                color,
                items: items.map(name => ({
                    id: generateUniqueId([]),
                    name,
                    checked: "false",
                    subitems: []
                }))
            };
            this.lists.push(newList);
            save();
            this.renderTodoBook();
        } catch (err) {
            console.error("AI list generation failed:", err);
        }
    },
    
    generateItems: async function(prompt, listId) {
        try {
            const items = await genTodoList(prompt);
            const list = this.lists.find(l => l.id === listId);
            if (!list) return;
    
            for (const name of items) {
                list.items.push({
                    id: generateUniqueId(list.items),
                    name,
                    checked: "false",
                    subitems: []
                });
            }
    
            save();
            this.renderTodoBook();
        } catch (err) {
            console.error("AI item generation failed:", err);
        }
    }
};
//#endregion

//#region todo list
const todoList = {
    id: 0,
    title: "",
    color: "#ffffff",
    items: [],

    createItem: function(name, checked = false) {
        const id = generateUniqueId(this.items);
        this.items.push({
            id,
            name,
            checked,
            subitems: []
        });
    },

    updateItem: function(id, name, checked) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.name = name;
            item.checked = String(checked);
            save();
        }
    },

    deleteItem: function(id) {
        this.items = this.items.filter(i => i.id !== id);
        save();
    },

    moveCheckedItemsToStart: function() {
        const sortRecursive = items => {
            for (let item of items) {
                if (item.subitems?.length) sortRecursive(item.subitems);
            }
            items.sort((a, b) => {
                const aChecked = a.checked === "true";
                const bChecked = b.checked === "true";
                return (aChecked === bChecked) ? 0 : (aChecked ? -1 : 1);
            });
        };
        sortRecursive(this.items);
        save();
    },
    
    moveCheckedItemsToEnd: function() {
        const sortRecursive = items => {
            for (let item of items) {
                if (item.subitems?.length) sortRecursive(item.subitems);
            }
            items.sort((a, b) => {
                const aChecked = a.checked === "true";
                const bChecked = b.checked === "true";
                return (aChecked === bChecked) ? 0 : (aChecked ? 1 : -1);
            });
        };
        sortRecursive(this.items);
        save();
    },    

    orderItemsAlphabeticaly: function() {
        const sortRecursive = items => {
            for (let item of items) {
                if (item.subitems?.length) sortRecursive(item.subitems);
            }
            items.sort((a, b) => a.name.localeCompare(b.name));
        };
        sortRecursive(this.items);
        save();
    },

    deleteFirstItem: function() {
        if (todoList.items.length > 0) {
            todoList.items.shift();
            save();
            todoList.renderList();
        }
    },
    
    deleteLastItem: function() {
        if (todoList.items.length > 0) {
            todoList.items.pop();
            save();
            todoList.renderList();
        }
    },

    renderList: function() {
        const container = document.getElementById("todoList");
        if (!container) return;
    
        container.innerHTML = "";

        if (!this.items || this.items.length === 0) {
            container.innerHTML = `
                <div class='placeholder-graphic'>
                    <img src='resource/placeholder.png'>
                    <h2 style="color: var(--highlight-color)">Still a blank canvas</h2>
                    <p>Add your first task</p>
                </div>
            `;
            return;
        }
    
        const generateUniqueId = (items) => {
            let id = 0;
            while (items.some(item => item.id === id.toString())) {
                id++;
            }
            return id.toString();
        };
    
        const renderItem = (item, parentArray) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = (parentArray !== this.items) ? "child-todo-item" : "todo-item";
    
            const mainContent = document.createElement("div");
            mainContent.className = "main-content";
    
            const contentDiv = document.createElement("div");
            contentDiv.className = "content-div";
    
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = item.checked === "true";
            checkbox.onchange = () => {
                item.checked = String(checkbox.checked);
                save();
            };
    
            const label = document.createElement("label");
            label.textContent = item.name;
            label.setAttribute("translate", "no");
    
            contentDiv.appendChild(checkbox);
            contentDiv.appendChild(label);
    
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-div";
    
            const addBtn = document.createElement("button");
            addBtn.className = "icon-button add-button";
            addBtn.textContent = "add";
            addBtn.title = "Add Subitem";
            addBtn.setAttribute("translate", "no");
            addBtn.onclick = async () => {
                const name = await promptString("Sub-item name");
                if (name) {
                    const newId = generateUniqueId(item.subitems);
                    item.subitems.push({ id: newId, name, checked: "false", subitems: [] });
                    save();
                    this.renderList();
                }
            };
    
            const editBtn = document.createElement("button");
            editBtn.className = "icon-button edit-button";
            editBtn.textContent = "edit";
            editBtn.title = "Edit";
            editBtn.setAttribute("translate", "no");
            editBtn.onclick = async () => {
                const name = await promptString("New name:", item.name);
                if (name !== null) {
                    item.name = name;
                    save();
                    this.renderList();
                }
            };
    
            const delBtn = document.createElement("button");
            delBtn.className = "icon-button delete-button";
            delBtn.textContent = "delete";
            delBtn.title = "Delete";
            delBtn.setAttribute("translate", "no");
            delBtn.onclick = () => {
                const index = parentArray.findIndex(i => i === item);
                if (index !== -1) {
                    parentArray.splice(index, 1);
                    save();
                    this.renderList();
                }
            };
    
            buttonDiv.appendChild(addBtn);
            buttonDiv.appendChild(editBtn);
            buttonDiv.appendChild(delBtn);
    
            mainContent.appendChild(contentDiv);
            mainContent.appendChild(buttonDiv);
    
            itemDiv.appendChild(mainContent);
    
            const childContainer = document.createElement("div");
            childContainer.className = "child-content";
            item.subitems?.forEach(sub => {
                const subItemDiv = renderItem(sub, item.subitems);
                childContainer.appendChild(subItemDiv);
            });
    
            itemDiv.appendChild(childContainer);

            updateProgressBar();
            return itemDiv;
        };
    
        this.items.forEach(item => {
            const element = renderItem(item, this.items);
            container.appendChild(element);
        });
    },

    getStat: function () {
        let totalItems = 0;
        let totalCheckedItems = 0;
        let totalUncheckedItems = 0;
    
        let totalParentItems = 0;
        let totalParentCheckedItems = 0;
        let totalParentUncheckedItems = 0;
    
        let totalChildItems = 0;
        let totalChildCheckedItems = 0;
        let totalChildUncheckedItems = 0;
    
        const countStats = (items, isChild = false) => {
            for (const item of items) {
                totalItems++;
                if (item.checked === "true") {
                    totalCheckedItems++;
                    if (isChild) {
                        totalChildCheckedItems++;
                    } else {
                        totalParentCheckedItems++;
                    }
                } else {
                    totalUncheckedItems++;
                    if (isChild) {
                        totalChildUncheckedItems++;
                    } else {
                        totalParentUncheckedItems++;
                    }
                }
    
                if (isChild) {
                    totalChildItems++;
                } else {
                    totalParentItems++;
                }
    
                if (item.subitems && item.subitems.length > 0) {
                    countStats(item.subitems, true);
                }
            }
        };
    
        countStats(this.items);
    
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
};
//#endregion

//#region todo item
const todoItem = {
    id: 0,
    name: "",
    checked: false,
    subitems: [],

    createItem: function(name, checked = false) {
        return {
            id: String(this.subitems.length),
            name,
            checked: String(checked),
            subitems: []
        };
    },

    updateItem: function(id, name, checked) {
        const item = this.subitems.find(i => i.id === id);
        if (item) {
            item.name = name;
            item.checked = String(checked);
        }
    },

    deleteItem: function(id) {
        this.subitems = this.subitems.filter(i => i.id !== id);
    }
};
//#endregion

//#region file management
function save() {
    localStorage.setItem("kittenTodoBookJson", JSON.stringify({ KittenTodoBook: { lists: todoBook.lists } }));
    console.log(JSON.stringify({ KittenTodoBook: { lists: todoBook.lists } }));
    updateProgressBar();
}

function load() {
    const json = localStorage.getItem("kittenTodoBookJson");
    if (json) {
        try {
            const data = JSON.parse(json);
            todoBook.lists = data.KittenTodoBook?.lists || [];
        } catch (e) {
            console.error("Failed to load file");
        }
    }
    updateProgressBar();
}
//#endregion

//#region support functions

function generateUniqueId(items) {
    let id = 0;
    while (items.some(item => item.id === id.toString())) {
        id++;
    }
    return id.toString();
}

function handleSearch() {
    const query = document.getElementById("search-input").value.toLowerCase().trim();
    if (!query) {
        lastFilteredLists = null;
        todoBook.renderTodoBook();
        return;
    }

    const filtered = todoBook.lists.filter(list =>
        list.title.toLowerCase().includes(query)
    );

    lastFilteredLists = filtered;
    todoBook.renderTodoBook(filtered);
}

let canShowConfetti = true;
let lastValue = 0;
function updateProgressBar() {
    const pb = document.getElementById('progress-bar');
    const counts = todoList.getStat();
    const done = counts.totalParentCheckedItems;
    const total = counts.totalParentItems;

    if (pb && total > 0) {
        const percent = (done / total) * 100;
        pb.style.width = `${percent}%`;
        pb.title = `${percent.toFixed(2)}%`;

        // shows confetti if :
        // - confetti wasn't shown in the last 10 secconds
        // - the last percentage wasn't 100% (so deleting a item in a full list doesn't show confetti)
        // - there's more than 10 items
        // - "confetti" setting is true
        if (canShowConfetti && lastValue != 100 && percent >= 100 && done >= 10 && loadSetting('confetti', true) === "true") {
            startConfetti();
            setTimeout(stopConfetti, 1000);
            canShowConfetti = false;
            setTimeout(() => {
                canShowConfetti = true;
            }, 10000);
        }
        lastValue = percent;
    } else if (pb) {
        pb.style.width = `0%`;
        pb.title = `0%`;
    }
}
//#endregion

//#region AI LIST GENERATION
/**
 * Get stored ChatGPT API key
 * @returns {string|error} ChatGPT API key, or error if there's no key
 */
async function getGptKey() {
    const key = localStorage.getItem("kittenGptKey");
    if (!key) throw new Error("No API key found. Check settings");
    return key;
}

/**
 * Generates a todo list based on a prompt
 * @param {string} prompt List title
 * @param {string} model ChatGPT model
 * @param {string} lang Prefered language
 * @returns {string[]} Todo list as array of strings
 */
async function genTodoList(prompt, model = "gpt-4.1-nano") {
    const apiKey = await getGptKey();
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const messages = [
        {
            role: "system",
            content: `You are a helpful assistant that generates a JavaScript array of strings for todo-lists. Your response must be ONLY a valid array, no explanations or additional text.`,
        },
        {
            role: "user",
            content: `Create a task-list based on: "${prompt}"`,
        }
    ];

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
        })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
        throw new Error("Unexpected response from the model");
    }

    const content = data.choices[0].message.content;

    try {
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) throw new Error("Not an array");
        return parsed;
    } catch {
        console.warn("The response is not a clean JSON array. Returning raw text instead.");
        return content.split(/\r?\n/).filter(line => line.trim().startsWith("- ")).map(line => line.replace(/^[-*]\s*/, ""));
    }
}
//#endregion