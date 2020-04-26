using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Live.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Live.Mapper;
using HtmlAgilityPack;
using Serilog;
using Live.Settings;

namespace Live.Repositories
{
    public class TVMovieRepository : ITVMovieRepository
    {

        private readonly LiveContext _liveContext;
        private readonly IMapper _autoMapper;
        private readonly SqlConnectingSettings _sql;

        public TVMovieRepository(LiveContext liveContext, IMapper autoMapper, SqlConnectingSettings sql)
        {
            this._liveContext = liveContext;
            this._autoMapper = autoMapper;
            this._sql = sql;
        }

        private bool GetExists(TVMovie tvMovie)
        {
            var actuall = _liveContext.TVMovies.FirstOrDefault(x => x.Title == tvMovie.Title && x.PlayAt == tvMovie.PlayAt);
            return actuall == null;
        }

        public async Task<string> ChangeRating(string newRating, string videoId)
        {
            var movies = await _liveContext.TVMovies.Include(x => x.YouTube)
            .Where(x => x.YouTube.VideoID == videoId).ToListAsync();

            var archMovies = await _liveContext.ArchiveMovies.Include(x => x.YouTube)
            .Where(x => x.YouTube.VideoID == videoId).ToListAsync();

            string rating = "0,0";

            var actuallMovie = movies.FirstOrDefault();

            if(actuallMovie != null)
            {
                if(string.IsNullOrEmpty(newRating))
                {
                rating = actuallMovie.getFilmwebRating();
                }
                else
                {
                    rating = newRating;
                }

                _liveContext.Update(actuallMovie);
                foreach(var movie in movies)
                {
                    movie.changeRating(rating);
                    //movie.getFilmwebRating();
                    _liveContext.Update(movie);
                }

                foreach(var movie in archMovies)
                {
                    movie.changeRating(rating);
                    //movie.getFilmwebRating();
                    _liveContext.Update(movie);
                }

            }
            await _liveContext.SaveChangesAsync();
            return rating;
        }

        public async Task<List<IconDto>> GetActuallMovies()
        {
            var movies = await _liveContext.TVMovies.Include(x => x.YouTube)
            .Where(x => x.PlayAt >= DateTime.Now.AddMinutes(-30) && x.PlayAt <= DateTime.Now.AddHours(24))
            .ToListAsync();

            var frontMovies = new List<FrontYouTube>();
            foreach (var movie in movies)
            {
                var dates = movies.Where(x => x.Title == movie.Title && x.PlayAt != movie.PlayAt).Select(x => x.PlayAt).ToList();

                frontMovies.Add(new FrontYouTube(movie, dates));

            }
            var frontMoviesToReturn = new List<FrontYouTube>();
            while (frontMovies.Count != 0)
            {
                var movie = frontMovies[0];
                //var songCount = frontMovies.Where(s => s.YouTube.VideoID == song.YouTube.VideoID).ToList().Count;
                frontMoviesToReturn.Add(movie);

                frontMovies.RemoveAll(m => m.videoId == movie.videoId);


            }
            return frontMoviesToReturn.OrderByDescending(x => x.playAt)   
            .Select(m => _autoMapper.Map<IconDto>(m)).ToList();
        }

        private async Task <DateTime> GetLastDate()
        {
            using(var context = new LiveContext(_sql))
            {
            var movies = await context.TVMovies.ToListAsync();
            
            if(movies.Count>0)
            {
                var dates = movies.Select(x => x.PlayAt).ToList();
                return dates.Max();
            }
            return DateTime.Now;
            }
        }

