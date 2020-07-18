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
         private readonly  ISendEmailService _emailService;

        public UserRepository(LiveContext liveContext, IMapper autoMapper, IJwtService jwtService, ISendEmailService emailService)
        {
            this._liveContext = liveContext;
            this._autoMapper = autoMapper;
            this._jwtService = jwtService;
            this._emailService = emailService;
        }
        
        Task<List<UserDto>> IUserRepository.GetAllAsync()
        {
            throw new NotImplementedException();
        }


        public async Task<UserDto> SocialLoginAsync(string userId, string name, string email, string authType)
        {
            User user = _liveContext.Users.FirstOrDefault(x => x.UserEmail == email && x.AuthType == authType && x.UserSocialId ==  userId);

 //bool sended = _emailService.ResetPassword(user, new Guid());

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




        public async Task<UserDto> RegisterAsync(string email, string password)
        {
            User user = _liveContext.Users.FirstOrDefault(x => x.UserEmail == email);
            if(user == null)
            {
               var encrypter = new Encrypter();
                var salt = encrypter.GetSalt(password);
                var hash = encrypter.GetHash(password, salt);

                var name = email.Split('@')[0];
                var userId = "";

                User newUser = new User(userId, name, email, "LiveSearch", "USER", hash, salt);
             

                await _liveContext.AddAsync(newUser);
                await _liveContext.SaveChangesAsync();


                var userDto = _autoMapper.Map<UserDto>(newUser);
                userDto.JwtToken = _jwtService.CreateToken(newUser.ID, newUser.UserRole).Token;
                return userDto;
            }
            else 
            {
                var userEx = new UserDto();
                userEx.Email = "exists";
                return userEx;
            }
        
        }

  public async Task<string> GetUserEmail(Guid userId)
  {
      var user = await _liveContext.Users.FirstOrDefaultAsync(x => x.ID == userId);

      if(user != null)
      {
          return user.UserEmail;
      }
      return null;
  }
        public async Task<string> ResetPasswordAsync(string email, string password, string url)
        {
            User user = _liveContext.Users.FirstOrDefault(x => x.UserEmail == email);
            if(user != null)
            {
                var encrypter = new Encrypter();
                var salt = encrypter.GetSalt(password);
                var hash = encrypter.GetHash(password, salt);
                var resetId = Guid.NewGuid();

                bool sended = _emailService.ResetPassword(user, resetId, url);

                if(sended)
                {
                    user.SetNewPassword(hash, salt, resetId);
                    _liveContext.Update(user);
                    await _liveContext.SaveChangesAsync();
                }
                else
                {
                    return "emailerror";
                }
                return "ok";
            }
            else 
            {
                return "notexists";
            
            }
        
        }

   public async Task<UserDto> LoginAsync(string email, string password)
        {
            
            User user = _liveContext.Users.FirstOrDefault(x => x.UserEmail == email);

            if(user == null)
            {
                Console.WriteLine("User is null!!!!");
                return null;
            }
            else 
            {
                if(!user.IsActive)
                {
                    Log.Warning($"Try get deactivate user: {user.UserName}");
                    return null;
                }
                else 
                {
                var userSalt = user.Salt;
                var encrypter = new Encrypter();
                 string hash = encrypter.GetHash(password, userSalt);

                 if(hash == user.PasswordHash)
                 {
                user.NextLogin();
                _liveContext.Update(user);
                await _liveContext.SaveChangesAsync();
                var userDtoExist = _autoMapper.Map<UserDto>(user);
                userDtoExist.JwtToken = _jwtService.CreateToken(user.ID, user.UserRole).Token;
                return userDtoExist;
                 }
            return null;

               
                }
                
            }
        
        }


          public async Task<UserDto> ConfirmAsync(string email, string userId, string resetId)
        {
            
            User user = _liveContext.Users.FirstOrDefault(x => x.UserEmail == email);

            if(user == null)
            {
              
                return null;
            }
            else 
            {
                if(!user.IsActive)
                {
                    Log.Warning($"Try get deactivate user: {user.UserName}");
                    return null;
                }
                else 
                {
                
            if(user.ResetId.HasValue)
            {
                 if(user.ID.ToString() == userId && user.ResetId.Value.ToString() == resetId)
                 {
                    bool confirm =  user.ConfirmReset();
                    if(confirm)
                    {
                        user.NextLogin();
                        _liveContext.Update(user);
                        await _liveContext.SaveChangesAsync();
                        var userDtoExist = _autoMapper.Map<UserDto>(user);
                        userDtoExist.JwtToken = _jwtService.CreateToken(user.ID, user.UserRole).Token;
                        return userDtoExist;
                    }
                 }
                }
            return null;

               
                }
                
            }
        
        }


    }

}