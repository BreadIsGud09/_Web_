import * as CustomUIEvent from "../Lib/Calendar_lib.js";


export class UIDataModel {
    HTML = ""; ///html

    /**@type {[Element]}*/
    #ActionClass = [Element];///CSS class collection
    /**@type {[""]}*/
    #ActionList = [''];///action List
    /**@type {[(e = CustomEvent) => {}]}*/
    #Handler = [];

    
    #global_Handler = {};//seperate reuseable handler

    /**@type {[string]}
     * @description Collection of css modules
     */
    Css_Path = [""]

    /**@type {{prototype : {Target : Element, EventName : "",Handler : (e = CustomEvent) => {}}}}*/
    #ActionLog = {};

    constructor(html = "", actionClass = [Element], actionList = [''], handler = {}) {
        this.HTML = html;
        this.#ActionClass = actionClass;
        this.#ActionList = actionList;
        this.#Handler = handler;
    }

    CurrentData()///Return current set of data
    {
        return {
            html: this.HTML,
            ActionClass: this.ActionClass,
            ActionList: this.#ActionList,
            Handler: this.#Handler
        }
    }

    get Log() {
        return this.#ActionLog;
    }

    get Classlist() {
        return this.#ActionClass;
    }

    set Class(E = Element)///set new value to the memory
    {
        this.#ActionClass.push(E);
    }

    set CssModules(Path = "") {
        this.Css_Path.push(Path);
    }

    set Handler(Handler = () => { })///
    {
        this.#Handler.push(Handler);
    }

    set Action(events = "")///access the action list 
    {
        this.ActionList.push(events);///push to Action list 
    }


    #CreateMapPoints(TargetElement = Element, eventname = "", handler = (eventData) => { }) {
        ///Link ids to ids
        const map = {
            Target: TargetElement,
            EventName: eventname,
            Handler: handler
        }

        return map
    }

    #GenerateLogIndentifer() {
        return Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    }///Generate a 3 digits number




    AddNewMap(E = Element, event = "", Handler = () => { }) {///Addding a new map clues to the memory
        ///create an indentifier
        let identifer = this.#GenerateLogIndentifer;
        const Map_Clues = this.#CreateMapPoints(E, event,Handler);///will return a data map for pushing into log object

        this.#ActionLog[identifer] = Map_Clues;///Creating a new map object by the event name
        return identifer;
    }


    /**
     * 
     * @param {String} key
     * @returns {{Caller : Function}}
     */
    GetGlobalHandler(key = "") { ///Takes a key to return 

        if (key == "") { return undefined };

        return this.#global_Handler[key];/// return function caller() method
    }

    /**
     * 
     * @param {string} Key
     * @param {Function} Handler
     * @returns {boolean}
     * Will access the global handler properties, call the global handler by Caller method
     */

    SetGlobalHandler(Key = "", Handler = () => { }) {
        if (Key !== "") {
            this.#global_Handler[Key] = {
                Caller: Handler,
            }///Set Handler to passed in handler 
            return true;
        }
        return false;
    }
}


class ObjectTracker {
    
    ListenTo;
    Triggerer
    
    constructor(listenToActionMethod,triggerer)
    {
        this.ListenTo = listenToActionMethod;
        this.Triggerer = triggerer;
    }

    Alert() {
    }

}


export class PartialUI  ///Only available for html and js
{
    HTML = "";
    /**@type {[HTMLDivElement]}*/
    ClassCollection = [];///Class involve in the UI
    /**@type {CustomUIEvent.Custom_UI_Event_Handler()}*/
    #Action_Service;
    /**@type {UIDataModel}*/
    #ExportModel;
    
    /** 
     * @type {string} html
     * @type {[element]} Css_ClassName
     * @type {string} Css_Modules_Path
     */
    constructor(html = "", Element_List = [Element]) {
        this.HTML = html;
        this.ClassCollection = Element_List;
        this.#Action_Service = new CustomUIEvent.Custom_UI_Event_Handler()///using service
        this.#ExportModel = new UIDataModel(html, this.ClassCollection);
        
        this.#InitilizeSetupAction();///Initilize event service for Class collection
    }

    set NewClass(Class = Element) {///Set in a new class to the ClassCollection
        this.ClassCollection.push(Class);
        this.#InitilizeSetupAction();///Runs the event services for class;
    }

    #DisposeCollection()
    {
        for (var keys in this.ClassCollection) {
            let Values = this.ClassCollection[keys];
            if (Values == null) {
                this.ClassCollection.splice(Values);
            }
        }
    }///Remove any null element that still exsit in memory

