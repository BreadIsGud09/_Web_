import * as Polling from '../Lib/Communcation.js';
import * as Partial from '../Lib/UI_Moduler.js';
 


let DialogHtml =`<div class="Task_dialog">
  <div class="Task-Sub-dialog">
    <form class="dialog_Form" id="Task-info" method="post" asp-controller="Main_Api" asp-action="CreateNewTask?ProjectID=@Model[0].id">
      <button class="Cancel-icon">
        <img id="X-Icon" src="~/Images/x-regular-48.png">
      </button>

      <div class="Portions_Container">
        <input type="text" maxlength="50" class="Task_TextBox_Header" placeholder="Untitled" required autocomplete="off" id="Text-Box-Header">
      </div>

      <div class="Atributes_Container">
        <div class="Atributes_">
          <label class="Task-Dialog-label">Tags: </label>
          <input type="text" maxlength="20" class="Tags_Selection" autocomplete="off" required id="Text-Box-Tags">
        </div>

        <div class="Atributes_">
          <label class="Task-Dialog-label">Due-date:</label>
          <input autocomplete="off" class="DueDate_Box" required type="date" name="Task-due-date" id="Task-TextBox">
        </div>
      </div>

      <div class="Main_Description_Container">
        <textarea rows="50" cols="100" id="Task-TextBox-Description" placeholder="Your ideas start here" required name="Task_Content"></textarea>
      </div>

      <input class="Task-Save-button" type="submit" value="Save">
    </form>
  </div>
</div>`


const Task_Dialog_Obj = {
    Dialog: document.querySelector(".Task_dialog"),
    Header: document.querySelector(".Task_TextBox_Header"),
    Tags: document.querySelector(".Tags_Selection"),
    Duedate: document.querySelector(".DueDate_Box"),
    Body: document.getElementById("Task-TextBox-Description")
}

const Task_TemplateObj = {
    Template: document.querySelector(".Tag_Template"),
    Header: document.querySelector(".Task_Template_Header"),
    Properties: [document.querySelectorAll(".Properties")],
};

const Request = new Polling.Polling("");


/**@type {HTMLDivElement} */
const Dialog_ClosingAction = document.querySelector(".Cancel-icon");
/**@type {HTMLDivElement}*/
const Dialog_Triggered_Button = document.querySelector(".CreateNewTask");
/**@type {HTMLButtonElement}*/
const Dialog_SaveButton = document.querySelector(".Task-Save-button");
/**@type {HTMLFormElement}*/
const Task_Form = document.getElementById("Task-info");
/**@type {HTMLDivElement}*/
const Task_Container_ = document.querySelector(".Task_Container");

const DialogAction = new Partial.PartialUI(DialogHtml, [
    Task_Dialog_Obj.Dialog,
    Dialog_ClosingAction,
    Dialog_Triggered_Button,
    Task_Form
]);

const TaskTemplateModel = new Partial.UIDataModel("",
    [document.querySelector(".Tag_Template"),
    document.querySelector(".Task_Template_Header"),
    document.querySelectorAll(".Properties")],
    ["click"],
    (e = new CustomEvent()) => { }
);


const DialogModel = new Partial.UIDataModel(
    "",
    [document.querySelector(".Task_dialog"),
    document.querySelector(".Task_TextBox_Header"),
    document.querySelector(".Tags_Selection"),
    document.querySelector(".DueDate_Box"),
    document.getElementById("Task-TextBox-Description")],
    ["click", "change"],
    (e = new CustomEvent()) => { }
);


const DialogHandler = new Partial.PartialUI();
DialogHandler.ImportData(DialogModel);

DialogHandler.On_Action(DialogHandler.ClassCollection.find((e) => e.classname == "Task_TextBox_Header"),
    "change",
    (e = new CustomEvent()) => {
        alert("input change");
    }
);


DialogAction.On_Action(Dialog_Triggered_Button, "click", (e = new CustomEvent()) => {
    Task_Dialog_Obj.Dialog.style.transform = "translate(48%,-5%)";
    
});///Openning Dialog Action

DialogAction.On_Action(Dialog_ClosingAction, "click", (e = new CustomEvent()) => {
    e.preventDefault();//Preventing from submitting to the server
    Task_Dialog_Obj.Dialog.style.transform = "translate(150%,-5%)";
});///Closing Dialog action

var Pid = Task_TemplateObj.Template.getAttribute('data-projectid');
var RootId = Task_TemplateObj.Template.getAttribute('data-rootprojectid');

Request.NewDirectory = 'https://localhost:7146/api/Task/' + Pid + '/' + RootId;

Task_TemplateObj.Template.addEventListener("click", (e) => { ///retrive data from endpoints for accessing the task
    const data = Request.GetRequest() 
        .then(a => {
            var Retrive_Template = a[0];

            Task_Dialog_Obj.Dialog.style.transform = "translate(48%,25%)";
            ///Filling the form data
            
            Task_Dialog_Obj.Header.value = Retrive_Template.Name;
            Task_Dialog_Obj.Tags.value = Retrive_Template.Tags;
            Task_Dialog_Obj.Duedate.value = Retrive_Template.Due_Date;
            Task_Dialog_Obj.Body.innerHTML = Retrive_Template.Content;
            ///**Listen for anychanges in the task*/



            console.log(Task_Dialog_Obj);
            console.log(Retrive_Template,a);
        });
    console.log(data);
});





