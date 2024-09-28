import * as LayoutBehavior from "../Lib/Layout_Handler.js";

window.addEventListener('DOMContentLoaded', (event) => {
    const menusButton = document.querySelector('.Menus button');
    const navBar = document.querySelector('.nav-bar');
    const navBarTrigger = document.querySelector('.nav-bar-trigger');
    const mainContent = document.querySelector('.Main-Section');
    const body = document.body;

    const Layout = new LayoutBehavior.LayoutManager({ ///Set initial layout
        Name: "Defualt",
        Row: getComputedStyle(body).getPropertyValue("grid-template-rows"),
        Coll: getComputedStyle(body).getPropertyValue("grid-template-columns")
    }, body);

    Layout.Push("FullSize", getComputedStyle(body).getPropertyValue("grid-template-rows"),
        "auto  100%");//auto 100%
    
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
        Layout.Set("FullSize");////Set to fullsize layout
        dispatchSidebarCloseEvent();
    } else {
        Layout.Set("Defualt");
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
            Layout.Set("FullSize");
            navBarTrigger.style.display = 'flex';
            navBarTrigger.style.justifyContent = 'center';
            navBarTrigger.style.alignItems = 'center';
        } else {
            Layout.Set("Defualt");
            dispatchSidebarOpenEvent();
            saveStateToLocalStorage(false);
            navBarTrigger.style.display = 'none';
        }
    });

    navBarTrigger.addEventListener('click', () => {
        dispatchSidebarOpenEvent();
        console.log("Triggered");
        navBar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        navBarTrigger.style.display = 'none';
        Layout.Set("Defualt");
        saveStateToLocalStorage(false);
    });
});








