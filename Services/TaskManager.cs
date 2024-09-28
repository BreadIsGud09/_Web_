using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Net;
using System.Runtime.CompilerServices;
using System.Security.Permissions;
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

        public UserTask FindTask(int ProjectId,int RootProjectID);
    }

    public class TaskManager : Project_Handler, ITaskManager ///Task Manager service 
    {
        private UserTask? _TaskModel;
        private readonly IDB_Services DB_services;
        
        public TaskManager(IDB_Services Services, ProjectDb db) : base(Services, db)///Injecting services
        {
            DB_services = Services;
        }


        public UserTask FindTask(int ProjectId, int RootProjectID) {

            var Project = this.GetProjectByID(ProjectId)[0];
            UserTask Serialized;


            if (Project is not null && Project.Task_List is not null)
            {
                foreach (var E in Project.Task_List)
                {
                    Serialized = JsonSerializer.Deserialize<UserTask>(E);
                    if (Serialized is not null && Serialized.RootProject_ID == RootProjectID) {
                        return Serialized;
                    }

                }
            }
            return new UserTask();
        }

        public List<UserTask> LoadUserTask(int ProjectId)///Load the user by accessing the TaskList properties 
        {
            var project = this.GetProjectByID(ProjectId)[0];

            if (project is not null && project.Task_List.Any() == true)
            {
                var ConvertedList = project.Task_List.Select(e => JsonSerializer.Deserialize<UserTask>(e)).ToList();

                if (ConvertedList.Any() == true)
                {
                    return ConvertedList;
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

        public async Task<UserTask> RemoveTaskFromProject(int Project_ID)
        {
            throw new NotImplementedException();
        }

        public Task<UserTask>UpdateTask(UserTask task)
        {
            throw new NotImplementedException();
        }
    }
}
