using Web_demo.Models;



namespace Web_demo.Services
{
    public interface IProject_Services
    {
        public void Initialize_Project(); ///Create new project method
        public void DeleteProject(int id);///Delete current project
        public void DeleteAllProjects(int UserId);///Delete all project

    }


    public class Project_Handler : IProject_Services
    {
        private readonly IDB_Services DB_services;
        private Project_Details? _details;


        Project_Handler(IDB_Services Services) 
        { 
            DB_services = Services;
        }

        public void Initialize_Project(int User_Id)
        {
            ////Get the user info and the user project settings
            ///
            var UserInfo = DB_services.Get_UserInfo(User_Id);

            if (UserInfo != null)
            {
                UserInfo.project_json = "Examples";
                
            }

        }
    }
}
