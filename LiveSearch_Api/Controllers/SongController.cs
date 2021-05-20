using System.Linq;
using System.Threading.Tasks;
using Live.Repositories;
using Microsoft.AspNetCore.Mvc;


namespace Live.Controllers
{
    //[EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [Route("api/[controller]")]
   /* [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
  [Authorize(Roles = "ADMIN")] */
    public class SongController : LiveController
    {
        private readonly  ISongsRepository _songRepository;
      
      

        public SongController (ISongsRepository songRepository)
        {
            this._songRepository = songRepository;
        }

  /*       [HttpPost("update")]
        public async Task Post()
        {
           await  _songRepository.UpdateAsync();
        } */

       

/*         private async void AutoUpdate()
        {
        await  _songRepository.UpdateAsync();
        } */

        [HttpPost("allradiosongs/{stations}")]
        public async Task <IActionResult> GetAllActualSongs(string stations)
        {
            var radio_list= stations.Split('_').ToList();
            var songs = await _songRepository.GetActualByRadioAsync(radio_list);
            return Json(songs);
        }

        [HttpPost("radiorandom")]
        public async Task <IActionResult> GetAllRandomSongs()
        {
            var songs = await _songRepository.GetActualRandomSongs();
            return Json(songs);
        }
    }
}
