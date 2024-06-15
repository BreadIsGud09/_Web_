import * as CustomUIEvent from "../Lib/Calendar_lib.js";


export class UIDataModel {
    HTML = ""; ///html
    #ActionClass = [Element];///CSS class
    #ActionList = [''];///action List
    #Handler = [];

    #ActionLog = {
        prototype: {
            Target: Element,
            EventName: "",
            Handler: (EventData = CustomEvent) => { }
        }
    };

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

    get Log()
    {
        return this.#ActionLog;
    }

    get Classlist()
    {
        return this.#ActionClass;
    }

    set Class(E = Element)///set new value to the memory
    {
        this.#ActionClass.push(E);
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

    AddNewMap(E = Element, event = "", Handler = () => { }) {///Addding a new map clues to the memory
        ///create an indentifier
        let identifer = 0;
        const Map_Clues = this.#CreateMapPoints(E, event,Handler);///will return a data map for pushing into log object

        this.#ActionLog["Log " + identifer] = Map_Clues;///Creating a new map object by the event name
        return Map_Clues;
    }
}



export class PartialUI  ///Only available for html and js
{
    HTML = "";
    ClassCollection = [];///Class involve in the UI
    #Action_Service;
    #ExportModel;
    

    constructor(html = "", CSS_ClassName = [Element]) {
        this.HTML = html;
        this.ClassCollection = CSS_ClassName;
        this.#Action_Service = new CustomUIEvent.Custom_UI_Event_Handler();///using service
        this.#ExportModel = new UIDataModel(html, this.ClassCollection);


        this.#InitilizeSetupAction();///Initilize event service for Class collection
    }

    set NewClass(Class = Element) {///Set in a new class to the ClassCollection
        this.ClassCollection.push(Class);
        this.#InitilizeSetupAction();///Runs the event services for class;
    }

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
                this.ClassCollection.splice(index,1);///remove the null out of the element 
            }
        });
    }

    CallAction(ClassName = Element)///Calling the action directly without listenner
    {
        const IndexOfClass = this.ClassCollection.indexOf(ClassName);
        const EventObj = this.#Action_Service.EventMemory.find((act) => act.classname === ClassName.classname);

        this.#Action_Service.Call_Event(IndexOfClass, EventObj); ///executing the event         
    }

    /**
     * 
     * @param {Element} ClassName
     * @param {string} TriggerEvent
     * @param {Function} Handler
     * Method map action to the element exsiting in the memory 
     */
    On_Action(ClassName = Element, TriggerEvent = "", Handler = () => { })
    {
        const IndexOfClass = this.ClassCollection.indexOf(ClassName);

        if (IndexOfClass !== -1)///Exsiting in the memory?
        {
            this.#Action_Service.ListenOn(this.ClassCollection[IndexOfClass], TriggerEvent, Handler); ///Mapping event to Class
            this.#ExportModel.AddNewMap(ClassName, TriggerEvent, Handler);//Add a new map to memory 
        }
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







