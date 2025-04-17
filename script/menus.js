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