using Live.Repositories;
using Microsoft.AspNetCore.Mvc;
using Live.Core;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Timers;
using Serilog;

namespace Live.Controllers
{
    //[EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "ADMIN")]
    public class AdminController : LiveController
    {
        private readonly  ISongsRepository _songRepository;
        private readonly  ITVMovieRepository _movieRepository;
        private readonly  IAdminRepository _adminRepository;
         private readonly  IUpdatingRepository _updateRepository;

        private readonly IBestsellersRepository _bestSellersRepository;

        private static Timer songTimer = new Timer();
        private static  Timer movieTimer = new Timer();
        private static  Timer bookTimer = new Timer();

        public AdminController (ISongsRepository songRepository, ITVMovieRepository movieRepository,
         IAdminRepository adminrepo, IBestsellersRepository bestRepo, IUpdatingRepository updateRepository)
        {
            this._songRepository = songRepository;
            this._movieRepository = movieRepository;
            this._adminRepository = adminrepo;
           this._bestSellersRepository = bestRepo;
           this._updateRepository = updateRepository;
        }

//for testing!
   
     /*       [HttpPost("startsongsupdating1")]
        public async Task<IActionResult> StartSongsUpdating1()
        {
            //await  _songRepository.UpdateAsync();
         
            SongIntervalTest = 0.5;
            
            songTimer.Interval = TimeSpan.FromSeconds(SongIntervalTest).TotalMilliseconds; 
                
            songTimer.Elapsed +=  OnTimedEvent;
         

            songTimer.Enabled = true;
            songTimer.Start();

            return Json("Songs updated and started");
        }   */

        private static void StartSongUpdater() {
 
            double songInterval = 3600000;
            songTimer.Interval = TimeSpan.FromHours(songInterval).TotalMilliseconds;      
            songTimer.Elapsed +=  SongsUpdate;
            songTimer.Enabled = true;
        }
    private static  async void SongsUpdate(Object source, System.Timers.ElapsedEventArgs e)
    {
         //await  UpdatingRepository.SongsUpdateAsync1();
    }


        [HttpPost("startsongsupdating")]
        public async Task<IActionResult> StartSongsUpdating()
        {
          await _updateRepository.SongsUpdateAsync();
         
            return Json("Songs updated");
        }   



     [HttpPost("starttvmoviesupdating")]
        public async Task<IActionResult> StartTvMoviesUpdating()
        {
            await  _updateRepository.TvMoviesUpdateAsync(true);
            /* var TvMoviesInterval = 24;
            movieTimer.Interval = TimeSpan.FromHours(TvMoviesInterval).TotalMilliseconds;      
            movieTimer.Elapsed +=  MoviesUpdate;
           
            movieTimer.Enabled = true;
            movieTimer.Start(); */

            return Json("Movies updated");
        }

        [HttpPost("starttvmoviesupdatingwithoutyt")]
        public async Task<IActionResult> StartTvMoviesUpdatingWYT()
        {
            await  _updateRepository.TvMoviesUpdateAsync(false);
            /* var TvMoviesInterval = 24;
            movieTimer.Interval = TimeSpan.FromHours(TvMoviesInterval).TotalMilliseconds;      
            movieTimer.Elapsed +=  MoviesUpdate;
           
            movieTimer.Enabled = true;
            movieTimer.Start(); */

            return Json("Movies updated without Youtubes");
        }

    private  async void MoviesUpdate(Object source, System.Timers.ElapsedEventArgs e)
    {
       //await  _updateRepository.TvMoviesUpdateAsync();
    }


        [HttpPost("startbooksupdating")]
        public async Task<IActionResult> StartBooksUpdating()
        {
            await _bestSellersRepository.UpdateAsync();
           
           /*  var BooksInterval = 48;
            var random = new Random();
            bookTimer.Interval = TimeSpan.FromHours(BooksInterval).TotalMilliseconds;      
            bookTimer.Elapsed +=  BooksUpdate;
            bookTimer.Enabled = true;
            bookTimer.Start(); */

            return Json("Books updated and started");
        }

   private  async void BooksUpdate(Object source, System.Timers.ElapsedEventArgs e)
    {
        await _bestSellersRepository.UpdateAsync();
    }


        [HttpPost("getallusers")]
        public async Task <IActionResult> GetUsersInfo()
        {
           var users = await _adminRepository.GetAllUsersAsync();
           return Json(users);
        }

