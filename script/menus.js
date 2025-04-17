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

/* this only exists because electron doesn't support the `prompt()` method*/
function promptString(title) {
    return new Promise((resolve) => {
        // overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';

        // dialog
        const dialog = document.createElement('div');
        dialog.style.backgroundColor = 'var(--card-color)';
        dialog.style.padding = '20px';
        dialog.style.border = '1px solid var(--border-color)'
        dialog.style.borderRadius = '15px';
        dialog.style.width = '300px';

        // title
        const titleElement = document.createElement('p');
        titleElement.textContent = title;
        titleElement.style.marginBottom = '15px';
        dialog.appendChild(titleElement);

        // field
        const input = document.createElement('input');
        input.type = 'text';
        input.style.background = 'var(--field-color)';
        input.style.color = 'var(--text-color)';
        input.style.width = 'calc(100% - 40px';
        input.style.height = '30px';
        input.style.padding = '0px 20px 0px 20px';
        input.style.marginBottom = '15px';
        input.style.border = '1px solid var(--border-color)';
        input.style.outline = 'none';
        input.style.borderRadius = '15px';
        dialog.appendChild(input);

        // buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '5px 30px';
        cancelButton.style.border = '1px solid var(--border-color)';
        cancelButton.style.borderRadius = '15px';
        cancelButton.style.backgroundColor = 'transparent';
        cancelButton.style.color = 'white';
        cancelButton.style.cursor = 'pointer';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.style.padding = '5px 30px';
        submitButton.style.border = '1px solid var(--highlight-color)';
        submitButton.style.borderRadius = '15px';
        submitButton.style.backgroundColor = 'var(--highlight-back)';
        submitButton.style.color = 'white';
        submitButton.style.cursor = 'pointer';

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