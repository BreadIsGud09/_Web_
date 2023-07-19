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
        private string Cookies_Key = "Scheduled_Cookies_Login";
        private readonly IEmail_Sender Email_Services;///email services

        public VisitorController(IDB_Services _userProfile, IEmail_Sender sender_)//injection 
        {
            this.userProfile = _userProfile;
            this.Email_Services = sender_;

        }///init DB

        public string CookiesValues_Generate(int size, bool lowerCase)
        {
            StringBuilder builder = new StringBuilder();
            Random random = new Random();
            char ch;
            for (int i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }
            if (lowerCase)
                return builder.ToString().ToLower();
            return builder.ToString();
        }

        private string CreateCookies() ///Create Login Cookies for user
        {
            string Value = CookiesValues_Generate(10,true);

            CookieOptions cookieOptions = new CookieOptions() {
                Expires = DateTime.UtcNow.AddMonths(2),
            };
            var Res_Cookies = Response.Cookies;

            Res_Cookies.Append(Cookies_Key,Value);

            return Value;
        }

        private string GetCookies()
        {
            var Cookies = Request.Cookies[Cookies_Key];

            if(Cookies is null)
            {
                return "Fail";
            }

            return Cookies;
        }

        //Cookies Handler
        //---------------------------------------------||
        //Pages

        public IActionResult Index()
        {
            ///Perform checking for Cookies 


            ViewBag.UserStatus = "Visitor";
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SignUp(string? UserName, string? Email, string? Password)
        {
            string body = "<h1>Please Verifield your email by reading this</h1>";
            userinfo UserData;
            string Cookies = GetCookies();
            var GmailExsit = userProfile.GetUserInDB(Email, null);

            if (GmailExsit is userinfo && !(Cookies is null))
            {
                ViewBag.UserStatus = "Visitor";
                ViewBag.Message = "The Account already signed in";
                return RedirectToAction("Login");
            }//Checking if the user's email is already taken

            if (UserName != null || Email != null || Password != null )
            {
                try
                {
                    var IsSuccess = await Email_Services.SendAsync(Email, "Scheduled verification!", body);

                    if (IsSuccess.Equals(true))
                    {
                        string CK_Value = CreateCookies();

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
            var info = userProfile.GetUserInDB(_Email, password);

            
            if (info is userinfo && IsCorrectGmail)
            {
                string CookiesValue = GetCookies();
                string UserCookies = userProfile.GetPropertiesValuesFromUser(info.username, "Cookies_ID ");
                ////Checking Cookies Values    

                if (CookiesValue == UserCookies) 
                {
                    ViewBag.UserInfo = info;
                    ViewBag.UserStatus = "Logged In";
                    return RedirectToAction("Index", "MainPage", info);
                }
                return RedirectToAction("Index");
            }
            else
            {
                ViewBag.UserStatus = "Logged in";
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