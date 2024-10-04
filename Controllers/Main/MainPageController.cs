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


namespace Web_demo.Controllers.Main
{
    public class MainPageController : Controller
    {
        ICookies_Handler Ck_Handler;
        IDB_Services DB_Services;
        IProject_Services Project_Services;
        private readonly IHttpContextAccessor _HttpContextAccessor;
        ITaskManager _taskManager;


        public MainPageController(IHttpContextAccessor accessor,
            IDB_Services DBInject,
            ICookies_Handler Cookies_Inject,
            IProject_Services project_Services,
            ITaskManager taskManager)
        {
            Ck_Handler = Cookies_Inject;
            _HttpContextAccessor = accessor;
            DB_Services = DBInject;
            Project_Services = project_Services;
            _taskManager = taskManager;
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
            var IsHaveLocalCookies = Ck_Handler.Get_UserLocal_Cookies();

            List<Project> UserProject = new List<Project>(); //UserProject List

            if (IsHaveLocalCookies is not null) /// Get valid values
            {
                var Local_UserInfo = DB_Services.Verified_User_Cookies(IsHaveLocalCookies);///Verified user cookies for direct access in url 

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

            return RedirectToAction("Login", "Visitor");
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

                var ClientCookies = Ck_Handler.Get_UserLocal_Cookies();

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
        /// User task collection page
        /// </summary>
        /// <param name="ProjectID"></param>
        [HttpGet]
        [Route("Project/YourProject/{ProjectID}/Task")]
        public IActionResult User_Task([FromRoute] int ProjectID)
        {
            ///Checking for auth
            ///loading task from project
            var UserSessionID = HttpContext.Session.GetInt32("User_ID");//Getting the Session saved on server 
            var User_Info = DB_Services.Get_UserInfo(UserSessionID.Value);

            string Local = Ck_Handler.Get_UserLocal_Cookies();


            if (User_Info is not null && Local is not "")
            {
                var UserProject_Collection = Project_Services.GetProjectByID(ProjectID).Where((p) => p.Owner == User_Info.id).ToList();

                if (UserProject_Collection.Any() == true)
                {
                    ViewBag.IsUsingProject = true;
                    ViewBag.ProjectID = ProjectID;///Set IDS
                    ViewData["username"] = User_Info.username;
                    ViewBag.IsUsingProject = true;
                    ViewBag.ToggleHeader = true;


                    return View(UserProject_Collection);
                }

            }

            return RedirectToAction("User_Project_Section", "MainPage");///Redirect To container project id not match
        }


        [HttpGet]
        [Route("Project/YourProject/{ProjectID}/Calendar")]
        public IActionResult Calendar_Project_Section(int ProjectID)
        {
            ViewBag.OnPage = "Scheduled-Page";
            ////Load all current Project/display
            var Http_Context = _HttpContextAccessor.HttpContext;
            string ClientCookies = Ck_Handler.Get_UserLocal_Cookies();
            var P_Model = Project_Services.GetProjectByID(ProjectID);


            int? userID = HttpContext.Session.GetInt32("User_ID");///Accessing server Session ID
            Userinfo? Info = DB_Services.Get_UserInfo(userID.Value);///Requesting DB using ID

            if (Info is not null && ClientCookies is not "")
            {
                ViewBag.Username = Info.username;///passing the neccessary info to pages
            }
            else
            {
                return RedirectToAction("Index", "MainPage");
            }

            ViewBag.ToggleHeader = false;
            ViewBag.IsUsingProject = true;
            ViewBag.ProjectId = ProjectID;

            return View(P_Model);
        }
    }
}