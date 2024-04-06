import { Calendar_Rendering } from "/js/Lib/Calendar_lib.js"

const Calendar_Header = document.querySelector(".Calendar-Month-Container > #Calendar-Header");///getting the header
const Days_DisplayElement = document.querySelectorAll(".Date-Block #Days-Text"); ///date display element
const CurrentDaysButton = document.querySelector(".CurrentDaysButton");

document.addEventListener('DOMContentLoaded',() =>
{   
    console.log(Calendar_Header);
    const CalendarRenderer = new Calendar_Rendering(Days_DisplayElement,Calendar_Header);
    const Month = CalendarRenderer.Current_MonthInCalendar;
    const Year = CalendarRenderer.currentYear;

    Calendar_Header.textContent = Month + " " + Year

    const LeftArrow = document.querySelector(".Calendar-Main-interface, .Transition-button-left ");
    const RightArrow = document.querySelector(".Calendar-Main-interface, .Transition-button-right");
    
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
    ///concrete UI function

    
    if(RightArrow && LeftArrow && CurrentDaysButton) 
    {
        CurrentDaysButton.addEventListener("click",() =>
        {
            CalendarRenderer.ResetCalendarTime();///Reset the calendar time
            
        })

        RightArrow.addEventListener("click",() => 
        {
            console.log("Ininti1");
            CalendarRenderer.UpdateNextMonth();
        });
        LeftArrow.addEventListener("click",() => 
        {
            console.log("Init event2");
            CalendarRenderer.UpdatePreviousMonth();
        });
    }

    ///event init

    CalendarRenderer.updateCalendar(); 
    document.addEventListener('sidebarOpen', handleSidebarOpenEvent);
    document.addEventListener('sidebarClose', handleSidebarCloseEvent);

})


///----Event Handler----\\




