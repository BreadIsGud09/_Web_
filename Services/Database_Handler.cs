using System.Reflection;
using System.Reflection.Metadata;
using Web_demo.Models;

namespace Web_demo.Services
{
    public interface IDB_Services
    {
        public userinfo AddToDB(string? USname, string? mail, string pass, string Cookies_Values);///Adding new user to DB/// 

        public userinfo? Verified_User_Cookies(string? InputCookies);

        public dynamic Get_UserInfo(string? mail, string? pass); ///Check if Email and pass exsit and return

        public userinfo? Get_UserInfo(int ID); ///getting user info by ID
    }

    public class Database_Handler : IDB_Services
    {
        private readonly UserDB Profile;


        public Database_Handler(UserDB _Profile_)
        {
            Profile = _Profile_;

        }

        public userinfo AddToDB(string? USname, string? mail, string pass, string Cookies_Values)
        {
            using (Profile)
            {
                userinfo Values = new userinfo()
                {
                    username = USname,
                    email = mail,
                    emailkey = pass,
                    status = "Logged in",
                    Cookies_ID = Cookies_Values
                };

                Profile.userinfo.Add(Values);

                Profile.SaveChanges();
                return Values;
            }
        }

        public dynamic Get_UserInfo(string? mail, string? pass)
        {
            foreach (var user in Profile.userinfo)
            {
                if ((mail != null && user.email == mail) || (pass != null && user.emailkey == pass))
                {
                    return user;
                }
            }
            return "Can't find user";
        }

        public userinfo? Get_UserInfo(int ID)
        {
            foreach(var user in Profile.userinfo)
            {
                if(user.id == ID)
                {
                    return user;
                }
            }

            return null;
        }


        public userinfo? Verified_User_Cookies(string? Cookies)
        {
            var Table = Profile.userinfo;

            foreach (var element in Table)
            {
                if (element.Cookies_ID == Cookies)
                {
                    return element;
                }
            }

            return null;
        }
    }
}
