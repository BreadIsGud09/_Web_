import * as Partial from '../Lib/UI_Moduler.js';
import * as  Polling from '../Lib/Communcation.js';


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
</div>`;
/**@type {HTMLDivElement} */
let Task_Dialog = document.querySelector(".Task_dialog");

/**@type {HTMLDivElement} */
const Dialog_ClosingAction = document.querySelector(".Cancel-icon");
/**@type {HTMLDivElement}*/
const Dialog_Triggered_Button = document.querySelector(".CreateNewTask");
/**@type {HTMLButtonElement}*/
const Dialog_SaveButton = document.querySelector(".Task-Save-button");
/**@type {HTMLFormElement}*/
const Task_Form = document.getElementById("Task-info");


///Transfer the form request 
const Form_Request = new Polling.Polling();
const RequestProjectId = new Polling.Polling();
const Form_Json = {} ;


const DialogAction = new Partial.PartialUI(DialogHtml, [
    Task_Dialog,
    Dialog_ClosingAction,
    Dialog_Triggered_Button,
    Task_Form
]);




DialogAction.On_Action(Dialog_Triggered_Button, "click", (e) => {
    Task_Dialog.style.transform = "translate(48%,-5%)";
    
});///Openning Action

DialogAction.On_Action(Dialog_ClosingAction, "click", (e) => {
    Task_Dialog.style.transform = "translate(150%,-5%)";


});///Closing action



