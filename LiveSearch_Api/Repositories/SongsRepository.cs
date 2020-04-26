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

namespace Live.Repositories
{
    public class SongsRepository : ISongsRepository
    {
        private readonly LiveContext _liveContext;
        private readonly IMapper _autoMapper;
         private readonly SqlConnectingSettings _sql;

     // private readonly ILogger _logger;


        public SongsRepository(LiveContext liveContext, IMapper autoMapper, SqlConnectingSettings sql)
        {
            this._liveContext = liveContext;
            this._autoMapper = autoMapper;
            this._sql = sql;
       

        }

        public async Task<List<IconDto>> GetFromArchiveByIndex(int i, int j)
        {
            var archiveSongs = await _liveContext.ArchiveSongs.Include(x=>x.YouTube).ToListAsync();
            int archCount = archiveSongs.Count;
            if(j>archCount)
            {
                j=archCount-1;
            }

            var songs = archiveSongs.Where(s => archiveSongs.IndexOf(s)>=i && archiveSongs.IndexOf(s)<=j).ToList();
            return songs.Select(s =>  _autoMapper.Map<IconDto>(s)).ToList();
        }

      public async Task DeleteByYouTubeId(string id)
        {
            var archiveSongs = await GetByYouTubeFromArchive(id);
            var actuallSongs =  await GetByYouTubeFromActuall(id);

            if(archiveSongs != null)
            {
                _liveContext.ArchiveSongs.RemoveRange(archiveSongs);
            }

            if(actuallSongs.Count>0)
            {
                _liveContext.Songs.RemoveRange(actuallSongs);
            }
           await _liveContext.SaveChangesAsync();
        }

/////////////CHANGE!! - FOR ALL IN ARCHIVE AND IN CURRENT SONGS!!------
       public async Task ChangeYouTubeId(string name, string Id, string toId)
       {
            var actuallSongs =  await GetByNameFromActuall(name);
            var archiveSongs = await GetByYouTubeFromArchive(Id);

            if(actuallSongs.Count>0)
            {
                foreach(var actuallSong in actuallSongs)
                {
                actuallSong.ChangeYouTubeId(toId);
                _liveContext.Update(actuallSong);

                }
            }

            if(archiveSongs.Count>0)
            {
                foreach(var achiveSong in archiveSongs)
                {
                achiveSong.ChangeYouTubeId(toId);
                _liveContext.Update(achiveSong);

                }
            }
           /*  if(archiveSong != null)
            {
            archiveSong.ChangeYouTubeId(toId);

            _liveContext.Update(archiveSong);
            } */
           await _liveContext.SaveChangesAsync();
       }


    public async Task ChangeName(string Id, string name)
       {
            //var archiveSong = await GetByYouTubeFromArchive(Id);
            var actuallSongs =  await GetByYouTubeFromActuall(Id);

            if(actuallSongs.Count>0)
            {
                foreach(var actuallSong in  actuallSongs)
                {
                    actuallSong.ChangeName(name);
                    _liveContext.Update(actuallSong);
                }
            }
         /*    if(archiveSong != null)
            {
            archiveSong.ChangeName(name);
           _liveContext.Update(archiveSong);
            } */
           await _liveContext.SaveChangesAsync();
       }


    public async Task ChangeLocation(string Id, string left, string top)
       {
            var actuallSongs =  await GetByYouTubeFromActuall(Id);
            var archiveSongs = await GetByYouTubeFromArchive(Id);

            if(actuallSongs.Count>0)
            {
                foreach(var actuallSong in actuallSongs )
                {
                    actuallSong.ChangeLocation(left, top);
                    _liveContext.Update(actuallSong);

                }
            }
            if(archiveSongs.Count>0)
            {
                foreach(var archiveSong in archiveSongs )
                {
                    archiveSong.ChangeLocation(left, top);
                    _liveContext.Update(archiveSong);
                }
            }
 
           await _liveContext.SaveChangesAsync();
       }



        public async Task<List<IconDto>> GetAllFromArchive()
        {
            var archiveSongs = await _liveContext.ArchiveSongs.Include(x=>x.YouTube)
            .ToListAsync();
           return archiveSongs.Select(s =>  _autoMapper.Map<IconDto>(s)).ToList();
        }


        public async Task<List<IconDto>> GetAllErrorsFromArchive()
        {
            var archiveSongs = await _liveContext.ArchiveSongs.Include(x=>x.YouTube)
            .ToListAsync();
            var errors = archiveSongs.Where(x => x.YouTube.VideoID.Contains("Error") || x.YouTube.VideoID==x.Name || x.YouTube.VideoID.Contains("!!ID!!") );
           return errors.Select(s =>  _autoMapper.Map<IconDto>(s)).ToList();
        }



