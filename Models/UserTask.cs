using Microsoft.Build.Framework;

namespace Web_demo.Models
{
    public class UserTask 
    {
        [Required]
        public string? Name { get; set; }
        [Required] 
        public string? Content { get; set; }/// Content of the Task
        [Required]
        private int TaskId { get; set; } //id

        [Required]
        public string? Assignee { get; set; }

        public string? Tags { get; set; }/// <summary>
        ///tag for distinguish task between one     
        ////// </summary>

        public string? Due_Date { get; set; }
        [Required]
        public int RootProject_ID { get; set; }
        [Required]
        private DateTime CreatedDate { get; set; }

        public void SetCatergory() { 
            
        }
        private int SetId() {
            // Create a Random object
            Random random = new Random();

            // Generate a random number between 1000 (inclusive) and 10000 (exclusive)
            // This ensures the number has 4 digits and doesn't start with 0
            return random.Next(1000, 10000);
        }
        private int IntializeTaskId() {
            this.TaskId = SetId();
            this.CreatedDate = DateTime.Now;


            return this.TaskId;
        }

        public UserTask() {
            this.IntializeTaskId();
        }
    }
}
