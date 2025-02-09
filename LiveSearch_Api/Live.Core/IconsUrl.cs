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
using System.Collections.Specialized;
using System.Text;
using Newtonsoft.Json;
using SpotifyAPI.Web;
using static SpotifyAPI.Web.SearchRequest;
using Live.Live.Core;

namespace Live.Core
{
    public class IconsUrl
    {

        //public List<IconDto> IDS {get; private set;}
        public IconsUrl(string url)
        {
            //this.SetIDFromUrl(url);
        }

        private static bool isSrc(string url, List<string> list)
        {
            foreach (var form in list)
            {
                var reg = new Regex(".*[.]{1}" + form + "$");
                if (reg.IsMatch(url))
                {
                    return true;
                }
            }
            return false;
        }

        public static async Task<List<IconDto>> GetIdsFromUrl(string url, bool isMovie)
        {
            var icons = new List<IconDto>();

            try
            {
                string patternYT1 = "watch[?]{1}v[=]{1}([^&]+)";
                string patternYT2 = "youtu.be[/]{1}([^&]+)";

                var imagesF = new List<string>(){
                    "apng", "bmp","pjpeg","pjp","png","svg","tif",
                    "gif", "ico", "cur","jpg","jpeg", "jfif","tiff", "webp"
                    };

                var reg1 = new Regex(patternYT1);
                var reg2 = new Regex(patternYT2);
                bool yt1 = reg1.IsMatch(url);
                bool yt2 = reg2.IsMatch(url);
                bool insta = url.Contains("instagram.com/p/");
                bool is_Src = isSrc(url, imagesF);
                bool isSpotify = url.Contains("iframe") && url.Contains("spotify");


                if (is_Src && !isMovie)
                {
                    icons.Add(new IconDto(url, url, "IMG"));
                }


                if (yt1)
                {
                    string src = reg1.Matches(url).Select(s => s.Groups[1].Value).ToArray()[0];
                    icons.Add(new IconDto(src, url, "YT"));
                    //Console.WriteLine(reg1.Matches(url).Select(s => s.Groups[1].Value).ToArray()[0]);
                }
                if (yt2)
                {
                    string src = reg2.Matches(url).Select(s => s.Groups[1].Value).ToArray()[0];
                    icons.Add(new IconDto(src, url, "YT"));
                    //Console.WriteLine(reg2.Matches(url).Select(s => s.Groups[1].Value).ToArray()[0]);
                }
                if (insta)
                {
                    url = url.Replace("?utm_source=ig_web_copy_link", "");

                    if (url[url.Length - 1] != '/')
                    {
                        url += '/';
                    }
                    string src = url + "media/?size=l";
                    icons.Add(new IconDto(src, url, "IMG"));

                }
                if (isSpotify)
                {
                    var doc = new HtmlDocument();
                    doc.LoadHtml(url);
                    var srcNode = doc.DocumentNode.SelectSingleNode("//iframe");
                    var spotifyId = srcNode.Attributes["src"].Value.Trim();
                    var spotPattern = "[%]{1}.*";
                    var spotReg = new Regex(spotPattern);
                    spotifyId = spotReg.Replace(spotifyId, "");
                    var imgAddress = spotifyId.Replace("embed/", "");

                    var spotIcon = await GetSpotifyIconDto(spotifyId);

                    icons.Add(spotIcon);

                }

               if (isMovie && !yt1 && !yt2)
               {
                   var movieImages = await GetImagesFromUrl(url);
                   string src = "NO_FOUND";
                   var image = movieImages.FirstOrDefault();
                   if(image != null)
                   {
                       src = image.id;
                   }
                   icons.Add(new IconDto(url,src, "MOVIE"));
               }

                if (!yt1 && !yt2 && !insta && !is_Src && !isSpotify && !isMovie)
                {
                    var images = await GetImagesFromUrl(url);
                    icons.AddRange(images.ToList());
                }
            }
            catch (Exception ex)
            {
                Log.Error($"Error in adding icon: {ex.Message}");
                Log.Error(ex.StackTrace);
            }
            return icons;

        }