        public async Task<List<IconDto>> GetActualByRadioAsync(List<string> stations)
        {  
            var date24 = DateTime.Now.AddHours(-12);
           var all_songs =  await _liveContext.Songs.Include(s => s.YouTube).Where(s => s.PlayAt>=date24).ToListAsync();
            //var all_songs =  await _liveContext.Songs.Include(s => s.YouTube).Where(s => s.PlayAt<date24).ToListAsync();
            


            var songs = new List<Song>();
            var ytFront = new List<FrontYouTube>();

          foreach(string radio in stations)
          {
              songs.AddRange(all_songs.Where(s => s.Station == radio).ToList());
          }
        


          while(songs.Count != 0)
          {
              var song = songs[0];
              var songCount = songs.Where(s => s.YouTube.VideoID == song.YouTube.VideoID).ToList().Count;
              songs.RemoveAll(s => s.YouTube.VideoID == song.YouTube.VideoID);
              ytFront.Add(new FrontYouTube(song, songCount));
              //Console.WriteLine(song.Name);
          }

          return ytFront.OrderByDescending(x => x.playAt).Select(x => _autoMapper.Map<IconDto>(x)).ToList();

        }


        public async Task<List<IconDto>> GetActualRandomSongs()
        {  
            var songsDto = new List<FrontYouTube>();
            try{

            var date12 = DateTime.Now.AddHours(-12);
            var allSongs =  await _liveContext.Songs.Include(s => s.YouTube).Where(s => s.PlayAt>=date12).ToListAsync();
            //allSongs = allSongs.OrderByDescending
            
            var songs = new List<Song>();
            Random random = new Random();
 
        var stations = new Dictionary<int, string>(){{1,"zet"},{2,"rmf"},{3,"eska"},{4, "rmfmaxx"},{9, "zloteprzeboje"},{30, "vox"},{48, "trojka"}};

        //var arrayLog  = songsDto.ToArray();
       

        if(allSongs.Count>0) 
        {

          foreach(var radio in stations)
          {
            var radioSongs = allSongs.Where(s => s.Station == radio.Value).ToList();

            if(radioSongs.Count>11)
            {
                while(radioSongs.Count > 11)
                {
                    var index = random.Next(0, radioSongs.Count-1);
                    //Console.WriteLine(index);
                    radioSongs.RemoveAt(index);
                }
            }
            songs.AddRange(radioSongs);   
          }
        }  

        if(songs.Count>0)
        {

          while(songs.Count != 0)
          {
              var song = songs[0];
               //Console.WriteLine(song.Name);
              var songCount = songs.Where(s => s.YouTube.VideoID == song.YouTube.VideoID).ToList().Count;
                songs.RemoveAll(s => s.YouTube.VideoID == song.YouTube.VideoID);
                songsDto.Add(new FrontYouTube(song, songCount));
          }
        }

            songsDto.Shuffle();
          return songsDto.Select(x => _autoMapper.Map<IconDto>(x)).ToList();
    }
    catch (Exception ex)
    {
        //Console.WriteLine(ex.Message);
        //Console.WriteLine(ex.StackTrace);
        Log.Error($"Get random songs exception {ex.Message}");
        Log.Error(ex.StackTrace);
        return null;
    }

        }


         public async Task<List<Song>> GetAllActuall()
        {
            var actuallSongs = await _liveContext.Songs.Include(x=>x.YouTube).ToListAsync();
            return actuallSongs.OrderByDescending(x => x.PlayAt).ToList();
        } 

        public async Task<List<ArchiveSong>> GetByYouTubeFromArchive(string id)
        {
          var archiveSongs = await _liveContext.ArchiveSongs.Include(x=>x.YouTube).ToListAsync();
          var songs = archiveSongs.Where(s => s.YouTube.VideoID == id).ToList();
          return songs;
        }

        public async Task<List<Song>> GetByYouTubeFromActuall(string id)
        {
          var actualSongs = await _liveContext.Songs.Include(x=>x.YouTube).ToListAsync();
          var songs = actualSongs.Where(s => s.YouTube.VideoID == id).ToList();
          return songs;
        } 


   public async Task<List<Song>> GetByNameFromActuall(string name)
        {
            var actuallSongs = await _liveContext.Songs.Include(x=>x.YouTube).ToListAsync();
            var songs = actuallSongs.Where(s => s.Name == name).ToList();
            return songs;
        }
     
         public async Task<ArchiveSong> GetByNameFromArchive(string name)
        {
            var archiveSongs = await _liveContext.ArchiveSongs.Include(x=>x.YouTube).ToListAsync();

           // var actuallSongs = await _liveContext.Songs.Include(x=>x.YouTube).ToListAsync();
            
            var songArch = archiveSongs.FirstOrDefault(s => s.Name == name);
            
            return songArch;
        }

