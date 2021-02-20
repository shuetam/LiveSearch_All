using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Live.Controllers;
using Live.Core;


namespace Live.Repositories
{
    public interface IUserDesktopRepository
    {   
        Task<List<IconDto>> GetAllIconsForUserAsync(Guid userId, string folderId);
        Task<List<IconDto>> GetAllImagesForUserAsync(Guid userId, string folderId);

        Task<List<IconDto>> GetAllSpotifyForUserAsync(Guid userId, string folderId);
         Task<IconDto> ChangeEntityTitleAsync(EntitySetter newTitle, Guid userId, string tagsString);
        
        Task<bool> AddYouTubeAsync(EntitySetter addYoutube, Guid userId, string tagsString);
        Task<bool> AddImageAsync(EntitySetter addYoutube, Guid userId, string tagsString);
       Task<bool> AddSpotifyAsync(EntitySetter addSpotify, Guid userId, string tagsString);
        Task<FolderDto> CreateFolderAsync(Guid userId, EntitySetter Folder);
        Task<object> AddEntityToFolder(Guid userId, string folderId, string entityId, string entityType);
    
        Task RemoveEntity(Guid userId, string entityId, string entityType);
        Task MoveEntityFromFolder(Guid userId, string entityId, string entityType);
        Task<List<FolderDto>> GetAllFoldersForUserAsync(Guid userId);
        Task<List<FolderDto>> GetFollowedFoldersForUserAsync(Guid userId);
        Task<object> GetAllIconsIdAsync(Guid userId);

        Task SaveIconsLocations(Guid userId, List<EntitySetter> icons);
        
        Task<List<IconDto>> GetNewIcons( Guid userId, EntitySetter data);
        Task<FolderDto> EditFolder(Guid UserId, EntitySetter folderSetter);
        Task<FolderDto> FollowFolder(Guid UserId, Guid FolderId, string left, string top);
        Task<FolderDto> UnFollowFolder(Guid UserId, Guid FolderId);
        Task<FolderDto> GetFolderInfoAsync(Guid userId, Guid folderId);
    }

}
