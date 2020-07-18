using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Live.Controllers;
using Live.Core;
using Live.Extensions;
using Live.Services;
using Live.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Live.Repositories
{

    public class ExploreRepository : IExploreRepository
    { 

        private readonly LiveContext _liveContext;
        private readonly IMapper _autoMapper;
        private readonly IJwtService _jwtService;

         private readonly ITVMovieRepository _tvMovieRepository;
         private readonly ISongsRepository _radioSongsRepository;
         private readonly IBestsellersRepository _bestSellersRepository;

        public ExploreRepository(LiveContext liveContext, IMapper autoMapper, IJwtService jwtService , ITVMovieRepository tvMovieRepository, ISongsRepository radioSongsRepository, IBestsellersRepository bestSellersRepository)
        {
            this._liveContext = liveContext;
            this._autoMapper = autoMapper;
            this._jwtService = jwtService;
            this._tvMovieRepository = tvMovieRepository;
            this._radioSongsRepository = radioSongsRepository;
            this._bestSellersRepository = bestSellersRepository;
        }

        public async Task<List<IconDto>> GetAllActuallYTAsync()
        {
             var stations = new List<string>(){"zet","rmf","eska","rmfmaxx","zloteprzeboje","vox", "chillizet"};

            var songs = await _radioSongsRepository.GetActualByRadioAsync(stations);
            var movies = await _tvMovieRepository.GetActuallMovies();
            

             songs = songs.Count>0? songs.OrderByDescending(x => x.countValue).ToList().Take(50).ToList(): songs;
             movies = movies.Count>0? movies.OrderByDescending(x => x.countValue).ToList().Take(10).ToList(): movies;
           

            songs.AddRange(movies);
             return songs;

        }
        public async Task<List<IconDto>> GetAllActuallIMGAsync()
        {
         var books = await _bestSellersRepository.GetActuallBestsellersAsync();
           books = books.Count>0? books.OrderByDescending(x => x.countValue).ToList().Take(10).ToList(): books;
           return books;
        }


        public async Task<ExploreResultsDto>  ExploreIconsAsync(string query, int count, int skip)
        {
            query = query.ToLower().Trim();
            query = query.RemovePolish();
            var counter = new ExploreCounter(count);

            var foundIcons = new List<IconDto>();
            List<Action<List<IconDto>, string,  int, ExploreCounter, int>> ListOfActions 
            = new List<Action<List<IconDto>, string,  int,  ExploreCounter, int>>()
            {FillFromSongs, FillFromArchSongs, FillFromUsersYouTubes, FillBestSellers, FillFromTvMoviesArchive};
          
          int deep = 0;
if(query.Length>7)
{
    //deep = 5;
    deep = 2;
    await this.GoFindInDeepAsync(foundIcons, query, deep, counter, ListOfActions, skip); 
}
else
{

            for(int i = 1; i<3;i++) 
            {
                
                if(counter.count>0)
                {
                    deep = i;
                    await this.GoFindInDeepAsync(foundIcons, query, i, counter, ListOfActions, skip);
                }
                else
                {
                    break;
                }

            }
}

            foundIcons.Reverse();

            var results = new ExploreResultsDto(foundIcons, deep, counter.count);

            return results;
        }

        private async Task GoFindInDeepAsync(List<IconDto> listToFill, string query,  int deep, ExploreCounter count, List<Action<List<IconDto>, string,  int, ExploreCounter, int>> ListOfActions, int skip)
        {
            
            foreach(var findAction in ListOfActions)
            {
                if(count.count>0)
                {

                await Task.Run(() =>
                {
                    findAction.Invoke(listToFill, query, deep, count, skip);
                });
                 
                }
            }

        }



        private void FillFromSongs(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
             string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);
             var exploreSongs =  _liveContext.Songs.Include(x => x.YouTube).ToList()
             .Where(x => x.YouTube.HasYTId())
              .Where(x =>  x.getTags().Any(t => t.Match(query, regStart, deep)))
              .Where(x => !listToFill.Select(y => y.id).Contains(x.YouTube.VideoID))
              .ToList();
              if(exploreSongs.Count>0)
              {
                 
                var hashVideos = new HashSet<string>(exploreSongs.Select(x => x.YouTube.VideoID)).ToList();
               hashVideos = hashVideos.Skip(skip).Take(count.count).ToList();
                count.count -= hashVideos.Count;
             
                foreach(var vidId in hashVideos)
                {
                    var songToAdd = exploreSongs.FirstOrDefault(x => x.YouTube.VideoID == vidId);
                    listToFill.Add(_autoMapper.Map<IconDto>(songToAdd));
                }
              }
        }


        private void FillFromTvMovies(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
             string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);
             var exploreMovies =  _liveContext.TVMovies.Include(x => x.YouTube).ToList()
             .Where(x => x.YouTube.HasYTId())
              .Where(x =>  x.getTags().Any(t => t.Match(query, regStart, deep)))
              .Where(x => !listToFill.Select(y => y.id).Contains(x.YouTube.VideoID))
              .ToList();
              if(exploreMovies.Count>0)
              {
                 
                var hashVideos = new HashSet<string>(exploreMovies.Select(x => x.YouTube.VideoID)).ToList();
               hashVideos = hashVideos.Skip(skip).Take(count.count).ToList();
                count.count -= hashVideos.Count;
             
                foreach(var vidId in hashVideos)
                {
                    var songToAdd = exploreMovies.FirstOrDefault(x => x.YouTube.VideoID == vidId);
                    listToFill.Add(_autoMapper.Map<IconDto>(songToAdd));
                }
              }
        }

         private void FillFromTvMoviesArchive(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
             string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);
             var exploreMovies =  _liveContext.ArchiveMovies.Include(x => x.YouTube).ToList()
             .Where(x => x.YouTube.HasYTId())
              .Where(x =>  x.getTags().Any(t => t.Match(query, regStart, deep)))
              .Where(x => !listToFill.Select(y => y.id).Contains(x.YouTube.VideoID))
              .ToList();
              if(exploreMovies.Count>0)
              {
                 
                var hashVideos = new HashSet<string>(exploreMovies.Select(x => x.YouTube.VideoID)).ToList();
               hashVideos = hashVideos.Skip(skip).Take(count.count).ToList();
                count.count -= hashVideos.Count;
             
                foreach(var vidId in hashVideos)
                {
                    var songToAdd = exploreMovies.FirstOrDefault(x => x.YouTube.VideoID == vidId);
                    listToFill.Add(_autoMapper.Map<IconDto>(songToAdd));
                }
              }
        }


        private void FillFromArchSongs(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
             string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);
             var exploreSongs =  _liveContext.ArchiveSongs.Include(x => x.YouTube).ToList()
             .Where(x => x.YouTube.HasYTId())
              .Where(x => x.getTags().Any(t => t.Match(query, regStart, deep)))
              .Where(x => !listToFill.Select(y => y.id).Contains(x.YouTube.VideoID))
              .ToList();
              if(exploreSongs.Count>0)
              {
                var hashVideos = new HashSet<string>(exploreSongs.Select(x => x.YouTube.VideoID)).ToList();
               hashVideos = hashVideos.Skip(skip).Take(count.count).ToList();
                count.count -= hashVideos.Count;
             
                foreach(var vidId in hashVideos)
                {
                    var songToAdd = exploreSongs.FirstOrDefault(x => x.YouTube.VideoID == vidId);
                    listToFill.Add(_autoMapper.Map<IconDto>(songToAdd));
                }
              }
        }

    private void FillBestSellers(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
             string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);
             var exploreBooks =  _liveContext.Bestsellers.ToList()
              .Where(x =>  x.getTags().Any(t => t.Match(query, regStart, deep)))
              .Where(x => !listToFill.Select(y => y.groupBook).Contains(x.GroupNo))
              .ToList();
              if(exploreBooks.Count>0)
              {
                var hashGroup = new HashSet<int>(exploreBooks.Select(x => x.GroupNo)).ToList();
               hashGroup = hashGroup.Skip(skip).Take(count.count).ToList();
                count.count -= hashGroup.Count;
             
                foreach(var gr in hashGroup)
                {
                    var iconToAdd = exploreBooks.FirstOrDefault(x => x.GroupNo == gr);
                    var bookIcon = _autoMapper.Map<IconDto>(iconToAdd);
                    bookIcon.setLocation(false);
                    listToFill.Add(bookIcon);
                }
              }
        } 

        private void FillFromUsersYouTubes(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
             string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);
             var exploreSongs =  _liveContext.UserYoutubes.ToList()
             .Where(x => !(string.IsNullOrEmpty(x.Title) && string.IsNullOrEmpty(x.Tags)))
              .Where(x => x.Title.Match(query, regStart, deep) ||  x.GetTags().Any(t => t.Match(query, regStart, deep)))
              .Where(x => !listToFill.Select(y => y.id).Contains(x.VideoId))
              .ToList();
              if(exploreSongs.Count>0)
              {
                var hashVideos = new HashSet<string>(exploreSongs.Select(x => x.VideoId)).ToList();
               hashVideos = hashVideos.Skip(skip).Take(count.count).ToList();
                count.count -= hashVideos.Count;
             
                foreach(var vidId in hashVideos)
                {
                    var songToAdd = exploreSongs.FirstOrDefault(x => x.VideoId == vidId);
                    listToFill.Add(_autoMapper.Map<IconDto>(songToAdd));
                }
              }
        }

    }

    public class ExploreCounter
    {
        public int count { get; set; }
        public ExploreCounter(int _count)
        {
            this.count = _count;
        }
    }
}
