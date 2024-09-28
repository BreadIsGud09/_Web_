export class Calendar_Rendering////This class handles everything about calendar behavior
{   
    constructor(RenderBlocks = new NodeList(),Header = Element) ///Must provide a RenderBlocks
    {
        //--Componets--\\
        
        this.Element_Renderer = new ElementRenderer();///Element Renderer Componets
        
        ///Defualt properties
        const dateObj = new Date();

        this.RootTime = {
            Month : dateObj.getMonth(),
            Year : dateObj.getFullYear()
        }
        this.CurrentMonth  = dateObj.getMonth()
        this.currentYear = this.#GetCurrentYear();
        this.Current_MonthInCalendar = this.#ConvertMonthType(this.CurrentMonth);
        this.CurrentyearsInCalendar = this.currentYear;///initial values
        //---------------------\\\
      
        let RenderCondition = typeof(RenderBlocks);

        if(RenderCondition !== "object" && Header == null)
        {
            throw new Error("Invalid params");
        }
        else if(RenderCondition == "object")
        {
            
        this.DateBlocks = RenderBlocks;///assigning renderElement
        this.display_Header = Header;

        this.DateBlocks_Event = new Custom_UI_Event_Handler(this.DateBlocks, {
            Event_List: [
                "IsCurrentMonthDays",
                "IsNotCurrentMonthDays",
                "IsCurrentDays",
                "IsNotCurrentDays",
                "Flush_Event"
            ],
            Event_config: {
                bubbles: false,
            }}, 
        ); ///SetupEvent


        this.DateBlocks_Event.EventMemory.forEach(_event => ///Adding Handler to event 
        {
            const FlushEvent = this.DateBlocks_Event.EventMemory.find((e) => e.type == "Flush_Event");
                if (_event.type == FlushEvent.type) ///Seperate Event
                {
                    this.DateBlocks_Event.AddHandlerToEvent(_event, (_E = new CustomEvent()) => {
                        this.Element_Renderer.removeClassList(_E.target, _event.type);
                        this.Element_Renderer.removeClassList(_E.target, "IsCurrentMonthDays");
                        this.Element_Renderer.removeClassList(_E.target, "IsNotCurrentMonthDays");
                        this.Element_Renderer.removeClassList(_E.target, "IsCurrentDays");
                        this.Element_Renderer.removeClassList(_E.target, "IsNotCurrentDays");

                    });
                }

                this.DateBlocks_Event.AddHandlerToEvent(_event, (_E = new CustomEvent()) => { ///add new event handler to all tag 
                    console.log("adding new classlist ");
                    this.Element_Renderer.AddingClasslist(_E.target, _event.type);
                });
            }
        );

      

        console.log("Event Setup success!");
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
    updateCalendar(IsReset,_year, _month) { ///render days to grid
        console.log(this.CurrentMonth, this.currentYear);

        let EventReload = false;
        let currentYear, currentMonth;
        const Time_Now = this.#GetFirstDaysOfCurrentMonth();
    
        if (_year !== undefined && _month !== undefined && IsReset == false) { /// Reload and update
            ////Remove all the current inside element if exist
            EventReload = true;
            
            currentYear = _year;
            currentMonth = _month;
        }
        else if(IsReset == true && _month == undefined && _year == undefined)///Reload and update current time
        {
            EventReload = true;

            currentYear = this.RootTime.Year;
            currentMonth = this.RootTime.Month;
        } 
        else { ///Render defualt time
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
            if(EventReload == true){ this.DateBlocks_Event.Call_Event(i,"Flush_Event") }

            if (lastDayOfPrevMonth == Time_Now.date && currentMonth - 1 == Time_Now.month) {
                this.DateBlocks_Event.Call_Event(i,"IsCurrentDays");
                this.DateBlocks_Event.Call_Event(i,"IsCurrentMonthDays");
            } 
            else if(currentMonth - 1 == Time_Now.month)
            {
                this.DateBlocks_Event.Call_Event(i,"IsNotCurrentDays");
                this.DateBlocks_Event.Call_Event(i,"IsCurrentMonthDays");
            }
            else 
            {
                this.DateBlocks_Event.Call_Event(i,"IsNotCurrentDays");
                this.DateBlocks_Event.Call_Event(i,"IsNotCurrentMonthDays");
            }
            
            
            this.DateBlocks[i].textContent = lastDayOfPrevMonth;
            lastDayOfPrevMonth--;
        }
    
        // Display the current month's dates
        for (let i = previuosDayOfMonth + 1; i < totalDays + previuosDayOfMonth + 1; i++) {
            if(i >= this.DateBlocks.length){ break }
            if(EventReload == true) { this.DateBlocks_Event.Call_Event(i,"Flush_Event") }

            if (currentDate == Time_Now.date && currentMonth == Time_Now.month) {///checking for current days
                this.DateBlocks_Event.Call_Event(i,"IsCurrentDays");
                this.DateBlocks_Event.Call_Event(i,"IsCurrentMonthDays");
            } 
            else if(currentMonth == Time_Now.month)///checking for current monthS
            {
                this.DateBlocks_Event.Call_Event(i,"IsNotCurrentDays");
                this.DateBlocks_Event.Call_Event(i,"IsCurrentMonthDays");
            }
            else {
                this.DateBlocks_Event.Call_Event(i,"IsNotCurrentDays");
                this.DateBlocks_Event.Call_Event(i,"IsNotCurrentMonthDays");
            }
    
            this.DateBlocks[i].textContent = currentDate;
            currentDate++;
        }
    
        // Calculate the number of days to display from the next month
        let nextMonthDate = 1;
        for (let i = firstDayOfWeek + totalDays; i < this.DateBlocks.length; i++) {
            if(EventReload == true) { this.DateBlocks_Event.Call_Event(i,"Flush_Event") }///Refresh element


            if(nextMonthDate == Time_Now.date && currentMonth + 1 == Time_Now.month)
            {
                this.DateBlocks_Event.Call_Event(i,"IsCurrentDays");
                this.DateBlocks_Event.Call_Event(i,"IsCurrentMonthDays");
            }
            else if(currentMonth + 1 == Time_Now.month)
            {
                this.DateBlocks_Event.Call_Event(i,"IsNotCurrentDays");
                this.DateBlocks_Event.Call_Event(i,"IsCurrentMonthDays");
            }
            else
            { 
                this.DateBlocks_Event.Call_Event(i,"IsNotCurrentDays");
                this.DateBlocks_Event.Call_Event(i,"IsNotCurrentMonthDays");
            }
    
            this.DateBlocks[i].textContent = nextMonthDate;
            nextMonthDate++;
        }
    }

    ResetCalendarTime()
    { 
        this.CurrentMonth = this.RootTime.Month;
        this.currentYear = this.RootTime.Year;
        this.Current_MonthInCalendar = this.#ConvertMonthType(this.CurrentMonth);
        this.CurrentyearsInCalendar = this.currentYear;
        ///Reset all the time controller in the calendar 

        this.Element_Renderer.UpdateElement(this.display_Header,this.Current_MonthInCalendar + " "+ this.CurrentyearsInCalendar);
        this.updateCalendar(true);
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
    
        this.updateCalendar(false,this.CurrentyearsInCalendar,MonthValues);///Render the given time
        this.Element_Renderer.UpdateElement(this.display_Header,this.Current_MonthInCalendar + " " + this.CurrentyearsInCalendar);
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
    
        this.updateCalendar(false,this.CurrentyearsInCalendar,nextMonth);///Render the given time
        this.Element_Renderer.UpdateElement(this.display_Header, this.Current_MonthInCalendar + " " + this.CurrentyearsInCalendar);
    }
}   

class ElementRenderer ///modify html tag and style class
{   
    UpdateElement(selector, data) {
        if (selector) {
            selector.textContent = data;
            return true;
        }
        else
        {
            return false;
        }
    }

    UpdateElement_Style(_selector, properties,data)
    {
        if(_selector !== null)
        {
            Target_Element.style[properties] = data
        }
    }

    AddingClasslist(Selected_Elements = new Element(), values = "")///selector using css based 
    {
        if(Selected_Elements == null)
        {
            throw new Error("please give an Element instances");
        }
        else if(Selected_Elements !=  null)
        {
            Selected_Elements.classList.add(values);
            console.log(Selected_Elements);
            return Selected_Elements;   
        }
    }   

    removeClassList(Selected_Elements = null ,MatchingValues = new String())
    {
        if(Selected_Elements == null)
        {
            throw new Error("please give an element instances")
        }
        else if(Selected_Elements != null)
        {
            Selected_Elements.classList.remove(MatchingValues);
            return Selected_Elements;
        }
    }   
}



export class Custom_UI_Event_Handler ///Allows to add multiple certain event to multiple element
{
    /**@type {[Element]}*/
    Tag_Collection = []; ///Css collection 
    /**@type {object}*/
    Event_Settings = {};///Contains genereal settings
    /**@type {[CustomEvent]}*/
    EventMemory = []; ///Contains Customevent classes event 
    Call = 0;

    /**
     * 
     * @param {NodeList} tags
     * @param {{Event_List : ["eventName"], Event_config : {}}} eventObject
     * @returns this 
     * @description only intiilize event into the memory without mapping the event to the element
     */
    constructor(tags = NodeList, eventObject = { Event_List: [], Event_config: {} })///Multiple event element
    {
        const IsHasEvent = (eventObject.Event_List.length > 0) ? "true" : "false" ///Checking if any event has assigned to List
        
        if(IsHasEvent == "true")
        {
            this.Tag_Collection = Array.from(tags); ////Creating new array for Tag_Colllection
            this.Event_Settings = eventObject.Event_config; ///Contains settings
            this.EventMemory = []; ///Contains Customevent classes event

            this.#Initialize_CollectionEvent();

            eventObject.Event_List.forEach(p => {///Init event inside of EventMemory
                if(typeof p == 'string')
                {
                    let event = this.#Initialize_Event(p, this.Event_Settings)
                    this.EventMemory.push(event);///Setup event
                }
            })
        }
        else if(tags == null && IsHasEvent == false)
        {
            return this;
        }
    } ////Setup the general event

    /**
     * 
     * @param {{ interfaces : Element, eventObject : {Event_List : ["eventName"], Event_Config : {}}}} SetupModel
     * @returns this
     * @description will push both event into the memmory so as interface
     */
    SingleSetup(SetupModel = { interfaces: Element,
        eventObject : {
            Event_List: [""],
            Event_Config: {} 
        } })///Custom initilize constructor 
    {
        const IsHasEvent = (SetupModel.eventObject.Event_List.length > 0) ? "true" : "false" ///Checking if any event has assigned to List

        this.Tag_Collection.push(SetupModel.interfaces);//add new element to the Collection

        this.#Initialize_CollectionEvent();///give the event an event id in the list

        if (IsHasEvent) {
            for (let i = 0; i <= SetupModel.eventObject.Event_List.length - 1; i++)///Creating event
            {
                var info = this.#Initialize_Event(SetupModel.eventObject.Event_List[i], SetupModel.eventObject.config);

                this.EventMemory.push(info);///Adding info to Memory 

                return this;
            }
        }
        else {
            return this;
        }
    } ///For singular


    #Initialize_CollectionEvent()///Creating new identified properties for each element
    {
    let Event_id = 0; 

        this.Tag_Collection.forEach(e => {
            e.setAttribute("Event_id", Event_id);////set new properties
            Event_id++;
        }); 
    }

    #Initialize_Event(EventName = "",Settings = {})///Convert event to Initiable type
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

    /**
     * 
     * @param {CustomEvent} EventTarget
     * @param {(e = new CustomEvent) => {}} NewHandler
     * @param {boolean} IsDefualt 
     * @description method will map event handler to all tag_collection child
     * 
     */
    AddHandlerToEvent(event = CustomEvent, NewHandler = (e = CustomEvent) => { }, IsDefault = false) ///Add event handler to all element inside the Tag_Collection 
    {
        this.Tag_Collection.forEach(_e => {
            if (event.target == null)///Checking if the event is element is already fired or event has not assigned 
            {
                this.ListenOn(_e, event.type, NewHandler, IsDefault);
            }
            else {
                return new Error("event target is: " + event.target);
            }
        });
    }
    
    /**
     * 
     * @param {Element} Target
     * @param {string} event
     * @returns {boolean}
     * 
     */

    ListenOn(Target = Element, event = "", Handler = () => { }, IsDefualtEvent = true)
    {
        
        if (IsDefualtEvent === true) {
            Target.addEventListener(event, (Event_Properties) => { //Listenning
                Handler(Event_Properties);///Execute given function 
            });
        }
        else if (IsDefualtEvent === false)
        {
            const EventInMemo = this.EventMemory.find((e) => e.type === event);//Searching event inside the memory
            const TargetInMemo = this.Tag_Collection.find((e) => e.getAttribute("Event_id") === Target.getAttribute("Event_id"));
            
            if (EventInMemo !== undefined && TargetInMemo !== undefined) {

                TargetInMemo.addEventListener(event, (e) => {
                    Handler(e);
                });

                console.log(EventInMemo.target);

                return;
            }
            else {
                console.error("Could not find Event/Target inside memo");
                return false;
            }
        }
    }


     /**
     * 
     * @param {number} id
     * @param {string} eventNames
     * @returns boolean
     * @description Search event and dispatch by ID
     */
    Call_Event(id = -1,eventNames = "") ///Callin the event 
    {
        
        if(id < 0){ throw new Error("Missing Event ID!"); }

        let Selector = `[event_id="${id}"]`;
        //Gets the Element that has id equal to the passed in params    
        const Target = document.querySelectorAll(Selector);
        
        let Select;

        Target.forEach(e => {
            const Result = this.Tag_Collection.find(m => m.className == e.className)
            if (Result !== null) {
                Select = e;
                return;
            }
        });

        if (Select !== null)
        {
            let state = Select.dispatchEvent(this.AccessEvent(eventNames));

            return state;
        }
        else
        {
            throw new Error("Cant find Element");
        }
    }

}

