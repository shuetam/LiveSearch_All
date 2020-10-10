using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;


namespace Live.Controllers
{
    public class ExploreQuery 
    {
        public string query {get; set;}
        public int count {get;set;}
        public int next {get; set;}
        public string folderId { get; set; }
    }

}