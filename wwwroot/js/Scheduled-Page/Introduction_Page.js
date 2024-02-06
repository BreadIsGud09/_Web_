import { Client_Signal } from "./Lib/Communcation.js";

///this page only active when the user has no project or new to the web
const CreateNew_Project = document.querySelector("#Create-New-calendar");
var Project_Dialog = document.querySelector(".dialog");

document.addEventListener("DOMContentLoaded",() => {
    CreateNew_Project.addEventListener("click",() => { ///Appears UI
        Project_Dialog.style.visibility = "visible";
    });
});

