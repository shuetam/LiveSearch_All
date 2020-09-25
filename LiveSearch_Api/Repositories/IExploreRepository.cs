using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Live.Core;
using Microsoft.AspNetCore.Mvc;

namespace Live.Repositories
{
    public interface IExploreRepository
    {     
        Task<List<IconDto>> GetAllActuallYTAsync();
        Task<List<IconDto>>  GetAllActuallIMGAsync();
        Task<ExploreResultsDto>  ExploreIconsAsync(string query, int count, int skip);
         Task<List<FolderDto>> GetAllSharedFoldersAsync(string query, int skip, int count);


    }
}