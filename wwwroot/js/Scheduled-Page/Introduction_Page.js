import * as polling from "../Lib/Communcation.js";
import * as UIModule from "../Lib/UI_Moduler.js";

const DialogHTML = `
<div class="dialog">
  <button class="Cancel-icon">
    <img id="X-Icon" src="~/Images/x-regular-48.png">
  </button>

  <h1 class="Project-Header">Project Settings</h1>

  <div class="Sub-dialog">
    <form id="Project-info" method="post" asp-controller="MainPage" asp-action="Init_Project">
      <label class="Dialog-label">Name</label>

      <input autocomplete="off" required type="text" name="P_Name" id="Project-TextBox" class="Name_Box">

      <label class="Dialog-label">Description</label>

      <input autocomplete="off" required type="text" name="P_Description" id="Project-TextBox">

      <input class="Save-button" type="submit" value="Save">
    </form>
  </div>
</div>`;

const IshaveProject = new polling.Polling("YourProject/api/ProjectUser");

//const IsHaveProject = await IshaveProject.GetRequest();///Getting request from the server to validate

//console.log(IsHaveProject);

///this page only active when the user has no project or new to the web
const CreateNew_Project = document.querySelector("#Create-New-calendar");
const Submit = document.querySelector(".Save-button");
const MainPageLayout = document.querySelector(".Main-Section");
var CancelButton = document.querySelector(".Cancel-icon");
var Project_Dialog = document.querySelector(".dialog");
var Overlay = document.querySelector(".Overlay");


var ProjectForm = Project_Dialog.querySelector(".Sub-dialog");


const Pop_Project_Dialog = new UIModule.PartialUI(DialogHTML, [
    Project_Dialog,
    CreateNew_Project,
    CancelButton
]);///Creating new partialUI



var Dialog_Function = Pop_Project_Dialog.SetGlobalHandler("Dialog_Click", (Data = { Project_Dialog }) => {////Set new click action
    if (Data.Project_Dialog !== null) {
        Data.Project_Dialog.style.visibility = "visible";

        Data.Project_Dialog.style.animationName = 'scale-up-center';
        Data.Project_Dialog.style.animationDuration = '0.2s';
        Data.Project_Dialog.style.animationTimingFunction = 'cubic-bezier(0.785, 0.135, 0.150, 0.860';
        Data.Project_Dialog.style.animationDelay = '0.02s';
        Data.Project_Dialog.style.animationFillMode = 'both';

        Overlay.style.display = "block";
    }
});  ///Create a new global handler



document.addEventListener("DOMContentLoaded", () => {
    console.log(Dialog_Function);    

    Pop_Project_Dialog.On_Action(CreateNew_Project, "click", (EventDetails) => {
        console.log("Clicked");

        Dialog_Function.Caller({ Project_Dialog });///Calling the global handler 
    },true);///Action of project dialog


    Pop_Project_Dialog.On_Action(CancelButton, "click", () => {

        ///Refresh the content inside of the dialog input field and then set invisible

        console.log(ProjectForm);

        /**@type {HTMLInputElement}*/
        const DialogProjectHeader = ProjectForm.firstElementChild.children.namedItem("Project-Header-Content");

        /**@type {HTMLInputElement}*/
        const DIalogProjectBody = ProjectForm.firstElementChild.children.namedItem("Project-Body-Content");

        DialogProjectHeader.value = "";
        DIalogProjectBody.value = "";


        Project_Dialog.style.visibility = "hidden";
        Overlay.style.display = "none";
        Project_Dialog.style.animation = 'none';
    }, true);

});

export const Partial_ProjectDialog = Pop_Project_Dialog.ExportedData();///Exported the UI to another file