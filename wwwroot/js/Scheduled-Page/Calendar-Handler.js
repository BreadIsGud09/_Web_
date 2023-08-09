const LeftArrow = document.querySelector(".Transition-button-left");
const RightArrow = document.querySelector(".Transition-button-right");

const dateObj = new Date()
let CurrentmonthInCalendar = dateObj.getMonth();
let CurrentyearsInCalendar = dateObj.getFullYear();

function UpdateElement(selector, data) {
    let Element = document.querySelector(selector);

    if (Element) {
        Element.textContent = data;
    }
}


function updateCalendar(_year,_month)///update the current time or set time 
{

    let currentYear, currentMonth;

    if (_year !== undefined && _month !== undefined) {
        currentYear = _year;
        currentMonth = _month;
    } else { ///Get current time
        const currentDateObj = new Date();
        currentYear = currentDateObj.getFullYear();
        currentMonth = currentDateObj.getMonth();
    }

    const dateObj = new Date(currentYear, currentMonth, 1);
    const firstDayOfWeek = dateObj.getDay();
    const previuosDayOfMonth = firstDayOfWeek;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dateBlocks = document.querySelectorAll(".Date-Block #Days-Text");
  
    let currentDate = 1;

    // Calculate the last day of the previous month
    let lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Display the last day of the previous month
    for (let i = previuosDayOfMonth; i >= 0; i--) {
        dateBlocks[i].textContent = lastDayOfPrevMonth;
        lastDayOfPrevMonth--;
    }

    // Display the current month's dates
    for (let i = firstDayOfWeek; i < firstDayOfWeek + totalDays; i++) {
        dateBlocks[i].textContent = currentDate;
        currentDate++;
    }

    // Calculate the number of days to display from the next month
    let nextMonthDate = 1;
    for (let i = firstDayOfWeek + totalDays; i < dateBlocks.length; i++) {
        dateBlocks[i].textContent = nextMonthDate;
        nextMonthDate++;
    }
}


function GetCurrentYear() { 
    const currentDateObj = new Date();
    const currentYear = currentDateObj.getFullYear();

    return currentYear;
}

function GetToStringMonth(MonthIndex)
{

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentDateObj = new Date();
    const currentMonth = currentDateObj.getMonth();

    if (MonthIndex == undefined)
    {
        return monthNames[currentMonth];
    }

    return monthNames[MonthIndex];
}

function UpdatePreviousMonth() {
    debugger
    const currentDateObj = new Date();
    let currentYear = currentDateObj.getFullYear();
    let currentMonth = currentDateObj.getMonth();

    if(CurrentmonthInCalendar != currentMonth || CurrentyearsInCalendar != currentYear)
    {
        currentMonth = CurrentmonthInCalendar;
        currentYear = CurrentyearsInCalendar 
    }
    
    // Calculate the previous month and year
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    if (previousMonth < 0) {
        previousMonth = 11; // December
        previousYear -= 1;
    }

    CurrentmonthInCalendar = previousMonth; //update the overall state of script
    CurrentyearsInCalendar = previousYear;


    let MonthValues = GetToStringMonth(CurrentmonthInCalendar);

    ///updating the element of which display the month and years
    

    updateCalendar(CurrentmonthInCalendar,CurrentyearsInCalendar);
    UpdateElement("#Calendar-Header",MonthValues + " " + CurrentyearsInCalendar);
}

function UpdateNextMonth() {
    debugger

    const currentDateObj = new Date();
    let currentYear = currentDateObj.getFullYear();
    let currentMonth = currentDateObj.getMonth();

    if(CurrentmonthInCalendar != currentMonth || CurrentyearsInCalendar != currentYear)
    {
        currentMonth = CurrentmonthInCalendar;
        currentYear = CurrentyearsInCalendar 
    }
    // Calculate the next month and year
   
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
        nextMonth = 0; // January
        nextYear += 1;
    }
    CurrentmonthInCalendar = nextMonth;
    CurrentyearsInCalendar = nextYear;

    let MonthTostring = GetToStringMonth(CurrentmonthInCalendar);

    updateCalendar(CurrentyearsInCalendar,CurrentmonthInCalendar);
    UpdateElement("#Calendar-Header", MonthTostring + " " + CurrentyearsInCalendar);

}



// Initial call to update the calendar when the page loads

LeftArrow.addEventListener("click", () => {
    UpdatePreviousMonth(); //update next month
})

RightArrow.addEventListener("click", () =>
{
    UpdateNextMonth();///update the previous month
})

window.onload = function () {
    updateCalendar();
    const Month = GetToStringMonth();
    const Year = GetCurrentYear();

    UpdateElement("#Calendar-Header", Month + " " + Year);
};