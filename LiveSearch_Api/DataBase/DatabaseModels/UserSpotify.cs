using Live;
using Newtonsoft.Json;
using Serilog;
using SpotifyAPI.Web;
using System;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

public class UserSpotify : Live.Core.Entity
{
    public Guid UserId { get; protected set; }
    public Guid? FolderId { get; protected set; }
    public string SpotifyId { get; protected set; }//this is id
    public string ImgSource { get; protected set; }
    public string LocLeft { get; protected set; }
    public string LocTop { get; protected set; }
    public string Title { get; protected set; }
    public DateTime CreatedAt { get; protected set; }
    public string Tags { get; protected set; }
    public DateTime? AddedToFolder { get; protected set; }


    public UserSpotify()
    {
    }

    public UserSpotify(Guid userId, string spotifyId, string imgSrc, string title, string left, string top, string folderId, string tagsString)
    {
        UserId = userId;
        Title = title;
        SpotifyId = spotifyId;

        if (string.IsNullOrEmpty(folderId))
        {
            FolderId = null;
        }
        else
        {
            FolderId = new Guid(folderId);
        }

        ImgSource = imgSrc;
        LocLeft = left;
        LocTop = top;
        CreatedAt = DateTime.Now;
        Tags = tagsString;

    }


    //<iframe src = "https://open.spotify.com/embed/album/3Talg3a0AmXfiV4FlV3ZjL" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

    //<iframe src = "https://open.spotify.com/embed/track/0FYUTxJZvvOVLopuhusqYC" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>


    //<iframe src = "https://open.spotify.com/embed/artist/0bOlhT8OcoC1lCpN69NcFP" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

    //  <iframe src = "https://open.spotify.com/embed/playlist/5S6Z1f6tsGaApoH9RNOE9c" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

    public void SetFolder(Guid folderId)
    {
        if (this.FolderId == null)
        {
            this.FolderId = folderId;
            this.AddedToFolder = DateTime.Now;
        }
    }

    public void RemoveFromFolder()
    {
        if (this.FolderId != null)
        {
            this.FolderId = null;
            this.AddedToFolder = null;
        }
    }


    public void ChangeTags(string newTags)
    {


        this.Tags = newTags;
    }

    public void ChangeLocation(string left, string top)
    {
        this.LocLeft = left;
        this.LocTop = top;
    }

    public void ChangeTitle(string newTitle)
    {

        if (newTitle.Length > 100)
        {
            newTitle = newTitle.Substring(0, 100) + "...";
        }
        this.Title = newTitle;
    }

}