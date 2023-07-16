using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Web_demo.Models;

namespace RoutingTest.Controllers
{
    public class MainPageController : Controller
    {
        // GET: MainPage
        
        public ActionResult Index(userinfo user)///Main field
        {
            int? ID = user.id;

            if(ID.HasValue) 
            {
                ViewBag.UserStatus = "Logged in";
                ViewBag.Username = user.username;
            }
            else if(ID == null)
            {
                return RedirectToAction("Index","Visitor");
            }
            
            return View();
        }
    }
}