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
        submitButton.textContent = 'Submit';
        submitButton.className = 'prompt-button submit';

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        input.focus();

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

function promptSelect(title, options = [], defaultOption = "") {
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

        // combo-box
        const select = document.createElement('select');
        select.className = 'prompt-select';

        options.forEach((opt) => {
            const optionElement = document.createElement('option');
            optionElement.value = opt;
            optionElement.textContent = opt;
            if (opt === defaultOption) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });

        dialog.appendChild(select);

        // buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'prompt-buttons';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'prompt-button cancel';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.className = 'prompt-button submit';

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        function closePrompt(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        cancelButton.addEventListener('click', () => closePrompt(null));
        submitButton.addEventListener('click', () => closePrompt(select.value));

        overlay.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                closePrompt(select.value);
            } else if (event.key === 'Escape') {
                closePrompt(null);
            }
        });

        select.focus();
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

function promptTagsEditor(tags = [], iconOptions = []) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'prompt-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'prompt-dialog';

        const tagList = document.createElement('div');
        tagList.className = 'prompt-list';
        dialog.appendChild(tagList);

        function renderTags() {
            tagList.innerHTML = '';
            tags.forEach((tag, index) => {
                const tagItem = document.createElement('div');
                tagItem.style.display = 'flex';
                tagItem.style.justifyContent = 'space-between';
                tagItem.style.alignItems = 'center';
                tagItem.style.background = 'var(--field-color)';
                tagItem.style.padding = '5px 10px';
                tagItem.style.borderRadius = '10px';

                const icon = document.createElement('span');
                icon.textContent = `${tag.icon}`;
                icon.style.fontFamily = 'Material Symbols Outlined';

                const text = document.createElement('span');
                text.textContent = `${tag.name}`;

                const remove = document.createElement('button');
                remove.textContent = '✖';
                remove.style.background = 'transparent';
                remove.style.border = 'none';
                remove.style.color = 'var(--text-color)';
                remove.style.cursor = 'pointer';

                remove.addEventListener('click', () => {
                    tags.splice(index, 1);
                    renderTags();
                });

                tagItem.appendChild(icon);
                tagItem.appendChild(text);
                tagItem.appendChild(remove);
                tagList.appendChild(tagItem);
            });
        }

        renderTags();

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.gap = '0.5rem';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.paddingBottom = '30px';

        const iconSelect = document.createElement('select');
        iconSelect.className = 'prompt-select';
        iconSelect.style.fontFamily = 'Material Symbols Outlined';
        iconSelect.style.fontSize = 'large';
        iconSelect.style.width = '4rem';
        iconSelect.style.minWidth = 'unset';
        iconSelect.style.flexShrink = '0';
        iconSelect.style.textAlign = 'center';

        const nameInput = document.createElement('input');
        nameInput.placeholder = 'Tag name';
        nameInput.className = 'prompt-input';
        nameInput.style.flex = '1';

        iconOptions.forEach(icon => {
            const opt = document.createElement('option');
            opt.value = icon;
            opt.textContent = icon;
            iconSelect.appendChild(opt);
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'add';
        addButton.className = 'prompt-button';
        addButton.style.fontFamily = 'Material Symbols Outlined';
        addButton.style.fontSize = 'large';
        addButton.style.flexShrink = '0';
        addButton.style.height = '30px';
        addButton.style.paddingLeft = '10px';
        addButton.style.paddingRight = '10px';

        addButton.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const icon = iconSelect.value;
            if (name) {
                tags.push({ name, icon });
                nameInput.value = '';
                iconSelect.selectedIndex = 0;
                renderTags();
            }
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'prompt-button';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Save';
        submitButton.className = 'prompt-button submit';

        inputContainer.appendChild(iconSelect);
        inputContainer.appendChild(nameInput);
        inputContainer.appendChild(addButton);

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);

        dialog.appendChild(inputContainer);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        function closePrompt(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        cancelButton.addEventListener('click', () => closePrompt(null));
        submitButton.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const icon = iconSelect.value;
        
            if (name) {
                tags.push({ name, icon });
                nameInput.value = '';
                iconSelect.selectedIndex = 0;
            }
        
            renderTags();
            closePrompt(tags);
        });

        overlay.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closePrompt(null);
            }
        });

        nameInput.focus();
    });
}
