using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Live.Controllers;
using Live.Core;
using Live.Services;
using Live.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Live.Repositories
{

    public class AdminRepository : IAdminRepository
    { 

        private readonly LiveContext _liveContext;
        private readonly IMapper _autoMapper;
        private readonly IJwtService _jwtService;

         private readonly ITVMovieRepository _tvMovieRepository;

        public AdminRepository(LiveContext liveContext, IMapper autoMapper, IJwtService jwtService , ITVMovieRepository tvMovieRepository)
        {
            this._liveContext = liveContext;
            this._autoMapper = autoMapper;
            this._jwtService = jwtService;
            this._tvMovieRepository = tvMovieRepository;
        }

        public async Task <AdminUpdatesDto> GetAdminUpdates()
        {

            var date12 = DateTime.Now.AddHours(-12);
            var actuallSongs =  await _liveContext.Songs.Include(s => s.YouTube).Where(s => s.PlayAt>=date12).ToListAsync();
            //var actuallSongs = await _liveContext.Songs.Include(x => x.YouTube).ToListAsync();
            var songsCount = actuallSongs.Count;
            DateTime? lastUpdateSong = null;
            DateTime? lastPlayedSong = null;
            DateTime? songsFirstPlayed = null;
            var songsErrors = actuallSongs.Where(x => x.YouTube.VideoID.Contains("Error") || x.YouTube.VideoID==x.Name || x.YouTube.VideoID.Contains("!!ID!!"));
            var stations = songsErrors.Select(x => x.Station).ToHashSet();
            string songErrorInfo = songsErrors.ToList().Count.ToString();
            string songsHours = "";
            string moviesHous = "";

            foreach(var st in stations)
            {
                songErrorInfo += "." + st;
            }

            if(songsCount>0)
            {
                var newestSong =  actuallSongs.Where(x=> x.Added.HasValue).Select( x => x.Added.Value).ToList();
                var lastPlayed = actuallSongs.Select( x => x.PlayAt).ToList();
                if(newestSong.Count>0)
                {
                   lastUpdateSong = newestSong.Max();
                }
                if(lastPlayed.Count>0)
                {
                    lastPlayedSong = lastPlayed.Max();
                    songsFirstPlayed = lastPlayed.Min();

                    if(lastPlayedSong.HasValue && songsFirstPlayed.HasValue)
                    {
                        songsHours = Math.Round(((lastPlayedSong.Value - songsFirstPlayed.Value).TotalHours + 1), 2).ToString();
                    }
                }
            }


          /*   var actuallTvMovies = await _liveContext.TVMovies.Include(x => x.YouTube)
            .Where(x => x.PlayAt >= DateTime.Now.AddHours(-0.5))
            .ToListAsync(); */

        var showingTvMovies = await  _tvMovieRepository.GetActuallMovies();

         var allFutureTvMovies = await  _tvMovieRepository.GetAllFutureMovies();


           //var actuallTvMovies = await _liveContext.TVMovies.Include(x => x.YouTube).ToListAsync();
            var moviesCount = allFutureTvMovies.Count;
            DateTime? lastUpdateMovie = null;
            var moviesErrors = allFutureTvMovies.Where(x => x.id.Contains("Error"));
            var moviesRating = allFutureTvMovies.Where(x => x.countValue == 0).ToList().Count;
            
            string firsPlayedMovie = "";
            string lastPlayedMovie = "";
            if(moviesCount>0)
            {
                var plays = allFutureTvMovies.Select(x => x.playAt);
                firsPlayedMovie = plays.Min().ToString("dd.MM.yyyy HH:mm");
                lastPlayedMovie = plays.Max().ToString("dd.MM.yyyy HH:mm");
                lastUpdateMovie = plays.Max();
                moviesHous =  Math.Round((plays.Max() - plays.Min()).TotalHours, 2).ToString();

            }

           // var showingMovies = actuallTvMovies.Where(x => x.PlayAt <= DateTime.Now.AddHours(24)).ToList();
            
            var showingMovies = showingTvMovies.ToList();
           
            var showingMoviesCount = showingMovies.Count;
            var showingMoviesCountErrors = showingMovies.Where(x => x.id.Contains("Error")).ToList().Count;
            var showingMoviesRating = showingMovies.Where(x => x.countValue == 0).ToList().Count;
            var actuallBooks = await _liveContext.Bestsellers.ToListAsync();

        var Bonito = actuallBooks.Where(x => x.Store == "Bonito").ToList().Count;
        var Aros = actuallBooks.Where(x => x.Store == "Aros").ToList().Count;
        var Czytam = actuallBooks.Where(x => x.Store == "Czytam").ToList().Count;
        var Empik = actuallBooks.Where(x => x.Store == "Empik").ToList().Count;
        var Gandalf = actuallBooks.Where(x => x.Store == "Gandalf").ToList().Count;
        var Livro = actuallBooks.Where(x => x.Store == "Livro").ToList().Count;
        var Profit24 = actuallBooks.Where(x => x.Store == "Profit24").ToList().Count;


            var bestsellersErrors = actuallBooks.Where(x => x.Title.Contains('�')  || x.Author.Contains('�')  ).ToList().Count;

            var booksCount = actuallBooks.Count;
            DateTime? lastUpdateBook = null;
            if(booksCount>0)
            {
                var newest =  actuallBooks.Where(x=> x.Added.HasValue).OrderByDescending( x => x.Added.Value).FirstOrDefault();
                lastUpdateBook = newest.Added;
            }


         
            var udpateInfo = new AdminUpdatesDto();
            udpateInfo.SongsLastPlayed = lastPlayedSong.HasValue? lastPlayedSong.Value.ToString("dd.MM.yyyy HH:mm") : "";
            udpateInfo.songsFirstPlayed = songsFirstPlayed.HasValue? songsFirstPlayed.Value.ToString("dd.MM.yyyy HH:mm") : "";   
            udpateInfo.SongsCount = songsCount;
            udpateInfo.SongsUpdate = lastUpdateSong.HasValue? lastUpdateSong.Value.ToString("dd.MM.yyyy HH:mm") : "";
            udpateInfo.TvMoviesCount = moviesCount;
            udpateInfo.TvMoviesUpdate = lastUpdateMovie.HasValue? lastUpdateMovie.Value.ToString("dd.MM.yyyy HH:mm") : "";
            udpateInfo.BestsellersCount = booksCount;
            udpateInfo.BestsellersUpdate = lastUpdateBook.HasValue? lastUpdateBook.Value.ToString("dd.MM.yyyy HH:mm") : "";
            udpateInfo.songsErrors = songErrorInfo;
            udpateInfo.moviesErrors = moviesErrors.ToList().Count;
            udpateInfo.showingMoviesCount = showingMoviesCount;
            udpateInfo.showingMoviesCountErrors = showingMoviesCountErrors;
            udpateInfo.moviesFirstPlayed = firsPlayedMovie;
            udpateInfo.moviesLastPlayed = lastPlayedMovie;
            udpateInfo.songsHours = songsHours;
            udpateInfo.moviesHours = moviesHous;
            udpateInfo.moviesRuning = InfoCaches.duringMovieUpdate? "Yes" : "No";
            udpateInfo.songsRuning = InfoCaches.duringSongsUpdate? "Yes" : "No";
            udpateInfo.booksRuning = InfoCaches._booksUpdatingRunning? "Yes" : "No";

            udpateInfo. Bonito =    Bonito.ToString();
            udpateInfo.Aros = Aros.ToString();
            udpateInfo.Czytam = Czytam.ToString();
            udpateInfo.Empik = Empik.ToString();
            udpateInfo.Gandalf =Gandalf.ToString();
            udpateInfo.Livro = Livro.ToString();
            udpateInfo.Profit24 = Profit24.ToString();

            udpateInfo.mRating = moviesRating.ToString();
            udpateInfo.shRating = showingMoviesRating.ToString();
           
           udpateInfo.bestsellersErrors = bestsellersErrors.ToString();
            return udpateInfo;

        }
        
        public async Task <List<UserAdminDto>> GetAllUsersAsync()
        {
            var users = await _liveContext.Users
            .Where(x => x.UserRole != "ADMIN")
            .Include(x => x.UserImages)
            .Include(x => x.UserYoutubes)
            .Include(x => x.UserSpotify).ToListAsync();

            return users.OrderByDescending(x => x.CreatedAt)
            .Select(x => _autoMapper.Map<UserAdminDto>(x)).ToList();
        }

        public async Task <UserAdminDto> ChangeUserStatus(SocialLogin user)
        {
            var exUser = _liveContext.Users.FirstOrDefault(x => x.UserEmail == user.Email  && x.AuthType == user.AuthType);

            //Console.WriteLine("-----" + user.Email);
           // Console.WriteLine("-----" + user.AuthType);


            if(exUser != null)
            {
               exUser.ChangeStatus();
               _liveContext.Update(exUser);
               await _liveContext.SaveChangesAsync();
               return _autoMapper.Map<UserAdminDto>(exUser);
            }
            return null;
        }
    }

}