import { LayoutBehavior } from "../Lib/Layout_Handler";

window.addEventListener('DOMContentLoaded', (event) => {
    const menusButton = document.querySelector('.Menus button');
    const navBar = document.querySelector('.nav-bar');
    const navBarTrigger = document.querySelector('.nav-bar-trigger');
    const mainContent = document.querySelector('.Main-Section');
    const body = document.body;

    const Layout = new LayoutBehavior.LayoutManager({
        Name: "Defualt",
        Row: body.style.getPropertyValue("GridTemplateRows"),
        Coll: body.style.getPropertyValue("GridTemplateCollums")
    }, body);


    

    // Function to save the state to local storage
    function saveStateToLocalStorage(navBarCollapsed) {
        localStorage.setItem("navBarCollapsed", JSON.stringify(navBarCollapsed));
    }

    // Function to load the state from local storage
    function loadStateFromLocalStorage() {
        const state = localStorage.getItem("navBarCollapsed");
        return state ? JSON.parse(state) : false; // Default to false if the state is not found in local storage
    }

    // Add a class to indicate the page is loading
    body.classList.add('page-loading');


    function dispatchSidebarOpenEvent() {
        const event = new CustomEvent('sidebarOpen', { detail: true });
        document.dispatchEvent(event);
    }

    function dispatchSidebarCloseEvent() {
        const event = new CustomEvent('sidebarClose', { detail: false });
        document.dispatchEvent(event);
    }

    // Check the state from local storage and set the initial state of the navbar
    const initialNavBarCollapsed = loadStateFromLocalStorage();

    if (initialNavBarCollapsed) {
        navBar.classList.add('collapsed');
        navBarTrigger.style.display = "block";
        
        dispatchSidebarCloseEvent();
    } else {
        navBarTrigger.style.display = "none";
        dispatchSidebarOpenEvent();
    }

    // Remove the class after the initial state is set to prevent animation on page load
    body.classList.remove('page-loading');

    menusButton.addEventListener('click', () => {
        
        mainContent.classList.add('expanded');//add state

        navBar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');


        if (navBar.classList.contains('collapsed')) {
            
            console.log("Saving data");
            dispatchSidebarCloseEvent();
            saveStateToLocalStorage(true);

            navBarTrigger.style.display = 'flex';
            navBarTrigger.style.justifyContent = 'center';
            navBarTrigger.style.alignItems = 'center';
            body.style.gridTemplateColumns = 'auto 100%';
        } else {
            dispatchSidebarOpenEvent();
            saveStateToLocalStorage(false);
            body.style.gridTemplateColumns = 'auto 83.8%';
            navBarTrigger.style.display = 'none';
        }
    });

    navBarTrigger.addEventListener('click', () => {
        dispatchSidebarOpenEvent();
        console.log("Triggered");
        navBar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        navBarTrigger.style.display = 'none';
        body.style.gridTemplateColumns = 'auto 83.8%';
        saveStateToLocalStorage(false);
    });
});








