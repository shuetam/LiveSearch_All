using Live.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Live.Controllers
{
    //[EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [Route("api/[controller]")]
    public class BestsellersController : LiveController
    {
        private readonly IBestsellersRepository _bookRepository;

        public BestsellersController(IBestsellersRepository bookRepository)
        {
            this._bookRepository = bookRepository;
        }

        [HttpGet("getbestsellers")]
        public async Task<IActionResult> GetBestsellers()
        {
            var books = await _bookRepository.GetActuallBestsellersAsync();
            //Console.WriteLine("------------getting books---------------");
            //Console.WriteLine(books[0].title);
            return Json(books);
        }

        /*   [HttpPost("update")]
          public async Task UpdateBestsellser()
          {

              await _bookRepository.UpdateAsync();
          } */

        /*    [HttpPost("update/{store}")]
           public async Task UpdateStoreBestsellser(string store)
           {

               await _bookRepository.UpdateStoreAsync(store);
           } */


    }
}
