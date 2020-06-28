using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using HtmlAgilityPack;
using Serilog;

namespace Live.Core
{
    public class ArchiveMovie : Entity
    {
        public string Name {get; protected set;}
         public string Title {get; protected set;}
        public YouTube YouTube {get; protected set;}
        public string Rating {get; protected set;}
        public string Station {get; protected set;}

       protected ArchiveMovie()
        {}
       
        public void ChangeLocation(string left, string top)
        {
            this.YouTube.ChangeLocation(left, top);
        }

        public ArchiveMovie(TVMovie movie)
        {

            this.Name = movie.TrailerSearch;
            this.YouTube = movie.YouTube;
            if(movie.Title.Length>300)
            {
                this.Title = movie.Title.Substring(0,290);
            }
            else
            {
            this.Title = movie.Title;
            }
            if(movie.Station.Length>50)
            {
                this.Station = movie.Station.Substring(0, 40);
            }
            else
            {
                this.Station = movie.Station; 
            }

        }

        public void ChangeYouTubeId(string id)
        {
            this.YouTube.VideoID = id;
        }

        public void ChangeName(string name)
        {
            this.Name = name;
        }

         public string changeRating(string newRating)
        {
                this.Rating= newRating;
                return this.Rating;
        }

          public List<string> getTags()
            {
                var tags = new List<string>();
                if(!string.IsNullOrEmpty(this.Title))
                    tags.Add(this.Title.Replace(",", ""));
                if(!string.IsNullOrEmpty(this.Name))
                    tags.Add(this.Name.Replace(",", ""));
                if(!string.IsNullOrEmpty(this.Station))
                    tags.Add(this.Station);
                    return new HashSet<string>(tags).ToList();
            }

    }
}