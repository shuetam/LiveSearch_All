using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Live.Controllers;
using Live.Core;
using Microsoft.AspNetCore.Mvc;

namespace Live.Repositories
{
    public interface IAdminRepository
    { 
          Task <List<UserAdminDto>> GetAllUsersAsync();
        Task <UserAdminDto> ChangeUserStatus(SocialLogin user);
         Task <AdminUpdatesDto> GetAdminUpdates();
     }

}