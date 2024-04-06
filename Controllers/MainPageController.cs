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
        [Route("Project/YourProject")]
        public ActionResult Index()///Main Project Page
        {
            ViewBag.OnPage = "First-Visited-Page";

            var Contxt = _HttpContextAccessor.HttpContext;
            string LocalCookies = Ck_Handler.Get_Cookies_Key();
            var IsHaveLocalCookies = Contxt.Request.Cookies[LocalCookies]; ////Request cookies on user machine

            List<Project> UserProject = new List<Project>(); //UserProject 


            if (!(IsHaveLocalCookies is null)) /// Get valid values
            {
                var Local_UserInfo = DB_Services.Verified_User_Cookies(IsHaveLocalCookies);///Verified
                

                if (Local_UserInfo != null)
                {
                    ///Loading Project if user have project
                     UserProject = Project_Services.GetUserProject(Local_UserInfo.id);

                    ///Creating new Session
                    Contxt.Session.SetInt32("User_ID", Local_UserInfo.id);
                    ViewBag.UserStatus = "Logged in"; ////set status
                    ViewBag.Username = Local_UserInfo.username;///Get username for page
                    ///
                }
            }
            else //Return to the Visitor pages
            {
                return RedirectToAction("Index","Visitor");
            }
            
            return View(UserProject);
        }
        /// <summary>
        /// Main project section
        /// </summary>
        /// <returns></returns>


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
        public IActionResult Init_Project([FromForm] string P_Name, string P_Description)
        {
            var HttpCxt = _HttpContextAccessor.HttpContext;
            int? User_SessionId = HttpCxt.Session.GetInt32("User_ID");////Getting user cookies

            Project options = new Project()///Assign request to a new class
            {
                Name = P_Name,
                Description = P_Description,
            };
            //Creating a Project model samples for initialziing

            if (!(User_SessionId is null))
            {
                Project_Services.Initialize_Project(User_SessionId.Value,options);///Initialize project

                return RedirectToAction("Index");
            }
            else
            {
                return Ok("user Session expired");
            }
        }
        ///<summary>
        ///Task manager page can only access thru a project

    }
}