        [HttpPost("changeuserstatus")]
        public async Task <IActionResult> ChangeUserStatus([FromBody]SocialLogin user)
        {
           var users = await _adminRepository.ChangeUserStatus(user);
           return Json(users);
        }


        [HttpPost("changebookproperties")]  
        public async Task <IActionResult> ChangeBookProperties([FromBody]IconDto book)
        {
           var splitTitle = book.title.Split("||").ToList();

           // Console.WriteLine(splitTitle);

           if(splitTitle.Count > 1)
           {
               var newTitle = splitTitle[0];
               var newAuthor = splitTitle[1];
               //Console.WriteLine(newTitle);
                //Console.WriteLine(newAuthor);
               await _bestSellersRepository.ChangeBookTitle(book.id, newTitle, newAuthor);
               return Json(newTitle+"||"+newAuthor);
           }
          
          
           return Json("No changes");
        }

        [HttpPost("getupdatesinfo")]
        public async Task <IActionResult> GetUpdatesInfo()
        {
           var updates = await _adminRepository.GetAdminUpdates();

            /* updates.movieInterval  = Math.Round(TvMoviesInterval,2).ToString()+"h";
            updates.songInterval  = Math.Round(SongInterval,2).ToString()+"h";
            updates.bookInterval = Math.Round(BooksInterval,2).ToString()+"h"; */

           return Json(updates);
        }

        [HttpPost("edityoutube")]
        public async Task <IActionResult> EditYoutube([FromBody]EditYoutube editYoutube)
        {
            //Debug.Print("EDITSONG");
            if(editYoutube.newYouTubeId != editYoutube.youTubeId)
            {
                await _songRepository.ChangeYouTubeId(editYoutube.name, editYoutube.youTubeId, editYoutube.newYouTubeId);
                 await _movieRepository.ChangeYouTubeId(editYoutube.name, editYoutube.newYouTubeId);
            }
            if(editYoutube.newName != editYoutube.name)
            {
                await _songRepository.ChangeName(editYoutube.youTubeId, editYoutube.newName);
                await _movieRepository.ChangeName(editYoutube.youTubeId, editYoutube.newName);
            }
           return Json(editYoutube);
        }

        [HttpPost("changeyoutubelocation")]
        public async Task <IActionResult> ChangeLocation([FromBody]EntitySetter editYoutube)
        {
            await _songRepository.ChangeLocation(editYoutube.Id, editYoutube.Left, editYoutube.Top);
            await _movieRepository.ChangeLocation(editYoutube.Id, editYoutube.Left, editYoutube.Top);
           return Json(editYoutube);
        }


        [HttpPost("changemovierating")]
        public async Task <IActionResult> ChangeMovieRating([FromBody] IconDto movie)
        {
           var rating = await _movieRepository.ChangeRating(movie.count, movie.id);
           return Json(rating);
        }


        [HttpPost("update")]
        public async Task Post()
        {
           await  _updateRepository.SongsUpdateAsync();
        }

        [HttpPost("allarchive")]
        public async Task <IActionResult> GetAllSongs()
        {
            var songs = await _songRepository.GetAllFromArchive();
            return Json(songs);
        }



        [HttpPost("getallerrors")]
        public async Task <IActionResult> GetAllErrors()
        {
            var songs = await _songRepository.GetAllErrorsFromArchive();
            var movies = await _movieRepository.GetAllErrorsFromArchive();
            songs.AddRange(movies);
            return Json(songs);
        }

        [HttpPost("getallmoviesinfuture")]
        public async Task <IActionResult> GetAllFutureMovies()
        {
            var movies = await _movieRepository.GetAllFutureMovies();
            return Json(movies);
        }

        [HttpPost("archive/{i}/{j}")]
        public async Task <IActionResult> GetArchiveSongs(int i, int j)
        {
            var songs = await _songRepository.GetFromArchiveByIndex(i, j);
            return Json(songs);
        }

        [HttpPost("deleteyoutube")]
        public async Task <IActionResult> DeleteByYouTubeId([FromBody]EditYoutube youTube)
        {
            //Console.WriteLine("youTube.youTubeId");
            //Console.WriteLine(youTube.youTubeId);
             await _songRepository.DeleteByYouTubeId(youTube.youTubeId);
             await _movieRepository.DeleteByYouTubeId(youTube.youTubeId);
             return Json(youTube.youTubeId);
        }

        [HttpPost("changename/{Id}")]
        public async Task <IActionResult> ChangeName(string Id, [FromBody] NameSetter Name)
        {
             await _songRepository.ChangeName(Id, Name.name);
             return NoContent();
        }

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
