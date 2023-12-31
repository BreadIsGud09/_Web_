﻿using System;
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
        /// <summary>
        ///     Using Componets
        /// </summary>
       

        [HttpGet]
        [Route("Project/YourProject")]
        public ActionResult Index()///Main Project Page
        {
            ViewBag.OnPage = "First-Visited-Page";
            ViewBag.IsHasProject = false;
            var Contxt = _HttpContextAccessor.HttpContext;
            string LocalCookies = Ck_Handler.Get_Cookies_Key();
            var IsHaveLocalCookies = Contxt.Request.Cookies[LocalCookies]; ////Request cookies on user machine

            if(!(IsHaveLocalCookies is null)) /// Get valid values
            {
                var Local_UserInfo = DB_Services.Verified_User_Cookies(IsHaveLocalCookies);///Verified
                if( Local_UserInfo != null) 
                {
                    ///Loading Project if user have project
                   
                    ///
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
            userinfo? Info = DB_Services.Get_UserInfo(userID.Value);

            if (Info is userinfo)
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
        [HttpGet]
        [Route("Project/YourProject/TaskManager")]
        public IActionResult TaskManager_Project_Section()
        {   


            return View();
        }
        ///<summary>
        ///Task manager page can only access thru a project

    }
}