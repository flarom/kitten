function toggleDropdown(menuId) {
    const menu = document.getElementById(menuId);
    const dropdown = menu.parentElement;

    // Fecha todos os menus abertos
    document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('show');
            d.querySelector('.dropdown-content').classList.remove('align-left');
        }
    });

    // Alterna o menu atual
    dropdown.classList.toggle('show');

    // Reposiciona o menu se necessário
    if (dropdown.classList.contains('show')) {
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Verifica se o menu está saindo da tela à direita
        if (menuRect.right > viewportWidth) {
            menu.classList.add('align-left'); // Move o menu para a esquerda
        } else {
            menu.classList.remove('align-left'); // Mantém o menu à direita
        }
    }

    // Fecha o menu ao clicar fora
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