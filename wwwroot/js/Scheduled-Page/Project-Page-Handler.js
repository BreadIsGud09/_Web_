import * as UIModule from "../Lib/UI_Moduler.js";
import { Partial_ProjectDialog } from "../Scheduled-Page/Introduction_Page.js";
import { Custom_UI_Event_Handler } from "../Lib/Calendar_lib.js";
import { Polling } from "../Lib/Communcation.js";

const Submit = document.querySelector(".Save-button");
const MainPageLayout = document.querySelector(".Main-Section");


const ProjectList = document.querySelectorAll(".Project_Layout");

const ProjectAction = new Custom_UI_Event_Handler(ProjectList, {
    Event_List: ["contextmenu"],
    Event_config: {}
});

const ProjectListID = [];

ProjectList.forEach(project => {
    ProjectListID.push(document.getElementById(project.id));
});///getting element based on IDs


//Declaring Dropbox Element\\\
/**@type {string}*/
const DropboxHtml = `<div class="Dropbox_container">
  <button class="EditContent">
    <h3 class="Drop_Box_Text">Edit</h3>
  </button>
  <button class="DeleteContent">
    <h3 class="Drop_Box_Text">Delete</h3>
  </button>
</div>`;
/**@type {HTMLDivElement}*/
const Dropbox = document.querySelector(".Dropbox_container");
/**@type {HTMLButtonElement}*/
const EditContentButton = document.querySelector(".EditContent");
/**@type {HTMLButtonElement}*/
const DeleteContentButton = document.querySelector(".DeleteContent");

let IsEditState = false;

const ContextMenuPartial = new UIModule.PartialUI(DropboxHtml, [Dropbox, EditContentButton, DeleteContentButton]);
let modules = ContextMenuPartial.ExportedData().CssModules = 'https://localhost:7146/css/Modules/Dropbox.css';

