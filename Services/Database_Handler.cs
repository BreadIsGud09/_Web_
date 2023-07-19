using System.Reflection;
using Web_demo.Models;

namespace Web_demo.Services
{
    public interface IDB_Services
    {
        public userinfo AddToDB(string? USname, string? mail, string pass,string Cookies_Values);///Adding new user to DB/// 

        public List<userinfo> GetPropertiesValuesFromUser(string UserName,userinfo properties);

        public dynamic GetUserInDB(string? mail,string? pass); ///Check if Email and pass exsit and return
    }

    public class Database_Handler : IDB_Services
    {
        private readonly UserDB Profile;
        

        public Database_Handler(UserDB _Profile_)
        {
            Profile = _Profile_;
            
        }

        public userinfo AddToDB(string? USname,string? mail,string pass,string Cookies_Values)
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

        public dynamic GetUserInDB(string? mail,string? pass)
        {
            foreach(var user in Profile.userinfo) {
                if((mail != null && user.email == mail) || (pass  != null && user.emailkey == pass)) 
                {
                    return user;
                }
            }
            return "Can't find user";
        }

        public List<userinfo> GetPropertiesValuesFromUser(string Rows,userinfo properties)///Getting the properties values
        {
            var Userinf = Profile.userinfo.ToList();

            foreach(userinfo userinfo in Userinf) 
            {
               
            }

            return Userinf;
        }
    }
}
