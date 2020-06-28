using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Web;
using System.Globalization;

namespace Live.Core
{
    public class FrontYouTube
    {
    public string title {get; set;}
    public string  videoId {get; set;}

    public string  guidId {get; set;}
    public string  top {get; set;}
    public string left {get; set;}
    public string  count {get; set;}
    public int countValue {get; set;}
     public List<string>  tags {get; set;}
    public DateTime  playAt {get; set;}

    public FrontYouTube(Song song, int count)
    {
        this.title = song.Name;
        this.videoId = song.YouTube.VideoID;
        this.top = song.YouTube.top_;
        this.left = song.YouTube.left_;
        this.count = count.ToString();
        this.playAt = song.PlayAt;
        this.countValue = count;
        this.guidId = song.ID.ToString();

        this.tags = new HashSet<string>(song.getTags()).ToList();

    }

//for admin
      public FrontYouTube(TVMovie movie)
    {
        this.title = movie.TrailerSearch;
        this.guidId = movie.ID.ToString();
        this.videoId = movie.YouTube.VideoID;
        this.top = movie.YouTube.top_;
        this.left = movie.YouTube.left_;
        string rating = movie.Rating.Replace(",","");
        rating = rating.Replace(".","");
         if(rating == "00")
        {
            rating = "0";
        }
        this.count = (rating == "0")? "60" : rating;
        try{
        this.countValue = Int32.Parse(rating);
        }
        catch {
            this.countValue = 0;
        }

        this.playAt = movie.PlayAt;
    }

    public FrontYouTube(TVMovie movie,  List<DateTime> dates)
    {
        //var hour = movie.PlayAt.Hour;
        this.guidId = movie.ID.ToString();
        this.tags = movie.getTags();
        this.playAt = movie.PlayAt;
        var dateTimeFormats = new CultureInfo("pl-PL").DateTimeFormat;
        var day = movie.PlayAt.ToString("dddd", dateTimeFormats);
        if(day == DateTime.Now.ToString("dddd", dateTimeFormats))
        {
            day = "dzisiaj";
        }
        string another = "";

        string rating = movie.Rating.Replace(",","").Trim();
        rating = rating.Replace(".","").Trim();
        //int frontCount = Int32.Parse(rating);

        if(rating == "00")
        {
            rating = "0";
        }

        var hashDates = new HashSet<DateTime>(dates).ToList();
        foreach(var date in hashDates)
        {
            var daya = date.ToString("dddd", dateTimeFormats);

        if(daya == DateTime.Now.ToString("dddd", dateTimeFormats))
        {
            daya = "dzisiaj";
        }
            var houra = date.ToString("HH:mm");

            another += $"{daya} godz. {houra}||";
        }

        var inTime = (movie.PlayAt - DateTime.Now).TotalMinutes;
        var inHour = "";
        if(inTime>0)
        {
        var hours = Convert.ToInt32(Math.Floor(inTime/60));
        var min = Convert.ToInt32(Math.Floor(inTime%60));
        //var dateStart = new DateTime(0,0,0,0,0,0);
        //var inDate = dateStart.AddMinutes(inTime).ToString("HH:mm");
        inHour = $"za {hours}h {min}min";
        }
        else 
        {
            inHour = "trwa";
        }

        var hour = movie.PlayAt.ToString("HH:mm");
        var title = $"\"{movie.Title}\"||{day} godz. {hour}||{another}{movie.Station}||[{inHour}]";


        this.title = title;
        this.videoId = movie.YouTube.VideoID;
        this.top = movie.YouTube.top_;
        this.left = movie.YouTube.left_;
        this.count = (rating == "0")? "60" : rating;
        try {
        this.countValue = Int32.Parse(rating);
        }
        catch(Exception ex)
        {
           this.countValue = 0;
        }
    }

    }

}