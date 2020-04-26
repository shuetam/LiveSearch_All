using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using AutoMapper;
using Live.Core;

namespace Live.Mapper
{
    public static class AutoMapperConfig
    {

        public static IMapper Initialize()
        => new MapperConfiguration(config => 
        {
            config.CreateMap<RadioSong, RadioSongDto>()
                .ForMember(d => d.title, s => s.MapFrom(x => x.Name))
                .ForMember(d => d.videoId  , s => s.MapFrom(x => x.YouTubeId))
                .ForMember(d => d.count  , s => s.MapFrom(x => x.Count))
                .ForMember(d => d.top  , s => s.MapFrom(x => Regex.Replace(x.top_, @"\,+", "."))) 
                .ForMember(d => d.left  , s => s.MapFrom(x => Regex.Replace(x.left_, @"\,+", ".")));

            config.CreateMap<ArchiveSong, SongDto>()
                .ForMember(d => d.title, s => s.MapFrom(x => x.Name))
                .ForMember(d => d.videoId  , s => s.MapFrom(x => x.YouTube.VideoID))
                .ForMember(d => d.count  , opt => opt.MapFrom(src => "1"))
                .ForMember(d => d.top  , s => s.MapFrom(x => x.YouTube.top_))
                .ForMember(d => d.left  , s => s.MapFrom(x => x.YouTube.left_));



            config.CreateMap<ArchiveSong, IconDto>()
                .ForMember(d => d.title, s => s.MapFrom(x => x.Name))
                .ForMember(d => d.id, s => s.MapFrom(x => x.YouTube.VideoID))
                .ForMember(d => d.count  , opt => opt.MapFrom(src => "1"))
                .ForMember(d => d.top  , s => s.MapFrom(x => x.YouTube.top_))
                .ForMember(d => d.left  , s => s.MapFrom(x => x.YouTube.left_));

            config.CreateMap<ArchiveMovie, IconDto>()
                .ForMember(d => d.title, s => s.MapFrom(x => x.Name))
                .ForMember(d => d.id, s => s.MapFrom(x => x.YouTube.VideoID))
                .ForMember(d => d.count  , opt => opt.MapFrom(src => "1"))
                .ForMember(d => d.top  , s => s.MapFrom(x => x.YouTube.top_))
                .ForMember(d => d.left  , s => s.MapFrom(x => x.YouTube.left_));


            config.CreateMap<User, UserDto>()
                .ForMember(d => d.UserId, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.Email  , s => s.MapFrom(x => x.UserEmail))
                 .ForMember(d => d.Role  , s => s.MapFrom(x => x.UserRole));

            config.CreateMap<User, UserAdminDto>()
                .ForMember(d => d.Name, s => s.MapFrom(x => x.UserName))
                .ForMember(d => d.Email  , s => s.MapFrom(x => x.UserEmail))
                .ForMember(d => d.AuthType  , s => s.MapFrom(x => x.AuthType))
                .ForMember(d => d.LastLogin  , s => s.MapFrom(x => x.LastLogin.ToString("dd.MM.yyyy HH:mm")))
                .ForMember(d => d.LoginsCount  , s => s.MapFrom(x => x.LoginsCount))
                .ForMember(d => d.Active  , s => s.MapFrom(x => x.IsActive.ToString()))
                .ForMember(d => d.IconsCount  , s 
                => s.MapFrom(x => x.UserImages.Count + x.UserYoutubes.Count + x.UserSpotify.Count))
                 .ForMember(d => d.Created, s => s.MapFrom(x => x.CreatedAt.ToString("dd.MM.yyyy HH:mm")));

            config.CreateMap<UserYoutube, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.VideoId))
                .ForMember(d => d.left  , s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top  , s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.count  , s => s.MapFrom(x => "1"))
                .ForMember(d => d.title  , s => s.MapFrom(x => x.Title))
                .ForMember(d => d.type  , s => s.MapFrom(x => "YT"));

            config.CreateMap<UserImage, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.UrlAddress))
                .ForMember(d => d.left  , s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top  , s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.count  , s => s.MapFrom(x => "1"))
                .ForMember(d => d.title  , s => s.MapFrom(x => x.Title))
                .ForMember(d => d.source  , s => s.MapFrom(x => x.Source))
                .ForMember(d => d.type  , s => s.MapFrom(x => x.ImgType));

            config.CreateMap<UserSpotify, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.SpotifyId))
                .ForMember(d => d.left  , s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top  , s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.count  , s => s.MapFrom(x => "1"))
                .ForMember(d => d.title  , s => s.MapFrom(x => x.Title))
                .ForMember(d => d.source  , s => s.MapFrom(x => x.ImgSource))
                .ForMember(d => d.type  , s => s.MapFrom(x => "SPOTIFY"));
              


            config.CreateMap<FrontYouTube, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.videoId))
                .ForMember(d => d.left  , s => s.MapFrom(x => x.left))
                .ForMember(d => d.top  , s => s.MapFrom(x => x.top))
                .ForMember(d => d.count  , s => s.MapFrom(x => x.count))
                .ForMember(d => d.countValue  , s => s.MapFrom(x =>  x.countValue))
                .ForMember(d => d.title  , s => s.MapFrom(x => x.title))
                .ForMember(d => d.playAt  , s => s.MapFrom(x => x.playAt))
                .ForMember(d => d.type  , s => s.MapFrom(x => "YT"));


            config.CreateMap<Folder, FolderDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.left  , s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top  , s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.count  , s => s.MapFrom(x => "2"))
                .ForMember(d => d.icon0, s => s.MapFrom(x => x.icon0))
                .ForMember(d => d.icon1, s => s.MapFrom(x => x.icon1))
                .ForMember(d => d.icon2, s => s.MapFrom(x => x.icon2))
                .ForMember(d => d.icon3, s => s.MapFrom(x => x.icon3))
                .ForMember(d => d.title  , s => s.MapFrom(x => x.Title))
                .ForMember(d => d.type  , s => s.MapFrom(x => "FOLDER"));

            config.CreateMap<Folder, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.left  , s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top  , s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.title  , s => s.MapFrom(x => x.Title))
                .ForMember(d => d.type  , s => s.MapFrom(x => "FOLDER"));
        }
        ).CreateMapper();

    }
}
