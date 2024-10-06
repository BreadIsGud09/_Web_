import * as UIModule from "../Lib/UI_Moduler.js";
import { Partial_ProjectDialog } from "../Scheduled-Page/Introduction_Page.js";
import {  Custom_UI_Event_Handler } from "../Lib/Calendar_lib.js";
import { Polling } from "../Lib/Communcation.js";

const Submit = document.querySelector(".Save-button");
const MainPageLayout = document.querySelector(".Main-Section");


const ProjectList = document.querySelectorAll(".Project_Layout");

const ProjectAction = new Custom_UI_Event_Handler(ProjectList, {
    Event_List: ["contextmenu","click"],
    Event_config: {}
});

const ProjectListID = [];

ProjectList.forEach(project => {
    ProjectListID.push(document.getElementById(project.id));
});///getting element based on IDs

const UserProjectEvent = new Custom_UI_Event_Handler();

const CreateNewProject = document.querySelector(".Create_Project");
var Project_Dialog = document.querySelector(".dialog");

///Partail container UI
const PartialUI = new UIModule.PartialUI();
const Dialog = PartialUI.ImportData(Partial_ProjectDialog);

let CurrentProjectElement;

document.addEventListener("DOMContentLoaded", () => {
    ////----Partial Dialog behavior-----\\\\\
    var Dialog_Click = Partial_ProjectDialog.GetGlobalHandler("Dialog_Click");///Access the global handler

    ContextMenuPartial.LoadModules();//loading css modules

    Dialog.NewClass = CreateNewProject///Set new class for the action 

    //------------\\

    ///Custom hevaior for project display element
    const OpenMenu = ProjectAction.EventMemory.find(e => e.type == "contextmenu");///ContextMenu action
    const CloseMenu = ProjectAction.EventMemory.find(e => e.type == "ExitMenu");///Exit menu
    const Target = ContextMenuPartial.ClassCollection.find((e => e.className == "Dropbox_container"));
    const TargetEditButton = ContextMenuPartial.ClassCollection.find(e => e.className == "EditContent");
    const TargetDeleteContent = ContextMenuPartial.ClassCollection.find(e => e.className == "DeleteContent");
    /**@type {HTMLDivElement}*/
    let CurrentProjectElement;

    let X = 0;
    let Y = 0;
    //--- Project Form declaration--\\
    const Dialog_Element = Dialog.ClassCollection.find(k => k.className == "dialog");

    const Project_Form = Dialog_Element.getElementsByClassName("Project-info")[0];

    /**@type {HTMLInputElement}*/
    let ProjectForm_Header = Project_Form.getElementsByTagName("INPUT").namedItem("P_Name");
    /**@type {HTMLInputElement}*/
    let ProjectForm_Body = Project_Form.getElementsByTagName("INPUT").namedItem("P_Description");
    /**@type {HTMLInputElement}*/
    let ProjectForm_Saving = Project_Form.getElementsByClassName("Save-button")[0];



    document.addEventListener("mousemove", (mouse) => { ///Capturing mouse position
        X = mouse.clientX + "px";
        Y = mouse.clientY + "px";
    });

    ContextMenuPartial.On_Action(Target, "Inactive", (e) => {
        if (Target.matches(":hover")) {///Checking the contextmenu is hovered
            return;
        }
        else {
            Target.style.visibility = "hidden";
        }///Checking if the element is being hovered
    });

    ContextMenuPartial.On_Action(Target, "Active", (e) => {///Set an event "Call" for UI
        Target.style.visibility = "visible";
        Target.style.top = Y;
        Target.style.left = X;

        ///Adjusting position at mouse position 
        console.log("Showed");
        console.log(X,Y);
    }, false);




    Dialog.On_Action(CreateNewProject, "click", (eventConfig) => {
        IsEditState = false;

        ProjectForm_Saving.setAttribute("type", "submit");///Set saving button type to "Button

        Dialog_Click.Caller();
    }, true);///Adding new Action


    ContextMenuPartial.On_Action(TargetEditButton, "click", (e) => { ///Editing project properties
        const AddedDialogElementAction = Partial_ProjectDialog.GetGlobalHandler("Dialog_Click");

        IsEditState = true;

        const SentModel = {
            Name: "",
            Description: ""
        }

        Partial_ProjectDialog.Classlist.find(e => e.className == "")
        AddedDialogElementAction.Caller(); ///Triggered the open dialog action


        if (CurrentProjectElement instanceof Element && CurrentProjectElement != null) {///Check if the current project element is found

            SentModel.Name = CurrentProjectElement.getElementsByClassName("P_Name")[0].innerHTML;
            SentModel.Description = CurrentProjectElement.getElementsByClassName("Description")[0].innerHTML;
        }

       
        ProjectForm_Saving.setAttribute("type", "button");///Set saving button type to "Button
        ProjectForm_Body.value = SentModel.Description;
        ProjectForm_Header.value = SentModel.Name; ///Set the modal to the Existing value

       
        ///Set the current open form to the current data that has been taken
        Dialog.NewClass = ProjectForm_Saving;


        Dialog.ClassCollection.push(ProjectForm_Header); //Pushing 
        Dialog.ClassCollection.push(ProjectForm_Body); ///Pushing

        Dialog.On_Action(ProjectForm_Header, "change", (e) => { ///Detect changes in the textbox
            if (IsEditState == false) { return; }
            SentModel.Name = e.target.value;
        }, true);

        Dialog.On_Action(ProjectForm_Body, "change", (e) => { ///Detect changes in the textbox
            if (IsEditState == false) { return; }
            SentModel.Description = e.target.value;
        },true)



        Dialog.On_Action(ProjectForm_Saving, "click", (e) => { ///when the user click saves make a request to the server
            if (IsEditState == false) { return; } //Active defualt action

            e.preventDefault();

            const UserProject = "";
            const cookieValue = document.cookie.split('=')[1];

            console.log(cookieValue);

            let ProjectInfoRequest = new Polling('https://localhost:7146/Project/YourProject/api/GetProject/' + cookieValue);

            var HasProjectRespone = ProjectInfoRequest.GetRequest();

            HasProjectRespone.then(list => {
                /**@type {{Name : "", Description : "",DateCreated : "", id : number, Owner : number, Task_List : [] }}*/
                const ProjectDataObject = list[0];
                console.log(ProjectDataObject);

                const UpdateProjectRequest = new Polling("https://localhost:7146/Project/YourProject/Update/" + ProjectDataObject.id); ///make an request
                const IsHaveRespone = UpdateProjectRequest.PostRequest(SentModel); ///Sending Post request and geting a respone

                /**@description Make changes on the server and retrived the updated model*/
                IsHaveRespone.then(value => { 
                    /**@type {{ Name : "",Description : "", DateCreated : "", id  : 0, Owner : 0}}*/
                    var Retrived = value
                    console.log(Retrived);


                    const ProjectName = CurrentProjectElement.getElementsByClassName("P_Name")[0];
                    const ProjectDescription = CurrentProjectElement.getElementsByClassName("Description")[0];

                    const Closing = Dialog.ClassCollection.find(e => e.className == "Cancel-icon");//Adding closingButton element 

                    Dialog.CallAction(Closing, "click");///Closing the Dialog

                    

                    ProjectName.textContent = Retrived.Name;
                    ProjectDescription.textContent = Retrived.Description;
                    ///Updating on client side
                });
               
            });
            
           
            console.log("Editing");

            //---After that perform sync data from the server to the client

        }, true);
    }, true);


    ContextMenuPartial.On_Action(TargetDeleteContent, "click", (e) => {
        IsEditState = true;

        console.log("Deleting project");
    });


    ProjectAction.AddHandlerToEvent(OpenMenu, (e) => {///Assigning the "Call" event to ProjectAction
        e.preventDefault();///prevent defualt action to occurs

        if (e.target instanceof Element) {
            CurrentProjectElement = e.target.parentElement;

            if (CurrentProjectElement.className !== "Project") {
                CurrentProjectElement = CurrentProjectElement.parentNode
            }
        }///Finding the "Project" element classname

        ContextMenuPartial.CallAction(Target, "Active");///Open the custom contextmenu 
        console.log("Context actived");
    }, false);

    Dialog.On_Action(CreateNewProject, "click", (eventConfig) => {
        IsEditState = false;

        Dialog_Click.Caller();
    }, true);///Adding new Action

    //------------\\

    ///Custom hevaior for project display element
    const OpenMenu = ProjectAction.EventMemory.find(e => e.type == "contextmenu");///ContextMenu action
    const CloseMenu = ProjectAction.EventMemory.find(e => e.type == "ExitMenu");///Exit menu
    const Target = ContextMenuPartial.ClassCollection.find((e => e.className == "Dropbox_container"));
    const TargetEditButton = ContextMenuPartial.ClassCollection.find(e => e.className == "EditContent");
    const TargetDeleteContent = ContextMenuPartial.ClassCollection.find(e => e.className == "DeleteContent");
    /**@type {HTMLDivElement}*/
    let CurrentProjectElement;

    let X = 0;
    let Y = 0;


    document.addEventListener("mousemove", (mouse) => { ///Capturing mouse position
        X = mouse.clientX + "px";
        Y = mouse.clientY + "px";
    });

    ContextMenuPartial.On_Action(Target, "Inactive", (e) => {
        if (Target.matches(":hover")) {///Checking the contextmenu is hovered
            return;
        }
        else {
            Target.style.visibility = "hidden";
        }///Checking if the element is being hovered
    });

    ContextMenuPartial.On_Action(Target, "Active", (e) => {///Set an event "Call" for UI
        Target.style.visibility = "visible";
        Target.style.top = Y;
        Target.style.left = X;

        ///Adjusting position at mouse position 
        console.log("Showed");
        console.log(X,Y);
    }, false);

    ContextMenuPartial.On_Action(TargetEditButton, "click", (e) => { ///Editing project properties
        const AddedDialogElementAction = Partial_ProjectDialog.GetGlobalHandler("Dialog_Click");

        IsEditState = true;

        const SentModel = {
            Name: "",
            Description: ""
        }

        Partial_ProjectDialog.Classlist.find(e => e.className == "")
        AddedDialogElementAction.Caller(); ///Triggered the open dialog action


        if (CurrentProjectElement instanceof Element && CurrentProjectElement != null) {///Check if the current project element is found

            SentModel.Name = CurrentProjectElement.getElementsByClassName("P_Name")[0].innerHTML;
            SentModel.Description = CurrentProjectElement.getElementsByClassName("Description")[0].innerHTML;
        }

        const Dialog_Element = Dialog.ClassCollection.find(k => k.className == "dialog");

        const Project_Form = Dialog_Element.getElementsByClassName("Project-info")[0];

        /**@type {HTMLInputElement}*/
        let ProjectForm_Header = Project_Form.getElementsByTagName("INPUT").namedItem("P_Name");
        /**@type {HTMLInputElement}*/
        let ProjectForm_Body = Project_Form.getElementsByTagName("INPUT").namedItem("P_Description");
        /**@type {HTMLInputElement}*/
        let ProjectForm_Saving = Project_Form.getElementsByClassName("Save-button")[0];

        ProjectForm_Saving.setAttribute("type", "button");///Set saving button type to "Button"
        ProjectForm_Body.value = SentModel.Description;
        ProjectForm_Header.value = SentModel.Name; ///Set the modal to the Existing value

       
        ///Set the current open form to the current data that has been taken
        Dialog.NewClass = ProjectForm_Saving;


        Dialog.ClassCollection.push(ProjectForm_Header); //Pushing 
        Dialog.ClassCollection.push(ProjectForm_Body); ///Pushing

        Dialog.On_Action(ProjectForm_Header, "change", (e) => { ///Detect changes in the textbox
            if (IsEditState == false) { return; }
            SentModel.Name = e.target.value;
        }, true);

        Dialog.On_Action(ProjectForm_Body, "change", (e) => { ///Detect changes in the textbox
            if (IsEditState == false) { return; }
            SentModel.Description = e.target.value;
        },true)



        Dialog.On_Action(ProjectForm_Saving, "click", (e) => { ///when the user click saves make a request to the server
            if (IsEditState == false) { return; } //Active defualt action

            e.preventDefault();

            const UserProject = "";
            const cookieValue = document.cookie.split('=')[1];

            console.log(cookieValue);

            let ProjectInfoRequest = new Polling('https://localhost:7146/Project/YourProject/api/GetProject/' + cookieValue);

            var HasProjectRespone = ProjectInfoRequest.GetRequest();

            HasProjectRespone.then(list => {
                /**@type {{Name : "", Description : "",DateCreated : "", id : number, Owner : number, Task_List : [] }}*/
                const ProjectDataObject = list[0];
                console.log(ProjectDataObject);

                const UpdateProjectRequest = new Polling("https://localhost:7146/Project/YourProject/Update/" + ProjectDataObject.id); ///make an request
                const IsHaveRespone = UpdateProjectRequest.PostRequest(SentModel); ///Sending Post request and geting a respone

                /**@description Make changes on the server and retrived the updated model*/
                IsHaveRespone.then(value => { 
                    /**@type {{ Name : "",Description : "", DateCreated : "", id  : 0, Owner : 0}}*/
                    var Retrived = value
                    console.log(Retrived);


                    const ProjectName = CurrentProjectElement.getElementsByClassName("P_Name")[0];
                    const ProjectDescription = CurrentProjectElement.getElementsByClassName("Description")[0];

                    const Closing = Dialog.ClassCollection.find(e => e.className == "Cancel-icon");//Adding closingButton element 

                    Dialog.CallAction(Closing, "click");///Closing the Dialog

                    

                    ProjectName.textContent = Retrived.Name;
                    ProjectDescription.textContent = Retrived.Description;
                    ///Updating on client side
                });
               
            });
            
           
            console.log("Editing");

            //---After that perform sync data from the server to the client

        }, true);
    }, true);


    ContextMenuPartial.On_Action(TargetDeleteContent, "click", (e) => {
        IsEditState = true;

        console.log("Deleting project");
    });


    ProjectAction.AddHandlerToEvent(OpenMenu, (e) => {///Assigning the "Call" event to ProjectAction
        e.preventDefault();///prevent defualt action to occurs

        if (e.target instanceof Element) {
            CurrentProjectElement = e.target.parentElement;

            if (CurrentProjectElement.className !== "Project") {
                CurrentProjectElement = CurrentProjectElement.parentNode
            }
        }///Finding the "Project" element classname

        ContextMenuPartial.CallAction(Target, "Active");///Open the custom contextmenu 
        console.log("Context actived");
    }, false);

    window.addEventListener("click", (e) => {
        ContextMenuPartial.CallAction(Target,"Inactive");// Disable the custom contextmenu
    });
});



