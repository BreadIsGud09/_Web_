using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.IO.Pipelines;
using System.Reflection;
using System.Reflection.Metadata;
using System.Text.Json;
using Web_demo.Models;

namespace Web_demo.Services
{
    public interface IDB_Services
    {
        public Userinfo AddToDB(string? USname, string? mail, string pass, string Cookies_Values);///Adding new user to DB/// 

        public Userinfo? Verified_User_Cookies(string? InputCookies);

        public dynamic Get_UserInfo(string? mail, string? pass); ///Check if Email and pass exsit and return

        public Userinfo? Get_UserInfo(int ID); ///getting user info by ID

        public List<Project_Details>? GetProjectJson(int id); //get the project setting from the user 

        public void UpdateInfo(int User_id);
    }

    public class Database_Handler : IDB_Services
    {
        private readonly UserDB Profile;


        public Database_Handler(UserDB _Profile_)
        {
            Profile = _Profile_;

        }

        public Userinfo AddToDB(string? USname, string? mail, string pass, string Cookies_Values)
        {
            using (Profile)
            {
                Userinfo Values = new Userinfo()
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

        public Userinfo? Get_UserInfo(int ID)
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

        public void UpdateInfo(int User_id)///Update neccessary for making any changes for user
        {
            var User = Get_UserInfo(User_id);
            ///Changing the user properties
            if (User != null)
            {
                var Updated_Result = Profile.Update(User!);

                Profile.SaveChanges();
            }
            else {
                throw new Exception("User ID not found!");
            }
            
        }

        public Userinfo? Verified_User_Cookies(string? Cookies)
        {
            var Table = Profile.userinfo;

            foreach (var properties in Table)
            {
                if (properties.Cookies_ID == Cookies)
                {
                    return properties;
                }
            }

            return null;
        }

        public List<Project_Details>? GetProjectJson(int id)
        {
            ///Get the user info then retrive JSON
            var User = Get_UserInfo(id);

            if (User != null && User.user_project != null)
            {
                List<Project_Details> P_Data = new List<Project_Details>();

                var Project_Data = User.user_project.RootElement.EnumerateArray();

                foreach (var P in Project_Data)
                {
                    P_Data.Add(JsonSerializer.Deserialize<Project_Details>(P.ToString()));
                    ////Adding all the project into a Project_Details model list 
                }
                return P_Data;
            }
            else
            {
                return null;
            }
        }
    }
}
