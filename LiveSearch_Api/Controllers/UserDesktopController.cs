using Live.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System;

namespace Live.Controllers
{

    //[EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [Route("api/[controller]")]
   [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]  
   [Authorize(Roles = "USER,ADMIN")]
    public class UserDesktopController : LiveController
    {
        private readonly  IUserDesktopRepository _desktopRepository;
         private readonly  IUserRepository _userRepository;
        
        public UserDesktopController (IUserDesktopRepository desktopRepository, IUserRepository userRepository)
        {
            this._desktopRepository = desktopRepository;
            this._userRepository = userRepository;
        }


        [HttpPost("addicon")]
        public async Task<IActionResult> AddIcon([FromBody] EntitySetter icon)
        {
          string tagsString =  "";

      
        if(icon.tags != null )
        {
            foreach(var tag in icon.tags)
            {
                  string tagT = tag.Trim();
                  if(!string.IsNullOrEmpty(tagT))
                  {
                    tagsString += $"{tagT}||";
                  }
            }
            if(tagsString.Length>2)
            {
              tagsString = tagsString.Substring(0, tagsString.Length-2);
            }

        }
  


           if(icon.Type == "YT")
           {
            var added = await _desktopRepository.AddYouTubeAsync(icon, this.UserId, tagsString);
             return Json(added);
           }
          if(icon.Type == "SPOTIFY")
           {
            var added = await _desktopRepository.AddSpotifyAsync(icon, this.UserId, tagsString);
             return Json(added);
           }
           if(icon.Type == "IMG" || icon.Type == "BOOK")
           {
            var added = await _desktopRepository.AddImageAsync(icon, this.UserId, tagsString);
            return Json(added);
           }
           return (Json(false));
        }


        [HttpPost("createfolder")]
        public async Task<IActionResult> CreateFolder([FromBody] EntitySetter folder)
        {
           // Console.Write(folder.Title);
            var newFolder = await _desktopRepository.CreateFolderAsync(this.UserId, folder.Title);
            return Json(newFolder);
        }

           [HttpPost("getuseremail")]
        public async Task<IActionResult> GetUseremail([FromBody] EntitySetter folder)
        {
           // Console.Write(folder.Title);
            var userEmail = await _userRepository.GetUserEmail(this.UserId);
            return Json(userEmail);
        }

        [HttpPost("findiconsfromurl")]
        public async Task<IActionResult> FindIconsFromUrl([FromBody] EntitySetter data)
        {
            //Console.Write(data.Title);
            var newIcons = await _desktopRepository.GetNewIcons(this.UserId, data.Title);
            return Json(newIcons);
        }

        [HttpPost("geticons")]
        public async Task<IActionResult> GetIcons([FromBody] AuthUser user)
        {
          var icons = await _desktopRepository.GetAllIconsForUserAsync(this.UserId, user.folderId);
          //Log.Information("Getting icons for user");
          return Json(icons);
        }

        [HttpPost("getimages")]
        public async Task<IActionResult> GetImages([FromBody] AuthUser user)
        {
          var icons = await _desktopRepository.GetAllImagesForUserAsync(this.UserId, user.folderId);
             //Log.Information("Getting images for user");
          return Json(icons);
        }

        [HttpPost("getspotify")]
        public async Task<IActionResult> GetSpotify([FromBody] AuthUser user)
        {
          var icons = await _desktopRepository.GetAllSpotifyForUserAsync(this.UserId, user.folderId);
            //Log.Information("Getting spotify for user");
          return Json(icons);
        }

        [HttpPost("getfolders")]
        public async Task<IActionResult> GetFolders([FromBody] AuthUser user)
        {
          var icons = await _desktopRepository.GetAllFoldersForUserAsync(this.UserId);
          return Json(icons);
        }

        [HttpPost("geticonsid")]
        public async Task<IActionResult> GetIconsId([FromBody] AuthUser user)
        {
          var iconsIds = await _desktopRepository.GetAllIconsIdAsync(this.UserId);
          return Json(iconsIds);
        }


        [HttpPost("addtofolder")]
        public async Task<IActionResult> AddToFolder([FromBody] EntitySetter en)
        {
          var data = await _desktopRepository.AddEntityToFolder(this.UserId, en.ParentId, en.Id, en.Type);
          return Json(data);
        }



        [HttpPost("removeentity")]
        public async Task RemoveEntity([FromBody] EntitySetter entity)
        {
           // Console.WriteLine("REMOVING  "+ entity.Id);
           await _desktopRepository.RemoveEntity(this.UserId, entity.Id, entity.Type);
           
          //return Json(icons);
        }


        [HttpPost("movefromfolder")]
        public async Task MoveEntityFromFolder([FromBody] EntitySetter entity)
        {
           await _desktopRepository.MoveEntityFromFolder(this.UserId, entity.Id, entity.Type);
        }

        [HttpPost("savelocations")]
        public async Task SaveLocations([FromBody] List<EntitySetter> entities)
        {
            //Console.WriteLine("I am in savelocations");
            
            //Console.WriteLine(entities[0].Top);
           await _desktopRepository.SaveIconsLocations(this.UserId, entities);
           
          //return Json(icons);
        }

        [HttpPost("changetitle")]
        public async Task<IActionResult> ChangeTitle([FromBody] EntitySetter entity)
        {
          string tagsString =  null;
            if(entity.tags != null )
            {
                foreach(var tag in entity.tags)
                {
                  string tagT = tag.Trim();
                  if(!string.IsNullOrEmpty(tagT))
                  {
                    tagsString += $"{tagT}||";
                  }
                }
                if(tagsString != null)
                {
                  if(tagsString.Length>2)
                  {
                    tagsString = tagsString.Substring(0, tagsString.Length-2);
                     if(tagsString.Length > 200)
                        {
                            tagsString = tagsString.Substring(0, 200);
                        }
                  }
                }

            }
         

           var icon = await _desktopRepository.ChangeEntityTitleAsync(entity, this.UserId,tagsString );
           return Json(icon);
          
        }

       
    }

}
