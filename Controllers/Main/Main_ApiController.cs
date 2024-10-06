using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol;
using System.Text.Json;
using System.Text.Json.Nodes;
using Web_demo.Models;
using Web_demo.Services;

namespace Web_demo.Controllers.Main
{
    public class Main_ApiController : Controller
    {
        private readonly IProject_Services Project_Services;
        private readonly IDB_Services User_dB_;
        private readonly ICookies_Handler Cookie_Handler;
        private readonly ITaskManager _taskManager;
        private readonly IHttpContextAccessor _HttpContextAccessor;


        public Main_ApiController(IProject_Services project_, IDB_Services user_dB_, ICookies_Handler cookies, IHttpContextAccessor httpContextAccessor, ITaskManager taskManager)
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

<<<<<<< HEAD

        [HttpGet]
        [Route("api/Task/{ProjectID}/{ProjectRootId}")]
        public async Task<IActionResult> GetUserTask([FromRoute] int ProjectID, [FromRoute] int ProjectRootId)
        {
            var SessionChecked = HttpContext.Session.GetInt32("User_ID");

            var Project_Result = Project_Services.GetProjectByID(ProjectID)[0];

            if (Project_Result is not null && SessionChecked is not null)
            {
                var UserTask_ = _taskManager.LoadUserTask(ProjectID);///get the user task


                var ToJson = UserTask_.Where<UserTask>(e => e.RootProject_ID == ProjectRootId).ToJson();

                return Ok(ToJson);
            }

            return Ok("Try again!");
        }


        [HttpGet]
        [Route("Project/YourProject/api/GetProject/{Cookies}")]
        public IActionResult GetProject([FromRoute] string Cookies)
        {
            Userinfo? Info = User_dB_.Verified_User_Cookies(Cookies);

            if (Info is not null)
            {
                var UserP = Project_Services.GetUserProject(Info.id);

                if (UserP.Any() == true)
                {
                    return Ok(UserP.ToJson());
                }

            }

            return Ok("");
        }

        [HttpGet]
        [Route("Project/YourProject/Access/Task/{ProjectID}")]
        public IActionResult AccessProject([FromRoute] int ProjectID)
        {
            var Verified = Project_Services.GetProjectByID(ProjectID)[0];

            if (Verified.id != 0)
            {
                return RedirectToAction("User_Task", "MainPage", new { ProjectID = ProjectID });
            }
            else {
                return Ok("Couln't find appropriate user");
            }

        }


=======
>>>>>>> parent of 9ba607d (beta edit mode on project)
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
                var Task = await _taskManager.CreateTaskModel(task_Model, ProjectID);////update the database 

                if (Task.RootProject_ID != 0)
                {
                    return RedirectToAction("User_Task", "MainPage", new { ProjectID = ProjectID });
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

        
        [HttpPost]
        [Route("Project/YourProject/Update/{ProjectID}")]
        
        public async Task<IActionResult> Modify_Project([FromRoute] int ProjectID, [FromBody] Project UpdatedProject) {

            var IsHaveLocalCookies = Cookie_Handler.Get_UserLocal_Cookies();////Request cookies on user machine
            var Local_User = User_dB_.Verified_User_Cookies(IsHaveLocalCookies);///Verified and return the userinfo if have

            var CurrentProject = Project_Services.GetProjectByID(ProjectID)[0];
            

            if (CurrentProject is not null && Local_User is not null)
            {
                //Perform changes from project to the database then return the full project properties
                var Updated = await Project_Services.UpdateModels(Local_User.id, ProjectID,
                    new Project()
                    {
                        Name = UpdatedProject.Name,
                        Description = UpdatedProject.Description
                    }); 

                if (Updated.DateCreated is not null)
                {
                    var Body = JsonSerializer.Serialize<Project>(Updated);

                    return Ok(Body); ///Return the UpdatedProject json
                }

            }
            return Ok("Could not find the project");
        }



    }
}
