import * as polling from "../Lib/Communcation.js";
import * as UIModule from "../Lib/UI_Moduler.js";
import { Partial_ProjectDialog } from "../Scheduled-Page/Introduction_Page.js";

const Submit = document.querySelector(".Save-button");
const MainPageLayout = document.querySelector(".Main-Section");
const Project_ = document.querySelector(".Access");
const CreateNewProject = document.querySelector(".Create_Project");
///Container UI
const Dialog = new UIModule.PartialUI();

document.addEventListener("DOMContentLoaded", () => {

    var PartialDialog = Dialog.ImportData(Partial_ProjectDialog);///Import UI module

    console.log(PartialDialog);

    Project_.addEventListener("click", () => {
        ///Project accessor
        const Request = new polling.Polling();
        console.log("init request");



    });///Accessing the project workflow
});


