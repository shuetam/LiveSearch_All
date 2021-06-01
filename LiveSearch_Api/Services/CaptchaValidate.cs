using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Live.Services
{
    public class CaptchaValidate
    {
        public bool CaptchaVerify(string captchaToken)
        {
            bool isHuman = false;

            if (string.IsNullOrEmpty(captchaToken))
               return false;

            using (var client = new WebClient())
            {
                string captchaKey = GoogleKey.captcha;
                string apiGoogle = $"https://www.google.com/recaptcha/api/siteverify?secret={captchaKey}&response={captchaToken}";
                var response = client.DownloadString(apiGoogle);
                var captchaObject = JsonConvert.DeserializeObject<CaptchaResponse>(response);
                isHuman = captchaObject.success;

            }
            return isHuman;
        }

        private class CaptchaResponse
        {
            public bool success { get; set; }
        }
    }

   
}