        public async Task<DateTime> GetLastDate()
        {
            //var sql = new SqlConnectingSettings("connection");

            var LastDate =  DateTime.Now.AddDays(-1);
            using(var context = new LiveContext(_sql))
            {
                var actualSongs = await context.Songs.ToListAsync(); ///BAD
                if(actualSongs.Count>0)
                {
                    var dates = actualSongs.Select(s => s.PlayAt).ToList();
                    LastDate = dates.Max();
                }
            }

//playAt -> 13:06 ...---->13.00
       
            return LastDate;

        }

            public async Task UpdateTestAsync()
            {
                var date = await GetLastDate();
                //Console.WriteLine("Update song test: "+ date);/// TU PROBOWAC
            }


  /*   public async Task UpdateAsync()
    {

        if(duringUpdate)
        {
            return;
        }


        duringUpdate = true;
        try
        {
        Log.Information("Start radio songs updating");
        Console.WriteLine($"{DateTime.Now}Start radio songs updating");

            var stations = new Dictionary<int, string>(){{1,"zet"},{2,"rmf"},{3,"eska"},{4, "rmfmaxx"},{9, "zloteprzeboje"},{30, "vox"},{48, "trojka"}};
           var dateLast = await GetLastDate();

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
                  var names = getNamesFromUrl(addres);
                
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

      using(var context = new LiveContext(_sql))
            {
                try
                {
                foreach(var song in listOfInitialSongs)
                {   
                    
                    //Console.WriteLine(songsCount);
                    
                    //var archiveSong = await GetByNameFromArchive(song.Name);

            var archiveSong = await context.ArchiveSongs.Include(x=>x.YouTube).FirstOrDefaultAsync(s => s.Name == song.Name);

           // var actuallSongs = await _liveContext.Songs.Include(x=>x.YouTube).ToListAsync();
            
            //var songArch = archiveSongs.FirstOrDefault(s => s.Name == name);


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
                    await context.ArchiveSongs.AddAsync(toArchiveSong);
                    await context.SaveChangesAsync();

                    //await AddToArchiveAsync(song);
                }
                else
                {
                    song.SetYoutube(archiveSong);
                }

                    song.Added = DateTime.Now;
                    //Console.WriteLine("Adding song to Songs");
                    await context.Songs.AddAsync(song);

                    songsCount = songsCount-1;
                }
                await context.SaveChangesAsync();
                }
                catch(Exception ex)
                {
                    Log.Error($"Error while updating songs: {ex.Message}");
                    Log.Error(ex.StackTrace);
                    context.Dispose();
                }

            }
        }

        if(listOfInitialSongs.Count>0)
        {

        using(var context = new LiveContext(_sql))
                {
                    context.Songs.RemoveRange(context.Songs.Where(s => s.PlayAt<dateNow.AddHours(-13)));
                    await context.SaveChangesAsync();
                }
            var errors = listOfInitialSongs.Where(x => x.YouTube.VideoID.Contains("Error")).ToList();
            Log.Information($"Finish radio songs update with {listOfInitialSongs.Count} songs and {errors.Count} youtube errors");

        }
          InfoCaches._radioSongsUpdatingRunning = true;
            duringUpdate = false;
        
        }
        catch (Exception ex)
        {
            Log.Error($"Error in updating songs {ex.Message}");
            Log.Error(ex.StackTrace);
            InfoCaches._radioSongsUpdatingRunning = false;
             Console.WriteLine($"Error in updating songs {ex.Message}");
          Console.WriteLine(ex.StackTrace);
            duringUpdate = false;
        }
    } */

    public async Task AddToArchiveAsync(Song song)
    {
            var toArchiveSong = new ArchiveSong(song);
            await _liveContext.ArchiveSongs.AddAsync(toArchiveSong);
            await _liveContext.SaveChangesAsync();

    }

        private   List<string> getNamesFromUrl(string url)
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


    //public async Task GetByRadioAsync

    public async Task UpdateArchiveAsync(Song actualSong)
    {
       // GetByYouTubeFromArchive

        var actuallSongs = await GetAllActuall();

        foreach(var song in actuallSongs)
        {
            var archiveSong = await GetByYouTubeFromArchive(song.YouTube.VideoID);

            if (archiveSong is null)
            {
                var toArchiveSong = new ArchiveSong(song);
                await _liveContext.ArchiveSongs.AddAsync(toArchiveSong);
                await _liveContext.SaveChangesAsync();
            }  
           // Console.WriteLine(archiveSong.Name);
        }
    } 
} 
}