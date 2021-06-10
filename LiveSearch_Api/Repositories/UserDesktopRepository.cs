using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Live.Controllers;
using Live.Core;
using Live.Live.Core;
using Microsoft.EntityFrameworkCore;

namespace Live.Repositories
{
    public class UserDesktopRepository : IUserDesktopRepository
    {

        private readonly LiveContext _liveContext;
        private readonly IMapper _autoMapper;

        public UserDesktopRepository(LiveContext liveContext, IMapper autoMapper)
        {
            this._liveContext = liveContext;
            this._autoMapper = autoMapper;
        }


        public async Task<bool> AddYouTubeAsync(EntitySetter addYoutube, Guid userId, string tagsString)
        {
            var exist = _liveContext.UserYoutubes.FirstOrDefault(x => x.UserId == userId && x.VideoId == addYoutube.Id);


            if (exist == null)
            {
                var titles = addYoutube.Title.Split("||").ToList();
                string title = titles.Count > 0 ? titles[0] : addYoutube.Title;

                var newYoutube = new UserYoutube(userId, addYoutube.Id, title, addYoutube.Left, addYoutube.Top, addYoutube.FolderId, tagsString, addYoutube.Source);
              
                _liveContext.UserYoutubes.Add(newYoutube);
                await this.UpdateUserById(userId);
                await _liveContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        private async Task<string> GetLocationAsync(Guid userId)
        {
            var entities = await GetAllIconsForUserAsync(userId, "");
            var location = "30px";
            if (entities.Count > 0)
            {
                var reg = new Regex("px");
                var locationsTop = entities.Select(x => double.Parse(reg.Replace(x.top, "")));
                location = (locationsTop.Max() + 50) + "px";
            }
            return location;

        }

        public async Task<List<IconDto>> GetAllIconsForUserAsync(Guid userId, string folderId)
        {
            //Console.WriteLine(userId + "      -       " + folderId);
            var yotubes =
            string.IsNullOrEmpty(folderId) ?
            await _liveContext.UserYoutubes.Where(x => x.UserId == userId && x.FolderId == null).ToListAsync()
            :
            await _liveContext.UserYoutubes.Where(x => x.UserId == userId && x.FolderId.ToString() == folderId).ToListAsync();

            var icons = yotubes.Select(x => _autoMapper.Map<IconDto>(x)).ToList();

            //Console.WriteLine("Getting icons");
            return icons;
        }

        public async Task<List<IconDto>> GetAllImagesForUserAsync(Guid userId, string folderId)
        {
            //Console.WriteLine(userId + "      -       " + folderId);
            var images =
            string.IsNullOrEmpty(folderId) ?
            await _liveContext.UserImages.Where(x => x.UserId == userId && x.FolderId == null).ToListAsync()
            :
            await _liveContext.UserImages.Where(x => x.UserId == userId && x.FolderId.ToString() == folderId).ToListAsync();

            var icons = images.Select(x => _autoMapper.Map<IconDto>(x)).ToList();

            // Console.WriteLine("Getting images");
            return icons;
        }

        public async Task<List<IconDto>> GetAllSpotifyForUserAsync(Guid userId, string folderId)
        {
            //Console.WriteLine(userId + "      -       " + folderId);
            var spotifies =
            string.IsNullOrEmpty(folderId) ?
            await _liveContext.UserSpotify.Where(x => x.UserId == userId && x.FolderId == null).ToListAsync()
            :
            await _liveContext.UserSpotify.Where(x => x.UserId == userId && x.FolderId.ToString() == folderId).ToListAsync();

            var icons = spotifies.Select(x => _autoMapper.Map<IconDto>(x)).ToList();

            //Console.WriteLine("Getting spotifies");
            return icons;
        }




        public async Task<object> GetAllIconsIdAsync(Guid userId)
        {
            var iconsIds = await _liveContext.UserYoutubes.Where(x => x.UserId == userId).Select(x => x.VideoId).ToListAsync();
            var imgIds = await _liveContext.UserImages.Where(x => x.UserId == userId).Select(x => x.UrlAddress).ToListAsync();
            var spotifyIds = await _liveContext.UserSpotify.Where(x => x.UserId == userId).Select(x => x.SpotifyId).ToListAsync();
            var foldersIds = await _liveContext.Folders.Where(x => x.UserId == userId).Select(x => x.ID.ToString().ToLower()).ToListAsync();

            iconsIds.AddRange(imgIds);
            iconsIds.AddRange(spotifyIds);
            iconsIds.AddRange(foldersIds);

            iconsIds.Add(userId.ToString());

            var followedIds = await _liveContext.SharedDesktops.Where(x => x.UserId == userId).Select(x => x.OwnerId.ToString()).ToListAsync();

            var iconsIDS = new { userIds = iconsIds, followedIds = followedIds };
            return iconsIDS;

            //return iconsIds;
        }


        public async Task<List<FolderDto>> GetAllFoldersForUserAsync(Guid userId, bool onlyPublic)
        {

            var folders = new List<Folder>();

            if (onlyPublic)
            {
                folders = await _liveContext.Folders
                                .Where(x => x.UserId == userId)
                                .Include(x => x.UserYouTubes)
                                .Include(x => x.UserImages)
                                .Include(x => x.UserSpotify)
                                .ToListAsync();
            }
            else
            {
                folders = await _liveContext.Folders
                               .Where(x => x.UserId == userId && x.IsShared == true)
                               .Include(x => x.UserYouTubes)
                               .Include(x => x.UserImages)
                               .Include(x => x.UserSpotify)
                               .ToListAsync();
            }

            foreach (var folder in folders)
            {
                folder.SetFourIcons();
            }
            var icons = folders.Select(x => _autoMapper.Map<FolderDto>(x)).ToList();

             foreach (var icon in icons)
            {
                int followers = _liveContext.SharedFolders.Where(x => x.FolderId.ToString() == icon.id).Count();
                icon.followers = followers;
             }

            return icons;
        }

        public async Task<List<FolderDto>> GetFollowedDesktopsForUserAsync(Guid userId)
        {
            var deskIds = _liveContext.SharedDesktops.Where(x => x.UserId == userId)
            .Select(x => x.OwnerId);


           // var desktops = await _liveContext.Users.Where(p => p.IsPublic.HasValue).Where(x => x.IsPublic.Value && deskIds.Contains(x.ID))
           // .Include(x => x.UserYoutubes)
           // .Include(x => x.UserSpotify)
          //  .Include(x => x.UserImages).ToListAsync();

            var desktops = await _liveContext.Users.Where(x => deskIds.Contains(x.ID))
                          .Include(x => x.UserYoutubes)
                          .Include(x => x.UserSpotify)
                          .Include(x => x.UserImages).ToListAsync();


            foreach (var desk in desktops)
            {
                desk.SetFourIcons();
            }
            var icons = desktops.Select(x => _autoMapper.Map<FolderDto>(x)).ToList();

            foreach (var icon in icons)
            {
                int followers = _liveContext.SharedDesktops.Where(x => x.OwnerId.ToString() == icon.id).Count();
                var followDesk = _liveContext.SharedDesktops.FirstOrDefault(x => x.UserId == userId && x.OwnerId.ToString() == icon.id);
                icon.followers = followers;
                icon.left = followDesk.LocLeft;
                icon.top = followDesk.LocTop;
            }

            return icons;

        }

        public async Task RemoveEntity(Guid userId, string entityId, string entityType)
        {
            //Console.WriteLine(entityType);
            if (entityType == "YT" || entityType == "MOVIE")
            {
                //Console.WriteLine("i am removing entity");
                var entity = _liveContext.UserYoutubes.FirstOrDefault(x => x.UserId == userId && x.VideoId == entityId);
                //Console.WriteLine(entity.ID);
                _liveContext.Remove(entity);
                await _liveContext.SaveChangesAsync();
            }

            if (entityType == "SPOTIFY")
            {
                //Console.WriteLine("i am removing entity");
                var entity = _liveContext.UserSpotify.FirstOrDefault(x => x.UserId == userId && x.SpotifyId == entityId);
                //Console.WriteLine(entity.ID);
                _liveContext.Remove(entity);
                await _liveContext.SaveChangesAsync();
            }

            if (entityType == "IMG" || entityType == "BOOK")
            {
                //Console.WriteLine("i am removing IMAGE");
                var entity = _liveContext.UserImages.FirstOrDefault(x => x.UserId == userId && x.UrlAddress == entityId);
                //Console.WriteLine(entity.ID);
                _liveContext.Remove(entity);
                await _liveContext.SaveChangesAsync();
            }

            if (entityType == "FOLDER")
            {
                //Console.WriteLine("i am removing folder");
                var folder = _liveContext.Folders
                .Include(x => x.UserYouTubes)
                .Include(x => x.UserImages)
                .Include(x => x.UserSpotify)
                .FirstOrDefault(x => x.UserId == userId && x.ID.ToString() == entityId);
                //Console.WriteLine(folder.ID);
                if (folder != null)
                {
                    var shared = _liveContext.SharedFolders.Where(x => x.FolderId == folder.ID);

                    if (shared != null)
                    {
                        _liveContext.SharedFolders.RemoveRange(shared);
                    }

                    _liveContext.RemoveRange(folder.UserYouTubes);
                    _liveContext.RemoveRange(folder.UserImages);
                    _liveContext.RemoveRange(folder.UserSpotify);
                    _liveContext.Remove(folder);


                }
                await _liveContext.SaveChangesAsync();
            }
        }

        public async Task MoveEntityFromFolder(Guid userId, string entityId, string entityType)
        {
            //Console.WriteLine(entityType);
            if (entityType == "YT" || entityType == "MOVIE")
            {
                //Console.WriteLine("i am removing entity");
                var entity = _liveContext.UserYoutubes.FirstOrDefault(x => x.UserId == userId && x.VideoId == entityId);
                // Console.WriteLine(entity.ID + " removing from folder");
                entity.RemoveFromFolder();
            }

            if (entityType == "SPOTIFY")
            {
                var entity = _liveContext.UserSpotify.FirstOrDefault(x => x.UserId == userId && x.SpotifyId == entityId);
                entity.RemoveFromFolder();
            }

            if (entityType == "IMG" || entityType == "BOOK")
            {
                //Console.WriteLine("i am removing entity");
                var entity = _liveContext.UserImages.FirstOrDefault(x => x.UserId == userId && x.UrlAddress == entityId);
                // Console.WriteLine(entity.ID + " removing from folder");
                entity.RemoveFromFolder();
            }
            await _liveContext.SaveChangesAsync();
        }

        public async Task<object> AddEntityToFolder(Guid userId, string folderId, string entityId, string entityType)
        {
            //Console.WriteLine("FOLDER ID!:  "+ folderId);

            Folder folder = null;

            if (entityType == "YT" || entityType == "MOVIE")
            {
                var entity = _liveContext.UserYoutubes.FirstOrDefault(x => x.UserId == userId && x.VideoId == entityId);
                if (entity != null)
                {
                    entity.SetFolder(new Guid(folderId));
                    _liveContext.Update(entity);
                }
            }
            if (entityType == "IMG" || entityType == "BOOK")
            {
                var entityImg = _liveContext.UserImages.FirstOrDefault(x => x.UserId == userId && x.UrlAddress == entityId);
                entityImg.SetFolder(new Guid(folderId));
                _liveContext.Update(entityImg);
            }
            if (entityType == "SPOTIFY")
            {
                var entityImg = _liveContext.UserSpotify.FirstOrDefault(x => x.UserId == userId && x.SpotifyId == entityId);
                entityImg.SetFolder(new Guid(folderId));
                _liveContext.Update(entityImg);
            }


            folder = _liveContext.Folders
            .Include(x => x.UserYouTubes)
            .Include(x => x.UserImages)
            .Include(x => x.UserSpotify)
            .FirstOrDefault(x => x.ID.ToString() == folderId);

            folder.UpdateFolder();
            await _liveContext.SaveChangesAsync();

            folder.SetFourIcons();
            //Console.WriteLine($"Folder has youtbes: {folder.UserYouTubes.Count}");


            return new { folder = _autoMapper.Map<FolderDto>(folder), entityId = entityId };
        }

        public async Task<FolderDto> CreateFolderAsync(Guid userId, EntitySetter folderSetter)
        {
            //var folder = new Folder(userId, Title);
            var folder = new Folder(userId, folderSetter);
            await _liveContext.Folders.AddAsync(folder);
            await _liveContext.SaveChangesAsync();
            return _autoMapper.Map<FolderDto>(folder);
        }

        public async Task SaveIconsLocations(Guid userId, List<EntitySetter> icons)
        {
            var user = _liveContext.Users
            .Include(x => x.UserYoutubes)
            .Include(x => x.UserImages)
            .Include(x => x.UserSpotify)
            //.Include(x => x.FollowedFolders)
            //.Include(x => x.FollowedFolders).ThenInclude(x => x.Folder)
            .FirstOrDefault(x => x.ID == userId);

            if (user != null)
            {


                foreach (var icon in icons.Where(x => x.Type == "ICON"))
                {

                    var yt = user.UserYoutubes.FirstOrDefault(x => x.VideoId == icon.Id);
                    if (yt != null)
                    {
                        yt.ChangeLocation(icon.Left, icon.Top);
                    }

                    var im = user.UserImages.FirstOrDefault(x => x.UrlAddress == icon.Id);
                    if (im != null)
                    {
                        im.ChangeLocation(icon.Left, icon.Top);
                    }

                    var sp = user.UserSpotify.FirstOrDefault(x => x.SpotifyId == icon.Id);
                    if (sp != null)
                    {
                        sp.ChangeLocation(icon.Left, icon.Top);
                    }

                }
                await _liveContext.SaveChangesAsync();

                foreach (var folder in icons.Where(x => x.Type == "FOLDER"))
                {
                    var fol = _liveContext.Folders.FirstOrDefault(x => x.ID.ToString() == folder.Id);

                    if (fol != null)
                    {
                        fol.ChangeLocation(folder.Left, folder.Top);
                    }
                }

                foreach (var folder in icons.Where(x => x.Type == "FOLLOWED_FOLDER"))
                {
                    var fol = _liveContext.SharedFolders.FirstOrDefault(x => x.FolderId.ToString().ToLower() == folder.Id && x.UserId == userId);

                    if (fol != null)
                    {
                        fol.ChangeLocation(folder.Left, folder.Top);
                    }
                }
            }
            await _liveContext.SaveChangesAsync();

        }


        public async Task<List<IconDto>> GetNewIcons(Guid userId, EntitySetter data)
        {

            var user = await _liveContext.Users.FirstOrDefaultAsync(x => x.ID == userId);
            var url = data.Title;
            var icons = new List<IconDto>();
            bool isMovie = data.Type == "MOVIE";

            if (user != null)
            {
                //var iconsFromUrl = new IconsUrl(url);
                if (!url.Contains("http"))
                {
                    url = "http://" + url;
                }

                var getIcons = await IconsUrl.GetIdsFromUrl(url, isMovie);

                //icons.AddRange(iconsFromUrl.IDS);
                icons.AddRange(getIcons);

            }


            if (icons.Count == 0)
            {
                icons.Add(new IconDto("noFound", "noFound", "noFound"));
            }
            return icons;
        }

        public async Task<bool> AddImageAsync(EntitySetter addImage, Guid userId, string tagsString)
        {

            var exist = _liveContext.UserImages.FirstOrDefault(x => x.UserId == userId && x.UrlAddress == addImage.Id);
            if (exist == null)
            {
                var newImage = new UserImage(userId, addImage.Source, addImage.Id,
                addImage.Title, addImage.Left, addImage.Top, addImage.FolderId, addImage.Type, tagsString);
                _liveContext.UserImages.Add(newImage);
                await this.UpdateUserById(userId);
                await _liveContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> AddSpotifyAsync(EntitySetter addSpotify, Guid userId, string tagsString)
        {

            var exist = _liveContext.UserSpotify.FirstOrDefault(x => x.UserId == userId && x.SpotifyId == addSpotify.Id);
            if (exist == null)
            {
                var newSpot = new UserSpotify(userId, addSpotify.Id, addSpotify.Source,
                addSpotify.Title, addSpotify.Left, addSpotify.Top, addSpotify.FolderId, tagsString);
                _liveContext.UserSpotify.Add(newSpot);
                await this.UpdateUserById(userId);
                await _liveContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }



        public async Task<IconDto> ChangeEntityTitleAsync(EntitySetter newTitle, Guid userId, string tagsString)
        {
            var enType = newTitle.Type;

            switch (enType)
            {
                case "IMG":
                case "BOOK":
                    var img = _liveContext.UserImages.FirstOrDefault(x => x.UrlAddress == newTitle.Id && x.UserId == userId);
                    if (img != null)
                    {
                        var title = newTitle.Title;
                        img.ChangeTitle(title);

                        img.ChangeTags(tagsString);
                        _liveContext.Update(img);
                        await _liveContext.SaveChangesAsync();
                        return _autoMapper.Map<IconDto>(img);
                        //return new IconDto(img.UrlAddress, title);
                    }
                    break;

                case "YT":
                case "MOVIE":
                    var yt = _liveContext.UserYoutubes.FirstOrDefault(x => x.VideoId == newTitle.Id && x.UserId == userId);
                    if (yt != null)
                    {
                        var titleYT = newTitle.Title;
                        yt.ChangeTitle(titleYT);

                        yt.ChangeTags(tagsString);
                        _liveContext.Update(yt);
                        await _liveContext.SaveChangesAsync();
                        return _autoMapper.Map<IconDto>(yt);
                        //return new IconDto(yt.VideoId, titleYT);
                    }
                    break;

                case "SPOTIFY":
                    var sp = _liveContext.UserSpotify.FirstOrDefault(x => x.SpotifyId == newTitle.Id && x.UserId == userId);
                    if (sp != null)
                    {
                        var titleSP = newTitle.Title;
                        sp.ChangeTitle(titleSP);

                        sp.ChangeTags(tagsString);
                        _liveContext.Update(sp);
                        await _liveContext.SaveChangesAsync();
                        return _autoMapper.Map<IconDto>(sp);
                        //return new IconDto(sp.SpotifyId, titleSP);
                    }
                    break;


                case "FOLDER":
                    var fol = _liveContext.Folders.FirstOrDefault(x => x.ID.ToString() == newTitle.Id && x.UserId == userId);
                    if (fol != null)
                    {
                        var titleF = newTitle.Title;
                        fol.ChangeTitle(titleF);
                        _liveContext.Update(fol);
                        await _liveContext.SaveChangesAsync();
                        return _autoMapper.Map<IconDto>(fol);
                        //return new IconDto(fol.ID.ToString(), titleF);
                    }
                    break;

            }

            return null;

        }

        public async Task<FolderDto> EditFolder(Guid UserId, EntitySetter folderSetter)
        {
            var FolderId = new Guid(folderSetter.Id);
            var folder = _liveContext.Folders
                .Where(x => x.UserId == UserId && x.ID == FolderId)
                .Include(x => x.UserYouTubes)
                .Include(x => x.UserImages)
                .Include(x => x.UserSpotify)
                .FirstOrDefault(x => x.UserId == UserId && x.ID == FolderId);

            if (folder != null)
            {
                folder.ChangeDescription(folderSetter.Description);
                folder.ChangeTitle(folderSetter.Title);

                bool shared = folder.ShareFolder(folderSetter.Shared);
                if (!shared)
                {
                   // _liveContext.SharedFolders.RemoveRange(_liveContext.SharedFolders.Where(x => x.FolderId == FolderId));
                }

                _liveContext.Update(folder);
                await _liveContext.SaveChangesAsync();
            }
            return _autoMapper.Map<FolderDto>(folder);
        }

        public async Task<FolderDto> FollowFolder(Guid UserId, Guid FolderId, string left, string top)
        {

            var sharedFolder = _liveContext.SharedFolders.FirstOrDefault(x => x.UserId == UserId && x.FolderId == FolderId);
            var folder = _liveContext.Folders.Include(x => x.UserYouTubes)
                                            .Include(x => x.UserImages)
                                            .Include(x => x.UserSpotify)
                                            .FirstOrDefault(x => x.ID == FolderId);
            if (folder != null && sharedFolder == null)
            {
                if (sharedFolder == null && folder.IsShared)
                {
                    sharedFolder = new SharedFolder(UserId, FolderId, left, top);
                    _liveContext.SharedFolders.Add(sharedFolder);
                    //folder.AddFollower();
                    _liveContext.Update(folder);
                    await _liveContext.SaveChangesAsync();
                    //return _autoMapper.Map<FolderDto>(folder);

                    var folderDto = _autoMapper.Map<FolderDto>(folder);
                    var followers = _liveContext.SharedFolders.Where(x => x.FolderId == folder.ID).ToList().Count;
                    folderDto.followers = followers;
                    folderDto.followed = true;
                    return folderDto;
                }
            }

            return null;
        }



        public async Task<FolderDto> FollowDesk(Guid UserId, Guid ownerId, string left, string top)
        {

            if (UserId != ownerId)
            {
                var sharedDesk = _liveContext.SharedDesktops.FirstOrDefault(x => x.UserId == UserId && x.OwnerId == ownerId);

                var userDesk = _liveContext.Users.Include(x => x.UserYoutubes)
                                                .Include(x => x.UserImages)
                                                .Include(x => x.UserSpotify)
                                                .FirstOrDefault(x => x.ID == ownerId);

                if (userDesk != null && sharedDesk == null)
                {
                    //if(userDesk.IsPublic.HasValue)
                    // if (userDesk.IsPublic.Value)
                    // {
                    sharedDesk = new SharedDesktop(UserId, ownerId, left, top);
                    _liveContext.SharedDesktops.Add(sharedDesk);

                    await _liveContext.SaveChangesAsync();

                    var desktopDto = _autoMapper.Map<FolderDto>(userDesk);
                    var followers = _liveContext.SharedDesktops.Where(x => x.OwnerId == ownerId).ToList().Count;
                    desktopDto.followers = followers;
                    desktopDto.followed = true;
                    return desktopDto;
                    // }
                }
            }

            return null;
        }



        public async Task<FolderDto> UnFollowFolder(Guid UserId, Guid FolderId)
        {
            var sharedFolder = _liveContext.SharedFolders.FirstOrDefault(x => x.UserId == UserId && x.FolderId == FolderId);

            var folder = _liveContext.Folders.Include(x => x.UserYouTubes)
                                  .Include(x => x.UserImages)
                                  .Include(x => x.UserSpotify)
                                  .FirstOrDefault(x => x.ID == FolderId);

            if (folder != null && sharedFolder != null)
            {
                _liveContext.SharedFolders.Remove(sharedFolder);
                //folder.RemoveFollower();
                _liveContext.Update(folder);
                await _liveContext.SaveChangesAsync();

                var folderDto = _autoMapper.Map<FolderDto>(folder);
                var followers = _liveContext.SharedFolders.Where(x => x.FolderId == folder.ID).ToList().Count;
                folderDto.followers = followers;
                folderDto.followed = false;
                return folderDto;

            }

            return null;
        }


        public async Task<FolderDto> UnFollowDesk(Guid UserId, Guid OwnerId)
        {
            var sharedDesk = _liveContext.SharedDesktops.FirstOrDefault(x => x.UserId == UserId && x.OwnerId == OwnerId);

            var desk = _liveContext.Folders.Include(x => x.UserYouTubes)
                                  .Include(x => x.UserImages)
                                  .Include(x => x.UserSpotify)
                                  .FirstOrDefault(x => x.ID == OwnerId);

            if (desk != null && sharedDesk != null)
            {
                _liveContext.SharedDesktops.Remove(sharedDesk);
                //folder.RemoveFollower();
                _liveContext.Update(desk);
                await _liveContext.SaveChangesAsync();

                var folderDto = _autoMapper.Map<FolderDto>(desk);
                var followers = _liveContext.SharedDesktops.Where(x => x.OwnerId == desk.ID).ToList().Count;
                folderDto.followers = followers;
                folderDto.followed = false;
                return folderDto;

            }

            return null;
        }



        public async Task<FolderDto> GetDeskInfoAsync(Guid userId, Guid ownerId)
        {
            var sharedDesk = await _liveContext.SharedDesktops.FirstOrDefaultAsync(x => x.UserId == userId && x.OwnerId == ownerId);
            var desk = _liveContext.Users.FirstOrDefault(x => x.ID == ownerId);

            if (desk != null )
            {
                var folderDto = _autoMapper.Map<FolderDto>(desk);
                var followers = _liveContext.SharedDesktops.Where(x => x.OwnerId == desk.ID).ToList().Count;
                folderDto.followers = followers;
                folderDto.followed = sharedDesk != null;
                return folderDto;
            }

            return null;
        }

        private async Task UpdateUserById(Guid userId)
        {
            var user = await _liveContext.Users.FirstOrDefaultAsync(x => x.ID == userId);
            if(user != null)
            {
                user.UpdateDate();
            }
        }
    }

}