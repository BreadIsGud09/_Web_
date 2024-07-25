import * as UIModule from "../Lib/UI_Moduler.js";
import { Partial_ProjectDialog } from "../Scheduled-Page/Introduction_Page.js";
import {  Custom_UI_Event_Handler } from "../Lib/Calendar_lib.js";


const Submit = document.querySelector(".Save-button");
const MainPageLayout = document.querySelector(".Main-Section");

const ProjectList = document.querySelectorAll(".Project_Layout");

const ProjectListID = [];

ProjectList.forEach(project => {
    ProjectListID.push(document.getElementById(project.id));
});///getting element based on IDs 

const UserProjectEvent = new Custom_UI_Event_Handler();

const CreateNewProject = document.querySelector(".Create_Project");
var Project_Dialog = document.querySelector(".dialog");

///Container UI
const Dialog = new UIModule.PartialUI();

document.addEventListener("DOMContentLoaded", () =>
{
    var PartialDialog = Dialog.ImportData(Partial_ProjectDialog);///Import UI module
    
    var Dialog_Click = Partial_ProjectDialog.GetGlobalHandler("Dialog_Click");///Access the global handler

    PartialDialog.NewClass = CreateNewProject///Set new class for the action 
    
    PartialDialog.On_Action(CreateNewProject, "click", (eventConfig) => {
        Dialog_Click.Caller({ Project_Dialog });
    });///Adding new Action 

    console.log(PartialDialog);
});

