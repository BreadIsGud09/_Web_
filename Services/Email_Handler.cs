using Web_demo.Models;
using MimeKit;
using MailKit.Net.Smtp;
using System.Threading;

namespace Web_demo.Services
{
    interface Email_Sender 
    {
        public Task<bool> SendAsync(string ToEmail,string subject, string body);
    }

    public class Email_Handler : Email_Sender
    {
        private readonly MailSettings _Details;

        public Email_Handler(MailSettings _Emails)
        {
            _Details = _Emails;
        }

        public async Task<bool> SendAsync(string ToEmail,string subject, string body)///Sending Email To Direct Email;
        {
            var BodyBuilder = new BodyBuilder();
            BodyBuilder.HtmlBody = body;

            SmtpClient smtp = new SmtpClient();

            await smtp.ConnectAsync(_Details.Host, _Details.Port);
            await smtp.AuthenticateAsync(_Details.UserName, _Details.Password); 

            try 
            {
                var Message = new MimeMessage();

                Message.From.Add(new MailboxAddress(_Details.DisplayName, _Details.From));
                Message.To.Add(new MailboxAddress("NAM LWE",ToEmail));///Target
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
