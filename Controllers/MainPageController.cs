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

namespace RoutingTest.Controllers
{
    public class MainPageController : Controller
    {
        ICookies_Handler Ck_Handler;
        IDB_Services DB_Services;
        private readonly IHttpContextAccessor _HttpContextAccessor;
        
        public MainPageController(IHttpContextAccessor accessor,IDB_Services DBInject,ICookies_Handler Cookies_Inject)
        {
            Ck_Handler = Cookies_Inject;
            _HttpContextAccessor = accessor;
            DB_Services = DBInject;
        }


        [HttpGet]
        [Route("Project/YourProject")]
        public ActionResult Index()
        {
            ViewBag.OnPage = "First-Visited-Page";
            var Contxt = _HttpContextAccessor.HttpContext;
            string LocalCookies = Ck_Handler.Get_Cookies_Key();
            var IsHaveLocalCookies = Contxt.Request.Cookies[LocalCookies]; 

            if(!(IsHaveLocalCookies is null)) /// Get valid values
            {
                var Local_UserInfo = DB_Services.Verified_User_Cookies(IsHaveLocalCookies);
                if( Local_UserInfo != null) 
                {
                    Contxt.Session.SetInt32("User_ID", Local_UserInfo.id);
                    ViewBag.UserStatus = "Logged in"; ////set status
                    ViewBag.Username = Local_UserInfo.username;///Get username for page
                }
            }
            else //Return to the Visitor pages
            {
                return RedirectToAction("Index","Visitor");
            }
            
            return View();
        }



        [HttpGet]
        [Route("Project/YourProject/Calendar")]
        public IActionResult Calendar_Project_Section()
        {
    
            ViewBag.OnPage = "Scheduled-Page";
            ////Load all current Project/display
            var Http_Context = _HttpContextAccessor.HttpContext;

            int? userID = HttpContext.Session.GetInt32("User_ID");
            userinfo? Info = DB_Services.Get_UserInfo(userID.Value);

            if (Info is userinfo)
            {
                ViewBag.Username = Info.username;
            }
            else 
            {
                return RedirectToAction("Index", "MainPage");
            }
            
            return View();
        }
    }
}