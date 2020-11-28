using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Live.Core;
using Microsoft.AspNetCore.Mvc;

namespace Live.Repositories
{
    public interface IUserRepository
    { 
          Task <List<UserDto>> GetAllAsync();
          Task <UserDto> SocialLoginAsync(string userId, string name, string email, string authType);
          
         Task<UserDto> RegisterAsync(string email, string password);
            Task<UserDto> LoginAsync(string email, string password);
              Task<string> ResetPasswordAsync(string email, string password, string url);
            Task<string> GetUserEmail(Guid userId);
          Task<UserDto> ConfirmAsync(string email, string userId, string resetId);
         
     }

}