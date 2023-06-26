using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Data;
using Web_demo.Models;

namespace RoutingTest.Controllers
{
    public class VisitorController : Controller
    {
        User_DB UserProfile = new User_DB();

        public IActionResult Index(bool? status)
        {
            if (status is true && status.HasValue)
            {
                ViewBag.UserStatus = "Logged in";
                
                
                return RedirectToAction("Index", "MainPage", new { user_state = "Logged in" });
            }
            else
            {
                ViewBag.UserStatus = "Visitor";
            }

            return View();
        }

        [HttpPost]
        public IActionResult SignUp(string UserName, string Email, string Password)
        {
            bool status = false;

            List<object> ValuesToAdd = new List<object>() {UserName,Email,Password,status};

            status = UserProfile.AddValuesTo(ValuesToAdd);

            
            return RedirectToAction("Index", "Visitor", new {Status = status});
        }

        [HttpPost]
        public IActionResult Login(string userName, string email, string password)
        {
            string status;///Passing user Status

            try
            {
                // Perform login logic here
            }
            catch (Exception Message)
            {
                // Handle login exception
            }

            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            ViewBag.UserStatus = "Logged In";
            
            return View();
        }

        public IActionResult SignUp()
        {
            ViewBag.UserStatus = "Logged in";

            return View();
        }
    }
}