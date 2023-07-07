using Web_demo.Models;
using MimeKit;
using MailKit.Net.Smtp;
using System.Threading;
using Microsoft.Extensions.Options;
using MimeKit.Cryptography;
using MailKit.Security;

namespace Web_demo.Services
{
    public interface IEmail_Sender 
    {
        public Task<bool> SendAsync(string ToEmail,string subject, string body);
    }

    public class Email_Handler : IEmail_Sender
    {
        private readonly MailSettings settings;

        public Email_Handler(IOptions<MailSettings> _Settings)
        {
            settings = _Settings.Value;
        }

        public async Task<bool> SendAsync(string ToEmail,string subject, string body)///Sending Email To Direct Email;
        {
            var BodyBuilder = new BodyBuilder();
            BodyBuilder.HtmlBody = body;

            SmtpClient smtp = new SmtpClient();

            await smtp.ConnectAsync(settings.Host, settings.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(settings.UserName, settings.Password);

            try 
            {
                var Message = new MimeMessage();

                Message.From.Add(new MailboxAddress(settings.DisplayName, settings.From));
                Message.To.Add(new MailboxAddress("",ToEmail));///Target
                Message.Subject = subject;
                Message.Body = BodyBuilder.ToMessageBody();

                await smtp.SendAsync(Message);

                await smtp.DisconnectAsync(true);
                smtp.Dispose();


                return true;
            }
            catch(Exception A) 
            { 
                return false;
            }
        }

        

    }
}
