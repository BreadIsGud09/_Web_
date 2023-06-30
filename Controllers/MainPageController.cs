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
        public ActionResult Index(userinfo user)
        {
            if(user.email != null) 
            {
                ViewBag.UserStatus = "Logged in";
            }
            else
            {
                return RedirectToAction("Index","Visitor");
            }
            
            return View();
        }
    }
}