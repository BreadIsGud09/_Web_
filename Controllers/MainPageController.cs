using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Web_demo.Models;
using Web_demo.Services;

namespace RoutingTest.Controllers
{
    public class MainPageController : Controller
    {
    // GET: MainPage
        [HttpGet]
        [Route("Project/YourProject/{user?}")]
        public ActionResult Index(userinfo user)///Main field
        {
            int? ID = user.id;
            IDB_Services dB_Services;///Loading user project
            

            if(ID.HasValue) /// Get valid values
            {
                ViewBag.UserStatus = "Logged in"; ////set status
                ViewBag.Username = user.username;///Get username for page
            }
            else if(ID == null)
            {
                return RedirectToAction("Index","Visitor");
            }
            
            return View();
        }

        public ActionResult Calendar() ///calendar Section button
        { 
            ///Load project filed////
            ///

            //Operation filed///

            return View();
        }

    }
}