using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using Live.Core;
using Live.DataBase.DatabaseModels;

public class User : Entity
{
    public string UserSocialId { get; protected set; }
    public string UserName { get; protected set; }
    public string UserEmail { get; protected set; }
    public DateTime CreatedAt { get; protected set; }
    public DateTime LastLogin { get; protected set; }
    public int LoginsCount { get; protected set; }
    public bool IsActive { get; protected set; }
    public string AuthType { get; protected set; }
    public string UserRole { get; protected set; }
    public Guid? ResetId { get; protected set; }


    public string PasswordHash { get; protected set; }
    public string Salt { get; protected set; }
    public string NewPasswordHash { get; protected set; }
    public string NewSalt { get; protected set; }
    public DateTime? ResetPassword { get; protected set; }


    public string PublicName { get; protected set; }
    public string PublicDescription { get; protected set; }
    public bool? IsPublic { get; protected set; }
    public DateTime? SharedAt { get; protected set; }
    public DateTime? UpdatedAt { get; protected set; }


    public List<UserYoutube> UserYoutubes { get; set; }
    public List<UserImage> UserImages { get; set; }
    public List<UserSpotify> UserSpotify { get; set; }

    public string icon0 { get => four[0]; }
    public string icon1 { get => four[1]; }
    public string icon2 { get => four[2]; }
    public string icon3 { get => four[3]; }

    string[] four = { "", "", "", "" };

    protected User()
    {

    }
    public User(string userId, string userName, string userEmail, string auth, string role, string hash = "", string salt = "")
    {
        UserSocialId = userId;
        UserName = userName;
        UserEmail = userEmail;
        AuthType = auth;
        UserYoutubes = new List<UserYoutube>();
        LoginsCount = 1;
        IsActive = true;
        CreatedAt = DateTime.Now;
        LastLogin = DateTime.Now;
        UserRole = role;
        Salt = salt;
        PasswordHash = hash;
        IsPublic = false;
        this.UpdateDate();
    }

    public void ChangeStatus()
    {
        this.IsActive = !this.IsActive;
    }

    public void SetNewPassword(string hash, string salt, Guid resetId)
    {
        ResetPassword = DateTime.Now;
        NewPasswordHash = hash;
        NewSalt = salt;
        ResetId = resetId;

    }

    public bool ConfirmReset()
    {

        if (!string.IsNullOrEmpty(NewSalt) && !string.IsNullOrEmpty(NewPasswordHash) && ResetPassword.HasValue)
        {
            if (ResetPassword.Value.AddHours(24) > DateTime.Now && NewSalt != Salt && NewPasswordHash != PasswordHash)
            {
                Salt = NewSalt;
                PasswordHash = NewPasswordHash;
                return true;
            }
        }
        return false;
    }


    public void NextLogin()
    {
        LastLogin = DateTime.Now;
        LoginsCount += 1;
    }

    public bool? ShareDesktop(bool shared)
    {
        IsPublic = shared;
        if (shared)
        {
            SharedAt = DateTime.Now;

        }
        return IsPublic;
    }

    public string SetPublicName(string name)
    {
        var regex = new Regex(@"^[A-Za-z0-9_]{5,50}$");
        var regexN = new Regex(@"^[0-9]+$");
        var regex_ = new Regex(@"^[_]+$");

        if (name != PublicName && regex.IsMatch(name) && !regexN.IsMatch(name) && !regex_.IsMatch(name))
            PublicName = name;

        return PublicName;
    }

    public void ChangeDescription(string newDescription)
    {
        if (newDescription != this.PublicDescription)
        {
            if (newDescription.Length > 500)
            {
                newDescription = newDescription.Substring(0, 500);
            }
            this.PublicDescription = newDescription;
            this.UpdatedAt = DateTime.Now;
        }
    }

    public void UpdateDate()
    {
        this.UpdatedAt = DateTime.Now;
    }


    public void SetFourIcons()
    {
        var listYT = this.UserYoutubes.OrderByDescending(x => x.AddedToFolder)
        .Select(x => new FolderDto(x.CreatedAt, getImgSrc(x.VideoId, x.ImgSource)))
        .ToList()
        .Take(4);


        var listImg = this.UserImages.OrderByDescending(x => x.AddedToFolder)
        .Select(x => new FolderDto(x.AddedToFolder, x.UrlAddress)).ToList()
        .Take(4);

        var listSpot = this.UserSpotify.OrderByDescending(x => x.AddedToFolder)
        .Select(x => new FolderDto(x.CreatedAt, x.ImgSource)).ToList()
        .Take(4);

        var list = new List<FolderDto>();
        list.AddRange(listYT);
        list.AddRange(listImg);
        list.AddRange(listSpot);

        list = list.OrderByDescending(x => x.created).ToList();

        for (int i = 0; i < 4; i++)
        {
            try
            {
                four[i] = list[i].id;
            }
            catch (Exception e)
            { }
        }
    }

    private string getImgSrc(string videoId, string imgSource)
    {

        if (string.IsNullOrEmpty(imgSource) || imgSource == "YT")
        {
            return "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
        }
        return imgSource;
    }

    public int IconsCount()
    {
        if (this.UserImages != null && this.UserSpotify != null && this.UserYoutubes != null)
        {
            int count =
            this.UserImages.Count +
            this.UserSpotify.Count +
            this.UserYoutubes.Count;
            return count;
        }
        return 1;
    }

    public bool HasIcons()
    {

        if (this.UserYoutubes != null && this.UserSpotify != null && this.UserImages != null)
        {
            return !(this.UserYoutubes.Count == 0 && this.UserSpotify.Count == 0 && this.UserImages.Count == 0);
        }
        return false;
    }

    public string GetDate(DateTime? date)
    {
        if (date.HasValue)
        {
            var dateTimeFormats = new CultureInfo("pl-PL").DateTimeFormat;
            string day = date.Value.ToString("dd MMMM yyyy o HH:MM", dateTimeFormats);
            return day;
        }
        return "";
    }

}
