using Live.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Live.Controllers
{
    //[EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [Route("api/[controller]")]
    public class MovieController : LiveController
    {
        private readonly  ITVMovieRepository _movieRepository;
        
        public MovieController (ITVMovieRepository movieRepository)
        {
            this._movieRepository = movieRepository;
        }

        
        [HttpPost("takemovies")]
        public async Task<IActionResult> TakeMovies()
        {
           // Log.Information("Hello from movies");
             var movies = await _movieRepository.GetActuallMovies();

             return Json(movies);
        }

     /*    [HttpPost("update")]
        public async Task UpdateMovies()
        {
            await _movieRepository.UpdateAsync();
        } */


    }
}
