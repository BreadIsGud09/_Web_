const LeftArrow = document.querySelector(".Transition-button-left");
const RightArrow = document.querySelector(".Transition-button-right");

const dateObj = new Date()
let CurrentmonthInCalendar = dateObj.getMonth();
let CurrentyearsInCalendar = dateObj.getFullYear();

const dateBlocks = document.querySelectorAll(".Date-Block #Days-Text"); ///date display element
///css events class
const IsCurrentMonthDays = new CustomEvent("IsCurrentMonthDays");

const IsNotCurrentMonthDays = new CustomEvent("IsNotCurrentMonthDays");

const CurrentDays_Event = new CustomEvent("IsCurrentDays",{
    settings:{
        IsCurrentDay: true
    }
});

const NotCurrentDays_Event = new CustomEvent("IsNotCurrentDays",
{
    settings:
    {
        IsCurrenday: false
    }
})
////

function UpdateElement(selector, data) {
    let Element = document.querySelector(selector);

    if (Element) {
        Element.textContent = data;
    }
}

function UpdateElement_Style(_selector, properties,data)
{
    let Target_Element = document.querySelector(_selector);

    if(Target_Element !== null)
    {
        Target_Element.style[properties] = data
    }
}
//----------------------------\\


function GetCurrentDaysOfMonth()
{
    const Currentdate = new Date().getDate();
    const CurrentMonth = new Date().getMonth();

    return {
        date: Currentdate,
        month: CurrentMonth
    };
}

function updateCalendar(_year, _month) {
    let currentYear, currentMonth;
    const Time_Now = GetCurrentDaysOfMonth();

    if (_year !== undefined && _month !== undefined) {
        currentYear = _year;
        currentMonth = _month;
    } else {
        const currentDateObj = new Date();
        currentYear = currentDateObj.getFullYear();
        currentMonth = currentDateObj.getMonth();
    }

    const dateObj = new Date(currentYear, currentMonth, 1);
    let firstDayOfWeek = dateObj.getDay(); // Sunday is 0, Monday is 1
    
    const previuosDayOfMonth = (firstDayOfWeek === 0) ? -1 : (firstDayOfWeek + 6) % 7;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    let currentDate = 1;
    let lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Display the last day of the previous month
    for (let i = previuosDayOfMonth; i >= 0; i--) {
        if (lastDayOfPrevMonth == Time_Now.date && currentMonth - 1 == Time_Now.month) {
            dateBlocks[i].dispatchEvent(CurrentDays_Event);///firing current days event
            dateBlocks[i].dispatchEvent(IsCurrentMonthDays);///Firing event
        } 
        else if(currentMonth - 1 == Time_Now.month)
        {
            dateBlocks[i].dispatchEvent(NotCurrentDays_Event);
            dateBlocks[i].dispatchEvent(IsCurrentMonthDays);
        }
        else 
        {
            dateBlocks[i].dispatchEvent(IsNotCurrentMonthDays);
        }

        dateBlocks[i].textContent = lastDayOfPrevMonth;
        lastDayOfPrevMonth--;
    }

    // Display the current month's dates
    for (let i = previuosDayOfMonth + 1; i < totalDays + previuosDayOfMonth + 1; i++) {
        if(i >= dateBlocks.length)
        {
            break;
        }

        if (currentDate == Time_Now.date && currentMonth == Time_Now.month) {///checking for current days
            dateBlocks[i].dispatchEvent(CurrentDays_Event);///firing current days event
            dateBlocks[i].dispatchEvent(IsCurrentMonthDays);///Firing event
        } 
        else if(currentMonth == Time_Now.month)///checking for current monthS
        {
            dateBlocks[i].dispatchEvent(NotCurrentDays_Event);
            dateBlocks[i].dispatchEvent(IsCurrentMonthDays)//the current days of month
        }
        else {
            
            dateBlocks[i].dispatchEvent(IsNotCurrentMonthDays);
            dateBlocks[i].dispatchEvent(NotCurrentDays_Event);
        }

        dateBlocks[i].textContent = currentDate;
        currentDate++;
    }

    // Calculate the number of days to display from the next month
    let nextMonthDate = 1;
    for (let i = firstDayOfWeek + totalDays; i < dateBlocks.length; i++) {
        if(nextMonthDate == Time_Now.date && currentMonth + 1 == Time_Now.month)
        {
            dateBlocks[i].dispatchEvent(CurrentDays_Event);///firing current days event
            dateBlocks[i].dispatchEvent(IsCurrentMonthDays);///Firing event
        }
        else if(currentMonth + 1 == Time_Now.month)
        {
            dateBlocks[i].dispatchEvent(NotCurrentDays_Event);
            dateBlocks[i].dispatchEvent(IsCurrentMonthDays);
        }
        else
        {
            dateBlocks[i].dispatchEvent(IsNotCurrentMonthDays);
            dateBlocks[i].dispatchEvent(NotCurrentDays_Event)///remove the event for css
        }

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
    

    updateCalendar(CurrentyearsInCalendar,CurrentmonthInCalendar);
    UpdateElement("#Calendar-Header",MonthValues + " " + CurrentyearsInCalendar);
}

function UpdateNextMonth() {
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

///---\\\
// Initial call to update the calendar when the page loads


LeftArrow.addEventListener("click", () => {
    UpdatePreviousMonth(); //update next month
})

RightArrow.addEventListener("click", () =>
{
    UpdateNextMonth();///update the previous month
})

window.onload = function () {
    const Month = GetToStringMonth();
    const Year = GetCurrentYear();

    dateBlocks.forEach(E => {
        E.addEventListener("IsCurrentDays", (EventConfig) => {
            E.classList.add("IsCurrentDays");
        });

        E.addEventListener("IsNotCurrentDays",(EventConfig) => 
        {
            E.classList.remove("IsCurrentDays")
        });

        E.addEventListener("IsCurrentMonthDays",() =>  ////IsCurrent Monthdays event
        {
            E.classList.add("Is_Days_In_Month")
        })

        E.addEventListener("IsNotCurrentMonthDays",() => {
            E.classList.remove("Is_Days_In_Month")
        })
    });

    UpdateElement("#Calendar-Header", Month + " " + Year);
    updateCalendar();
};