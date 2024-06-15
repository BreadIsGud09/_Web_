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

            if (!(IsHaveLocalCookies is null)) /// Get valid values
            {
                var Local_UserInfo = DB_Services.Verified_User_Cookies(IsHaveLocalCookies);///Verified


                if (Local_UserInfo != null)
                {
                    ///Loading Project if user have project
                    UserProject = Project_Services.GetUserProject(Local_UserInfo.id);

                    if (UserProject.Any() != false) { 
                        ///Creating new Session
                        Contxt.Session.SetInt32("User_ID", Local_UserInfo.id);
                        ViewBag.UserStatus = "Logged in"; ////set status
                        ViewBag.Username = Local_UserInfo.username;///Get username for page


                        return RedirectToAction("User_Project_Section", "MainPage", UserProject);///Redirect to the Main project page      
                    }

                }
            }


            return View();
        }

        [HttpGet]
        [Route("Project/YourProject/{UserID}")]
        public IActionResult User_Project_Section(int UserID)
        {
            var Project = Project_Services.GetUserProject(UserID);///Getting the user project 


            if (Project.Any() == true) ///checking if the List has any project
            {
                return View(Project);
            }
            else
            {
                return RedirectToAction("Index","Mainpage");
            }
        }


        [HttpGet]
        [Route("Project/YourProject/Calendar")]
        public IActionResult Calendar_Project_Section()
        {
            ViewBag.OnPage = "Scheduled-Page";
            ////Load all current Project/display
            var Http_Context = _HttpContextAccessor.HttpContext;

            int? userID = HttpContext.Session.GetInt32("User_ID");
            Userinfo? Info = DB_Services.Get_UserInfo(userID.Value);

            if (Info is Userinfo)
            {
                ViewBag.Username = Info.username;///passing the neccessary info to pages
            }
            else 
            {
                return RedirectToAction("Index", "MainPage");
            }
            
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
                await Project_Services.Initialize_Project(Local_User.id,options);///Initialize project to the database 
            
                
                return RedirectToAction("User_Project_Section", "MainPage", new { UserID = Local_User.id });//send to Action
            }
            else
            {
                return Ok("user Session expired");
            }
        }

        [HttpGet]
        [Route("Project/YourProject/api/ProjectUser")]
        public IActionResult IsHaveProject() 
        {
            var HttpCxt = _HttpContextAccessor.HttpContext;
            int? User_SessionId = HttpCxt.Session.GetInt32("User_ID");////Getting user cookies

            if (User_SessionId != null)
            {
                List<Project> UserProjectApi = Project_Services.GetUserProject(User_SessionId.Value);
                var ToJson = JsonSerializer.Serialize(UserProjectApi);

                return Ok(ToJson);///Returnning a JSON string 
            }
            else {
                return Ok(null);
            }
        }
    }
}