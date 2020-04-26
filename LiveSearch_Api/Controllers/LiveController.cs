using System;
using Microsoft.AspNetCore.Mvc;

namespace Live.Controllers
{
    [Route("[controller]")]
    public class LiveController : Controller
    {
   protected Guid UserId
        {
        get
        { 
        if (User.Identity.IsAuthenticated)
            {return Guid.Parse(User.Identity.Name);
        }
        else
        {
            return Guid.Empty;
        }
        }
    }
    }
}
