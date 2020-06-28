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
        private readonly  IExploreRepository _exploreRepository;
        
        public ExploreController (IExploreRepository repository)
        {
            this._exploreRepository = repository;
        }

        
        [HttpPost("geticons")]
        public async Task<IActionResult> SearchIcons([FromBody] ExploreQuery Query)
        {
            string query = Query.query;
            int count = Query.count;
            int skip = count * Query.next;

            if(!string.IsNullOrEmpty(query))
            {
                var explore = await _exploreRepository.ExploreIconsAsync(query, count, skip);
                return Json(explore);
            }
            

            var top = await _exploreRepository.GetAllActuallYTAsync();
            var topImg = await _exploreRepository.GetAllActuallIMGAsync();

            top.AddRange(topImg);
            var results = new ExploreResultsDto(top, 6);
            return Json(results);
        }  
    }
}
