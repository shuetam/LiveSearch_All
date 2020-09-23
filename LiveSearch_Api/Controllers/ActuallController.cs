using Live.Core;
using Live.Extensions;
using Live.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Live.Controllers
{

    [Route("api/[controller]")]
    public class ActuallController : LiveController
    {
        private readonly IExploreRepository _actuallRepository;

        public ActuallController(IExploreRepository repository)
        {
            this._actuallRepository = repository;
        }


        [HttpPost("getactualltopicons")]
        public async Task<IActionResult> TakeTopYT()
        {
            var top = await _actuallRepository.GetAllActuallYTAsync();
            var topImg = await _actuallRepository.GetAllActuallIMGAsync();
            top.AddRange(topImg);

            top.Shuffle();
            return Json(new ExploreResultsDto(top, 1, 1));
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
