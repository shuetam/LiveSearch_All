using System;

namespace Live.Core
{
    public class AdminUpdatesDto
    {
        public string SongsUpdate {get; set;}
        public string SongsLastPlayed {get; set;}
        public string songsFirstPlayed {get; set;}
        public int SongsCount {get; set;}
        public string TvMoviesUpdate {get; set;}
        public int TvMoviesCount {get; set;}
        public string BestsellersUpdate {get; set;}
        public int BestsellersCount {get; set;}
        public string songsErrors {get; set;}
        public int moviesErrors {get; set;}
        public int showingMoviesCount {get; set;}
        public int showingMoviesCountErrors {get; set;}
        public string moviesFirstPlayed {get; set;}
        public string moviesLastPlayed {get; set;}
         public string songsHours {get; set;}
         public string moviesHours {get; set;}
         public string moviesRuning {get; set;}
         public string songsRuning {get; set;}
         public string booksRuning {get; set;}
         public string bestsellersErrors  {get; set;}

            public string Bonito {get; set;}
          public string Aros {get; set;}
          public string Czytam {get; set;}
          public string Empik {get; set;}
          public string Gandalf{get; set;}
          public string Livro {get; set;}
          public string Profit24  {get; set;}
          public string mRating {get; set;}
          public string shRating {get; set;}

          public string movieInterval {get; set;}
          public string songInterval {get; set;}
          public string bookInterval {get; set;}

    }
}