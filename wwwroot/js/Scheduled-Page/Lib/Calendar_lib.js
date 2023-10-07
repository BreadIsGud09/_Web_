export class Calendar_Rendering  ////This class handles everything about calendar behavior
{   
    constructor(RenderBlocks) ///Must provide a RenderBlocks
    {
        //--Componets--\\
        this.Element_Renderer = new ElementRenderer();///Element Renderer Componets
        
        //Handles all the Event
        //-------------\\
        ///Assigning Values
         //Defualt Events
        this.IsCurrentMonthDays = new CustomEvent("IsCurrentMonthDays");
        this.IsNotCurrentMonthDays = new CustomEvent("IsNotCurrentMonthDays");
        this.CurrentDays_Event = new CustomEvent("IsCurrentDays");
        this.NotCurrentDays_Event = new CustomEvent("IsNotCurrentDays");

        ///Defualt properties
        let DateObj = new Date();
        this.CurrentMonth  = DateObj.getMonth()
        this.currentYear = this.#GetCurrentYear();
        this.Current_MonthInCalendar = this.#ConvertMonthType(this.CurrentMonth);
        this.CurrentyearsInCalendar = this.currentYear;///initial values
        //---------------------\\\
        debugger
        let RenderCondition = typeof(RenderBlocks);

        if(RenderCondition !== "object")
        {
            return "Invalid dateblocks"
        }
        else if(RenderCondition == "object")
        {
            debugger
            this.DateBlocks = RenderBlocks;///assigning renderElement

            ///Initialize events
            this.DateBlocks.forEach(E => {
                E.addEventListener("IsCurrentDays", () => {
                    E.classList.add("IsCurrentDays");
                });
        
                E.addEventListener("IsNotCurrentDays",() => 
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
        }
    }

///Private componets method 
    #GetFirstDaysOfCurrentMonth()
    {
        const Currentdate = new Date().getDate();
        const CurrentMonth = new Date().getMonth();

        return {
            date: Currentdate,
            month: CurrentMonth
        };
    }

    #GetCurrentYear() {  
        const currentDateObj = new Date();
        const currentYear = currentDateObj.getFullYear();

        return currentYear;
    }
    
    #ConvertMonthType(MonthIndex)
    {
        debugger

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        const currentDateObj = new Date();
        const currentMonth = currentDateObj.getMonth();
    
        if(typeof(MonthIndex) == 'number')
        {
            return monthNames[MonthIndex];
        }
        else if(typeof(MonthIndex) == 'string')
        {
            return monthNames.indexOf(MonthIndex);
        }
        
        return monthNames[currentMonth];
    }
    
    ///public main Method
    updateCalendar(_year, _month) { ///render days to grid
        debugger
        let currentYear, currentMonth;
        const Time_Now = this.#GetFirstDaysOfCurrentMonth();
    
        if (_year !== undefined && _month !== undefined) {
            currentYear = _year;
            currentMonth = _month;
        } else {
            currentYear = this.currentYear;
            currentMonth = this.CurrentMonth;
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
                this.DateBlocks[i].dispatchEvent(this.CurrentDays_Event);///firing current days event
                this.DateBlocks[i].dispatchEvent(this.IsCurrentMonthDays);///Firing event
            } 
            else if(currentMonth - 1 == Time_Now.month)
            {
                this.DateBlocks[i].dispatchEvent(this.NotCurrentDays_Event);
                this.DateBlocks[i].dispatchEvent(this.IsCurrentMonthDays);
            }
            else 
            {
                this.DateBlocks[i].dispatchEvent(this.IsNotCurrentMonthDays);
            }
    
            this.DateBlocks[i].textContent = lastDayOfPrevMonth;
            lastDayOfPrevMonth--;
        }
    
        // Display the current month's dates
        for (let i = previuosDayOfMonth + 1; i < totalDays + previuosDayOfMonth + 1; i++) {
            if(i >= this.DateBlocks.length)
            {
                break;
            }
    
            if (currentDate == Time_Now.date && currentMonth == Time_Now.month) {///checking for current days
                this.DateBlocks[i].dispatchEvent(this.CurrentDays_Event);///firing current days event
                this.DateBlocks[i].dispatchEvent(this.IsCurrentMonthDays);///Firing event
            } 
            else if(currentMonth == Time_Now.month)///checking for current monthS
            {
                this.DateBlocks[i].dispatchEvent(this.NotCurrentDays_Event);
                this.DateBlocks[i].dispatchEvent(this.IsCurrentMonthDays)//the current days of month
            }
            else {
                
                this.DateBlocks[i].dispatchEvent(this.IsNotCurrentMonthDays);
                this.DateBlocks[i].dispatchEvent(this.NotCurrentDays_Event);
            }
    
            this.DateBlocks[i].textContent = currentDate;
            currentDate++;
        }
    
        // Calculate the number of days to display from the next month
        let nextMonthDate = 1;
        for (let i = firstDayOfWeek + totalDays; i < this.DateBlocks.length; i++) {
            if(nextMonthDate == Time_Now.date && currentMonth + 1 == Time_Now.month)
            {
                this.DateBlocks[i].dispatchEvent(this.CurrentDays_Event);///firing current days event
                this.DateBlocks[i].dispatchEvent(this.IsCurrentMonthDays);///Firing event
            }
            else if(currentMonth + 1 == Time_Now.month)
            {
                this.DateBlocks[i].dispatchEvent(this.NotCurrentDays_Event);
                this.DateBlocks[i].dispatchEvent(this.IsCurrentMonthDays);
            }
            else
            {
                this.DateBlocks[i].dispatchEvent(this.IsNotCurrentMonthDays);
                this.DateBlocks[i].dispatchEvent(this.NotCurrentDays_Event)///remove the event for css
            }
    
            this.DateBlocks[i].textContent = nextMonthDate;
            nextMonthDate++;
        }
    }

    UpdatePreviousMonth() {///Update the next month of current month 
        let Currentvaluesmonth = this.#ConvertMonthType(this.Current_MonthInCalendar);

        if(Currentvaluesmonth != this.CurrentMonth || this.CurrentyearsInCalendar != this.currentYear)
        {
            this.CurrentMonth = Currentvaluesmonth;
            this.currentYear = this.CurrentyearsInCalendar 
        }
        
        // Calculate the previous month and year
        let previousMonth = this.CurrentMonth - 1;
        let previousYear = this.currentYear;
        if (previousMonth < 0) {
            previousMonth = 11; // December
            previousYear -= 1;
        }
    
        this.Current_MonthInCalendar = this.#ConvertMonthType(previousMonth); //update the overall state of script
        this.CurrentyearsInCalendar = previousYear;
    
        ///updating the element of which display the month and years
        let MonthValues = this.#ConvertMonthType(this.Current_MonthInCalendar);
    
        this.updateCalendar(this.CurrentyearsInCalendar,MonthValues);
        this.Element_Renderer.UpdateElement("#Calendar-Header",this.Current_MonthInCalendar + " " + this.CurrentyearsInCalendar);
    }
    
    UpdateNextMonth() {///Update the previous month of current month 
        let Currentvaluesmonth = this.#ConvertMonthType(this.Current_MonthInCalendar);

        if(Currentvaluesmonth != this.CurrentMonth || this.CurrentyearsInCalendar != this.currentYear)
        {
            this.CurrentMonth = Currentvaluesmonth;
            this.currentYear = this.CurrentyearsInCalendar 
        }
        // Calculate the next month and year
       
        let nextMonth = this.CurrentMonth + 1;
        let nextYear = this.currentYear;
        if (nextMonth > 11) {
            nextMonth = 0; // January
            nextYear += 1;
        }
        this.Current_MonthInCalendar= this.#ConvertMonthType(nextMonth);
        this.CurrentyearsInCalendar = nextYear;
    
        this.updateCalendar(this.CurrentyearsInCalendar,nextMonth);
        this.Element_Renderer.UpdateElement("#Calendar-Header", this.Current_MonthInCalendar + " " + this.CurrentyearsInCalendar);
    }
}   


class ElementRenderer ///modify html tag and style class
{
    UpdateElement(selector, data) {
        let Element = document.querySelector(selector);

        if (Element) {
            Element.textContent = data;
            return true;
        }
        else
        {
            return false;
        }
    }

    UpdateElement_Style(_selector, properties,data)
    {
        let Target_Element = document.querySelector(_selector);

        if(Target_Element !== null)
        {
            Target_Element.style[properties] = data
        }
    }
}

class Custom_UI_Event_Handler ///Allows to assign multiple event to a single element
{
    constructor(tags,{Event_Name,Event_config})
    {
        if(typeof tags == "object" && tags != null)
        {
            this.Tags = tags
            this.Event_Info = [Event_Name,Event_config]

            return this.#Initialize_Event();///This will assign and attach event to tags
        }
        else
        {
            return "invalid types";
        }
    }
    
    #Initialize_Event()///When setup dispatch will work
    {
        const Event_Info = new CustomEvent(this.Event_Info[0],this.Event_Info[1]);

        this.Tags.addEventListener(this.Event_Info[0]);

        return Event_Info;
    }

    GetEventInfo()
    {
        return this.Event_Info;
    }


}




