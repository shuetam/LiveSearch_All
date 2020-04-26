using System.Linq;
using System.Threading.Tasks;
using Live.Repositories;
using Microsoft.AspNetCore.Mvc;


namespace Live.Controllers
{
    [Route("api/[controller]")]
    public class UpdatingController : LiveController
    {
        private readonly  IUpdatingRepository _updateRepository;
       
        
        public UpdatingController (IUpdatingRepository updateRepository)
        {
            this. _updateRepository = updateRepository;
            
        }
           

        [HttpPost("updates")]
        public async Task  Update()
        {
           await _updateRepository.SongsUpdateAsync();
          // await  _updateRepository.TvMoviesUpdateAsync();
          
          
        }
    }
}
