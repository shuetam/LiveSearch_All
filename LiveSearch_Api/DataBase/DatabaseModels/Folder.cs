using System;
using System.Collections.Generic;
using System.Linq;
using Live.Controllers;
using Live.Core;

public class Folder : Live.Core.Entity
{
    public Guid? ParentId { get; protected set; }
    public Guid UserId { get; protected set; }
    public string LocLeft { get; protected set; }
    public string LocTop { get; protected set; }
    public string Title { get; protected set; }
    public string ShareDescription { get; protected set; }
    public bool IsShared { get; protected set; }
    public DateTime CreatedAt { get; protected set; }
    public DateTime? SharedAt { get; protected set; }

     public DateTime? UpdatedAt { get; protected set; }
    public List<UserYoutube> UserYouTubes { get; protected set; }
    public List<UserImage> UserImages { get; protected set; }
    public List<UserSpotify> UserSpotify { get; protected set; }
    //public int? Followers { get; protected set; }

    public string icon0 { get => four[0]; }
    public string icon1 { get => four[1]; }
    public string icon2 { get => four[2]; }
    public string icon3 { get => four[3]; }

    private List<string> GetLastFour()
    {

        if (UserYouTubes.Count() > 5)
        { 
            return this.UserYouTubes.OrderBy(x => x.AddedToFolder).Select(x => x.VideoId).ToList()
            .Skip(Math.Max(0, UserYouTubes.Count() - 4)).ToList();
        }
        else
        {
            return this.UserYouTubes.OrderBy(x => x.AddedToFolder).Select(x => x.VideoId).ToList();
        }
    }

    string[] four = { "", "", "", "" };


    private string getImgSrc(string videoId)
    {
        return "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
    }

    public bool HasIcons()
    {
        return !(this.UserYouTubes.Count == 0 && this.UserSpotify.Count == 0 && this.UserImages.Count == 0);
    }

    public bool ShareFolder(bool shared)
    {
        IsShared = shared;
        if (shared)
        {
            SharedAt = DateTime.Now;

        }
        return IsShared;
    }

public int IconsCount()
{
    int count = 
    this.UserImages.Count +
    this.UserSpotify.Count +
    this.UserYouTubes.Count;
    return count;
}

/*     public void AddFollower()
    {
        if (this.IsShared)
            ++this.Followers;
    }

    public void RemoveFollower()
    {
        if (Followers > 0 && this.IsShared)
            --this.Followers;
    }

    private void CleanFollowers()
    {
        this.Followers = 0;
    } */


        public void UpdateFolder() 
        {
            this.UpdatedAt = DateTime.Now;
        }

    public void SetFourIcons()
    {
        var listYT = this.UserYouTubes.OrderByDescending(x => x.AddedToFolder)
        .Select(x => new FolderDto(x.AddedToFolder, getImgSrc(x.VideoId)))
        .ToList()
        .Take(4);


        var listImg = this.UserImages.OrderByDescending(x => x.AddedToFolder)
        .Select(x => new FolderDto(x.AddedToFolder, x.UrlAddress)).ToList()
        .Take(4);

        var listSpot = this.UserSpotify.OrderByDescending(x => x.AddedToFolder)
        .Select(x => new FolderDto(x.AddedToFolder, x.ImgSource)).ToList()
        .Take(4);

        var list = new List<FolderDto>();
        list.AddRange(listYT);
        list.AddRange(listImg);
        list.AddRange(listSpot);

        list = list.OrderByDescending(x => x.DateCreated).ToList();

        //var listofId = this.UserYouTubes.Select(x => x.VideoId).ToList();
        //listofId.Reverse();
        //var listImg = this.UserImages.ToList();



        for (int i = 0; i < 4; i++)
        {
            try
            {
                four[i] = list[i].id;

            }
            catch (Exception e)
            {

            }

        }
        

    }

    protected Folder()
    {
    }
    public Folder(Guid userId, string title)
    {
        UserId = userId;
        Title = title;
        LocLeft = "10vw";
        LocTop = "10vh";
        CreatedAt = DateTime.Now;
        UserYouTubes = new List<UserYoutube>();
        UserImages = new List<UserImage>();
        UserSpotify = new List<UserSpotify>();

    }


    public Folder(Guid userId, EntitySetter folder)
    {
        UserId = userId;
        Title = folder.Title;
        IsShared = folder.Shared;
        ShareDescription = folder.Description;
        LocLeft = "10vw";
        LocTop = "10vh";
        CreatedAt = DateTime.Now;
        UserYouTubes = new List<UserYoutube>();
        UserImages = new List<UserImage>();
        UserSpotify = new List<UserSpotify>();
        this.UpdatedAt = DateTime.Now;
    }

    public void ChangeLocation(string left, string top)
    {
        this.LocLeft = left;
        this.LocTop = top;
    }

    public void ChangeTitle(string newTitle)
    {
        if (newTitle != this.Title)
        {
            if (newTitle.Length > 20)
            {
                newTitle = newTitle.Substring(0, 20);
            }
            this.Title = newTitle;
            this.UpdatedAt = DateTime.Now;
        }
    }

    public void ChangeDescription(string newDescription)
    {
        if (newDescription != this.ShareDescription)
        {
            if (newDescription.Length > 500)
            {
                newDescription = newDescription.Substring(0, 500);
            }
            this.ShareDescription = newDescription;
              this.UpdatedAt = DateTime.Now;
        }
    }

}

