using Microsoft.IdentityModel.Abstractions;
using System.Text.Json;
using Web_demo.Models;

namespace Web_demo.Services
{
    public interface IProject_Services
    {
        public string? Initialize_Project(int userid, Project_Details options); ///Create new project method
        public void DeleteProject(int id);///Delete current project
        public void DeleteAllProjects(int UserId);///Delete all project
        public Project_Details GetUserProject(int UserId);
    }

    public class Project_Handler : IProject_Services
    {
        private readonly IDB_Services DB_services;

        public Project_Handler(IDB_Services Services)
        {
            DB_services = Services;
        }

        public string? Initialize_Project(int User_Id, Project_Details options)
        {
            ////Get the user info and the user project settings
            ///
            var UserInfo = DB_services.Get_UserInfo(User_Id);

            Project_Details _details = new Project_Details();

            if (UserInfo != null && options.id == 0)
            {
                ///Initialize project
                ///
                _details.Name = options.Name;
                _details.Description = options.Description;
                _details.id = GenerateUniqueId();
                ///Serialize the Object to JSON and assign to DB
                UserInfo.user_project = JsonSerializer.Serialize(_details);///Serialize JSON

                DB_services.UpdateInfo(User_Id);///update data to the database

                return UserInfo.user_project;
            }
            else { 
                return null;
            }

        }

        public void DeleteProject(int Id) { }

        public void DeleteAllProjects(int UserId) { }

        public Project_Details GetUserProject(int UserId)
        {
            var user = DB_services.Get_UserInfo(UserId);

            if (user == null || user.user_project == null)
            {
                return new Project_Details();
            }

            var Data = JsonSerializer.Deserialize<Project_Details>(user.user_project);

            return Data;
        }

        private int GenerateUniqueId()
        {
            var random = new Random();
            // Generate a random number using the Next method of the Random class
            return random.Next();
        }
    }
}
