using System.ComponentModel;

namespace Web_demo.Services
{
    public interface Itimes_Services
    {
        public int GetCurrentDays();
        public string? GetCurrentMonth();
        public int GetCurrentYear();
        public int Total_DateInMonth(int? month, int? year);
        public string GetDaysOfWeek(int DaysInMonth,int Month,int year);
    }

    public class Time_Services : Itimes_Services
    {
        DateTime Current_Time = new DateTime();

        DateOnly date_only = new DateOnly();
        private Dictionary<int, string> Month_Values_Pair = new Dictionary<int, string>()
        {
            {1,"January"},
            {2, "Febuary"},
            {3,"March"},
            {4, "April"},
            {5,"May"},
            {6,"June"},
            {7,"July"},
            {8,"August"},
            {9,"September"},
            {10,"October"},
            {11,"November"},
            {12,"December"}
        };

        public int GetCurrentDays()
        {
            return date_only.Day;
        }
        public string? GetCurrentMonth()
        {
            foreach (var Months in Month_Values_Pair)
            {
                if (DateTime.Now.Month == Months.Key)
                {
                    return Months.Value;
                }
            }

            return null;
        }
        public int GetCurrentYear()
        {
            return DateTime.Now.Year;
        }

        public int Total_DateInMonth(int? month, int? year)
        {
            if (month != null && year != null)
            {
                return DateTime.DaysInMonth(year.Value,month.Value);
            }
            DateTime now = DateTime.Now;
           
            return DateTime.DaysInMonth(now.Year, now.Month);
        }

        public string GetDaysOfWeek(int DaysInMonth, int Month, int year)
        {
            DateTime Time = new DateTime(year,Month,DaysInMonth);

            return Time.ToString("ddd");
        }

    }
}