        private static async Task<List<IconDto>> GetImagesFromUrl(string url)
        {
            var mainHTML = new HtmlDocument();
            string host = "";
            string htmlCode = "";

            using (WebClient client = new WebClient() { Encoding = System.Text.Encoding.UTF8 })
            {
                await Task.Run(() =>
                {
                    htmlCode = client.DownloadString(url);

                });
            }

            var uri = new Uri(url);

            host = uri.Host;

            List<string> ids = new List<string>();

            ///Console.WriteLine(htmlCode);

            //mainHTML = new HtmlDocument();
            await Task.Run(() =>
            {
                mainHTML.LoadHtml(htmlCode);
            });


            var list = new List<string>();


                var icons = new List<IconDto>();
            if (mainHTML.DocumentNode.SelectNodes("//img") != null)
            {

                var src = "";
                var httpReg = new Regex("^http[s]?[:]{1}[/]{1}[/]{1}");

                //var wwwReg = new Regex("^www[.]{1}");

                var hashReg = new Regex("^[/]+");

                foreach (HtmlNode node in mainHTML.DocumentNode.SelectNodes("//img"))
                {
                    //list.Add(node.InnerText);
                    src = node.Attributes["src"].Value.Trim();
                    src = hashReg.Replace(src, "");

                    if (!httpReg.IsMatch(src))
                    {
                        src = "http://" + src;
                    }


                    if (!icons.Any(x => x.id == src))
                    {
                        icons.Add(new IconDto(src, url, "IMG"));

                    }
                }


            }
                return icons;
        }



        public static async Task<IconDto> GetSpotifyIconDto(string spotifyFrame)
        {
            var spotIcon = new IconDto(spotifyFrame, "", "SPOTIFY");
            spotIcon.source = "https://developer.spotify.com/assets/branding-guidelines/icon4@2x.png";
            spotIcon.title = "";

            using (var webClient = new WebClient())
            {
                var keys = new GoogleKey();
                var spotifyClient = keys.spotifyClient;
                var spotifySecret = keys.spotifySecret;

                var urlRegex = new Regex(@"^http(s)?://([\w-]+.)+[\w-]+(/[\w- ./?%&=])?$");

                if (urlRegex.IsMatch(spotifyFrame))
                {
                    try
                    {
                        string urlValue = urlRegex.Match(spotifyFrame).Value;
                        var spotProp = urlValue.Split('/').ToList();
                        var spotifyId = spotProp.LastOrDefault();
                        var spotifyType = spotProp[spotProp.Count - 2];

                        var postparams = new NameValueCollection();
                        postparams.Add("grant_type", "client_credentials");
                        var authHeader = Convert.ToBase64String(Encoding.Default.GetBytes($"{spotifyClient}:{spotifySecret}"));
                        webClient.Headers.Add(HttpRequestHeader.Authorization, "Basic " + authHeader);
                        var tokenResponse = webClient.UploadValues("https://accounts.spotify.com/api/token", postparams);
                        var textJson = Encoding.UTF8.GetString(tokenResponse);
                        var tokenObject = JsonConvert.DeserializeObject<GoogleKey>(textJson);
                        string token = tokenObject.access_token;
                        var spotify = new SpotifyClient(token);

                        switch (spotifyType.ToLower())
                        {

                            case "artist":
                                var artist = await spotify.Artists.Get(spotifyId);
                                spotIcon.source = artist.Images.FirstOrDefault().Url;
                                spotIcon.title = artist.Name;
                                break;

                            case "album":
                                var album = await spotify.Albums.Get(spotifyId);
                                spotIcon.source = album.Images.FirstOrDefault().Url;
                                spotIcon.title = album.Name;
                                break;

                            case "playlist":
                                var playlist = await spotify.Playlists.Get(spotifyId);
                                spotIcon.source = playlist.Images.FirstOrDefault().Url;
                                spotIcon.title = playlist.Name;
                                break;

                            case "track":
                                var track = await spotify.Tracks.Get(spotifyId);
                                spotIcon.source = track.Album.Images.FirstOrDefault().Url;
                                spotIcon.title = track.Name;
                                break;
                        }
                    }
                    catch (Exception ex)
                    {
                        Log.Error($"Error in adding spotify: {ex.Message}");
                        Log.Error(ex.StackTrace);
                        return spotIcon;
                    }
                }
            }

            return spotIcon;
        }

    }

}