    /**
     * @description intialize event to each element
     */
    #InitilizeSetupAction()//Setup event for collection 
    {
        this.ClassCollection.forEach((e, index) => {
            if (e !== null) {
                if (e.className == undefined) { return }

                this.#Action_Service.SingleSetup({
                    interfaces: this.ClassCollection[index],
                    eventObject: {
                        Event_List: [""], Event_Config: {}
                    }
                });///Initilizing service
            }
            else {
                this.ClassCollection.splice(index, 1);///remove the null out of the element 
            }
        });
    }

   
    /**
     * 
     * @param {Element} ClassName
     * @param {string} EventNameOptional
     * @returns {boolean}
     * @description Trigger the call event inside the Action service
     */
    CallAction(ClassName = Element,EventName = "")///Calling exitsing action directly without listenner
    {
        const IndexOfClass = this.ClassCollection.indexOf(ClassName);////return element inside memo
        const EventObj = this.#Action_Service.EventMemory.find((act) => act.type === EventName);///Event string
        const ClassId = ClassName.getAttribute("event_id");


        if (EventObj !== undefined) {
            return this.#Action_Service.Call_Event(ClassId, EventObj.type); ///executing the event
        }
        else {
            return false;
        }
    }

    /**
     * 
     * @param {string} key
     * @param {(e = new CustomEvent()) => {}} Handler
     * @description Method will set a new global handler inside UIDataModel class
     */

    SetGlobalHandler(key = "", Handler = () => { })
    {
        if (key !== "") {
            this.#ExportModel.SetGlobalHandler(key, Handler);///Set handler 

            return this.#ExportModel.GetGlobalHandler(key);///The handler that saved to the ExportModel 
        }
        else
        {
            return false;
        }
    }

    /**
     * 
     * @param {Element} ClassName
     * @param {string} TriggerEvent
     * @param {(e = CustomEvent) => {}} Handler
     * @param {boolean} IsDefualtEvent
     * @description Method Map any action to the element exsiting in the MEMORY 
     * @description action will be disposed when export
     */
    On_Action(Class = Element, TriggerEvent = "", Handler = (e) => { },IsDefualtEvent = false)
    {
        this.#DisposeCollection();

        const IndexOfClass = this.ClassCollection.indexOf(Class);
        const IntialAction = new CustomEvent(TriggerEvent);

        this.#Action_Service.EventMemory.push(IntialAction);

        if (IndexOfClass !== -1 && Class !== null)///Exsiting in the memory?
        {
            this.#Action_Service.ListenOn(this.ClassCollection[IndexOfClass], TriggerEvent, Handler, IsDefualtEvent); ///Mapping event to Class

            this.#ExportModel.AddNewMap(Class, TriggerEvent, Handler);//Add a new map to memory
        }
    }

    /**
     * @description return false if not success
     */
    LoadModules() {
        const ModulesList = this.#ExportModel.Css_Path;
        const HtmlHeader = document.getElementsByTagName('head')[0];

        ModulesList.forEach(e => {
            const Link = document.createElement('link');
            Link.rel = "stylesheet";
            Link.type = "text/css";
            Link.href = e;
            Link.media = 'all';
            
            HtmlHeader.appendChild(Link);

        });
    }

    RenderHTML(ParentClass = Element) { ///Rendering the html 
        if (ParentClass == Element) {
            ///Append html into the Parent class
            ParentClass.innerHTML = this.HTML;
        }
        else
        {
            document.body.innerHTML = this.HTML;
            ///append into the body
        }
    }; ///Render UI

    /**
     * the data return is for export to another modules 
     * @returns {UIDataModel}
     */

    ExportedData()
    {
        ///returning exported data model
        return this.#ExportModel
    }

    /**
     * 
     * @param {UIDataModel} Model
     * @returns PartialUI object
     */
    ImportData(Model = new UIDataModel)
    {
        ///**Importing stage*/
        this.HTML = Model.HTML;
        this.ClassCollection = Model.Classlist.slice();
        this.#ExportModel = Model;

        this.LoadModules(); ////Loading all the neccesary modules

        this.#InitilizeSetupAction();///Assignning element to event Service
        const Map = this.#ExportModel.Log;

        //**Mapping stage:*/

        Object.keys(Map).forEach(key => {///Searching through logs
            if (key !== "prototype")
            {
                let MapIndex = Map[key];//Maps values 
                this.On_Action(MapIndex.Target, MapIndex.EventName, MapIndex.Handler);//Map Target to action 
            }
        });


        return this; 
    }

}







