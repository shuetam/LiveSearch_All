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
using Microsoft.Extensions.Logging;
using Serilog;
using Live.Settings;
using Live.Extensions;
using Live.DataBase.DatabaseModels;
using Live.Core.BookStores;
using Live.Live.Core.BookStores;

namespace Live.Repositories
{
    public class UpdatingRepository : IUpdatingRepository
    {
    private readonly LiveContext _context;
    private readonly IMapper _autoMapper;
    private  readonly SqlConnectingSettings _sql;
    private readonly ITVMovieRepository _tvMovieRepository;

        public UpdatingRepository(LiveContext liveContext, IMapper autoMapper,
         SqlConnectingSettings sql, ITVMovieRepository tvMovieRepository)
        {
            this._context = liveContext;
            this._autoMapper = autoMapper;
           // this._sql = sql;
            this._tvMovieRepository = tvMovieRepository;
       

        }


        public  async Task SongsUpdateAsync()
        {
               

        if(InfoCaches.duringSongsUpdate)
        {
            return;
        }


        InfoCaches.duringSongsUpdate = true;
        try
        {
        //Log.Information("Start radio songs updating");
        //Console.WriteLine($"{DateTime.Now}  Start radio songs updating");

            var stations = new Dictionary<int, string>()
            {{1,"zet"},{2,"rmf"},{3,"eska"},{4, "rmfmaxx"},{9, "zloteprzeboje"},{30, "vox"},{40, "chillizet"}};
           var dateLast = await GetLastDate();
        Console.WriteLine("Context works  datelst -> " + dateLast);
                //Console.WriteLine(dateLast);
                var dateNow = DateTime.Now;
                int hourNow = dateNow.Hour;
                //Console.WriteLine(dateNow );

                var hours = (dateNow - dateLast).TotalHours;

                int i = 0;
                int h = 50;
                if (hours>=12)
                {
                    i = 12;
                
                }

                if(hourNow == dateLast.Hour && hours<12 )
                {
                    i = 0;
              
                }
                if(hourNow != dateLast.Hour && hours<12 )
                {

                    while(h != hourNow)
                    {
                    dateLast = dateLast.AddHours(1);
                    h =  dateLast.Hour;

                    i++;
            
                    } 
                }


            var listOfInitialSongs = new List<Song>();
            var songsCount = 0;

            for (int j = 0;j<i;j++)
            {
                 

                    var hourTo = dateNow.AddHours(-j).Hour;
                    var dateBase = dateNow.AddHours(-j);
                    var date = dateNow.AddHours(-j-1).ToString("dd-MM-yyyy");
                    var hourFrom = dateNow.AddHours(-j-1).Hour;

                foreach(var s in stations.Keys)
                {
                    string addres = "https://www.odsluchane.eu/szukaj.php?r="+s+"&date="+date+"&time_from="+hourFrom+"&time_to="+hourTo;
                    //Console.WriteLine(addres);
                  var names = getSongsNamesFromUrl(addres);
                
                    if(names.Count>0)
                    {
                    foreach(var name in names)
                    {
                       
                        listOfInitialSongs.Add(new Song(name, stations[s], dateBase ));
                    }
                    }
                }

                }

        //Log.Information($"Radio Songs UPDATED with {listOfInitialSongs.Count} songs");
        //Console.WriteLine($"Radio Songs UPDATED with {listOfInitialSongs.Count} songs");
            if(listOfInitialSongs.Count>0)
            {
                var toManyReq = false;
              songsCount = listOfInitialSongs.Count;

      //using(var context = new LiveContext(_sql))
       //using(var context = new LiveContext())
            //{
                try
                {
                foreach(var song in listOfInitialSongs)
                {   
                
            var archiveSong = await _context.ArchiveSongs.Include(x=>x.YouTube).FirstOrDefaultAsync(s => s.Name == song.Name);
                if(archiveSong is null)
                {
                    if(toManyReq == false)
                    {
                        song.SetYoutube();
                    }
                    else
                    {
                        song.SetWhileYoutube();
                    }

                    if (song.YouTube.VideoID.Contains("FirstError"))
                    {
                        Log.Warning("First ERROR from Song Update");
                        toManyReq = true;
                    }

                    var toArchiveSong = new ArchiveSong(song);
                    //Console.WriteLine("Adding new song to archive");
                    await _context.ArchiveSongs.AddAsync(toArchiveSong);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    song.SetYoutube(archiveSong);
                }

                    song.Added = DateTime.Now;
                    //Console.WriteLine("Adding song to Songs");
                    await _context.Songs.AddAsync(song);

                    songsCount = songsCount-1;
                }
                await _context.SaveChangesAsync();
                }
                catch(Exception ex)
                {
                    Log.Error($"Error while updating songs: {ex.Message}");
                    Log.Error(ex.StackTrace);
                    //context.Dispose();
                }

            //}
        }

        if(listOfInitialSongs.Count>0)
        {

        //using(var context = new LiveContext(_sql))
        // using(var context = new LiveContext())
                //{
                    _context.Songs.RemoveRange(_context.Songs.Where(s => s.PlayAt<dateNow.AddHours(-13)));
                    await _context.SaveChangesAsync();
                //}
            var errors = listOfInitialSongs.Where(x => x.YouTube.VideoID.Contains("Error")).ToList();
            Log.Information($"Finish radio songs update with {listOfInitialSongs.Count} songs and {errors.Count} youtube errors");

//Console.WriteLine($"Finish radio songs update with {listOfInitialSongs.Count} songs and {errors.Count} youtube errors");
        }
          
           InfoCaches.duringSongsUpdate = false;
        
        }
        catch (Exception ex)
        {
            Log.Error($"Error in updating songs {ex.Message}");
            Log.Error(ex.StackTrace);
             Console.WriteLine($"Error in updating songs {ex.Message}");
          Console.WriteLine(ex.StackTrace);
            InfoCaches.duringSongsUpdate = false;
        }
    }

