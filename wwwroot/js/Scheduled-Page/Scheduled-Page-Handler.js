import { Calendar_Rendering } from "/js/Scheduled-Page/Lib/Calendar_lib.js"

document.addEventListener('DOMContentLoaded',() =>
{   
    const Days_DisplayElement = document.querySelectorAll(".Date-Block #Days-Text"); ///date display element
    const CalendarRenderer = new Calendar_Rendering(Days_DisplayElement);
    const Month = CalendarRenderer.Current_MonthInCalendar;
    const Year = CalendarRenderer.currentYear;

    const LeftArrow = document.querySelector(".Calendar-Main-interface, .Transition-button-left ");
    const RightArrow = document.querySelector(".Calendar-Main-interface, .Transition-button-right");
    debugger

    
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
    ///Hard UI function

    console.log("Runnning");
    console.log(LeftArrow,RightArrow);
    
    let state = CalendarRenderer.UpdateElementAccessor("#Calendar-Header", Month + " " + Year);


    RightArrow.addEventListener("click",() => 
    {
        console.log("Ininti1");
        CalendarRenderer.UpdateNextMonth();
    });
    LeftArrow.addEventListener("click",() => 
    {
        console.log("Init event2")
        CalendarRenderer.UpdatePreviousMonth();
    });
    ///event init

    CalendarRenderer.updateCalendar(); 
    document.addEventListener('sidebarOpen', handleSidebarOpenEvent);
    document.addEventListener('sidebarClose', handleSidebarCloseEvent);

})


///----Event Handler----\\




