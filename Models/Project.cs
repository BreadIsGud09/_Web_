using Microsoft.AspNetCore.Antiforgery;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.SqlServer.Server;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;



namespace Web_demo.Models
{
    public class Project
    {
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        public string? DateCreated { get; set; }

        public int id { get; set; }

        [Required]
        public int Owner { get; set; } /// <summary>
        /// Properties use for retrive when user GetProject Method is called
        /// </summary>
        /// 
        ///Category properties for sorting task

        public List<string>? Task_List { get; set; }
        ///*Must be initilize by Project Services 



    }

    public class ProjectDb : DbContext
    { 
        public ProjectDb (DbContextOptions<ProjectDb> contextOptions) : base(contextOptions) { }

        public DbSet<Project> ProjectTable { get; set;}

    }


}