        public  async Task<DateTime> GetLastDate()
        {
            var LastDate =  DateTime.Now.AddDays(-1);
            //using(var context = new LiveContext(_sql))
             //using(var context = new LiveContext())
            //{
                var actualSongs = await _context.Songs.ToListAsync(); ///BAD
                if(actualSongs.Count>0)
                {
                    var dates = actualSongs.Select(s => s.PlayAt).ToList();
                    LastDate = dates.Max();
                }
            //}    
            return LastDate;
        }

        private static  List<string> getSongsNamesFromUrl(string url)
        {
            string htmlCode = "";
            using( var client = new WebClient() { Encoding = System.Text.Encoding.UTF8 })
            {

            try 
            {
            htmlCode = client.DownloadString(url);
            }
            catch(Exception ex)
            {
                Log.Error($"Exception DownloadString: {url}");
                Log.Error(ex.Message);
            }

            }
            List<string> names = new List<string>();
            string pattern = "class[=]{1}[\"]{1}title-link[\"]{1}[>]{1}([^\"]+)[<]{1}[/]{1}a[>]{1}";
            var reg1 = new Regex(pattern);
        if(reg1.IsMatch(htmlCode))
        {
            names = reg1.Matches(htmlCode).Select(s => s.Groups[1].Value.Trim()).ToList();
        }
            return names;
        }



