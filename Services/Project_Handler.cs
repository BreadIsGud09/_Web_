using Microsoft.IdentityModel.Abstractions;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.CryptoPro;
using System.Text.Json;
using Web_demo.Models;

namespace Web_demo.Services
{
    public interface IProject_Services
    {
        public Task<Project?> Initialize_Project(int userid, Project options); ///Create new project method
        public void DeleteProject(int id);///Delete current project
        public void DeleteAllProjects(int UserId);///Delete all project
        public List<Project> GetUserProject(int UserId);
        public List<Project> GetProjectByID(int ID);
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
