const LeftArrow = document.querySelector(".Transition-button-left");
const RightArrow = document.querySelector(".Transition-button-right");


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
    } else {
        const currentDateObj = new Date();
        currentYear = currentDateObj.getFullYear();
        currentMonth = currentDateObj.getMonth();
    }

    const dateObj = new Date(currentYear, currentMonth, 1);
    const firstDayOfWeek = dateObj.getDay() - 1;
    const previuosDayOfMonth = firstDayOfWeek - 1;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dateBlocks = document.querySelectorAll(".Date-Block #Days-Text");
    const taskContainers = document.querySelectorAll('.Task-Container');

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
    debugger
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
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();

    
    // Calculate the previous month and year
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    if (previousMonth < 0) {
        previousMonth = 11; // December
        previousYear -= 1;
    }

    let MonthValues = GetToStringMonth(previousMonth);

    ///updating the element of which display the month and years
    

    // Update the date object to represent the previous month
    //const dateObj = new Date(previousYear, previousMonth, 1);
    //const firstDayOfWeek = dateObj.getDay() - 1;
    //const previuosDayOfMonth = firstDayOfWeek - 1;
    //const totalDays = new Date(previousYear, previousMonth + 1, 0).getDate();

    // ... (Rest of the code to update the calendar with the previous month's data)
    // You can reuse the same code from the `updateCalendar` function

    // Call updateCalendar() to update the calendar with the previous month's data
    updateCalendar(previousYear,previousMonth);
    UpdateElement("#Calendar-Header", MonthValues + " " + previousYear);
}

function UpdateNextMonth() {
    debugger
    const currentDateObj = new Date();
    const currentYear = currentDateObj.getFullYear();
    const currentMonth = currentDateObj.getMonth();

    // Calculate the next month and year
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
        nextMonth = 0; // January
        nextYear += 1;
    }
    let MonthTostring = GetToStringMonth(nextMonth);

    
    // Update the date object to represent the next month
    //const dateObj = new Date(nextYear, nextMonth, 1);
    //const firstDayOfWeek = dateObj.getDay() - 1;
    //const previuosDayOfMonth = firstDayOfWeek - 1;
    //const totalDays = new Date(nextYear, nextMonth + 1, 0).getDate();

    // ... (Rest of the code to update the calendar with the next month's data)
    // You can reuse the same code from the `updateCalendar` function

    // Call updateCalendar() to update the calendar with the next month's data

    updateCalendar(nextYear,nextMonth);
    UpdateElement("#Calendar-Header", MonthTostring + " " + nextYear);

}



// Initial call to update the calendar when the page loads

LeftArrow.addEventListener("click", () => {
    debugger
    UpdatePreviousMonth();
})

RightArrow.addEventListener("click", () =>
{
    debugger
    UpdateNextMonth();
})

window.onload = function () {
    updateCalendar();
    const Month = GetToStringMonth();
    const Year = GetCurrentYear();

    UpdateElement("#Calendar-Header", Month + " " + Year);
};