function toggleDropdown(menuId) {
    const menu = document.getElementById(menuId);
    const dropdown = menu.parentElement;

    document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('show');
            d.querySelector('.dropdown-content').classList.remove('align-left');
        }
    });

    dropdown.classList.toggle('show');

    if (dropdown.classList.contains('show')) {
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        if (menuRect.right > viewportWidth) {
            menu.classList.add('align-left');
        } else {
            menu.classList.remove('align-left');
        }
    }

    document.addEventListener('click', closeDropdownOnClickOutside);
}

function closeDropdownOnClickOutside(event) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
            dropdown.querySelector('.dropdown-content').classList.remove('align-left');
        }
    });
    document.removeEventListener('click', closeDropdownOnClickOutside);
}

function promptString(title, defaultText="") {
    return new Promise((resolve) => {
        // overlay
        const overlay = document.createElement('div');
        overlay.className = 'prompt-overlay';

        // dialog
        const dialog = document.createElement('div');
        dialog.className = 'prompt-dialog';

        // title
        const titleElement = document.createElement('p');
        titleElement.textContent = title;
        titleElement.className = 'prompt-title';
        dialog.appendChild(titleElement);

        // field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = defaultText ? defaultText : ""
        input.className = 'prompt-input';
        dialog.appendChild(input);

        // buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'prompt-buttons';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'prompt-button cancel';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Ok';
        submitButton.className = 'prompt-button submit';

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        input.focus();
        input.selectionStart = 0;
        input.selectionEnd = input.value.length;

        function closePrompt(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        cancelButton.addEventListener('click', () => closePrompt(null));
        submitButton.addEventListener('click', () => closePrompt(input.value));

        overlay.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                closePrompt(input.value);
            } else if (event.key === 'Escape') {
                closePrompt(null);
            }
        });
    });
}

function promptMessage(htmlContent) {
    return new Promise((resolve) => {
        // overlay
        const overlay = document.createElement('div');
        overlay.className = 'prompt-overlay';

        // dialog
        const dialog = document.createElement('div');
        dialog.className = 'prompt-dialog';
        dialog.style.width = '100%';
        dialog.style.maxWidth = '500px';

        // html content
        const content = document.createElement('div');
        content.innerHTML = htmlContent;
        content.style.marginBottom = '15px';
        dialog.appendChild(content);

        // ok button
        const okButton = document.createElement('button');
        okButton.textContent = 'Ok';
        okButton.className = 'prompt-button submit';

        dialog.appendChild(okButton);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        function closePrompt() {
            document.body.removeChild(overlay);
            resolve();
        }

        okButton.addEventListener('click', closePrompt);

        overlay.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                closePrompt();
            }
        });

        okButton.focus();
    });
}

function promptConfirm(message) {
    return new Promise((resolve) => {
        // overlay
        const overlay = document.createElement('div');
        overlay.className = 'prompt-overlay';

        // dialog
        const dialog = document.createElement('div');
        dialog.className = 'prompt-dialog';
        dialog.style.width = '100%';
        dialog.style.maxWidth = '400px';

        // message
        const text = document.createElement('p');
        text.textContent = message;
        text.className = 'prompt-title';
        dialog.appendChild(text);

        // buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'prompt-buttons';

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.className = 'prompt-button submit';

        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.className = 'prompt-button cancel';

        buttonContainer.appendChild(noButton);
        buttonContainer.appendChild(yesButton);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        function closePrompt(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        yesButton.addEventListener('click', () => closePrompt(true));
        noButton.addEventListener('click', () => closePrompt(false));

        overlay.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                closePrompt(true);
            } else if (event.key === 'Escape') {
                closePrompt(false);
            }
        });

        yesButton.focus();
    });
}

//#region list creating

function promptListCreation() {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'prompt-overlay';

        const dialog = document.createElement('div');
        dialog.style.width = '500px';
        dialog.className = 'prompt-dialog';

        // Title
        const titleElement = document.createElement('p');
        titleElement.textContent = "Create a new list";
        titleElement.className = 'prompt-title';
        dialog.appendChild(titleElement);

        const fieldsContainer = document.createElement('div');
        fieldsContainer.className = "center-flex";
        fieldsContainer.style.marginBottom = "20px";
        
        // Color field
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = getCSSVariableValue("--highlight-color") || "#50d3ff";
        fieldsContainer.appendChild(colorInput);
        
        // Name field
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'List title';
        nameInput.className = 'prompt-input';
        nameInput.style.width = 'calc(100% - 100px)';
        nameInput.style.margin = '0px';
        fieldsContainer.appendChild(nameInput);
        dialog.appendChild(fieldsContainer)

        // Buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'prompt-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "prompt-button cancel";

        const createBtn = document.createElement('button');
        createBtn.textContent = "Create";
        createBtn.className = "prompt-button submit";

        const aiBtn = document.createElement('button');
        aiBtn.textContent = "Generate";
        aiBtn.className = "prompt-button";

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(aiBtn);
        buttonContainer.appendChild(createBtn);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        nameInput.focus();

        function close(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        cancelBtn.onclick = () => close(null);

        createBtn.onclick = () => {
            if (!nameInput.value.trim()) return;
            close({ mode: "manual", title: nameInput.value.trim(), color: colorInput.value });
        };

        aiBtn.onclick = () => {
            if (!nameInput.value.trim()) return;
            close({ mode: "ai", prompt: nameInput.value.trim(), color: colorInput.value });
        };

        overlay.addEventListener("keydown", (e) => {
            if (e.key === "Enter") createBtn.click();
            else if (e.key === "Escape") cancelBtn.click();
        });
    });
}

function promptListUpdate(title = "", color = "#50d3ff") {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'prompt-overlay';

        const dialog = document.createElement('div');
        dialog.style.width = '500px';
        dialog.className = 'prompt-dialog';

        // Title
        const titleElement = document.createElement('p');
        titleElement.textContent = "Edit list";
        titleElement.className = 'prompt-title';
        dialog.appendChild(titleElement);

        const fieldsContainer = document.createElement('div');
        fieldsContainer.className = "center-flex";
        fieldsContainer.style.marginBottom = "20px";

        // Color input
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = color || "#50d3ff";
        fieldsContainer.appendChild(colorInput);

        // Name input
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'List title';
        nameInput.value = title || "";
        nameInput.className = 'prompt-input';
        nameInput.style.width = 'calc(100% - 100px)';
        nameInput.style.margin = '0px';
        fieldsContainer.appendChild(nameInput);
        dialog.appendChild(fieldsContainer);

        // Buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'prompt-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "prompt-button cancel";

        const saveBtn = document.createElement('button');
        saveBtn.textContent = "Save";
        saveBtn.className = "prompt-button submit";

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(saveBtn);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        nameInput.focus();
        nameInput.selectionStart = 0;
        nameInput.selectionEnd = nameInput.value.length;

        function close(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        cancelBtn.onclick = () => close(null);

        saveBtn.onclick = () => {
            if (!nameInput.value.trim()) return;
            close({ title: nameInput.value.trim(), color: colorInput.value });
        };

        overlay.addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveBtn.click();
            else if (e.key === "Escape") cancelBtn.click();
        });
    });
}

//#endregion