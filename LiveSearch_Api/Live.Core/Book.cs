using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Drawing;
using Live.DataBase.DatabaseModels;

namespace Live.Core
{
    public class Book
    {
        public string Title;
        public string Author;
        public string ImageSrc;
        public int Size;
        public string Store;


        public Book(string title, string author, string img, string store)
        {
            this.Title =  System.Web.HttpUtility.HtmlDecode(title);
            this.Author = author;
            this.ImageSrc = img;
            this.Store = store;
        }

          public Book(Bestseller book)
        {
            this.Title =  book.Title;
            this.Author = book.Author;
            this.ImageSrc = book.ImageSrc;
            this.Store = book.Store;
        }



        public async Task SetSizeAsync()
        {
            using(var cli = new WebClient(){ Encoding = System.Text.Encoding.UTF8 })
            {
                cli.Headers.Add("User-Agent: Other");
                await Task.Run(() =>
                {
                    byte[] imageData = cli.DownloadData(this.ImageSrc);
                    this.Size = imageData.Length;
                });
            }

        }

        public bool TheSame(string  Title, string Author)
        {
            if (Title == this.Title && Author == this.Author)
            {
                return true;
            }
            var reg = new Regex("[ ]+");
            var title1 = reg.Split(this.Title.ToLower());
            var title2 = reg.Split(Title.ToLower());
            var author1 = reg.Split(this.Author.ToLower());
            var author2 = reg.Split(Author.ToLower());
            var titleEq = title1.All(x => Title.ToLower().Contains(x)) || title2.All(x => this.Title.ToLower().Contains(x));
            var authorEq = author1.Any(x => Author.ToLower().Contains(x)) || author2.Any(x => this.Author.ToLower().Contains(x));

            if (titleEq && authorEq)
            {
                return true;
            }
            return false;
        }
    }
}
