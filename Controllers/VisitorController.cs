using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.Text;
using Web_demo.Models;
using Web_demo.Services;


namespace RoutingTest.Controllers
{
    public class VisitorController : Controller
    {
        private IDB_Services userProfile;
        private ICookies_Handler cookies;
        private string Cookies_Key = "Scheduled_Cookies_Login";
        private readonly IEmail_Sender Email_Services;///email services

        ////---Services---\\\\\
        public VisitorController(IDB_Services _userProfile, IEmail_Sender sender_,ICookies_Handler CookiesServices)//injection 
        {
            CookieOptions option = new CookieOptions() 
            {
                Expires =  DateTime.UtcNow.AddMonths(2)
            };

            this.userProfile = _userProfile;
            this.Email_Services = sender_;
            this.cookies = CookiesServices;
            cookies.SetCookies_Configuration(option,"Scheudled_Cookies");

        }///init DB

        [HttpGet]
        public IActionResult Index()
        {
            ///Perform checking for Cookies 
            string getUserCookies = cookies.Get_LocalCookies();
            var IsUserVerified = userProfile.Verified_User_Cookies(getUserCookies);

            if (!(getUserCookies is null) && !(IsUserVerified is null)) ///Checl if not null
            {
                ViewBag.UserStatus = "Logged In";
                return RedirectToAction("Index", "MainPage", IsUserVerified);
            }


            ViewBag.UserStatus = "Visitor";
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SignUp(string? UserName, string? Email, string? Password)
        {
            string body = "<h1>Please Verifield your email by reading this</h1>";
            Userinfo UserData;
            string Cookies = cookies.Get_LocalCookies();
            var GmailExsit = userProfile.Get_UserInfo(Email, null);

            if (GmailExsit is Userinfo && !(Cookies is null))
            {
                ViewBag.UserStatus = "Visitor";
                ViewBag.Message = "The Account already signed in";
                return RedirectToAction("Login");
            }//Checking if the user's email is already taken

            if (UserName != null || Email != null || Password != null )
            {
                try
                {
                    //var IsSuccess = await Email_Services.SendAsync(Email, "Scheduled verification!", body);

                    var IsSuccess = true;

                    if (IsSuccess.Equals(true))
                    {
                        string CK_Value = cookies.CreateCookies();

                        UserData = userProfile.AddToDB(UserName, Email, Password,CK_Value);
                    }
                    else
                    {
                        ViewBag.ErrorMessage = "Something occur please try again!";
                        return View();
                    }
                }
                catch (Exception E)
                {
                    ViewBag.UserStatus = "Fail";
                    return View();
                }

                return RedirectToAction("Index", "MainPage", UserData);
            }

            return View();
        }

        [HttpPost]
        public IActionResult Login(string _Email, string password)
        {
            ///Login and pass user data to mainpage
            ///
            bool IsCorrectGmail = Email_Services.IsGmailFormat(_Email);
            var info = userProfile.Get_UserInfo(_Email, password); ///Get all INFO for the user required
            string Requested_Cookies = cookies.Get_LocalCookies();

            if (info is Userinfo && IsCorrectGmail && info.Cookies_ID == Requested_Cookies)////Checking Cookies Values and stuff
            {
                ViewBag.UserInfo = info;
                ViewBag.UserStatus = "Logged In";
                return RedirectToAction("Index", "MainPage", info);
            }
            else
            {
                ViewBag.UserStatus = "Logging In";
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