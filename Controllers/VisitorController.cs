using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System;
using System.Data;
using System.Reflection.Metadata.Ecma335;
using Web_demo.Models;
using Web_demo.Services;


namespace RoutingTest.Controllers
{
    public class VisitorController : Controller
    {
        private IDB_Services userProfile;
        private readonly IEmail_Sender Email_Services;///email services
        
        public VisitorController(IDB_Services _userProfile,IEmail_Sender sender_)//injection 
        {
            this.userProfile = _userProfile;
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
            string body = "<h1>Please Verifield your email by reading this</h1>";
            userinfo UserData;

            if (UserName != null || Email != null || Password != null)
            {
                try
                {
                    var IsSuccess = await Email_Services.SendAsync(Email, "Scheduled verification!", body);

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

            return View();
        }

        [HttpPost]
        public IActionResult Login(string _Email, string password)
        {
            ///Login and pass user data to mainpage
            ///
            var Result = userProfile.GetUserInDB(_Email, password);

            if(Result is userinfo)
            {
                ViewBag.UserInfo = Result;
                ViewBag.UserStatus = "Logged In";
                return RedirectToAction("Index", "MainPage", Result);
            }
            else 
            {
                ViewBag.UserStatus = "Logged In";
                ViewBag.message = "please try again";
                return View();
            }
        }

        [HttpGet]
        public IActionResult Login() 
        { 
            ViewBag.UserStatus = "Logging In";
            
            return View();
        }

        public IActionResult SignUp()
        {
            ViewBag.UserStatus = "Signing up";

            return View();
        }
    }
}