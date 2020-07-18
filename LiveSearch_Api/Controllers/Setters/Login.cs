using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;


namespace Live.Controllers
{
    public class Login 
    {
        public string Email {get; set;}
        public string Password {get; set;}
        public string ID {get; set;}
         public string resetID {get; set;}
   
    }

}