import { Client_Signal } from "../Lib/Communcation.js";

///this page only active when the user has no project or new to the web
const CreateNew_Project = document.querySelector("#Create-New-calendar");
var Project_Dialog = document.querySelector(".dialog");
var Overlay = document.querySelector(".Overlay");
var CancelButton = document.querySelector(".Cancel-icon");

document.addEventListener("DOMContentLoaded",() => {
    CreateNew_Project.addEventListener("click", () => { ///Appears UI
        Project_Dialog.style.visibility = "visible";
        
        Project_Dialog.style.animationName = 'scale-up-center';
        Project_Dialog.style.animationDuration = '0.2s';
        Project_Dialog.style.animationTimingFunction = 'cubic-bezier(0.785, 0.135, 0.150, 0.860';
        Project_Dialog.style.animationDelay = '0.02s';
        Project_Dialog.style.animationFillMode = 'both';
        

        Overlay.style.display = "block";
    });

    CancelButton.addEventListener("click", () => {
        Project_Dialog.style.visibility = "hidden";
        Overlay.style.display = "none";
        Project_Dialog.style.animation = 'none';
    })
});