        public async Task<List<IconDto>> GetAllFutureMovies()
        {
            
            var movies = await _liveContext.TVMovies.Include(x => x.YouTube)
            .Where(x => x.PlayAt >= DateTime.Now.AddHours(-0.5))
            .ToListAsync();

             var frontMovies = new List<FrontYouTube>();
             foreach(var movie in movies)
             {
                 frontMovies.Add(new FrontYouTube(movie));
             }

            var frontMoviesToReturn = new List<FrontYouTube>();
            while (frontMovies.Count != 0)
            {
                var movie = frontMovies[0];
                //var songCount = frontMovies.Where(s => s.YouTube.VideoID == song.YouTube.VideoID).ToList().Count;
                frontMoviesToReturn.Add(movie);

                frontMovies.RemoveAll(m => m.videoId == movie.videoId);


            }

              return frontMoviesToReturn.Select(m => _autoMapper.Map<IconDto>(m)).ToList(); 
        }


/*     public async Task UpdateAsync()
    {

        Log.Information($"Start TV movies upating");

        try
        {


        var tvPrograms = new List<string>() {
            "https://www.telemagazyn.pl/tvp_1/",
            "https://www.telemagazyn.pl/tvp_2/",
            "https://www.telemagazyn.pl/polsat/",
            "https://www.telemagazyn.pl/tvn/",
            "https://www.telemagazyn.pl/tvn_7/",
            "https://www.telemagazyn.pl/tv_4/",
            "https://www.telemagazyn.pl/tv_puls/",
            "https://www.telemagazyn.pl/stopklatka/",
            "https://www.telemagazyn.pl/fokus_tv/",
            "https://www.telemagazyn.pl/nowa_tv/",
            "https://www.telemagazyn.pl/metro/",
            "https://www.telemagazyn.pl/wp1/",
            "https://www.telemagazyn.pl/zoom_tv/",
        };

            var toManyReq = false;
            //var lastDate = GetLastDate();

        var todayDate = DateTime.Now.Date;
        var lastDate = DateTime.Now.Date;
        var movies = new List<TVMovie>();

        using(var context = new LiveContext(_sql))
        {
             movies = await context.TVMovies.ToListAsync();
        }
            
        if(movies.Count>0)
        {
            //var youngest =  movies.OrderByDescending(x => x.PlayAt).ToList().FirstOrDefault();
            //lastDate = DateTime.Parse(youngest.UrlEmisionDay).Date;
            
            var dates = movies.Select(x => DateTime.Parse(x.UrlEmisionDay)).ToList();
            lastDate = dates.Max();

        }

        var days = (lastDate - todayDate).TotalDays;

        //var days1 = (lastDate.AddDays(-2) - todayDate).Days;
        //var days2 = (lastDate.AddDays(1) - todayDate).Days;
        //var days3 = (lastDate.AddDays(-4) - todayDate).Days;
        //Console.WriteLine($"days: {days}");
        //Console.WriteLine($"days1: {days1}");
        //Console.WriteLine($"days2: {days2}");
        //Console.WriteLine($"days3: {days3}");

        int from = 0;
        int future = 0;

        if(days < 0)
        {
            from = 0;
            future = 4;
        }
        if(days == 0)
        {
            from = 1;
            future = 4;
        }
        if(days == 1)
        {
            from = 2;
            future = 4;
        }
         if(days == 2)
        {
            from = 3;
            future = 4;
        }
        if(days > 2)
        {
            from = 0;
            future = 0;
        }

        //Console.Write($"Days: {days}");

        var allMovies = new List<TVMovie>();

            for(int i=from; i<future; i++)
            {
                //string z przeslosci - update dzis jutro i pojutrze i popojutrze
                //string taki sam jak teraz - update z jutra i pojutrza i popojutrza
                //string z jutra - update dla pojutrza i popojutrza
                // string z pojutrza - update dla popojutrza 
                // string z dalej niz pojutrze - udpusc update 

             
                var date = System.DateTime.Now.AddDays(i);
                var day = date.ToString("yyyy-MM-dd");

                //Console.WriteLine($"Getting movies from day: {day}");
                
                foreach(var stat in tvPrograms)
                {
                    var progMovies = await GetMoviesForTvStationAsync(stat, day);
                    allMovies.AddRange(progMovies);
                }
            }
  
    var moviesCount = allMovies.Count;
    //Log.Information($"TVMovies UPDATED with {moviesCount} movies");
    foreach (var movie in allMovies)
    {
        var now = DateTime.Now;
        bool inFuture = movie.PlayAt >= now.AddHours(-1);
        var exists = await  GetTheSameFromActual(movie);

        if((exists is null) && inFuture)
        {
            //Console.WriteLine(moviesCount);

            var archiveMovieL = await GetByNameFromArchive(movie.TrailerSearch);

          var archiveMovie = archiveMovieL.FirstOrDefault();
                if(archiveMovie is null)
                {
                    if(toManyReq == false)
                    {
                        movie.SetYoutube();
                    }
                    else
                    {
                        movie.SetWhileYoutube();
                    }

                    if (movie.YouTube.VideoID.Contains("FirstError"))
                    {
                         Log.Warning("First ERROR from TVMovie Update");
                        toManyReq = true;
                    }
                    var rating = movie.getFilmwebRating();
                    await AddToArchiveAsync(movie);
                }
                else
                {
                    movie.SetYoutubeFromArchive(archiveMovie);
                    if(archiveMovie.Rating != null)
                    {
                        movie.changeRating(archiveMovie.Rating);
                    }
                    else{
                        var rating = movie.getFilmwebRating();
                        archiveMovie.changeRating(rating);
                    }
                }

                    //await _liveContext.Songs.AddAsync(movie);

            
                //Console.WriteLine(movie.Title + "  " + movie.YouTube.VideoID);
                movie.Added = DateTime.Now;
                //Console.WriteLine(movie.Title);
                await _liveContext.TVMovies.AddAsync(movie);
                await _liveContext.SaveChangesAsync();
                moviesCount = moviesCount-1;
        }
           // _liveContext.TVMovies.RemoveRange(_liveContext.TVMovies.Where(x => x.PlayAt < DateTime.Now.AddHours(-2)));
    }

    if(allMovies.Count>0)
    {
              
        _liveContext.TVMovies.RemoveRange(_liveContext.TVMovies.Where(x => x.PlayAt < DateTime.Now.AddHours(-2)));
        await _liveContext.SaveChangesAsync();

        var errors = allMovies.Where(x => x.YouTube != null)
        .Where(x => x.YouTube.VideoID.Contains("Error")).ToList();

        Log.Information($"Finish TV movies update with {allMovies.Count} and {errors.Count} youtube errors");
    }
       

        InfoCaches._tvMoviesUpdatingRunning = true;
        }
        catch(Exception ex)
        {
            Log.Error($"Error while updating tvmovies: {ex.Message}");
             Log.Error(ex.StackTrace);
             InfoCaches._tvMoviesUpdatingRunning = false;
        }

    } */

