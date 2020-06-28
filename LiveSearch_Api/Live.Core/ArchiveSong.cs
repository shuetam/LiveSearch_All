using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;


namespace Live.Core
{
    public class ArchiveSong : Entity
    {
        public string Name {get; protected set;}
         public string Station {get; protected set;}
        public YouTube YouTube {get; protected set;}
/* 
        public Song(string station, Song archive_song)
        {
            this.PlayAt = DateTime.Now;
            this.Station = station;
            this.Name= archive_song.Name;
            this.YouTube = archive_song.YouTube;
        } */

       protected ArchiveSong()
        {}
    

        public ArchiveSong(Song song)
        {
            this.Name = song.Name;
            this.YouTube = song.YouTube;
            this.Station = song.Station;
        }

        public void ChangeYouTubeId(string id)
        {
            this.YouTube.VideoID = id;
        }

public void ChangeLocation(string left, string top)
        {
            this.YouTube.ChangeLocation(left, top);
        }
        public void ChangeName(string name)
        {
            this.Name = name;
        }


   public List<string> getTags()
        {

        var tags = new List<string>();
   
        string name = this.Name.Replace(",", " ");
        //tags.Add(name);
        string pattern = @"\s+[-]\s+";
        var artTitle = Regex.Split(name, pattern ).ToList();
        tags.AddRange(artTitle);
        foreach(var ta in artTitle)
        {
            tags.AddRange(ta.Split('/').ToList());
        }
        if(!string.IsNullOrEmpty(this.Station))
        {
            tags.Add(this.Station);
        }

          return new HashSet<string>(tags).ToList();
        }

    }
}