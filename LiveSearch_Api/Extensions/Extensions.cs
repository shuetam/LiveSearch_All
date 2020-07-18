using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Live.Extensions
{
    public static class DateTimeExtensions
    {
        public static long ToTimestamp(this DateTime dateTime)
        {/* 
            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var time = dateTime.Subtract(new TimeSpan(epoch.Ticks)); */

            var date = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            TimeSpan time = dateTime.Subtract(date); 
            return time.Ticks / 10000;
        }
    }

public static class ListExtensions
    {
    private static Random rng = new Random();  

public static void Shuffle<T>(this IList<T> list)  
{  
            int n = list.Count;  
            while (n > 1) {  
                n--;  
                int k = rng.Next(n + 1);  
                T value = list[k];  
                list[k] = list[n];  
                list[n] = value;  
            }  
        }
        }


          public static class StringExtensions
    {
        public static bool Match(this string iconParametr, string query, Regex regQuery, int deep)
        {
            iconParametr = iconParametr.ToLower().Trim();         
            iconParametr = iconParametr.RemovePolish();

            bool match = false;

            switch(deep)
            {
                case 1:
                match = iconParametr == query || regQuery.IsMatch(iconParametr);
                break;

                case 2:
                //match = query.Length>3 && iconParametr.Contains(query);
                match = iconParametr.Contains(query);
                break;

                case 3:
                var icons =  iconParametr.Split().Where(x => x.Length>3).ToList(); //regWhite.Split(iconParametr).Where(x => x.Length>3);
                var queries = query.Split().Where(x => x.Length>3).ToList();  //regWhite.Split(query).Where(x => x.Length>3);
                match = queries.Any(x => icons.Contains(x)) || icons.Any(x => queries.Contains(x));
                break;

                case 4:
                var regWhite = new Regex("[ ]+");
                iconParametr = regWhite.Replace(iconParametr, "");
                query = regWhite.Replace(query, "");
                match = iconParametr.Contains(query) && query.Length>3;
                break;

                case 5:
                match = iconParametr.Contains(query);
                break;


            }
        return match;
        }


         public static string RemovePolish(this string input)
        {
           input = input.Replace('ą','a');
           input = input.Replace('ć','c');
           input = input.Replace('ę','e');
           input = input.Replace('ń','n');
           input = input.Replace('ż','z');
            input = input.Replace('ź','z');
            input = input.Replace('ó','o');
       
            return input;
        }
    }
}