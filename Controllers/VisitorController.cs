using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Data;
using Web_demo.Models;
using Web_demo.Services;


namespace RoutingTest.Controllers
{
    public class VisitorController : Controller
    {
        private UserDB userProfile;
        private readonly IEmail_Sender Email_Services;///email services
        
        public VisitorController(UserDB userProfile,IEmail_Sender sender_)//injection 
        {
            this.userProfile = userProfile;
            this.Email_Services = sender_;

        }///init DB

        public IActionResult Index()
        {
           
            return View();
        }

        [HttpPost]
        public IActionResult SignUp(string? UserName, string? Email, string? Password)
        {
            userinfo Values;///Values that pass in

            string body = "<h1>Please Verifield your email by reading this</h1>";

            if (UserName != null || Email != null || Password != null)
            {
                try
                {
                    
                    Values = new userinfo ///Create a new items 
                    {
                        username = UserName,
                        email = Email,
                        emailkey = Password,
                        status = "Logged In"
                    };

                    Email_Services.SendAsync(Email, "Scheduled verification!", body);

                    userProfile.userinfo.Add(Values);

                    userProfile.SaveChanges();
                }
                catch(Exception E)
                {
                    ViewBag.UserStatus = "Fail";
                    return View();
                }
                
                return RedirectToAction("Index", "MainPage",Values);
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

            ViewBag.UserStatus = "Logged in";
            ViewBag.message = "please try again";
            return View();
        }

        [HttpGet]
        public IActionResult Login() 
        { 
            ViewBag.UserStatus = "Logged in";
            
            return View();
        }

        public IActionResult SignUp()
        {
            ViewBag.UserStatus = "Logged in";

            return View();
        }
    }
}