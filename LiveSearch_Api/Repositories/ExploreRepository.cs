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
using Live.Services.Comparers;
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
        private readonly IUserDesktopRepository _userDesktopRepository;

        public ExploreRepository(LiveContext liveContext, IMapper autoMapper, IJwtService jwtService, ITVMovieRepository tvMovieRepository, ISongsRepository radioSongsRepository, IBestsellersRepository bestSellersRepository, IUserDesktopRepository userDesktopRepository)
        {
            this._liveContext = liveContext;
            this._autoMapper = autoMapper;
            this._jwtService = jwtService;
            this._tvMovieRepository = tvMovieRepository;
            this._radioSongsRepository = radioSongsRepository;
            this._bestSellersRepository = bestSellersRepository;
            this._userDesktopRepository = userDesktopRepository;
        }

        public async Task<List<IconDto>> GetAllActuallYTAsync()
        {
            var stations = new List<string>() { "zet", "rmf", "eska", "rmfmaxx", "zloteprzeboje", "vox", "chillizet" };

            var songs = await _radioSongsRepository.GetActualByRadioAsync(stations);
            var movies = await _tvMovieRepository.GetActuallMovies();

            songs = songs.Count > 0 ? songs.OrderByDescending(x => x.countValue).Take(50).ToList() : songs;
            movies = movies.Count > 0 ? movies.OrderByDescending(x => x.countValue).Take(10).ToList() : movies;


            songs.AddRange(movies);
            return songs;

        }
        public async Task<List<IconDto>> GetAllActuallIMGAsync()
        {
            var books = await _bestSellersRepository.GetActuallBestsellersAsync();
            books = books.Count > 0 ? books.OrderByDescending(x => x.countValue).Take(10).ToList() : books;
            return books;
        }


        public async Task<List<IconDto>> GetIconsForFolder(string folderId)
        {
            var folder = await _liveContext.Folders.Where(x => x.IsShared)
                .Include(x => x.UserImages)
                .Include(x => x.UserSpotify)
                .Include(x => x.UserYouTubes)
                .FirstOrDefaultAsync(x => x.ID.ToString() == folderId);
            var icons = new List<IconDto>();
            if (folder != null)
            {
                var images = folder.UserImages.Select(x => _autoMapper.Map<IconDto>(x));
                var spotify = folder.UserSpotify.Select(x => _autoMapper.Map<IconDto>(x));
                var youtubes = folder.UserYouTubes.Select(x => _autoMapper.Map<IconDto>(x));

                icons.AddRange(images);
                icons.AddRange(spotify);
                icons.AddRange(youtubes);

                return icons;
            }
            return icons;
        }


        public async Task<List<IconDto>> ExploreIconsAsync(string query, int count, int skip)
        {
            query = query.ToLower().Trim();
            query = query.RemovePolish();
            var counter = new ExploreCounter(count);

            var foundIcons = new List<IconDto>();
            List<Action<List<IconDto>, string, int, ExploreCounter, int>> ListOfActions
            = new List<Action<List<IconDto>, string, int, ExploreCounter, int>>()
            {FillFromSongs, FillFromArchSongs, FillFromUsersYouTubes, FillBestSellers, FillFromTvMoviesArchive, FillFromUsersSpotify};

            int deep = 0;
            if (query.Length > 7)
            {
                //deep = 5;
                deep = 2;
                await this.GoFindInDeepAsync(foundIcons, query, deep, counter, ListOfActions, skip);
            }
            else
            {

                for (int i = 1; i < 3; i++)
                {

                    if (counter.count > 0)
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

            //var results = new ExploreResultsDto(foundIcons, deep, counter.count);

            return foundIcons;
        }

        private async Task GoFindInDeepAsync(List<IconDto> listToFill, string query, int deep, ExploreCounter count, List<Action<List<IconDto>, string, int, ExploreCounter, int>> ListOfActions, int skip)
        {

            foreach (var findAction in ListOfActions)
            {
                if (count.count > 0)
                {

                    await Task.Run(() =>
                    {
                        findAction.Invoke(listToFill, query, deep, count, skip);
                    });

                }
            }

        }

        //Podobno teoria i tresci na studiach psychologicznych s� teraz mocno sfeminizowane, jak si� tam odnajdujesz?

        private void FillFromSongs(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
            string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);

            var exploreSongs = _liveContext.Songs.Include(x => x.YouTube).ToList()
            .Where(x => x.YouTube.HasYTId())
             .Where(x => x.getTags().Any(t => t.Match(query, regStart, deep)))
             .Where(x => !listToFill.Select(y => y.id).Contains(x.YouTube.VideoID))
             .Distinct(new YouTubeComparer())
             .Skip(skip).Take(count.count)
             .Select(s => _autoMapper.Map<IconDto>(s));

            count.count -= exploreSongs.Count();

            listToFill.AddRange(exploreSongs);


        }


        private void FillFromTvMovies(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
            string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);
            var exploreMovies = _liveContext.TVMovies.Include(x => x.YouTube).ToList()
            .Where(x => x.YouTube.HasYTId())
             .Where(x => x.getTags().Any(t => t.Match(query, regStart, deep)))
             .Where(x => !listToFill.Select(y => y.id).Contains(x.YouTube.VideoID))
             .ToList();
            if (exploreMovies.Count > 0)
            {

                var hashVideos = new HashSet<string>(exploreMovies.Select(x => x.YouTube.VideoID)).ToList();
                hashVideos = hashVideos.Skip(skip).Take(count.count).ToList();
                count.count -= hashVideos.Count;

                foreach (var vidId in hashVideos)
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
            var exploreMovies = _liveContext.ArchiveMovies.Include(x => x.YouTube).ToList()
            .Where(x => x.YouTube.HasYTId())
             .Where(x => x.getTags().Any(t => t.Match(query, regStart, deep)))
             .Where(x => !listToFill.Select(y => y.id).Contains(x.YouTube.VideoID))
               .Distinct(new MovieComparer())
             .Skip(skip).Take(count.count)
             .Select(s => _autoMapper.Map<IconDto>(s));

            count.count -= exploreMovies.Count();

            listToFill.AddRange(exploreMovies);

        }


        private void FillFromArchSongs(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
            string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);
            var exploreSongs = _liveContext.ArchiveSongs.Include(x => x.YouTube).ToList()
            .Where(x => x.YouTube.HasYTId())
             .Where(x => x.getTags().Any(t => t.Match(query, regStart, deep)))
             .Where(x => !listToFill.Select(y => y.id).Contains(x.YouTube.VideoID))
             .Distinct(new ArchiveComparer())
             .Skip(skip).Take(count.count)
             .Select(s => _autoMapper.Map<IconDto>(s));

            count.count -= exploreSongs.Count();

            listToFill.AddRange(exploreSongs);

        }

        private void FillBestSellers(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
            string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);
            var exploreBooks = _liveContext.Bestsellers.ToList()
             .Where(x => x.getTags().Any(t => t.Match(query, regStart, deep)))
             .Where(x => !listToFill.Select(y => y.groupBook).Contains(x.GroupNo))
             .Distinct(new BookComparer())
             .Skip(skip).Take(count.count)
             .Select(s => _autoMapper.Map<IconDto>(s));

            count.count -= exploreBooks.Count();
            foreach (var bookIcon in exploreBooks)
            {
                bookIcon.setLocation(false);
                listToFill.Add(bookIcon);

            }
        }

        private void FillFromUsersYouTubes(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
            string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);


            var exploreSongs = _liveContext.Folders.Where(x => x.IsShared).Include(x => x.UserYouTubes).SelectMany(x => x.UserYouTubes).ToList()
            //var exploreSongs = _liveContext.UserYoutubes
             .Where(x => x.GetTitle().Match(query, regStart, deep) || x.GetTags().Any(t => t.Match(query, regStart, deep)))
             .Where(x => !listToFill.Select(y => y.id).Contains(x.VideoId))                                                     
             .Distinct(new UserYTComparer())
             .Skip(skip).Take(count.count)
             .Select(s => _autoMapper.Map<IconDto>(s));

            count.count -= exploreSongs.Count();

            listToFill.AddRange(exploreSongs);

        }

        private void FillFromUsersSpotify(List<IconDto> listToFill, string query, int deep, ExploreCounter count, int skip)
        {
            string pattern = $@"^{query}[/w]*";
            var regStart = new Regex(pattern);


            var exploreSongs = _liveContext.Folders.Where(x => x.IsShared).Include(x => x.UserSpotify).SelectMany(x => x.UserYouTubes).ToList()
            //var exploreSongs = _liveContext.UserYoutubes
             .Where(x => x.GetTitle().Match(query, regStart, deep) || x.GetTags().Any(t => t.Match(query, regStart, deep)))
             .Where(x => !listToFill.Select(y => y.id).Contains(x.VideoId))
             .Distinct(new UserYTComparer())
             .Skip(skip).Take(count.count)
             .Select(s => _autoMapper.Map<IconDto>(s));

            count.count -= exploreSongs.Count();

            listToFill.AddRange(exploreSongs);

        }


        public async Task<List<FolderDto>> GetAllSharedFoldersAsync(string query, int skip, int count, string userFolder)
        {
            var folders = await _liveContext.Folders
            .Where(x => x.IsShared)
            .Where(x => x.Title.Contains(query) || x.ShareDescription.Contains(query))
            .Include(x => x.UserYouTubes)
            .Include(x => x.UserImages)
            .Include(x => x.UserSpotify).ToListAsync();

            if (!string.IsNullOrEmpty(userFolder))
            {
                var userFold = folders.FirstOrDefault(x => x.ID.ToString() == userFolder);
                if (userFold != null)
                {
                    folders = folders.Where(x => x.UserId == userFold.UserId).ToList();
                }
            }

            folders = folders
            .Where(x => x.HasIcons())
            .Skip(skip).Take(count)
            .ToList();

            // will be segereged by create date, populars, modyfy date

            foreach (var folder in folders)
            {
                folder.SetFourIcons();
            }
            var icons = folders.Select(x => _autoMapper.Map<FolderDto>(x)).ToList();
            foreach (var icon in icons)
            {
                int followers = _liveContext.SharedFolders.Where(x => x.FolderId.ToString() == icon.id).Count();
                icon.followers = followers;
                icon.setLocation(false);
            }

            //var results = new ExploreResultsDto(icons, count);

            return icons;

        }



        public async Task<List<FolderDto>> GetAllSharedDesktopsAsync(string query, int skip, int count)
        {
            var desktops = await _liveContext.Users
            //.Where(x => x.IsPublic)
            .Where(x => x.PublicName.Contains(query) || x.PublicDescription.Contains(query))
            .Include(x => x.UserYoutubes)
            .Include(x => x.UserImages)
            .Include(x => x.UserSpotify).ToListAsync();

            desktops = desktops
            .Where(x => x.HasIcons())
            .Skip(skip).Take(count)
            .ToList();

            // will be segereged by create date, populars, modyfy date

            foreach (var desk in desktops)
            {
                desk.SetFourIcons();
            }
            var icons = desktops.Select(x => _autoMapper.Map<FolderDto>(x)).ToList();
            foreach (var icon in icons)
            {
                int followers = _liveContext.SharedDesktops.Where(x => x.OwnerId.ToString() == icon.id).Count();
                icon.followers = followers;
                icon.setLocation(false);
            }


            return icons;

        }


        public async Task<List<FolderDto>> GetDeskIconsAsync(Guid ownerId, string folderId)
        {
            var icons = await _userDesktopRepository.GetAllIconsForUserAsync(ownerId, folderId);
            var images = await _userDesktopRepository.GetAllImagesForUserAsync(ownerId, folderId);
            var spotify = await _userDesktopRepository.GetAllSpotifyForUserAsync(ownerId, folderId);

            icons.AddRange(images);
            icons.AddRange(spotify);

            var allIcons = icons.Select(x => new FolderDto(x)).ToList();

            if (string.IsNullOrEmpty(folderId))
            {
                var folders = await _userDesktopRepository.GetAllFoldersForUserAsync(ownerId, true);
                allIcons.AddRange(folders);
            }
                return allIcons;
           
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
