using Web_demo.Models;

namespace Web_demo.Services
{
    public interface IDB_Services
    {
        public userinfo AddToDB(string? USname, string? mail, string pass);
        public dynamic GetUserInDB(string? mail,string? pass);
    }

    public class Database_Handler : IDB_Services
    {
        private readonly UserDB Profile;
        

        public Database_Handler(UserDB _Profile_)
        {
            Profile = _Profile_;
            
        }

        public userinfo AddToDB(string? USname,string? mail,string pass)
        {
            using (Profile)
            {
                userinfo Values = new userinfo()
                {
                    username = USname,
                    email = mail,
                    emailkey = pass,
                    status = "Logged in"
                };

                Profile.userinfo.Add(Values);

                Profile.SaveChanges();
                return Values;
            }
        }

        public dynamic GetUserInDB(string? mail,string? pass)
        {
            foreach(var user in Profile.userinfo) {
                if(user.email == mail || user.emailkey == pass) 
                {
                    return user;
                }
            }
            return "Can't find user";
        }
    }
}
