using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Web_demo.Models;
using Web_demo.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Session;
using Microsoft.EntityFrameworkCore.Internal;
using System.Net;
using Microsoft.VisualBasic;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using NuGet.Protocol;
using System.IdentityModel.Tokens.Jwt;
using System.Transactions;
using NuGet.Protocol.Plugins;


namespace RoutingTest.Controllers
{
    public class MainPageController : Controller
    {
        ICookies_Handler Ck_Handler;
        IDB_Services DB_Services;
        IProject_Services Project_Services;
        private readonly IHttpContextAccessor _HttpContextAccessor;

        public MainPageController(IHttpContextAccessor accessor,
            IDB_Services DBInject,
            ICookies_Handler Cookies_Inject,
            IProject_Services project_Services)
        {
            Ck_Handler = Cookies_Inject;
            _HttpContextAccessor = accessor;
            DB_Services = DBInject;
            Project_Services = project_Services;
        }
        /// <summary>
        ///     Using Componets
        /// </summary>

        [HttpGet]
        [Route("/Project")]
        public ActionResult Index()
        {
            ViewBag.OnPage = "First-Visited-Page";
            var Contxt = _HttpContextAccessor.HttpContext;
            string LocalCookies = Ck_Handler.Get_Cookies_Key();
            var IsHaveLocalCookies = Contxt.Request.Cookies[LocalCookies]; ////Request cookies on user machine
            
            List<Project> UserProject = new List<Project>(); //UserProject List

            if (IsHaveLocalCookies is not null) /// Get valid values
            {
                var Local_UserInfo = DB_Services.Verified_User_Cookies(IsHaveLocalCookies);///Verified

                if (Local_UserInfo != null)
                {
                    ViewBag.UserStatus = "Logged in"; ////set status
                    ViewBag.Username = Local_UserInfo.username;///Get username for page
                    ///Creating new Session "User_ID" for access id accross server 
                    Contxt.Session.SetInt32("User_ID", Local_UserInfo.id);

                    ///Loading Project if user have project
                    UserProject = Project_Services.GetUserProject(Local_UserInfo.id);
                    
                    if (UserProject.Any())
                    {
                        return RedirectToAction("User_Project_Section", "MainPage");///Redirect to the Main project page      
                    }

                    ViewBag.ToggleHeader = true; ///Toggle header 

                    return View();
                }
            }

            return RedirectToAction("Login","Visitor");
        }


        /// <summary>
        /// User project container page
        /// </summary>
        /// <returns>View with Project collection</returns>
        [HttpGet]
        [Route("Project/YourProject")]
        public IActionResult User_Project_Section()
        {
            var Contxt = _HttpContextAccessor.HttpContext;
            var UserSessionID = HttpContext.Session.GetInt32("User_ID");//Getting the Session saved on server 
            

            if (UserSessionID.HasValue)
            {
                var Project = Project_Services.GetUserProject(UserSessionID.Value);///Getting the user project 
                string LocalCookies = Ck_Handler.Get_Cookies_Key();
                var ClientCookies = Contxt.Request.Cookies[LocalCookies]; ////Request cookies on user machine

                var Local_User = DB_Services.Verified_User_Cookies(ClientCookies);///Verified

                if (Project.Any() == true && Local_User is not null) ///checking if the List has any project and prevent direct access
                {
                    ViewBag.Username = Local_User.username;
                    ViewBag.Status = Local_User.status;
                    ViewBag.ToggleHeader = true;

                    return View(Project);
                }
            }
            return RedirectToAction("Index", "Mainpage");
        }


        /// <summary>
        /// User project page 
        /// </summary>
        /// <param name="ProjectID"></param>
        [HttpGet]
        [Route("Project/YourProject/{ProjectID}")]
        public IActionResult User_Project(int ProjectID)
        {
            ///Checking for auth
            ///
            var UserSessionID = HttpContext.Session.GetInt32("User_ID");//Getting the Session saved on server 
            var User_Info = DB_Services.Get_UserInfo(UserSessionID.Value);
           
            if (User_Info is not null) {
                var UserProject_Collection = Project_Services.GetProjectByID(ProjectID).Where<Project>((p) => p.Owner == User_Info.id).ToList();

                if(UserProject_Collection.Any() == true)
                {
                    ViewBag.IsUsingProject = true;
                    ViewBag.ProjectID = ProjectID;///Set IDS
                    ViewData["username"] = User_Info.username;
                    ViewBag.IsUsingProject = true;
                    ViewBag.ToggleHeader = true;

                    return View(UserProject_Collection);
                }
                
            }

            return RedirectToAction("User_Project_Section","MainPage");///Redirect To container project id not match
        }


        [HttpGet]
        [Route("Project/YourProject/{ProjectID}/Calendar")]
        public IActionResult Calendar_Project_Section(int ProjectID)
        {
            ViewBag.OnPage = "Scheduled-Page";
            ////Load all current Project/display
            var Http_Context = _HttpContextAccessor.HttpContext;

            int? userID = HttpContext.Session.GetInt32("User_ID");///Accessing server Session ID
            Userinfo? Info = DB_Services.Get_UserInfo(userID.Value);///Requesting DB using ID

            if (Info is not null)
            {
                ViewBag.Username = Info.username;///passing the neccessary info to pages
            }
            else 
            {
                return RedirectToAction("Index", "MainPage");
            }

            ViewBag.ToggleHeader = false;

            return View();
        }
        /// <summary>
        /// Calendar page can only access thru a project
        /// 
        [HttpPost]
        [Route("Project/YourProject/Init_Project")]
        public async Task<IActionResult> Init_Project([FromForm] string P_Name, string P_Description)///Creating new project 
        {
            var Contxt = _HttpContextAccessor.HttpContext;
            string LocalCookies = Ck_Handler.Get_Cookies_Key();
            var IsHaveLocalCookies = Contxt.Request.Cookies[LocalCookies]; ////Request cookies on user machine
            
            var Local_User = DB_Services.Verified_User_Cookies(IsHaveLocalCookies);///Verified

            Project options = new Project()///Assign request to a new class
            {
                Name = P_Name,
                Description = P_Description,
            };
            //Creating a Project model samples for initialziing

            if (!(Local_User is null))///Checking if userSession still available
            {
                var CreatedProject = await Project_Services.Initialize_Project(Local_User.id,options);///Initialize project to the database 

                return RedirectToAction("User_Project_Section", "MainPage");//send to Action
            }
            else
            {
                return Ok("user Session expired");
            }   
        }

        [HttpGet]
        [Route("Project/YourProject/api/ProjectUser/{ProjectID}")]
        public IActionResult IsHaveProject(int? ProjectID) 
        {
            if (ProjectID.HasValue)///Checking by projectID instead of defualt user id checking methods 
            {
                List<Project> ProjectCollection = Project_Services.GetProjectByID(ProjectID.Value);///Get a collection which contains matched id project 

                return Ok(ProjectCollection[0].ToJson());
            }///return  the matching ID of the project (this only return singular project)

            var HttpCxt = _HttpContextAccessor.HttpContext;
            int? User_SessionId = HttpCxt.Session.GetInt32("User_ID");////Getting user cookies

            if (User_SessionId != null)
            {
                List<Project> UserProjectApi = Project_Services.GetUserProject(User_SessionId.Value);
                var ToJson = JsonSerializer.Serialize(UserProjectApi);

                return Ok(ToJson);///Returnning a JSON which have all the project the user currentlly have 
            }
            else {
                return Ok(null);
            }
        }
    }
}