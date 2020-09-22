using System;
using System.Collections.Generic;
using Live.Core;

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
    // public string UserNick {get; protected set;}

    public List<UserYoutube> UserYoutubes { get; set; }
    public List<UserImage> UserImages { get; set; }
    public List<UserSpotify> UserSpotify { get; set; }
    public List<Folder> FollowedFolders { get; set; }

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

    public void SetUserNick(string nick)
    {
        // if(this.UserNick != nick) 
        // {
        //  this.UserNick = nick;
        // }
    }
}
