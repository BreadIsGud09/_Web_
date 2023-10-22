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
        //this.IsCurrentMonthDays = new CustomEvent("IsCurrentMonthDays");
        //this.IsNotCurrentMonthDays = new CustomEvent("IsNotCurrentMonthDays");
        //this.CurrentDays_Event = new CustomEvent("IsCurrentDays");
        //this.NotCurrentDays_Event = new CustomEvent("IsNotCurretDays");

        ///Defualt properties
        let DateObj = new Date();
        this.CurrentMonth  = DateObj.getMonth()
        this.currentYear = this.#GetCurrentYear();
        this.Current_MonthInCalendar = this.#ConvertMonthType(this.CurrentMonth);
        this.CurrentyearsInCalendar = this.currentYear;///initial values
        //---------------------\\\
      
        let RenderCondition = typeof(RenderBlocks);

        if(RenderCondition !== "object")
        {
            return "Invalid dateblocks"
        }
        else if(RenderCondition == "object")
        {
            
            this.DateBlocks = RenderBlocks;///assigning renderElement

            
            ///Initialize events
            this.DateBlocks.forEach(E => {
                this.DateBlocks_Event = new Custom_UI_Event_Handler(E, {
                    Event_List: [
                        "IsCurrentMonthDays",
                        "IsNotCurrentMonthDays",
                        "IsCurrentDays",
                        "IsNotCurrentDays"
                    ],
                    Event_config: {}}, 
                    ); ///SetupEvent
                

                this.DateBlocks_Event.EventMemory.forEach(_event => ///Adding Handler to UI event 
                {
                    debugger
                    console.log(E)
                    this.DateBlocks_Event.AddHandlerToEvent(_event, () => {
                        this.Element_Renderer.AddingClasslist(E, _event.type)
                    });////pass the AddingClassList function to the Handler method
                })
                
                console.log("Event Setup success!")
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
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsCurrentDays")); ////firing for specifics days
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsCurrentMonthDays")); 
            } 
            else if(currentMonth - 1 == Time_Now.month)
            {
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsNotCurrentDays"));
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsCurrentMonthDays"));
            }
            else 
            {
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsNotCurrentDays"))
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsNotCurrentMonthDays"));
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
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsCurrentDays"));
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsCurrentMonthDays"));
            } 
            else if(currentMonth == Time_Now.month)///checking for current monthS
            {
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsNotCurrentDays"));
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsCurrentMonthDays"));
            }
            else {
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsNotCurrentDays"))
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsNotCurrentMonthDays"));
            }
    
            this.DateBlocks[i].textContent = currentDate;
            currentDate++;
        }
    
        // Calculate the number of days to display from the next month
        let nextMonthDate = 1;
        for (let i = firstDayOfWeek + totalDays; i < this.DateBlocks.length; i++) {
            if(nextMonthDate == Time_Now.date && currentMonth + 1 == Time_Now.month)
            {
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsCurrentDays"));
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsCurrentMonthDays"));
            }
            else if(currentMonth + 1 == Time_Now.month)
            {
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsNotCurrentDays"));
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsCurrentMonthDays"));
            }
            else
            {
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsNotCurrentDays"))
                this.DateBlocks_Event.ExecuteEvent(this.DateBlocks_Event.AccessEvent("IsNotCurrentMonthDays"));
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

    AddingClasslist(Selector = Element,values = string)
    {
        debugger
        
        if(Selector == null)
        {
            throw new Error("please give an Element instances");
        }
        else if(Selector !=  null)
        {
            Selector.classList.add(values);
        }
    }   

    removeClassList(Selector,Values)
    {
        Selector.classList.remove(Values);
    }   
}

export class Custom_UI_Event_Handler ///Allows to assign multiple event to a single element
{
    constructor(tags = Element,eventObject = {Event_List : [],Event_config : {}})
    {
        
        const IsHasEvent = (eventObject.Event_List.length >= 0) ? "true" : "false" ///Checking if any event has assigned to List
        
        if(tags != null && IsHasEvent)
        {
            this.Tags = tags
            this.Event_Settings = eventObject.Event_config ///Contains settings
            this.EventMemory = []; ///Contains Customevent classes event
            
            eventObject.Event_List.forEach(p => {///Init event inside of EventMemory
                if(typeof p == 'string')
                {
                    
                    this.EventMemory.push(this.#Initialize_Event(p,this.Event_Settings));///Setup event
                }
            })
        }
        else if(tags == null && IsHasEvent == false)
        {
            return null;
        }
    } ////Setup the general event
    
    
   
    #Initialize_Event(EventName = "",Settings = {})///Convert event to Initiable
    {
        
        const Info = new CustomEvent(EventName,Settings);
            
        return Info;
    }

    AccessEvent(EventName = "") ///return the CustomEventObject using string
    {
        const Found_Event = this.EventMemory.find((e) => e.type === EventName)

        if(Found_Event == null) {throw new Error(EventName  + " Cannot be found")} ///Checking if the Event exsits
        
        
        return Found_Event;
    }

    AddHandlerToEvent(EventTarget = new CustomEvent,NewHandler = () => {})
    {
         // Use the EventTarget type to determine the custom event type
         const eventType = EventTarget.type;
          
         // Find the corresponding custom event in EventMemory
         const event = this.EventMemory.find(event_ => event_.type === eventType);
       
         // Add the event listener with the correct type
         this.Tags.addEventListener(event.type, (e) => {
            debugger
            NewHandler()///Execute given function
            console.log(e.type);////Checking the state of Event
        });
    }

    ExecuteEvent(CustomeEventObj = new CustomEvent)///Execute the specify event in the memory
    {   
        
        console.log(this.Tags);
        let state = this.Tags.dispatchEvent(CustomeEventObj)
        return state;
    }
}




