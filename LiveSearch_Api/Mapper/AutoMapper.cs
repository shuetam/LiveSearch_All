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
using Live.DataBase.DatabaseModels;

namespace Live.Mapper
{
    public static class AutoMapperConfig
    {

        public static IMapper Initialize()
        => new MapperConfiguration(config =>
        {
            //string yt = "https://www.youtube.com/watch?v=";

            config.CreateMap<Song, IconDto>()
                         .ForMember(d => d.title, s => s.MapFrom(x => x.Name))
                         .ForMember(d => d.guidId, s => s.MapFrom(x => x.ID.ToString()))
                         .ForMember(d => d.id, s => s.MapFrom(x =>  x.YouTube.VideoID))
                         .ForMember(d => d.count, opt => opt.MapFrom(src => "1"))
                         .ForMember(d => d.top, s => s.MapFrom(x => x.YouTube.top_))
                         .ForMember(d => d.left, s => s.MapFrom(x => x.YouTube.left_))
                         .ForMember(d => d.tags, s => s.MapFrom(x => x.getTags()))
                         .ForMember(d => d.type, s => s.MapFrom(x => "YT"));

            config.CreateMap<ArchiveSong, IconDto>()
                .ForMember(d => d.title, s => s.MapFrom(x => x.Name))
                .ForMember(d => d.guidId, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.id, s => s.MapFrom(x =>  x.YouTube.VideoID))
                .ForMember(d => d.count, opt => opt.MapFrom(src => "1"))
                .ForMember(d => d.top, s => s.MapFrom(x => x.YouTube.top_))
                .ForMember(d => d.left, s => s.MapFrom(x => x.YouTube.left_))
                .ForMember(d => d.tags, s => s.MapFrom(x => x.getTags()))
                .ForMember(d => d.type, s => s.MapFrom(x => "YT"));

            config.CreateMap<ArchiveMovie, IconDto>()
                .ForMember(d => d.title, s => s.MapFrom(x => x.Name))
                .ForMember(d => d.guidId, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.id, s => s.MapFrom(x =>  x.YouTube.VideoID))
                .ForMember(d => d.count, opt => opt.MapFrom(src => "1"))
                .ForMember(d => d.top, s => s.MapFrom(x => x.YouTube.top_))
                .ForMember(d => d.left, s => s.MapFrom(x => x.YouTube.left_))
                .ForMember(d => d.tags, s => s.MapFrom(x => x.getTags()))
                .ForMember(d => d.type, s => s.MapFrom(x => "YT"));


            config.CreateMap<User, UserDto>()
                .ForMember(d => d.UserId, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.Email, s => s.MapFrom(x => x.UserEmail))
                 .ForMember(d => d.Role, s => s.MapFrom(x => x.UserRole))
                .ForMember(d => d.UserName, s => s.MapFrom(x => x.UserName));

            config.CreateMap<User, UserAdminDto>()
                .ForMember(d => d.Name, s => s.MapFrom(x => x.UserName))
                .ForMember(d => d.Email, s => s.MapFrom(x => x.UserEmail))
                .ForMember(d => d.AuthType, s => s.MapFrom(x => x.AuthType))
                .ForMember(d => d.LastLogin, s => s.MapFrom(x => x.LastLogin.ToString("dd.MM.yyyy HH:mm")))
                .ForMember(d => d.LoginsCount, s => s.MapFrom(x => x.LoginsCount))
                .ForMember(d => d.Active, s => s.MapFrom(x => x.IsActive.ToString()))
                .ForMember(d => d.IconsCount, s
              => s.MapFrom(x => x.UserImages.Count + x.UserYoutubes.Count + x.UserSpotify.Count))
                 .ForMember(d => d.Created, s => s.MapFrom(x => x.CreatedAt.ToString("dd.MM.yyyy HH:mm")));

            config.CreateMap<UserYoutube, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.VideoId))
                .ForMember(d => d.left, s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top, s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.count, s => s.MapFrom(x => "1"))
                .ForMember(d => d.title, s => s.MapFrom(x => x.Title))
                .ForMember(d => d.tags, s => s.MapFrom(x => Regex.Split(x.Tags, @"[|]{2}").ToList()))
                .ForMember(d => d.type, s => s.MapFrom(x => (string.IsNullOrEmpty(x.ImgSource) || x.ImgSource == "YT") ? "YT" : "MOVIE"))
                .ForMember(d => d.source, s => s.MapFrom(x => x.ImgSource))
                .ForMember(d => d.created, s => s.MapFrom(x => (x.AddedToFolder.HasValue && x.FolderId.HasValue) ? x.AddedToFolder : x.CreatedAt));


