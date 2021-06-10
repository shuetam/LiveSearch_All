using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System;

namespace Live.Core
{
    public class FolderDto : IconDto
    {
        public DateTime? created { get; set; }
        public string sharedAt { get; set; }
        public string updatedAt { get; set; }
        public string shareDescription { get; set; }
        public int followers { get; set; }
        public int iconsCount { get; set; }
        public bool hasDescription { get; set; }
        public bool followed { get; set; }
        public FolderDto(string _id, string _type) : base(_id, "", _type)
        {
        }

        protected FolderDto()
        {

        }


        public FolderDto(IconDto icon)
        {

            id = icon.id;
            guidId = icon.guidId;
            title = icon.title;
            top = icon.top;
            left = icon.left;
            count = icon.count;
            type = icon.type;
            source = icon.source;
            tags = icon.tags;
            playAt = icon.playAt;
            countValue = icon.countValue;
            groupBook = icon.groupBook;
            created = icon.created;
            isSong = icon.isSong;

        }

        public FolderDto(DateTime? date, string ID)
        {
            created = date;
            id = ID;
        }

        public string icon0 { get; set; }
        public string icon1 { get; set; }
        public string icon2 { get; set; }
        public string icon3 { get; set; }
        public bool shared { get; set; }
        public bool hasIcons { get; set; }

    }
}