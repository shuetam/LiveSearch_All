using System;

namespace Live.Core
{
    public class UserAdminDto
    {
        public string Name {get; set;}
        public string Email {get; set;}
        public string Created {get; set;}
        public string LastLogin {get; set;}
        public int LoginsCount {get; set;}
        public int IconsCount {get; set;}
        public string AuthType {get; set;}
        public string Active {get; set;} 
    }
}

