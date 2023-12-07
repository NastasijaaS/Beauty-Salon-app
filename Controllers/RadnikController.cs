using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;


namespace  Saloni.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RadnikController : ControllerBase
    {
        public SalonContext Context { get; set; }

        public RadnikController(SalonContext context)
        {
            Context = context;
        }

        [EnableCors("CORS")]
        [HttpGet]
        [Route("VratiRadnika/{RadnikID}")]
        public async Task<ActionResult> VratiRadnika(int RadnikID)
        {
            try
            {
                var radnik = await Context.Radnici.Where(p => p.ID == RadnikID ).Select(r => new
                {
                    r.ID,
                    r.Ime,
                    r.Prezime,
                    r.Ocena,
                    r.DatumZap
                }).FirstAsync();
                if (radnik == null)
                    throw new Exception("Ne postoji radnik sa zadatim ID-jem!");
                return Ok(radnik);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [EnableCors("CORS")]
        [Route("VratiRadnikeUSalonu/{SalonID}")]
        public async Task<ActionResult> VratiRadnike(int SalonID)
        {
            try
            {
                var salon = await Context.Saloni.Where(p => p.ID == SalonID).FirstAsync();
                if (salon == null)
                    throw new Exception("Salon ne postoji!");

                var radnici = await Context.Radnici.Include(p => p.Usluge).Where(p => p.Usluge.Any(us => us.Salon.ID == SalonID)).Select(
                    p => new
                    {
                        
                        p.ID,
                        p.Ime,
                        p.Prezime,
                        p.Ocena,
                        p.DatumZap
                        
                    }
                ).ToListAsync();
                return Ok(radnici);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [EnableCors("CORS")]
        [Route("VratiRadnikeBez/{SalonID}")]
        public async Task<ActionResult> VratiRadnikeBez(int SalonID)
        {
            try
            {
                 var salon = await Context.Saloni.Where(p => p.ID == SalonID).FirstAsync();
                if (salon == null)
                    throw new Exception("Salon ne postoji!");
                var radnici = await Context.Radnici.Where(p => p.Ocena == 5 && p.Salon.ID==SalonID).ToListAsync();
                return Ok(radnici);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [EnableCors("CORS")]
        [Route("DodajRadnika/{SalonID}/{Ime}/{Prezime}/{Ocena}")]
        public async Task<ActionResult> DodajRadnika(int SalonID,string Ime, string Prezime, float Ocena)
        {
            if (string.IsNullOrWhiteSpace(Ime) || Ime.Length > 50)
                return BadRequest($"Parametar 'Ime radnika' : {Ime} nije pravilno uneto!");

            if (string.IsNullOrWhiteSpace(Prezime) || Prezime.Length > 50)
                return BadRequest($"Parametar 'Prezime radnika' : {Prezime} nije pravilno uneto!");

            if (Ocena < 5|| Ocena > 10)
                return BadRequest($"Parametar 'Ocena' : {Ocena} nije pravilno uneto!");
            try
            {
                var salon = await Context.Saloni.Where(p => p.ID == SalonID).FirstOrDefaultAsync();
                if (salon == null)
                    throw new Exception("Ne postoji salon sa tim ID-jem!");
                Radnik r= new Radnik();
                
                r.Ime = Ime;
                r.Prezime = Prezime;
                r.Ocena = Ocena;
                r.DatumZap=DateTime.Today;
                r.Salon=salon;
            
               
                Context.Radnici.Add(r);
                salon.Radnici.Add(r);
                await Context.SaveChangesAsync();

                return Ok($"Uspesno dodat radnik {Ime} {Prezime} {r.ID}");

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [EnableCors("CORS")]
        [Route("ZameniOcenu/{RadnikID}/{Ocena}")]
        [HttpPut]
        public async Task<ActionResult> ZameniOcenu(int RadnikID, float Ocena)
        {
            if (Ocena < 5 || Ocena > 10)
                return BadRequest($"Parametar 'Ocena' : {Ocena} je pogresno unet!");
            try
            {
                var radnik = await Context.Radnici.Where(p => p.ID == RadnikID).FirstAsync();
                if (radnik == null)
                    throw new Exception("Ne postoji radnik sa takvim ID-jem!");
                radnik.Ocena = Ocena;
                Context.Update(radnik);

                await Context.SaveChangesAsync();

                return Ok("Uspesno promenjena ocena!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("ObrisiRadnika/{RadnikID}")]
        [EnableCors("CORS")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiRadnika(int RadnikID)
        {
            try
            {
                var radnik = await Context.Radnici.Where(p => p.ID == RadnikID).Include(p => p.Usluge).FirstAsync();
                if (radnik == null)
                    throw new Exception("Ne postoji radnik sa takvim ID-jem!");

                if (radnik.Usluge.Count() > 0)
                    throw new Exception("Nije moguce obrisati radnika koji ima zakazanu uslugu!");

                Context.Remove(radnik);

                await Context.SaveChangesAsync();

                return Ok("Uspesno izbrisan radnik!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

       
    }
}