function handleSidebarOpenEvent() {
    // Code to be executed when the sidebar is opened
    // For example, you can update the layout or styles here
    console.log("Sidebar is open!");
    document.body.classList.add('sidebar-opened');
}

function dispatchSidebarCloseEvent() {
    console.log("Sidebar is closed");
    document.body.classList.remove('sidebar-opened');
}


document.addEventListener('sidebarOpen', handleSidebarOpenEvent);
document.addEventListener('sidebarClose', handleSidebarOpenEvent);