            config.CreateMap<UserImage, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.UrlAddress))
                .ForMember(d => d.guidId, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.left, s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top, s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.count, s => s.MapFrom(x => "1"))
                .ForMember(d => d.title, s => s.MapFrom(x => x.Title))
                .ForMember(d => d.source, s => s.MapFrom(x => x.Source))
                .ForMember(d => d.tags, s => s.MapFrom(x => Regex.Split(x.Tags, @"[|]{2}").ToList()))
                .ForMember(d => d.type, s => s.MapFrom(x => x.ImgType))
                .ForMember(d => d.created, s => s.MapFrom(x => (x.AddedToFolder.HasValue && x.FolderId.HasValue) ? x.AddedToFolder : x.CreatedAt));

            config.CreateMap<UserSpotify, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.SpotifyId))
                .ForMember(d => d.guidId, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.left, s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top, s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.count, s => s.MapFrom(x => "1"))
                .ForMember(d => d.title, s => s.MapFrom(x => x.Title))
                 .ForMember(d => d.tags, s => s.MapFrom(x => Regex.Split(x.Tags, @"[|]{2}").ToList()))
                .ForMember(d => d.source, s => s.MapFrom(x => x.ImgSource))
                .ForMember(d => d.type, s => s.MapFrom(x => "SPOTIFY"))
                .ForMember(d => d.created, s => s.MapFrom(x => (x.AddedToFolder.HasValue && x.FolderId.HasValue)? x.AddedToFolder : x.CreatedAt));



            config.CreateMap<FrontYouTube, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.videoId))
                .ForMember(d => d.guidId, s => s.MapFrom(x => x.guidId))
                .ForMember(d => d.left, s => s.MapFrom(x => x.left))
                .ForMember(d => d.top, s => s.MapFrom(x => x.top))
                .ForMember(d => d.count, s => s.MapFrom(x => x.count))
                .ForMember(d => d.countValue, s => s.MapFrom(x => x.countValue))
                .ForMember(d => d.title, s => s.MapFrom(x => x.title))
                .ForMember(d => d.playAt, s => s.MapFrom(x => x.playAt))
                .ForMember(d => d.tags, s => s.MapFrom(x => x.tags))
                .ForMember(d => d.source, s => s.MapFrom(x => x.source))
                .ForMember(d => d.isSong, s => s.MapFrom(x => x.isSong))
                .ForMember(d => d.type, s => s.MapFrom(x => "YT"));


            config.CreateMap<Folder, FolderDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.left, s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top, s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.count, s => s.MapFrom(x => "2"))
                .ForMember(d => d.icon0, s => s.MapFrom(x => x.icon0))
                .ForMember(d => d.icon1, s => s.MapFrom(x => x.icon1))
                .ForMember(d => d.icon2, s => s.MapFrom(x => x.icon2))
                .ForMember(d => d.icon3, s => s.MapFrom(x => x.icon3))
                .ForMember(d => d.title, s => s.MapFrom(x => x.Title))
                .ForMember(d => d.type, s => s.MapFrom(x => "FOLDER"))
                .ForMember(d => d.shared, s => s.MapFrom(x => x.IsShared))
                .ForMember(d => d.created, s => s.MapFrom(x => x.CreatedAt))
                .ForMember(d => d.hasIcons, s => s.MapFrom(x => x.HasIcons()))
                .ForMember(d => d.sharedAt, s => s.MapFrom(x => x.GetDate(x.SharedAt)))
                .ForMember(d => d.updatedAt, s => s.MapFrom(x => x.GetDate(x.UpdatedAt)))
                .ForMember(d => d.hasDescription, s => s.MapFrom(x => !string.IsNullOrEmpty(x.ShareDescription)))
                  //.ForMember(d => d.followers, s => s.MapFrom(x => x.Followers))
                .ForMember(d => d.iconsCount, s => s.MapFrom(x => x.IconsCount()))
                .ForMember(d => d.shareDescription, s => s.MapFrom(x => x.ShareDescription));
               

            config.CreateMap<Folder, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.ID.ToString()))
                .ForMember(d => d.left, s => s.MapFrom(x => x.LocLeft))
                .ForMember(d => d.top, s => s.MapFrom(x => x.LocTop))
                .ForMember(d => d.title, s => s.MapFrom(x => x.Title))
                .ForMember(d => d.type, s => s.MapFrom(x => "FOLDER"));

            config.CreateMap<Bestseller, IconDto>()
                .ForMember(d => d.id, s => s.MapFrom(x => x.ImageSrc))

                .ForMember(d => d.count, s => s.MapFrom(x => "1"))
                .ForMember(d => d.source, s => s.MapFrom(x => x.Store))
                .ForMember(d => d.tags, s => s.MapFrom(x => x.getTags()))
                .ForMember(d => d.title, s => s.MapFrom(x => (x.Title + "||" + x.Author)))
                .ForMember(d => d.type, s => s.MapFrom(x => "BOOK"))
                .ForMember(d => d.groupBook, s => s.MapFrom(x => x.GroupNo));
        }
        ).CreateMapper();

    }
}
/* public IconDto(Bestseller agent,  int count)
    {
        this.id = agent.ImageSrc;
        this.type = "BOOK";
        this.title = agent.Title + "||" + agent.Author;
        this.setLocation(false);
        this.count = count.ToString();
        this.countValue = count;
        this.source = agent.Store;
        this.tags = agent.getTags();
        this.playAt = agent.Added.HasValue? agent.Added.Value : DateTime.Now ;
    } */
