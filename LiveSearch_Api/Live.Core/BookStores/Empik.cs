﻿using HtmlAgilityPack;
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
    public class Empik: BookStore
    {
        public override async Task<List<Book>> GetBestsellersAsync()
        {
            var bookList = new List<Book>();
            string url = "https://www.empik.com/bestsellery/ksiazki";
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
        catch (Exception ex) {
            Log.Error($"Network error in Empik: {ex.Message}");
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

            bestBooks = htmlDoc.DocumentNode.SelectNodes("//div[@class='productWrapper']");

            }
        
        catch(Exception ex)
        {
            Log.Error($"Html Error in Empik: {ex.Message}");
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

                    var title = doc.DocumentNode.SelectSingleNode("//strong[@class='ta-product-title']").InnerText.Trim();
                    var author = doc.DocumentNode.SelectSingleNode("//div[@class='smartAuthorWrapper ta-product-smartauthor']").InnerText.Trim();
                    var imgSrc = doc.DocumentNode.SelectSingleNode("//img[@class='lazy']").Attributes["lazy-img"].Value.Trim();

                    var rep = new Regex("-p-");
                    var img =  rep.Replace(imgSrc, "-w-");

                    var regTitle = new Regex("^[1-9]+[\n]{1}");
                    var regAuthor = new Regex("[\n]+");
                    var regAuthor1 = new Regex(" ,");
                    author = regAuthor.Replace(author, "");
                    author = regAuthor1.Replace(author, ", ");
                    title = regTitle.Replace(title, "");

                    var book = new Book(title, author, img, "Empik");
                    await book.SetSizeAsync();
                    bookList.Add(book);
                    //Console.WriteLine(book.Title);
                }
                catch (Exception ex)
                {
                    Log.Error($"BOOK error in Empik: {ex.Message}");
                    Log.Error(ex.StackTrace);
                }
            }
        }
    }

            return bookList;
        }
    }
}
