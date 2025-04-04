// ---------------------------------------Função Menu Mobile ------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.menu-btn button');
    const closeBtn = document.querySelector('.close-button');
    const menuOverlay = document.querySelector('.menu-overlay');
    const mobileEventosMenu = document.getElementById('mobile-eventos-menu');
    const mobileGaleriaMenu = document.getElementById('mobile-galeria-menu');

    // Function to toggle main menu
    function toggleMenu() {
        menuOverlay.classList.toggle('active');
        closeBtn.classList.toggle('active');
        document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : 'auto';

        // Reset submenus when closing main menu
        if (!menuOverlay.classList.contains('active')) {
            mobileEventosMenu.classList.remove('active');
            mobileGaleriaMenu.classList.remove('active');
        }
    }

    // Attach event listeners to menu buttons
    menuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    // Handle mobile submenu toggles
    const handleSubmenuToggle = function (e) {
        // Only prevent default and toggle active class if clicking the main menu item
        if (e.target === this.querySelector('a')) {
            e.preventDefault();
            this.classList.toggle('active');
        }
        // Allow submenu links to work normally
    };

    // Add event listeners to mobile submenus
    mobileEventosMenu.addEventListener('click', handleSubmenuToggle);
    mobileGaleriaMenu.addEventListener('click', handleSubmenuToggle);
});

