window.addEventListener('DOMContentLoaded', (event) => {
    const menusButton = document.querySelector('.Menus button');
    const navBar = document.querySelector('.nav-bar');
    const navBarTrigger = document.querySelector('.nav-bar-trigger');
    const mainContent = document.querySelector('.Main-Section');
    const body = document.body;

    menusButton.addEventListener('click', () => {
        navBar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        if (navBar.classList.contains('collapsed')) {
            navBarTrigger.style.display = 'flex';
            navBarTrigger.style.justifyContent = 'center';
            navBarTrigger.style.alignItems = 'center';
            body.style.gridTemplateColumns = 'auto 100%'
        }
        else {
            body.style.gridTemplateColumns = 'auto 83.8%';
            navBarTrigger.style.display = 'none';
        }
    });

    navBarTrigger.addEventListener('click', () => {
        navBar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        navBarTrigger.style.display = 'none';
        body.style.gridTemplateColumns = 'auto 83.8%';
    });
});