    public async Task TvMoviesUpdateAsync(bool getYT)
    {
        if( InfoCaches.duringMovieUpdate)
        {
            return;
        }

        InfoCaches.duringMovieUpdate = true;

        try
        {
       // Log.Information($"Start TV movies upating");
      // Console.WriteLine($"{DateTime.Now}  Start TV movies upating");


        var tvPrograms = new Dictionary<string, string>() {
            {"TVP1","https://www.telemagazyn.pl/tvp_1/"},
            {"TVP2","https://www.telemagazyn.pl/tvp_2/"},
            {"Polsat","https://www.telemagazyn.pl/polsat/"},
            {"TVN","https://www.telemagazyn.pl/tvn/"},
            {"TVN7","https://www.telemagazyn.pl/tvn_7/"},
            {"TV4","https://www.telemagazyn.pl/tv_4/"},
            {"TV Puls","https://www.telemagazyn.pl/tv_puls/"},
            {"Stopklatka","https://www.telemagazyn.pl/stopklatka/"},
            {"Fokus TV","https://www.telemagazyn.pl/fokus_tv/"},
            {"Nowa TV","https://www.telemagazyn.pl/nowa_tv/"},
            {"Metro","https://www.telemagazyn.pl/metro/"},
            {"WP1","https://www.telemagazyn.pl/wp1/"},
            {"Zoom TV","https://www.telemagazyn.pl/zoom_tv/"}
        };

            var toManyReq = false;
            //var lastDate = GetLastDate();

        var todayDate = DateTime.Now.Date;
        var lastDate = DateTime.Now.AddDays(-1).Date;
        var movies = new List<TVMovie>();

       // using(var context = new LiveContext(_sql))
       // {
             movies = await _context.TVMovies.ToListAsync();
       // }
            
        if(movies.Count>0)
        {
            //var youngest =  movies.OrderByDescending(x => x.PlayAt).ToList().FirstOrDefault();
            //lastDate = DateTime.Parse(youngest.UrlEmisionDay).Date;
            
            var dates = movies.Select(x => DateTime.Parse(x.UrlEmisionDay)).ToList();
            lastDate = dates.Max();

        }

        var days = (lastDate - todayDate).Days;

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

   /*      if(days == 3)
        {
            from = 3;
            future = 4;
        } */
        if(days >= 3)
        {
            from = 0;
            future = 0;
        }

        //Console.Write($"Days: {days}");
           // from = 0;
            //future = 1;

        var allMovies = new List<TVMovie>();

            for(int i=from; i<future; i++)
            {
                //string z przeslosci - update dzis jutro i pojutrze i popojutrze
                //string taki sam jak teraz - update z dzis, jutra i pojutrza i popojutrza
                //string z jutra - update dla pojutrza i popojutrza
                // string z pojutrza - update dla popojutrza 
                // string z dalej niz pojutrze - udpusc update 

             
                var date = System.DateTime.Now.AddDays(i);
                var day = date.ToString("yyyy-MM-dd");

                //Console.WriteLine($"Getting movies from day: {day}");
                
                foreach(var station in tvPrograms)
                {
                    var progMovies = await _tvMovieRepository.GetMoviesForTvStationAsync(station.Key, station.Value, day);
                    allMovies.AddRange(progMovies);
                }
            }
  
    var moviesCount = allMovies.Count;
    //Log.Information($"TVMovies UPDATED with {moviesCount} movies");
    foreach (var movie in allMovies)
    {
        var now = DateTime.Now;
        bool inFuture = movie.PlayAt >= now.AddHours(-1);
        var exists = await  _tvMovieRepository.GetTheSameFromActual(movie);

        if((exists is null) && inFuture)
        {
            //Console.WriteLine(moviesCount);

            var archiveMovieL = await _tvMovieRepository.GetByNameFromArchive(movie.TrailerSearch);
            var archiveMovie = archiveMovieL.FirstOrDefault();

                if(archiveMovie is null)
                {
                    if(toManyReq == false && getYT)
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
                    await _tvMovieRepository.AddToArchiveAsync(movie);
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
                await _context.TVMovies.AddAsync(movie);
                await _context.SaveChangesAsync();
                moviesCount = moviesCount-1;
        }
           // _liveContext.TVMovies.RemoveRange(_liveContext.TVMovies.Where(x => x.PlayAt < DateTime.Now.AddHours(-2)));
    }

    if(allMovies.Count>0)
    {
              
        _context.TVMovies.RemoveRange(_context.TVMovies.Where(x => x.PlayAt < DateTime.Now.AddHours(-2)));
        await _context.SaveChangesAsync();

        var errors = allMovies.Where(x => x.YouTube != null)
        .Where(x => x.YouTube.VideoID.Contains("Error")).ToList();

        Log.Information($"Finish TV movies update with {allMovies.Count} and {errors.Count} youtube errors");
   
    }
       

        InfoCaches.duringMovieUpdate = false;
       
        }
        catch(Exception ex)
        {
            Log.Error($"Error while updating tvmovies: {ex.Message}");
             Log.Error(ex.StackTrace);
             InfoCaches.duringMovieUpdate = false;
            
        }

    }


        public async Task BooksUpdateAsync()
        {
                  
        
            Console.WriteLine("Start updatign books");
            var bestList  = new List<Book>();
            
            
            await _context.SaveChangesAsync();
            var bonitos = await new Bonito().GetBestsellersAsync();
            bestList.AddRange(bonitos);
            var aros = await new Aros().GetBestsellersAsync();
            bestList.AddRange(aros);
            var czytams = await new Czytam().GetBestsellersAsync();
            bestList.AddRange(czytams);
            var empiks = await new Empik().GetBestsellersAsync();
            bestList.AddRange(empiks);
            var gandalfs = await new Gandalf().GetBestsellersAsync();
            bestList.AddRange(gandalfs);
            var livros = await new Livro().GetBestsellersAsync();
            bestList.AddRange(livros);
            var profit24s = await new Profit24().GetBestsellersAsync();
            bestList.AddRange(profit24s);
     
            Log.Information($"Finish bestsellers update with {bestList.Count} books");
            Log.Information($"{bonitos.Count} from Bonito");
            Log.Information($"{aros.Count} from Aros");
            Log.Information($"{czytams.Count} from Czytam");
            Log.Information($"{empiks.Count} from Empik");
            Log.Information($"{gandalfs.Count} from Gandalf");
            Log.Information($"{livros.Count} from Livro");
            Log.Information($"{profit24s.Count} from Profit24");

            var actualBestsellers = _context.Bestsellers.ToList();

            _context.Bestsellers.RemoveRange(_context.Bestsellers.Where(x => x.Store != ""));
             _context.SaveChanges();

            int group = 1;
            foreach(var book in bestList)
            {
                     var theSameList = bestList.Where(x => x.GroupNo == -1)
                     .Where(x => x.TheSame(book.Title, book.Author)).ToList();

                if(theSameList.Count>0)
                {     
                        foreach(var theSameBook in theSameList)
                        {
                            theSameBook.GroupNo = group;
                        }
                          group++;
                }
            }

        int no = 1;
        foreach(var book in bestList)
        {
                var exists = actualBestsellers.FirstOrDefault( x => x.ImageSrc == book.ImageSrc);

                if(exists != null)
                {
                    Console.WriteLine("Added exists");
                    exists.Added = DateTime.Now;

                    var theSame = bestList
                    .FirstOrDefault(x => x.TheSame(exists.Title, exists.Author));

                    if(theSame != null)
                    {
                        exists.SetGroupNo(theSame.GroupNo);
                       
                    }
                    else
                    {
                        int max = bestList.Select(x => x.GroupNo).Max() + no;
                        no++;
                        exists.SetGroupNo(max);
                    }

                    await _context.Bestsellers.AddAsync(exists);
                }
                else 
                {
                        var bestseller = new Bestseller(book);
                        bestseller.Added = DateTime.Now;
                        Console.WriteLine("Added new");
                        await _context.Bestsellers.AddAsync(bestseller);
                }

                 
            }
            await _context.SaveChangesAsync();
            InfoCaches._booksUpdatingRunning = true;
           // Console.WriteLine("========Finish book update==========");

            
        }

    }


}