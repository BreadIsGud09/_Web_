using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Evaluation;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using NuGet.Protocol;
using System.Text.Json;
using Web_demo.Models;
using Web_demo.Services;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Web_demo.Controllers.Main
{
    public class Main_ApiController : Controller
    {
        private readonly IProject_Services Project_Services;
        private readonly IDB_Services User_dB_;
        private readonly ICookies_Handler Cookie_Handler;
        private readonly ITaskManager _taskManager;
        private readonly IHttpContextAccessor _HttpContextAccessor;


        public Main_ApiController(IProject_Services project_, IDB_Services user_dB_, ICookies_Handler cookies, IHttpContextAccessor httpContextAccessor,ITaskManager taskManager)
        {
            Project_Services = project_;
            User_dB_ = user_dB_;
            Cookie_Handler = cookies;
            _HttpContextAccessor = httpContextAccessor;
            _taskManager = taskManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("Project/YourProject/api/Task/{ProjectID}")]
        public async Task<IActionResult> CreateNewTask([FromRoute] int ProjectID, [FromForm] string Task_Name, [FromForm] string TagName, [FromForm] string Task_Duedate, [FromForm] string Task_Content)
        {



            var task_Model = new UserTask()
            {
                Name = Task_Name,
                Content = Task_Content,
                Due_Date = Task_Duedate,
                Tags = TagName
            };
            
            var UserSessionID = HttpContext.Session.GetInt32("User_ID");//Getting the Session saved on server 

            if (UserSessionID != null)//Check session 
            {

                var Task = await _taskManager.CreateTaskModel(task_Model, ProjectID);

                if (Task.RootProject_ID != 0)
                {
                    return RedirectToAction("User_Task", "MainPage",new { ProjectID = ProjectID });
                }
            }
            
            return Ok("try again");
        }


        [HttpGet]
        [Route("Project/YourProject/api/ProjectUser/{ProjectID}")]
        public IActionResult IsHaveProject(int? ProjectID)
        {
            if (ProjectID.HasValue)///Checking by projectID instead of defualt user id checking methods 
            {
                List<Models.Project> ProjectCollection = Project_Services.GetProjectByID(ProjectID.Value);///Get a collection which contains matched id project 

                return Ok(ProjectCollection[0].ToJson());
            }///return  the matching ID of the project (this only return singular project)

            var HttpCxt = _HttpContextAccessor.HttpContext;
            int? User_SessionId = HttpCxt.Session.GetInt32("User_ID");////Getting user cookies

            if (User_SessionId != null)
            {
                List<Models.Project> UserProjectApi = Project_Services.GetUserProject(User_SessionId.Value);
                var ToJson = JsonSerializer.Serialize(UserProjectApi);

                return Ok(ToJson);///Returnning a JSON which have all the project the user currentlly have 
            }
            else
            {
                return Ok(null);
            }
        }

        /// <summary>
        /// Calendar page can only access thru a project
        /// 
        [HttpPost]
        [Route("Project/YourProject/Init_Project")]
        public async Task<IActionResult> Init_Project([FromForm] string P_Name, string P_Description)///Creating new project 
        {
            var IsHaveLocalCookies = Cookie_Handler.Get_UserLocal_Cookies();////Request cookies on user machine

            var Local_User = User_dB_.Verified_User_Cookies(IsHaveLocalCookies);///Verified

            Models.Project options = new Models.Project()///Assign request to a new class
            {
                Name = P_Name,
                Description = P_Description,
            };
            //Creating a Project model samples for initialziing

            if (!(Local_User is null))///Checking if userSession still available
            {
                var CreatedProject = await Project_Services.Initialize_Project(Local_User.id, options);///Initialize project to the database 

                return RedirectToAction("User_Project_Section", "MainPage");//send to Action
            }
            else
            {
                return Ok("user Session expired");
            }
        }


    }
}
