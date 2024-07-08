using Web_demo.Models;
using Web_demo.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Session;
using Microsoft.EntityFrameworkCore.Internal;
using System.Text;

namespace Web_demo.Services
{
    public interface ICookies_Handler
    {
        public void SetCookies_Configuration(CookieOptions config, string Cookies_Key1);
        public string CreateCookies();
        public string Get_LocalCookies();
        public string Get_Cookies_Key();
    }

    public class Cookies_Handler : ICookies_Handler
    {
        private readonly IHttpContextAccessor _HttpContextAccessor;
        private string _cookie_Key { get; set; }
        private CookieOptions _cookie_config;
        
        public Cookies_Handler(IHttpContextAccessor httpContextAccessor)
        {
            _HttpContextAccessor = httpContextAccessor;
        }

        private string CookiesValues_Generate(int size, bool lowerCase)
        {
            StringBuilder builder = new StringBuilder();
            Random random = new Random();
            char ch;
            for (int i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }
            if (lowerCase)
                return builder.ToString().ToLower();
            return builder.ToString();
        }

        public void SetCookies_Configuration(CookieOptions config,string Cookies_Key)
        {
            var HTTP_Context = _HttpContextAccessor.HttpContext;

            _cookie_config = config;
            _cookie_Key = Cookies_Key;

            HTTP_Context.Session.SetString(Cookies_Key, _cookie_Key);
            ///Set cookies session for user
        }

        public string Get_Cookies_Key()
        {
            var HTTP_Context = _HttpContextAccessor.HttpContext;


            return HTTP_Context.Session.GetString("Scheudled_Cookies");
        }

        public string CreateCookies() 
        {
            ///Genereate new Cookies on local
            string CookiesValue = CookiesValues_Generate(5, false);

            ///Respone as the client requre Cookies
            var Server_Respone = _HttpContextAccessor.HttpContext.Response;

            //Append Cookies 
            Server_Respone.Cookies.Append(_cookie_Key,CookiesValue);

            return CookiesValue;
        }

        public string Get_LocalCookies()
        {
            var Server_Request = _HttpContextAccessor.HttpContext.Request;
            string? Result = Server_Request.Cookies.ToString();
            
            if(Result is null)
            {
                return "Cookies not found";
            }

            return Result;
        }
    }
}
