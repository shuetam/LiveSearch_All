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
    public class ActuallController : LiveController
    {
        private readonly IExploreRepository _actuallRepository;
        private readonly IUserDesktopRepository _desktopRepository;
        private readonly IUpdatingRepository _updateRepository;

        public ActuallController(IExploreRepository repository, IUserDesktopRepository desktopRepository, IUpdatingRepository updateRepository)
        {
            this._actuallRepository = repository;
            this._desktopRepository = desktopRepository;
            this._updateRepository = updateRepository;
        }


        [HttpPost("getactualltopicons")]
        public async Task<IActionResult> TakeTopYT()
        {
            var top = await _actuallRepository.GetAllActuallYTAsync();
            var topImg = await _actuallRepository.GetAllActuallIMGAsync();


            if (top.Where(x => x.isSong).Count() == 0)
                await _updateRepository.SongsUpdateAsync();
            
            if (top.Where(x => !x.isSong).Count() == 0)
                await _updateRepository.TvMoviesUpdateAsync(true);


            if (top.Count > 0)
                top.AddRange(topImg);


            top = top.Where(x => !x.id.Contains("Error")).ToList();

            top.Shuffle();
            return Json(top);
        }

        [HttpPost("getDeskInfo")]
        public async Task<IActionResult> GetDeskInfo([FromBody] EntitySetter entity)
        {
            var ownerId = new Guid(entity.OwnerId);
            var folderInfo = await _desktopRepository.GetDeskInfoAsync(ownerId, ownerId);
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
