
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using Live.Core;
using Live.Extensions;
using Live.Settings;
using Microsoft.IdentityModel.Tokens;

namespace Live.Services
{
public  class SendEmailService : ISendEmailService
{

private  EmailCredensials _settings;
public SendEmailService(EmailCredensials settings)
{
    _settings = settings;
}

public bool ResetPassword(User user, Guid resetId, string url) 
{
        SmtpClient smtpClient = new SmtpClient();
        NetworkCredential basicCredential = new NetworkCredential(_settings.email, _settings.password);
        MailMessage message = new MailMessage();
        MailAddress fromAddress = new MailAddress(_settings.email);

        string href = $"{url}confirm?idu={user.ID}&for={user.UserEmail}&idr={resetId}"; 
//Console.WriteLine(href);
string body = $@" 
        <table border='0' cellspacing='0'>
            <tbody style='background-color: rgba(255, 255, 255, 0)'>
            <tr>
            <td align='center' background-color='rgba(136, 133, 133, 0.151)'>
              <p style='text-align: center; font-weight: lighter; font-family:  sans-serif; color: rgba(49, 49, 49, 0.733); color: rgb(231, 173, 64); font-size: 25px; background-color: rgba(97, 94, 94, 0)'>Live<span style='color: rgba(0, 0, 0, 0.781)'>S</span>earch</p>
                  
                  <p style='text-align: center; font-weight: lighter;  font-family:  sans-serif; color: rgba(29, 29, 29, 0.897); font-size: 19px;'>Otrzymaliśmy prośbę o zmianę hasła dla {user.UserEmail}</p>
                  <p style='text-align: center; font-weight: lighter; font-family:  sans-serif; color: rgba(29, 29, 29, 0.897); font-size: 15px;'>Aby potwierdzić kliknij w poniższy link (masz na to 24 godziny):</p>
                  <p style='background-color: rgba(204, 204, 204, 0); text-align: center; font-family:  sans-serif; color: rgba(29, 29, 29, 0.068);  font-size: 15px;'><a href='{href}'>{href}</a></p>
                  
                  <p style='text-align: center; font-weight: lighter; font-family:  sans-serif; color: rgba(29, 29, 29, 0.897); font-size: 13px;'>Zignoruj ten e-mail, jeżeli nie wysyłałaś(eś) prośby o zmianę hasła.</p>
                </p> </p> </p>
                <p style='text-align: center; font-weight: lighter; font-family:  sans-serif; color: rgba(29, 29, 29, 0.897); font-size: 10px; background-color:rgba(136, 133, 133, 0.151)'>
                    <a href='https://www.livesearch.pl/kontakt'>Kontakt</a>&nbsp;&nbsp;&nbsp;
                    <a href='https://www.livesearch.pl/polityka-prywatnosci'>Polityka prywatności</a>&nbsp;&nbsp;&nbsp; 
                    <a href='https://www.livesearch.pl/informacje'>Informacje i pomoc</a>
                </p>
            </td>
            </tr>
            </tbody>
                </table>
";



        smtpClient.Host = "smtp.webio.pl";
        smtpClient.Port = 587;
        smtpClient.UseDefaultCredentials = false;
        smtpClient.Credentials = basicCredential;

        message.From = fromAddress;
        message.Subject = "Reset hasła ";
        message.IsBodyHtml = true;
        message.Body = body;
        message.To.Add(user.UserEmail);

        try
        {
            smtpClient.Send(message);
            return true;
        }
        catch (Exception ex)
        {
            //Response.Write(ex.Message   ex.InnerException);
            Console.WriteLine(ex.InnerException);
            return false;
        }
}
}
}