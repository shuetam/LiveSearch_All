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
   public int deep {get; set;}

    public ExploreResultsDto(List<IconDto> _results, int _deep )
    {
      this.deep = _deep;
      this.results = _results;
    }

    }

}