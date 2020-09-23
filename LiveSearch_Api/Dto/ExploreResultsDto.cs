using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
namespace Live.Core
{
    public class ExploreResultsDto
    {
   public List<IconDto> results {get; set;}
        public List<FolderDto> folders { get; set; }
        public int deep {get; set;}
   public int count {get; set;}

    public ExploreResultsDto(List<IconDto> _results, int _deep, int _count)
    {
      this.deep = _deep;
      this.results = _results;
      this.count = _count;
    }

        public ExploreResultsDto(List<FolderDto> _results, int _count)
        {
            this.folders = _results;
            this.count = _count;
        }

    }

}