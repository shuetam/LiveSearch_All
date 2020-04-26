using HtmlAgilityPack;
using Live.Core;
using Live.Core.BookStores;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Live.Live.Core.BookStores
{
    public class InBook: BookStore
    {
        public override async Task<List<Book>> GetBestsellersAsync()
        {
            var bookList = new List<Book>();
            string url = "https://www.inbook.pl/bestsellers/list/2";
            string htmlCode = "";
           
       using( WebClient client = new WebClient(){ Encoding = System.Text.Encoding.UTF8 })
       {
            client.Headers.Add("User-Agent: Other");

            try{
            await Task.Run(() =>
            {
                htmlCode = client.DownloadString(url);
            });
            }
            catch (Exception ex){
                Log.Error($"Network error in InBook: {ex.Message}");
            }
       }

 if(!string.IsNullOrEmpty(htmlCode))
    {
        HtmlNodeCollection bestBooks = null;
        try {
            var htmlDoc = new HtmlDocument();

            await Task.Run(() =>
            {
                htmlDoc.LoadHtml(htmlCode);
            });

            bestBooks = htmlDoc.DocumentNode.SelectNodes("//div[@class='product-box text-center product-box-default']");
        }
        catch(Exception ex)
        {
            Log.Error($"Html Error in InBook: {ex.Message}");
            Log.Error(ex.StackTrace);
        }


if(bestBooks != null)
{
            foreach (var bestNode in bestBooks)
            {
                try
                {
                    var bookOut = bestNode.OuterHtml;
                    var doc = new HtmlDocument();
                    doc.LoadHtml(bookOut);

                    var titleNode = doc.DocumentNode.SelectSingleNode("//a");
                    var titleWithAuthor = titleNode.Attributes["title"].Value;

                    var docHtml = new HtmlDocument();
                    docHtml.LoadHtml(bookOut);

                    var imgSrc = docHtml.DocumentNode.SelectSingleNode("//img").Attributes["src"].Value;
                    

                }
                catch (Exception ex)
                {
                    Log.Error($"BOOK error in InBook: {ex.Message}");
                    Log.Error(ex.StackTrace);
                }
            }
        }
    }

            return bookList;
        }
    }
}
