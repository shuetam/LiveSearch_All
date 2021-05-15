using Live.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Live.Services.Comparers
{
    public class YouTubeComparer : IEqualityComparer<Song>
    {
        bool IEqualityComparer<Song>.Equals(Song x, Song y)
        {
            return x.YouTube.VideoID == y.YouTube.VideoID;
        }

        int IEqualityComparer<Song>.GetHashCode(Song obj)
        {
            return obj.YouTube.VideoID.GetHashCode();
        }
    }

    public class MovieComparer : IEqualityComparer<ArchiveMovie>
    {
        bool IEqualityComparer<ArchiveMovie>.Equals(ArchiveMovie x, ArchiveMovie y)
        {
            return x.YouTube.VideoID == y.YouTube.VideoID;
        }

        int IEqualityComparer<ArchiveMovie>.GetHashCode(ArchiveMovie obj)
        {
            return obj.YouTube.VideoID.GetHashCode();
        }
    }

    public class ArchiveComparer : IEqualityComparer<ArchiveSong>
    {
        bool IEqualityComparer<ArchiveSong>.Equals(ArchiveSong x, ArchiveSong y)
        {
            return x.YouTube.VideoID == y.YouTube.VideoID;
        }

        int IEqualityComparer<ArchiveSong>.GetHashCode(ArchiveSong obj)
        {
            return obj.YouTube.VideoID.GetHashCode();
        }
    }

    public class UserYTComparer : IEqualityComparer<UserYoutube>
    {
        bool IEqualityComparer<UserYoutube>.Equals(UserYoutube x, UserYoutube y)
        {
            return x.VideoId == y.VideoId;
        }

        int IEqualityComparer<UserYoutube>.GetHashCode(UserYoutube obj)
        {
            return obj.VideoId.GetHashCode();
        }
    }
}


