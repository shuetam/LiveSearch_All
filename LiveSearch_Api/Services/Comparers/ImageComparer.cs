using Live.Core;
using Live.DataBase.DatabaseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Live.Services.Comparers
{
    public class ImageComparer
    {
    }



    public class BookComparer : IEqualityComparer<Bestseller>
    {
        bool IEqualityComparer<Bestseller>.Equals(Bestseller x, Bestseller y)
        {
            return x.GroupNo == y.GroupNo;
        }

        int IEqualityComparer<Bestseller>.GetHashCode(Bestseller obj)
        {
            return obj.GroupNo.GetHashCode();
        }
    }

}
