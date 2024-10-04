using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Transactions;
using Web_demo.Models;

namespace Web_demo.Services
{
    public interface ITaskManager
    {
        public Task<UserTask> CreateTaskModel(UserTask model, int ProjectId);///Create a model for implmenting into CreateTask method
        public List<UserTask> LoadUserTask(int ProjectId);
        public Task<UserTask> UpdateTask(UserTask task);
        public Task<UserTask> RemoveTaskFromProject(int Project_ID);
    }

    public class TaskManager : Project_Handler, ITaskManager ///Task Manager service 
    {
        private UserTask? _TaskModel;
        private readonly IDB_Services DB_services;
        
        public TaskManager(IDB_Services Services, ProjectDb db) : base(Services, db)///Injecting services
        {
            DB_services = Services;
        }


        public List<UserTask> LoadUserTask(int ProjectId)///Load the user by accessing the TaskList properties 
        {
            var project = this.GetProjectByID(ProjectId)[0];

            if (project is not null && project.Task_List is not null)
            {
                var List = project.Task_List.Select(e => JsonSerializer.Deserialize<UserTask>(e)).ToList();

                if (List.Any() == true)
                {
                    return List;
                }
                
            }

            return new List<UserTask>();
        }

        public async Task<UserTask> CreateTaskModel(UserTask RootLess_model,int ProjectId) 
        {
            if (RootLess_model.Name is not null)
            {
                var Model = await this.SetNewTask(RootLess_model,ProjectId);

                if (Model.RootProject_ID is not 0)
                {
                    return Model;
                }
                
            }

            return RootLess_model;
        }

        public Task<UserTask> RemoveTaskFromProject(int Project_ID)
        {
            throw new NotImplementedException();
        }

        public Task<UserTask>UpdateTask(UserTask task)
        {
            throw new NotImplementedException();
        }
    }
}
