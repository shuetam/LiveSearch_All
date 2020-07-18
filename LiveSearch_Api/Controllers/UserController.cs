using Live.Repositories;
using Microsoft.AspNetCore.Mvc;
using Live.Core;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System;
using System.Net;
using System.IO;
using System.Text.RegularExpressions;
using Serilog;
using Live.Services;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace Live.Controllers
{
    // [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]

    [Route("api/[controller]")]
    public class UserController : LiveController
    {
        private readonly  IUserRepository _userRepository;
         public IConfiguration _configuration { get; }
        
        public UserController (IConfiguration Configuration, IUserRepository userRepository)
        {
            this._userRepository = userRepository;
            _configuration = Configuration;
        }


		[HttpPost("userlogin")]
        public async Task<IActionResult> Login([FromBody] Login socialLogin)
        {
            string error = "loginFalse";

             

            if(socialLogin.Password.Length>5 && IsMailValid(socialLogin.Email))
            {
                var user = await _userRepository.LoginAsync(socialLogin.Email, socialLogin.Password);
                if(user != null)
                {
                    return Json(user);
                }

            }
             
            return Json(error);
        }


		[HttpPost("confirmpassword")]
        public async Task<IActionResult> ConfirmPassword([FromBody] Login login)
        {
            string error = "loginFalse";
            
            
 
              
              
                var user = await _userRepository.ConfirmAsync(login.Email, login.ID, login.resetID);
                if(user != null)
                {
                    return Json(user);
                }

            
            return Json(error);
        }


        [HttpPost("userregister")]
        public async Task<IActionResult> Register([FromBody] Login socialLogin)
        {
            string error = "error";

            string passwordRegex = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$";
            var reg = new Regex(passwordRegex);
            var pass = reg.IsMatch(socialLogin.Password);
            
            if(pass && IsMailValid(socialLogin.Email))
            {
                var user = await _userRepository.RegisterAsync(socialLogin.Email, socialLogin.Password);
                return Json(user);
            }
            return Json(error);
        }

          [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPasword([FromBody] Login socialLogin)
        {
            string error = "error";

            string passwordRegex = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$";
            var reg = new Regex(passwordRegex);
            var pass = reg.IsMatch(socialLogin.Password);
            var url = _configuration.GetSection("client");
            
            if(pass && IsMailValid(socialLogin.Email))
            {
                var user = await _userRepository.ResetPasswordAsync(socialLogin.Email, socialLogin.Password, url.Value);
                return Json(user);
            }
            return Json(error);
        }

        private bool IsMailValid(string emailaddress)
        {
            try
            {
                MailAddress m = new MailAddress(emailaddress);

                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }
    }
}