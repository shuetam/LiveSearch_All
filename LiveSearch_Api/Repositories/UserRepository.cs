using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Live.Core;
using Live.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Live.Repositories
{
    public class UserRepository : IUserRepository
    { 

        private readonly LiveContext _liveContext;
        private readonly IMapper _autoMapper;
        private readonly IJwtService _jwtService;

        public UserRepository(LiveContext liveContext, IMapper autoMapper, IJwtService jwtService )
        {
            this._liveContext = liveContext;
            this._autoMapper = autoMapper;
            this._jwtService = jwtService;
        }
        
        Task<List<UserDto>> IUserRepository.GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public async Task<UserDto> SocialLoginAsync(string userId, string name, string email, string authType)
        {
            User user = _liveContext.Users.FirstOrDefault(x => x.UserEmail == email && x.AuthType == authType && x.UserSocialId ==  userId);


            if(user == null)
            {
                //Console.WriteLine("Save user to database");

                if(string.IsNullOrEmpty(email))
                {
                    var wrong = new UserDto();
                    wrong.Email = "noEmail";
                    return wrong;
                }
                else 
                {
                User newUser = new User(userId, name, email, authType, "USER");

               // var usersCount = _liveContext.Users.

                await _liveContext.AddAsync(newUser);
                await _liveContext.SaveChangesAsync();
                var userDto = _autoMapper.Map<UserDto>(newUser);
                userDto.JwtToken = _jwtService.CreateToken(newUser.ID, newUser.UserRole).Token;
                return userDto;
                }

            }
            else 
            {
                if(!user.IsActive)
                {
                    Log.Warning($"Try get deactivate user: {user.UserName}");
                    return null;
                }

                //Console.WriteLine($"login existing user:  {user.UserYoutubes.Count}");
                //user.UserYoutubes.Add(new UserYoutube("dVVsa","dVVVas","dVVfs","gdVVV"));
                user.NextLogin();
                _liveContext.Update(user);
                await _liveContext.SaveChangesAsync();
                
            }
            var userDtoExist = _autoMapper.Map<UserDto>(user);
            userDtoExist.JwtToken = _jwtService.CreateToken(user.ID, user.UserRole).Token;
            return userDtoExist;
        }
    }

}