           public async Task<List<TVMovie>> GetMoviesForTvStationAsync(string station, string url, string day)
            {
                var programDay = $"?dzien={day}";

                    var htmlCode = "";
                var movieList = new List<TVMovie>();
                try 
                {
                    var movieUrl = url + programDay;
             using(  WebClient client = new WebClient{ Encoding = System.Text.Encoding.UTF8 })
             {
                 
                    await Task.Run(() =>
                    {
                        try
                        {
                            htmlCode = client.DownloadString(movieUrl); 
                        }
                         catch(Exception ex)
                        {
                            Log.Error($"Exception DownloadString: {movieUrl}");
                            Log.Error(ex.Message);
                        }
                    });
             }

                    var mainHTML = new HtmlDocument();
                     await Task.Run(() =>
                    {
                        mainHTML.LoadHtml(htmlCode);
                    });

                    var programList = mainHTML.DocumentNode.SelectSingleNode("//div[@class='lista']").InnerHtml;
                 
                    var statHTML = new HtmlDocument();
                        await Task.Run(() =>
                        {
                            statHTML.LoadHtml(programList); 
                        });
                        
                    var hours = statHTML.DocumentNode.SelectNodes("//em")
                                    .Select(x => double.Parse(x.InnerText.Trim().Replace(':',','))).ToList();

                    var moviesLi = statHTML.DocumentNode.SelectNodes("//li");
                    
                    if(moviesLi != null)
                    {
                        var moviesProgList = moviesLi.Where(x => x.OuterHtml.Contains("programInfo")).ToList();
                        int i = 0;
                        foreach(var movie in moviesProgList)
                        {
                            var restHours = hours.Skip(i).ToList();
                            
                            /* var nextDay = true;
                            if(restHours.Count>0)
                            {
                               //Console.WriteLine(restHours[0]);
                                 nextDay = restHours.All(x => x<700);
                            } */

                            i++;
                            if(movie.Attributes["class"].Value == "filmy")
                            {
                                var html = movie.InnerHtml;
                                var doc = new HtmlDocument();
                                    await Task.Run(() =>
                                    {
                                        doc.LoadHtml(html);
                                    });
                                var docHref = doc.DocumentNode.SelectSingleNode("//a[@class='programInfo']");
                                if(docHref != null)
                                {
                                    var href = docHref.Attributes["href"].Value;
                                    var movieObj = new TVMovie(html, href, day);
                                    movieObj.SetStation(station);
                                    movieList.Add(movieObj);
                                }
                            }
                        }
                    }
                    }
                    catch(Exception ex)
                    {
                        //Console.WriteLine("Something wrong in program --> " + url);
                        //Console.WriteLine(ex.Message);

                        Log.Error($"Something wrong with program: {url}");
                        Log.Error(ex.Message);
                        Log.Error(ex.StackTrace);
                    }

                    return movieList;
            }
        

