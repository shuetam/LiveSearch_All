using Live.Core;
using Live.Extensions;
using Live.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Live.Controllers
{

    [Route("api/[controller]")]
    public class ExploreController : LiveController
    {
        private readonly IExploreRepository _exploreRepository;

        public ExploreController(IExploreRepository repository)
        {
            this._exploreRepository = repository;
        }


        [HttpPost("geticons")]
        public async Task<IActionResult> SearchIcons([FromBody] ExploreQuery Query)
        {
            string query = Query.query;
            int count = Query.count;
            int skip = count * Query.next;


            if (!string.IsNullOrEmpty(query))
            {
                var explore = await _exploreRepository.ExploreIconsAsync(query, count, skip);
                return Json(explore);
            }



            var top = await _exploreRepository.GetAllActuallYTAsync();
            var topImg = await _exploreRepository.GetAllActuallIMGAsync();

            if (top.Count > 0)
            {
                top.AddRange(topImg);
            }
            top = top.Skip(skip).Take(count).ToList();
            //var results = new ExploreResultsDto(top, 6, 1);
            return Json(top);
        }

        [HttpPost("getsharedfolders")]
        public async Task<IActionResult> SharedFolders([FromBody] ExploreQuery Query)
        {
            string folderId = Query.folderId;
            string userFolder = Query.userFolder;

            if (!string.IsNullOrEmpty(folderId))
            {
                var folderContent = await _exploreRepository.GetIconsForFolder(folderId);
                return Json(folderContent);
            }

            int count = Query.count;
            int skip = count * Query.next;
            string query = Query.query;
            var folders = await _exploreRepository.GetAllSharedFoldersAsync(query, skip, count, userFolder);

            //var results = new ExploreResultsDto(folders, folders.Count);
            return Json(folders);
        }
        
        [HttpPost("getshareddesktops")]
        public async Task<IActionResult> SharedDesktops([FromBody] ExploreQuery Query)
        {
            
            int count = Query.count;
            int skip = count * Query.next;
            string query = Query.query;
            var desktops = await _exploreRepository.GetAllSharedDesktopsAsync(query, skip, count);

            return Json(desktops);
        }


        [HttpPost("getPublicIconsForDesk")]
        public async Task<IActionResult> GetIconsForDesk([FromBody] EntitySetter entity)
        {
            if (string.IsNullOrEmpty(entity.OwnerId))
                return null; 

            var ownerId = new Guid(entity.OwnerId);
            var icons = await _exploreRepository.GetDeskIconsAsync(ownerId, entity.FolderId);
            return Json(icons);
        }
    }
}
