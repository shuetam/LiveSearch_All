using Live.Core;
using Live.Extensions;
using Live.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Live.Controllers
{

    [Route("api/[controller]")]
    public class ActuallController : LiveController
    {
        private readonly IExploreRepository _actuallRepository;
        private readonly IUserDesktopRepository _desktopRepository;

        public ActuallController(IExploreRepository repository, IUserDesktopRepository desktopRepository)
        {
            this._actuallRepository = repository;
            this._desktopRepository = desktopRepository;
        }


        [HttpPost("getactualltopicons")]
        public async Task<IActionResult> TakeTopYT()
        {
            var top = await _actuallRepository.GetAllActuallYTAsync();
            var topImg = await _actuallRepository.GetAllActuallIMGAsync();
            top.AddRange(topImg);

            top.Shuffle();
            return Json(top);
        }

        [HttpPost("getFolderInfo")]
        public async Task<IActionResult> GetFolderInfo([FromBody] EntitySetter entity)
        {
            var folderId = new Guid(entity.FolderId);
            var folderInfo = await _desktopRepository.GetFolderInfoAsync(folderId, folderId);
            return Json(folderInfo);
        }


        //[HttpPost("getsharedfolders")]
        //public async Task<IActionResult> TakeSharedFolders()
        //{
        //    var top = await _actuallRepository.GetAllActuallYTAsync();
        //    var topImg = await _actuallRepository.GetAllActuallIMGAsync();
        //    top.AddRange(topImg);

        //    top.Shuffle();
        //    return Json(new ExploreResultsDto(top, 1, 1));
        //}

        /*  [HttpPost("getactualltopimg")]
         public async Task<IActionResult> TakeTopIMG()
         {

              var top = await _actuallRepository.GetAllActuallIMGAsync();
             top.Shuffle();
              return Json(top);
         } */
    }
}
