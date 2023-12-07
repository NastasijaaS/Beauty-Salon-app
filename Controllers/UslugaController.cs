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
    public class UslugaController : ControllerBase
    {
        public SalonContext Context { get; set; }

        public UslugaController(SalonContext context)
        {
            Context = context;
        }
        [EnableCors("CORS")]
        [Route("VratiUslugeZaSalon/{SalonID}")]
        [HttpGet]
        public async Task<ActionResult> VratiUslugeZaSalon(int SalonID)
        {
            try
            {
                var salon = await Context.Saloni.Where(p => p.ID == SalonID).FirstAsync();
                if (salon == null)
                    throw new Exception("Salon ne postoji!");
                var usluge = await Context.Usluge.Where(p => p.Salon.ID == SalonID).Select(p => new
                {
                    uslugaID = p.ID,
                    uslugaNaziv = p.Naziv,
                    uslugaCena = p.Cena,
                    radnikID = p.Radnik.ID,
                
                }).ToListAsync();
                return Ok(usluge);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [EnableCors("CORS")]
        [Route("DodajUslugu/{Naziv}/{Cena}/{IDRadnika}/{IDSalona}")]
        [HttpPost]
        public async Task<ActionResult> DodajUslugu(string Naziv, int Cena, int IDRadnika,  int IDSalona)
        {
            if (string.IsNullOrWhiteSpace(Naziv) || Naziv.Length > 50)
                return BadRequest($"Parametar 'Naziv usluge' : {Naziv} nije pravilno unet!");
            if (Cena < 0 || Cena > 10000)
                return BadRequest($"Parametar 'Cena usluge' : {Cena} nije pravilno unet!");
           
            try
            {
                var radnik = await Context.Radnici.Where(p => p.ID == IDRadnika).FirstOrDefaultAsync();
                var salon = await Context.Saloni.Where(p => p.ID == IDSalona).FirstOrDefaultAsync();
                if (radnik == null)
                    throw new Exception("Ne postoji radnik sa tim ID-jem!");
                if (salon == null)
                    throw new Exception("Ne postoji salon sa tim ID-jem!");

                Usluga usl = new Usluga();
                usl.Naziv = Naziv;
                usl.Cena = Cena;
                usl.Radnik = radnik;
                usl.Salon = salon;

                Context.Usluge.Add(usl);
                salon.Usluge.Add(usl);

                await Context.SaveChangesAsync();

                return Ok($"Dodata Aktivnost: {usl.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [EnableCors("CORS")]
        [Route("ZameniRadnika/{UslugaID}/{RadnikID}")]
        [HttpPut]
        public async Task<ActionResult> ZameniRadnika(int UslugaID, int RadnikID)
        {
            try
            {
                var usl = await Context.Usluge.Where(p => p.ID == UslugaID).Include(p => p.Radnik).ThenInclude(p => p.Usluge).FirstOrDefaultAsync();
                if (usl == null)
                    return BadRequest("Ne postoji takva usluga!");
                var radnik = await Context.Radnici.Where(p => p.ID == RadnikID).Include(p => p.Usluge).FirstOrDefaultAsync();
                if (radnik == null)
                    return BadRequest("Radnik ne postoji!");

                usl.Radnik.Usluge.Remove(usl);
                radnik.Usluge.Add(usl);
                usl.Radnik = radnik;
                Context.Update(usl);
                Context.Update(radnik);
                await Context.SaveChangesAsync();

                return Ok("Zamenjen Radnik!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

         [EnableCors("CORS")]
        [Route("ZameniCenu/{UslugaID}/{Cena}")]
        [HttpPut]
        public async Task<ActionResult> ZameniCenu(int UslugaID, int Cena)
        {
            try
            {
                var usl = await Context.Usluge.Where(p => p.ID == UslugaID).Include(p => p.Radnik).ThenInclude(p => p.Usluge).FirstOrDefaultAsync();
                if (usl == null)
                    return BadRequest("Ne postoji takva usluga!");
                usl.Cena =Cena;
                Context.Update(usl);
                await Context.SaveChangesAsync();
                return Ok("Postavljena nova cena!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [EnableCors("CORS")]
        [Route("ObrisiUslugu/{UslugaID}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiUslugu(int UslugaID)
        {
            try
            {
                var usluga = await Context.Usluge.Where(p => p.ID == UslugaID).FirstAsync();
                if (usluga == null)
                    throw new Exception("Ne postoji usluga sa zadatim ID-jem!");
                var koristiLista = await Context.KoristiUslugu.Where(p => p.Usluga.ID == UslugaID).ToListAsync();
                foreach (var kor in koristiLista)
                {
                    Context.Remove(kor);
                }

                Context.Usluge.Remove(usluga);

                await Context.SaveChangesAsync();

                return Ok($"Obrisana usluga sa ID : ${UslugaID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}