                /////deprecated///////
  /*           private List<TVMovie> GetMoviesInfoFromUrl(string url, string day)
            {
                WebClient client = new WebClient(){ Encoding = System.Text.Encoding.UTF8 };
                //string url1 = "https://www.telemagazyn.pl/?dzien=2019-11-25&gatunek=film";
                string htmlCode = client.DownloadString(url);

                List<string> names = new List<string>();
                //string pattern = "class[=]{1}[\"]{1}mainCell[\\s]{1}filmy[\"]{1}[>]{1}(.+)[<]{1}[/]{1}a[>]{1}[<]{1}[/]{1}div[>]{1}";
                // string pattern = "class[=]{1}[\"]{1}programInfo[\"]{1}.+[>]{1}([^\"]+)[<]{1}[/]{1}a[>]{1}";

                var mainHTML = new HtmlDocument();
                mainHTML.LoadHtml(htmlCode);

                var pTags = mainHTML.DocumentNode.Descendants("a");

                var tableClass = "tabelaProg hyph";
                var programClass = "programInfo";
                var tables = mainHTML.DocumentNode.SelectNodes("//table[@class='" + tableClass + "']");


                //var date = System.DateTime.Now.AddDays(1);

                var tvMovies = new List<TVMovie>();
                foreach (var table in tables)
                {
                    string emisionDate = day;
                    var tableHtml = new HtmlDocument();
                    tableHtml.LoadHtml(table.OuterHtml);
                    //Console.WriteLine(table.OuterHtml);
                    var movieslist = tableHtml.DocumentNode.SelectNodes("//a[@class='" + programClass + "']");


                    foreach (var movie in movieslist)
                    {


                        if (!movie.InnerText.Contains("Film dokumentalny") && !System.Web.HttpUtility.HtmlDecode(movie.InnerText).Contains("Film krótkometrażowy"))
                        {

                            var tvMovie = new TVMovie(movie.OuterHtml, emisionDate);

                            var ATM = tvMovie.Station != "ATM Rozrywka";
                            var HBO = tvMovie.Station != "HBO";
                            var TvpKultura = tvMovie.Station != "TVP Kultura";
                            var TvpABC = tvMovie.Station != "TVP ABC";
                            var Tvp3 = !tvMovie.Station.Contains("TVP3");

                            //var actuall = _liveContext.TVMovies.FirstOrDefaultAsync(x => x.Title==tvMovie.Title && x.PlayAt == tvMovie.PlayAt);

                            var UNIQ = GetExists(tvMovie);

                            if (ATM && HBO && TvpKultura && UNIQ && TvpABC && Tvp3)
                            {
                                //tvMovie.SetYoutube();
                                tvMovies.Add(tvMovie);
                            }
                        }

                    }
                    day = DateTime.Parse(day).AddDays(1).ToString("yyyy-MM-dd");
              
                }

                return tvMovies;

            } */


    public async Task ChangeYouTubeId(string name, string toId)
       {
           // var actuallMovies =  await GetByYouTubeFromActuall(Id);
           // var archiveMovies = await GetByYouTubeFromArchive(Id);

            var actuallMovies =  await GetByNameFromActuall(name);
            var archiveMovies = await GetByNameFromArchive(name);

            if(actuallMovies.Count>0 )
            {
                foreach(var actuallMovie in actuallMovies)
                {
                    actuallMovie.ChangeYouTubeId(toId);
                    _liveContext.Update(actuallMovie);
                }
            }

             if(archiveMovies.Count>0 )
            {
                foreach(var archiveMovie in archiveMovies)
                {
                    archiveMovie.ChangeYouTubeId(toId);
                    _liveContext.Update(archiveMovie);
                }
            }
           await _liveContext.SaveChangesAsync();
       }


