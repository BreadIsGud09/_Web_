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
            ViewBag.UserStatus = "Visitor";
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SignUp(string? UserName, string? Email, string? Password)
        {
            userinfo User_Data;///Values that pass in

            string body = "<h1>Please Verifield your email by reading this</h1>";

            if (UserName != null || Email != null || Password != null)
            {
                try
                {
                    
                    if (IsSuccess.Equals(true)) 
                    {
                        UserData = userProfile.AddToDB(UserName, Email, Password);
                    }
                    else
                    {
                        ViewBag.ErrorMessage = "Something occur please try again!";
                        return View();
                    }
                }
                catch(Exception E)
                {
                    ViewBag.UserStatus = "Fail";
                    return View();
                }
                
                return RedirectToAction("Index", "MainPage",UserData);
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
           
            var Result = userProfile.GetUserInDB(_Email, password);

            if(Result is userinfo)
                {
                return RedirectToAction("Index", "MainPage", Result);
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