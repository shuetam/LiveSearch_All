using System;
using System.Collections.Generic;

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
}