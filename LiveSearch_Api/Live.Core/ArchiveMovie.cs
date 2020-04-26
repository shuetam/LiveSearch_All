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
        public YouTube YouTube {get; protected set;}
        public string Rating {get; protected set;}

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

    }
}