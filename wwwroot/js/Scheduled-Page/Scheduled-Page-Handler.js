function handleSidebarOpenEvent() {
    // Code to be executed when the sidebar is opened
    // For example, you can update the layout or styles here
    console.log("Sidebar is open!");
    document.body.classList.add('sidebar-opened');
    // Update the grid-template-columns and grid-template-rows when the sidebar is opened
    const containerElement = document.querySelector('.Calendar-Text-header');
    if (containerElement) {
        containerElement.style.gridTemplateColumns = "70px 30rem auto"; ///header layout 
        containerElement.style.gridTemplateRows = '100%';
    }
}

function handleSidebarCloseEvent() {
    console.log("Sidebar is closed");
    document.body.classList.remove('sidebar-opened');

    // Reset the grid-template-columns and grid-template-rows when the sidebar is closed
    const containerElement = document.querySelector('.Calendar-Text-header');

    if (containerElement) {
        containerElement.style.gridTemplateColumns = "70px 30rem auto"; ///header layout when closed navbar
        containerElement.style.gridTemplateRows = "100%";            ;
    } 
}

document.addEventListener('sidebarOpen', handleSidebarOpenEvent);
document.addEventListener('sidebarClose', handleSidebarCloseEvent);



///----Event Handler----\\

  // Function to update the day of the month for the current month