        public async Task ChangeName(string Id, string name)
       {
           // var archiveMovies = await GetByYouTubeFromArchive(Id);
            var actuallMovies =  await GetByYouTubeFromActuall(Id);

            if(actuallMovies.Count>0)
            {
                foreach(var actuallMovie in actuallMovies)
                {
                    actuallMovie.ChangeName(name);
                    _liveContext.Update(actuallMovie);
                }
            }
           await _liveContext.SaveChangesAsync();
       }


       public async Task ChangeLocation(string Id, string left, string top)
       {
            var archiveMovies = await GetByYouTubeFromArchive(Id);
            var actuallMovies =  await GetByYouTubeFromActuall(Id);

            if(actuallMovies.Count>0)
            {
                foreach(var actuallMovie in actuallMovies)
                {
                    actuallMovie.ChangeLocation(left, top);
                    _liveContext.Update(actuallMovie);

                }
            }

           if(archiveMovies.Count>0)
            {
                foreach(var archiveMovie in archiveMovies )
                {
                archiveMovie.ChangeLocation(left, top);
                _liveContext.Update(archiveMovie);

                }
            } 

           await _liveContext.SaveChangesAsync();
       }
       
        public async Task<List<TVMovie>> GetByYouTubeFromActuall(string id)
        {
          var movies = await _liveContext.TVMovies.Include(x=>x.YouTube).ToListAsync();
          var movie = movies.Where(s => s.YouTube.VideoID == id).ToList();
          return movie;
        } 


   public async Task<List<ArchiveMovie>> GetByYouTubeFromArchive(string id)
        {
          var movies = await _liveContext.ArchiveMovies.Include(x=>x.YouTube).ToListAsync();
          var movie = movies.Where(s => s.YouTube.VideoID == id).ToList();
          return movie;
        } 


        public async Task<List<IconDto>> GetAllErrorsFromArchive()
        {
            var archiveMovies = await _liveContext.ArchiveMovies.Include(x=>x.YouTube)
            .ToListAsync();
            var errors = archiveMovies.Where(x => x.YouTube.VideoID.Contains("Error") || x.YouTube.VideoID==x.Name);
           return errors.Select(s =>  _autoMapper.Map<IconDto>(s)).ToList();
        }

        public async Task DeleteByYouTubeId(string id)
        {
            var archiveMovies = await GetByYouTubeFromArchive(id);
            var actuallMovies =  await GetByYouTubeFromActuall(id);

          if(archiveMovies.Count >0)
            {
                _liveContext.ArchiveMovies.RemoveRange(archiveMovies);
            } 

            if(actuallMovies.Count > 0)
            {
                _liveContext.TVMovies.RemoveRange(actuallMovies);
            }
           await _liveContext.SaveChangesAsync();
        }





    public async Task AddToArchiveAsync(TVMovie movie)
    {
            var toArchiveMovie = new ArchiveMovie(movie);
            await _liveContext.ArchiveMovies.AddAsync(toArchiveMovie);
            await _liveContext.SaveChangesAsync();

    }

        public async Task<List<ArchiveMovie>> GetByNameFromArchive(string name)
        {
            var archiveMovies = await _liveContext.ArchiveMovies.Include(x=>x.YouTube).ToListAsync();
            var movies = archiveMovies.Where(s => s.Name == name).ToList();
            return movies;
        }

        public async Task<List<TVMovie>> GetByNameFromActuall(string name)
        {
            var movies = await _liveContext.TVMovies.Include(x=>x.YouTube).ToListAsync();
            var movie = movies.Where(s => s.TrailerSearch == name).ToList();
            return movie;
        }

        public async Task<TVMovie> GetTheSameFromActual(TVMovie movie)
        {
            var movies = await _liveContext.TVMovies.Include(x=>x.YouTube).ToListAsync();
            var exMovie = movies.FirstOrDefault(s => s.TrailerSearch == movie.TrailerSearch && s.PlayAt==movie.PlayAt);
            return exMovie;
        }
    }

    }

