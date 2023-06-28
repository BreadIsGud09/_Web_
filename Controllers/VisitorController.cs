using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Data;
using Web_demo.Models;

namespace RoutingTest.Controllers
{
    public class VisitorController : Controller
    {


            this.userProfile = userProfile; 

        }

        public IActionResult Index(string? status)
        {
            if (status is "Logged In" && status != null)
            {
                ViewBag.UserStatus = status;
                
                
                return RedirectToAction("Index", "MainPage", new { user_state = "Logged in" });
            }
            else
            {
                ViewBag.UserStatus = "Visitor";
            }

            return View();
        }

        [HttpPost]
        public IActionResult SignUp(string? UserName, string? Email, string? Password)
        {
            if (UserName != null || Email != null || Password != null)
            {
                try
        {
            var Values = new userinfo ///Create a new items 
            {
                username = UserName,
                email = Email,
                emailkey = Password,
                    status = "Logged In"
            };

            
                return RedirectToAction("Index", "Visitor", new { Status = "Logged in" });
            }
            else
            {
                ViewBag.UserStatus = "Fail";
                return View();
            }
        }

        [HttpPost]
        public IActionResult Login(string _Email, string password)
        {
            ///Login and pass user data to mainpage
            ///
            var UserList = userProfile.userinfo.ToList();


            foreach (var user in UserList) 
            { 
                if(user.email == _Email || user.emailkey == password)
                {
                    return RedirectToAction("Index", "MainPage",user);
                }
            }

            ViewBag.message = "please try again";
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