//-----\\

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

   /**@abstract make an custom API to server for creating new project*/
    /**@description this method serves creating new project*/
    Dialog.On_Action(CreateNewProject, "click", (eventConfig) => {
        if (IsEditState != false) { return }

        Dialog_Click.Caller();

        /**@type {HTMLDivElement}*/
        const DialogElement = Dialog.ClassCollection.find(e => e.className == "dialog");

        const Dialog_Element = Dialog.ClassCollection.find(k => k.className == "dialog");

        const Project_Form = Dialog_Element.getElementsByClassName("Project-info")[0];

        let ProjectForm_Saving = Project_Form.getElementsByClassName("Save-button")[0];

        ProjectForm_Saving.setAttribute("type","submit");

    }, true);


    //------------\\

    ///Custom hevaior for project display element
    const OpenMenu = ProjectAction.EventMemory.find(e => e.type == "contextmenu");///ContextMenu action
    const Target = ContextMenuPartial.ClassCollection.find((e => e.className == "Dropbox_container"));
    const TargetEditButton = ContextMenuPartial.ClassCollection.find(e => e.className == "EditContent");
    const TargetDeleteContent = ContextMenuPartial.ClassCollection.find(e => e.className == "DeleteContent");
    /**@type {HTMLDivElement}*/
    let CurrentProjectElement;

    let X = 0;
    let Y = 0;



    let SentModel = {
        Name: "",
        Description: ""
    }

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
        console.log(X, Y);
    }, false);



    /**@abstract trigger the target edit button and then set the edit mode to true*/
    /**@description comprises dependencies*/
    ContextMenuPartial.On_Action(TargetEditButton, "click", (e) => { ///Editing project properties
        const AddedDialogElementAction = Partial_ProjectDialog.GetGlobalHandler("Dialog_Click");

        IsEditState = true;

        Partial_ProjectDialog.Classlist.find(e => e.className == "")
        AddedDialogElementAction.Caller(); ///Triggered the open dialog action


        if (CurrentProjectElement != null) {///Check if the current project element is found

            SentModel.Name = CurrentProjectElement.getElementsByClassName("P_Name")[0].innerHTML;
            SentModel.Description = CurrentProjectElement.getElementsByClassName("Description")[0].innerHTML;
            console.log(CurrentProjectElement.getElementsByClassName("P_Name")[0].innerHTML, CurrentProjectElement.getElementsByClassName("Description")[0].innerHTML);
            console.log(SentModel);
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

            if(e.target.value != "") {
                SentModel.Name = e.target.value;
            }

            console.log(SentModel, CurrentProjectElement); 
        }, true);

        Dialog.On_Action(ProjectForm_Body, "change", (e) => { ///Detect changes in the textbox
            if (IsEditState == false) { return; }
            

            if (e.target.value != "") {
                SentModel.Description = e.target.value; ///Edited value
            }
            else {
                SentModel.Description = CurrentProjectElement.getElementsByClassName("Description")[0].innerHTML;
                console.log(CurrentProjectElement.getElementsByClassName("Description")[0].innerHTML);
            }
            
            
            console.log(SentModel);
        }, true)



        /**@abstract Send project changes to the server from client*/
        /**@description this saving method serves only for edit state*/
        Dialog.On_Action(ProjectForm_Saving, "click", (e) => { ///when the user click saves make a request to the server
            if (IsEditState == false) { return; } //Active defualt action

            if (CurrentProjectElement == null) { return }
            if (SentModel.Name == "" || SentModel.Description == "") { return }
            console.log(SentModel);
            e.preventDefault();

            /**@description The current project id*/
            let CurrentCommitProjectId = CurrentProjectElement.parentElement.parentElement.id;

            const UserProject = "";
            const cookieValue = document.cookie.split('=')[1];

            console.log(cookieValue);

            let ProjectInfoRequest = new Polling('https://localhost:7146/Project/YourProject/api/GetProject/' + cookieValue);


            /**@description Send a get requestt to endpoints to get entire project data*/
            var HasProjectRespone = ProjectInfoRequest.GetRequest();


            
            HasProjectRespone.then(list => {
                /**@type {[{Name : "", Description : "",DateCreated : "", id : number, Owner : number, Task_List : [] }]}*/
                const UserProjectList = list;


                /**@type {{Name : "", Description : "",DateCreated : "", id : number, Owner : number, Task_List : [] }}*/
                /**@description get the current editing project data*/
                var CurrentProject = UserProjectList.find(p => p.id == CurrentCommitProjectId);
                console.log(CurrentProject);
                console.log(SentModel);

                const UpdateProjectRequest = new Polling("https://localhost:7146/Project/YourProject/Update/" + CurrentProject.id); ///make a request

                /**@description send sentModel to the directory */
                const IsHaveRespone = UpdateProjectRequest.PostRequest(SentModel); 

                

                /**@description Make changes on the server and retrived the updated model*/
                IsHaveRespone.then(value => {
                    /**@type {{ Name : "",Description : "", DateCreated : "", id  : 0, Owner : 0}}*/
                    var Retrived = value
                    console.log(Retrived);


                    const ProjectName = CurrentProjectElement.getElementsByClassName("P_Name")[0];
                    const ProjectDescription = CurrentProjectElement.getElementsByClassName("Description")[0];

                    const Closing = Dialog.ClassCollection.find(e => e.className == "Cancel-icon");//Adding closingButton element 

                    Dialog.CallAction(Closing, "click");///Closing the Dialog action

                    ProjectName.textContent = Retrived.Name;
                    ProjectDescription.textContent = Retrived.Description;
                    
                    ///Updating on client side
                }).catch(e => {
                    console.log(e);
                });

            });


            console.log("Editing");

            //---After that perform sync data from the server to the client

            IsEditState = false;

            

        }, true);
    }, true);


    ContextMenuPartial.On_Action(TargetDeleteContent, "click", (e) => {
        IsEditState = true;


        

        console.log("Deleting project");
    });


    ProjectAction.AddHandlerToEvent(OpenMenu, (e) => {///Assigning the "Call" event to ProjectAction
        e.preventDefault();///prevent defualt action to occurs

        console.log(e.target);

        if (e.target instanceof Element) {
            CurrentProjectElement = e.target.parentElement;

            if (CurrentProjectElement.className !== "Project") {
                CurrentProjectElement = CurrentProjectElement.parentNode
            }
        }///Finding the "Project" element classname

        ContextMenuPartial.CallAction(Target, "Active");///Open the custom contextmenu 
        console.log("Context actived");
    }, false);

    window.addEventListener("click", (e) => { ///Access the project
        const ToPageRequest = new Polling();

        ContextMenuPartial.CallAction(Target, "Inactive");// Disable the custom contextmenu
    });
});


