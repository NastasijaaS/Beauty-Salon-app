using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Saloni.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SalonController : ControllerBase
    {

        public SalonContext Context { get; set; }
        public SalonController(SalonContext context)
        {
            Context = context;
        }

        [Route("PreuzmiSalone")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiSalone()
        {
            try
            {
                var saloni = Context.Saloni.Select(p => new { p.Naziv, p.Tip, p.ID });

                return Ok(await saloni.ToListAsync());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}