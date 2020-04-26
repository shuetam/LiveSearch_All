using HtmlAgilityPack;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Live.Core.BookStores
{
    public class Gandalf : BookStore
    {
        public override async Task<List<Book>> GetBestsellersAsync()
        {
            var bookList = new List<Book>();
            string url = "https://www.gandalf.com.pl/bestsellery/";
            string htmlCode = "";

          using( WebClient client = new WebClient(){ Encoding = System.Text.Encoding.UTF8 })
          {

            try{
                await Task.Run(() =>
                {
                    htmlCode = client.DownloadString(url);
                });
            }
            catch (Exception ex) {
                Log.Error($"Network error in Gandalf: {ex.Message}");
            }
          }

  if(!string.IsNullOrEmpty(htmlCode))
    {
        HtmlNodeCollection bestList = null;
        try {
            var htmlDoc = new HtmlDocument();
            await Task.Run(() =>
            {
                htmlDoc.LoadHtml(htmlCode);
            });

            bestList = htmlDoc.DocumentNode.SelectNodes("//div[@class='content']");
        }
        catch(Exception ex)
        {
            Log.Error($"Html Error in Gandalf: {ex.Message}");
            Log.Error(ex.StackTrace);
        }

            if(bestList != null)
            {
            foreach (var bestNode in bestList)
            {
                try
                {
                    var bookOut = bestNode.OuterHtml;
                    var doc = new HtmlDocument();
                    doc.LoadHtml(bookOut);

                   var imgpattern = "background[-]{1}image[:]{1}[ ]+url[(]{1}[\"]{1}([^\"]+)";

                    var reg1 = new Regex(imgpattern);
                  
                    if (reg1.IsMatch(htmlCode))
                    {
                       var names = reg1.Matches(bookOut).Select(s => s.Groups[1].Value.Trim()).ToList();
                    }

                    // "class[=]{1}[\"]{1}title-link[\"]{1}[>]{1}([^\"]+)[<]{1}[/]{1}a[>]{1}"
                    var srcNode = doc.DocumentNode.SelectSingleNode("//div[@class='hash product-image-box product-size-contain lazy']");

                    var src = srcNode.Attributes["data-src"].Value.Trim();

                    src = "https://www.gandalf.com.pl" + src;

                    var title = doc.DocumentNode.SelectSingleNode("//a[@class='title']").InnerHtml.Trim();
                    var authorNode = doc.DocumentNode.SelectSingleNode("//div[@class='author authorh3']");
                    var author = authorNode.Attributes["title"].Value.Trim();
                    var book = new Book(title, author, src, "Gandalf");
                    await book.SetSizeAsync();
                    bookList.Add(book);
                    //Console.WriteLine(book.Title);
                }
                catch (Exception ex)
                {
                    Log.Error($"BOOK error in Gandalf: {ex.Message}");
                    Log.Error(ex.StackTrace);
                    Console.WriteLine(ex.StackTrace);
                }
            }
        }
    }
            return bookList;
        }
    }
}
