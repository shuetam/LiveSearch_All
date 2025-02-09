﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Live.Core.BookStores;
using Live.Core;
using Live.DataBase.DatabaseModels;
using Live.Live.Core.BookStores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Live.Settings;

namespace Live.Repositories
{
    public class BestsellersRepository : IBestsellersRepository
    {

        private readonly LiveContext _liveContext;

        private readonly IMapper _autoMapper;
        public BestsellersRepository(LiveContext liveContext, IMapper autoMapper)
        {
            this._liveContext = liveContext;
            this._autoMapper = autoMapper;
        }
        public async Task<List<IconDto>> GetActuallBestsellersAsync()
        {
            var bestSellersData = await _liveContext.Bestsellers.ToListAsync();

            var hashGroups = new HashSet<int>(bestSellersData.Select(x => x.GroupNo).ToList()).ToList();
            var books = new List<IconDto>();
            foreach(var group in hashGroups)
            {
                var theSameBooks = bestSellersData.Where(x => x.GroupNo==group).ToList();
                var count = theSameBooks.Count;
                var bestImg = theSameBooks.Select(x => x.Size).Max();
                var agent = theSameBooks.FirstOrDefault(x => x.Size == bestImg);
                var icon = new IconDto(agent, count);
                books.Add(icon);
            }
            books = books.OrderByDescending(x => x.countValue).ToList();
            return books;
        }

        public async Task UpdateAsync()
        {
            Console.WriteLine("Start updatign books");
            var bestList  = new List<Book>();
            
            
            await _liveContext.SaveChangesAsync();
            var bonitos = await new Bonito().GetBestsellersAsync();
            bestList.AddRange(bonitos);
            var aros = await new Aros().GetBestsellersAsync();
            bestList.AddRange(aros);
            var czytams = await new Czytam().GetBestsellersAsync();
            bestList.AddRange(czytams);
            var empiks = await new Empik().GetBestsellersAsync();
            bestList.AddRange(empiks);
            var gandalfs = await new Gandalf().GetBestsellersAsync();
            bestList.AddRange(gandalfs);
            var livros = await new Livro().GetBestsellersAsync();
            bestList.AddRange(livros);
            var profit24s = await new Profit24().GetBestsellersAsync();
            bestList.AddRange(profit24s);
     
            Log.Information($"Finish bestsellers update with {bestList.Count} books");
            Log.Information($"{bonitos.Count} from Bonito");
            Log.Information($"{aros.Count} from Aros");
            Log.Information($"{czytams.Count} from Czytam");
            Log.Information($"{empiks.Count} from Empik");
            Log.Information($"{gandalfs.Count} from Gandalf");
            Log.Information($"{livros.Count} from Livro");
            Log.Information($"{profit24s.Count} from Profit24");

            var actualBestsellers = _liveContext.Bestsellers.ToList();

            _liveContext.Bestsellers.RemoveRange(_liveContext.Bestsellers.Where(x => x.Store != ""));
             _liveContext.SaveChanges();

            int group = 1;
            foreach(var book in bestList)
            {
                     var theSameList = bestList.Where(x => x.GroupNo == -1)
                     .Where(x => x.TheSame(book.Title, book.Author)).ToList();

                if(theSameList.Count>0)
                {     
                        foreach(var theSameBook in theSameList)
                        {
                            theSameBook.GroupNo = group;
                        }
                          group++;
                }
            }

        int no = 1;
        foreach(var book in bestList)
        {
                var exists = actualBestsellers.FirstOrDefault( x => x.ImageSrc == book.ImageSrc);

                if(exists != null)
                {
                    Console.WriteLine("Added exists");
                    exists.Added = DateTime.Now;

                    var theSame = bestList
                    .FirstOrDefault(x => x.TheSame(exists.Title, exists.Author));

                    if(theSame != null)
                    {
                        exists.SetGroupNo(theSame.GroupNo);
                       
                    }
                    else
                    {
                        int max = bestList.Select(x => x.GroupNo).Max() + no;
                        no++;
                        exists.SetGroupNo(max);
                    }

                    await _liveContext.Bestsellers.AddAsync(exists);
                }
                else 
                {
                        var bestseller = new Bestseller(book);
                        bestseller.Added = DateTime.Now;
                        Console.WriteLine("Added new");
                        await _liveContext.Bestsellers.AddAsync(bestseller);
                }

                 
            }
            await _liveContext.SaveChangesAsync();
            InfoCaches._booksUpdatingRunning = true;
           // Console.WriteLine("========Finish book update==========");

            }

          public async Task ChangeBookTitle(string id, string newTitle, string newAuthor)
          {
              var book = _liveContext.Bestsellers.FirstOrDefault(x => x.ImageSrc == id );

              if(book != null)
              {
                  book.ChangeTitleAndAuthor(newTitle, newAuthor);
                  _liveContext.Update(book);
                  await _liveContext.SaveChangesAsync();
              }

          }



  /*      public async Task UpdateStoreAsync(string store)
        {
            Log.Information("Start bestsellers updating");
            var bestList  = new List<Book>(); */
            
            /* await _liveContext.SaveChangesAsync();
            var bonitos = await new Bonito().GetBestsellersAsync();
            bestList.AddRange(bonitos);
            var aros = await new Aros().GetBestsellersAsync();
            bestList.AddRange(aros);
            var czytams = await new Czytam().GetBestsellersAsync();
            bestList.AddRange(czytams);
            var empiks = await new Empik().GetBestsellersAsync();
            bestList.AddRange(empiks); */
          /*   if(store == "gandalf")
            {
                var gandalfs = await new Gandalf().GetBestsellersAsync();
                bestList.AddRange(gandalfs);
            } */


            /* var livros = await new Livro().GetBestsellersAsync();
            bestList.AddRange(livros);
            var profit24s = await new Profit24().GetBestsellersAsync();
            bestList.AddRange(profit24s); */
     
  /*           Log.Information($"Finish bestsellers update with {bestList.Count} books");
            Log.Information($"{bonitos.Count} from Bonito");
            Log.Information($"{aros.Count} from Aros");
            Log.Information($"{czytams.Count} from Czytam");
            Log.Information($"{empiks.Count} from Empik");
            Log.Information($"{gandalfs.Count} from Gandalf");
            Log.Information($"{livros.Count} from Livro");
            Log.Information($"{profit24s.Count} from Profit24"); */

          /*   var bestSellers = await _liveContext.Bestsellers.ToListAsync();
            var i = 0;

            if(bestSellers.Count>0)
            {
               var theSames = bestSellers.Select(x => x.GroupNo).ToList() ;
               i = theSames.Max();
            } */

       /*     foreach(var best in bestList)
           {
               var theSame = bestSellers.FirstOrDefault(x => best.TheSame(x.Title, x.Author));
                var groupNo = i;
                if(theSame != null)
                {
                    groupNo = theSame.GroupNo;
                }
                else
                {
                    i = i+1;
                    groupNo = i;
                }

                var bestSeller = new Bestseller(best, groupNo);
                bestSeller.Added = DateTime.Now;
                await _liveContext.Bestsellers.AddAsync(bestSeller);

           } */
           // await _liveContext.SaveChangesAsync();
           // Console.WriteLine("========Finish book update==========");

        


    }
}
