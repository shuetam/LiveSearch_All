using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

public class UserYoutube : Live.Core.Entity
{
    public Guid UserId {get; protected set;}

    public Guid? FolderId {get; protected set;}
    public string VideoId {get; protected set;}//this is id
    public string LocLeft {get; protected set;}
    public string LocTop {get; protected set;}
    public string Title {get; protected set;}
    public string ImgSource { get; protected set; }

    public string Tags {get; protected set;}
    //public User User {get; protected set;}
    public DateTime CreatedAt {get; protected set;}
    public DateTime? AddedToFolder {get; protected set;}
    

        public UserYoutube()
        {
        }

        public UserYoutube(Guid userId, string videoId, string title, string left, string top, string folderId, string tagsString, string imgSource) 
        {
            UserId = userId;
            Title = title;

            if(string.IsNullOrEmpty(folderId))
            {
                FolderId = null;
            }
            else 
            {
                FolderId =  new Guid(folderId);
            }

            VideoId = videoId;
            LocLeft = left;
            LocTop = top;
            CreatedAt = DateTime.Now;
            Tags = tagsString;
            ImgSource = imgSource;
        }


          public UserYoutube( string videoId, string title, string left, string top) 
        {
            //UserId = new Guid(userId);
            Title = title;
            FolderId = null;
            VideoId = videoId;
            LocLeft = left;
            LocTop = top;
            CreatedAt = DateTime.Now;
        }

        public void SetFolder(Guid folderId)
        {
            if(this.FolderId == null)
            {
                this.FolderId = folderId;
                this.AddedToFolder = DateTime.Now;
            }
        }

        public void RemoveFromFolder()
        {
            if(this.FolderId != null)
            {
                this.FolderId = null;
                this.AddedToFolder = null;
            }
        }

        public void ChangeLocation(string left, string top)
        {
            this.LocLeft = left;
            this.LocTop = top;
        }

        public void ChangeTitle(string newTitle)
        {

            if(newTitle.Length > 100)
            {
                newTitle = newTitle.Substring(0, 100) + "...";
            }
            this.Title = newTitle;
        }


        public void ChangeTags(string newTags)
        {
            this.Tags = newTags;
        }

        public List<string> GetTags()
        {
            if(string.IsNullOrEmpty(this.Tags))
                return new List<string>();
            return  Regex.Split(this.Tags, @"[|]{2}").ToList();
        }

}