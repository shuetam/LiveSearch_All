using Live.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Live.DataBase.DatabaseModels
{
    public class Bestseller : Entity
    {
        public string Title { get; protected set; }
        public string Author { get; protected set; }
        public string ImageSrc { get; protected set; }
        public int Size { get; protected set; }
        public int GroupNo { get; protected set; }
        public string Store { get; protected set; }
         public DateTime? Added {get;  set;}

        protected Bestseller()
        {

        }


        public Bestseller(Book book)
        {
            this.Title = book.Title;
            this.Author = book.Author;
            this.ImageSrc = book.ImageSrc; //this is id
            this.GroupNo = book.GroupNo;
            this.Size = book.Size;
            this.Store = book.Store;
        }

        public void ChangeTitleAndAuthor(string newTitle, string newAuthor)
        {
            if(newAuthor != this.Author)
            {
                this.Author = newAuthor;
            }
            if(newTitle != this.Title)
            {
                this.Title = newTitle;
            }

        }

        public  List<string> getTags()
        {
            var tags = new List<string>();
            tags.Add(this.Title.Replace(",", ""));
            tags.Add(this.Author.Replace(",", ""));
            return new HashSet<string>(tags).ToList();
        }
 

        public void SetGroupNo(int no)
        {
            this.GroupNo = no;
        }
    }
}
