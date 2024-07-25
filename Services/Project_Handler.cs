using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Abstractions;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.CryptoPro;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using Web_demo.Models;

namespace Web_demo.Services
{
    public interface IProject_Services
    {
        public Task<Project?> Initialize_Project(int userid, Project options); ///Create new project method
        public void DeleteProject(int id);///Delete current project
        public void DeleteAllProjects(int UserId);///Delete all project
        public List<Project> GetUserProject(int UserId);/// Get userProject object by providing userID 
        public List<Project> GetProjectByID(int ID);///Get project by Project ID
        public Task<UserTask> SetNewTask(UserTask TaskModel, int ProjectId);///Set a new Task to the current project 
    }



    public class Project_Handler : IProject_Services
    {
        private readonly IDB_Services DB_services;
        private readonly ProjectDb _db;

       
        public Project_Handler(IDB_Services Services, ProjectDb db)
        {
            DB_services = Services;
            _db = db;
        }
        
        public async Task<Project?> Initialize_Project(int User_Id, Project options)
        {
            var Queries = _db.ProjectTable;
            var UserInfo = DB_services.Get_UserInfo(User_Id);
            var _project = new Project();

            if (UserInfo != null && options.id == 0)
            {
                ///Initialize project
                ///
                using (_db)
                { 
                    _project.id = GenerateUniqueId();
                    _project.Name = options.Name;
                    _project.Description = options.Description;
                    _project.DateCreated = DateTime.Now.ToString();
                    _project.Owner = UserInfo.id;

                    Queries.Add(_project);

                    await _db.SaveChangesAsync();
                }
                return _project;
            }
            else { 
                return null;
            }

        }

        public async Task<UserTask> SetNewTask(UserTask TaskModel,int ProjectId)
        { 
            var Query_ = _db.ProjectTable;
            var CurrentProject = this.GetProjectByID(ProjectId)[0];
            var User = DB_services.Get_UserInfo(CurrentProject.Owner);

            if (User is not null)///Check the user info
            {
                TaskModel.Assignee = User.username;
                TaskModel.RootProject_ID = CurrentProject.id;
                var JsonValue = JsonConvert.SerializeObject(TaskModel);

                ///add on the Task List properties inside the current method
                CurrentProject.Task_List.Add(JsonValue);
                using (_db)
                {
                    Query_.Update(CurrentProject);///Update the database 
                    await _db.SaveChangesAsync(true);
                }
               
            }
            return TaskModel;
        }

        public void DeleteProject(int Id) { }

        public void DeleteAllProjects(int UserId) { }

        public List<Project> GetUserProject(int UserId)
        {
            var user = DB_services.Get_UserInfo(UserId);///Getting the user info
            var p_table = _db.ProjectTable;

            if (user.id != 0)///Checking if the user exist
            {
                return p_table.Where<Project>(p => p.Owner == UserId).ToList();
            }
            else
            {
                return new List<Project>();
            }

        }

        public List<Project> GetProjectByID(int ID) {///Return singular project that mathces the ID 
            var P_table = _db.ProjectTable;

            var IsHaveProject = P_table.Where<Project>(p => p.id == ID).ToList();

            if (IsHaveProject != null)
            {
                return IsHaveProject;
            }
            else 
            {
                return new List<Project>(); 
            }
            
        }

                

        private int GenerateUniqueId()
        {
            var random = new Random();
            // Generate a random number using the Next method of the Random class
            return random.Next();
        }

    }
}
