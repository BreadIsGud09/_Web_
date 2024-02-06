using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Web_demo.Models
{
    public class Project_Details
    {
        public string? Name { get; set; }

        public string? Description { get; set; }

        public int id { get; set; }

        public class Task_Collections
        {
            public string? TaskName { get; set; }

            public string? TaskDescription { get; set; }

            public int id { get; set; }
            
            public string? Date { get; set; }
        }

    }
}
