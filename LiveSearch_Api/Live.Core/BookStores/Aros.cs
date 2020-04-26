using HtmlAgilityPack;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Live.Core.BookStores
{
    public class Aros : BookStore
    {
        public override async Task<List<Book>> GetBestsellersAsync()
        {
            var bookList = new List<Book>();
            string url = "https://aros.pl/";
            string htmlCode = "";
            using(WebClient client = new WebClient(){ Encoding = System.Text.Encoding.UTF8 })
            {
                try{
                    await Task.Run(() =>
                    {
                        htmlCode = client.DownloadString(url);
                    });
                }
                catch(Exception ex)
                {
                    Log.Error($"Network Error in Aros: {ex.Message}");
                }
            }

            var htmlDoc = new HtmlDocument();

if(!string.IsNullOrEmpty(htmlCode))
{
     HtmlNodeCollection bestList = null;
    try {

            await Task.Run(() =>
            {
                htmlDoc.LoadHtml(htmlCode);
            });

            var bestSel = htmlDoc.DocumentNode.SelectNodes("//b").FirstOrDefault(x => x.InnerText == "Bestsellery");
            var bestListhtml = bestSel.ParentNode.ParentNode.InnerHtml;
            htmlDoc.LoadHtml(bestListhtml);
             bestList = htmlDoc.DocumentNode.SelectNodes("//tr");
        }
        catch(Exception ex)
        {
            Log.Error($"Html Error in Aros: {ex.Message}");
            Log.Error(ex.StackTrace);
        }

    if(bestList != null)
    {
            foreach (var bestNode in bestList)
            {
                try
                {
                    var htmlDocSingle = new HtmlDocument();

                    htmlDocSingle.LoadHtml(bestNode.InnerHtml);
                    var href = htmlDocSingle.DocumentNode.SelectSingleNode("//a");

                    var urlAddress = href.Attributes["href"].Value;
                    urlAddress = "https://www.aros.pl" + urlAddress;

                    if (bestNode.InnerHtml.Contains("autor"))
                    {
                        string htmlBook = "";

                       

                    using (WebClient client = new WebClient())
                    {
                        var htmlData = client.DownloadData(urlAddress);
                        htmlBook = Encoding.UTF8.GetString(htmlData);
                    }

                        var htmlDocBook = new HtmlDocument();
                        htmlDocBook.LoadHtml(htmlBook);

                        var titleNode = htmlDocBook.DocumentNode.SelectSingleNode("//h1");
                        var title = titleNode.InnerHtml.Trim();
                        var mainNode = titleNode.ParentNode.ParentNode.ParentNode;

                        var authorNode = mainNode.InnerHtml;
                        var authorDoc = new HtmlDocument();
                            authorDoc.LoadHtml(authorNode);
                        var author = authorDoc.DocumentNode.SelectSingleNode("//b").InnerText;
                        var imgSrc = authorDoc.DocumentNode.SelectNodes("//img")
                            .FirstOrDefault(x => x.Attributes["alt"].Value == title).Attributes["src"].Value;
                            
                        //Attributes["alt"].Value;
                        imgSrc = "https:" + imgSrc;
                       

                        var book = new Book(title, author, imgSrc, "Aros");
                        await book.SetSizeAsync();
                        bookList.Add(book);
                    //Console.WriteLine(book.Title);

                    }
                }
                catch (Exception e)
                {
                    Log.Error($"BOOK error in Aros: {e.Message}");
                    Log.Error(e.StackTrace);

                }
            }
    }
}

            return bookList;
        }
    }
}
