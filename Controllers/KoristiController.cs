using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using System.Globalization;


namespace Saloni.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KoristiController : ControllerBase
    {

        public SalonContext Context { get; set; }
        public KoristiController(SalonContext context)
        {
            Context = context;
        }

        [EnableCors("CORS")]
        [Route("PreuzmiKlijentezaZadatuUslugu/{UslugaID}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiKlijentezaZadatuUslugu(int UslugaID)
        {
            try
            {
                DateTime danas=DateTime.Today;
                var usluga = await Context.Usluge.Where(p => p.ID == UslugaID).FirstAsync();
                if (usluga == null)
                    throw new Exception("Ne postoji usluga sa zadatim ID-jem!");
                CultureInfo culture = new CultureInfo("en-us");
                var klijenti = await Context.KoristiUslugu.Include(p => p.Usluga).Where(a => a.Usluga.ID == UslugaID && a.Datum>=danas ).Include(p => p.Klijent).Select(p => new
                {
                    ime = p.Klijent.Ime,
                    prezime = p.Klijent.Prezime,
                    klijentID = p.Klijent.ID,
                    brojtelefona = p.Klijent.BrojTelefonaKlijenta,
                    emailklijenta=p.Klijent.EmailKlijenta,
                    DatumZak = p.Datum.ToString("g",culture)
                   
                })
                .ToListAsync();



                

                return Ok(klijenti);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [EnableCors("CORS")]
        [Route("UpisiKlijenta/{KlijentID}/{UslugaID}/{DatumZakazivanja}")]
        public async Task<ActionResult> Upisi(int KlijentID, int UslugaID,DateTime DatumZakazivanja)
        {
            try
            {
                var klijent = await Context.Klijenti.Where(p => p.ID == KlijentID).FirstAsync();
                if (klijent == null)
                    throw new Exception("Ne postoji klijent sa zadatim ID-jem!");
                var usluga = await Context.Usluge.Where(p => p.ID == UslugaID).FirstAsync();
                if (usluga == null)
                    throw new Exception("Ne postoji usluga sa zadatim ID-jem!");
                if(DatumZakazivanja<DateTime.Today)
                {
                    throw new Exception("Uneli ste pogresan datum!");
                }   
                Koristi p = new Koristi();

            
                p.Klijent = klijent;
                p.Usluga = usluga;

                p.Datum= DatumZakazivanja;
                Context.KoristiUslugu.Add(p);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno upisan  klijent za zadatu uslugu!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

   

        [EnableCors("CORS")]
        [HttpPut]
        [Route("PromeniDatum/{KlijentID}/{UslugaID}/{DrugiDatum}")]
        public async Task<ActionResult> PromeniDatum(int KlijentID, int UslugaID, DateTime DrugiDatum)
        {
            
            try
            {
                var klijent = await Context.Klijenti.Where(p => p.ID == KlijentID).FirstAsync();
                if (klijent == null)
                    throw new Exception("Ne postoji klijent sa zadatim ID-jem!");
                var usluga = await Context.Usluge.Where(p => p.ID == UslugaID).FirstAsync();
                if (usluga == null)
                    throw new Exception("Ne postoji usluga sa zadatim ID-jem!");
                var kor = await Context.KoristiUslugu.Where(p => p.Usluga.ID == UslugaID && p.Klijent.ID == KlijentID).FirstOrDefaultAsync();
                if (kor == null)
                    throw new Exception("Greska, nema takve usluge ili klijenta!");
                if(kor.Datum==DrugiDatum)
                {
                    throw new Exception("Uneli ste isti datum!");
                }
                kor.Datum = DrugiDatum;
                Context.Update(kor);
                await Context.SaveChangesAsync();
                return Ok("Postavljen novi datum!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [EnableCors("CORS")]
        [Route("VratiRadnikeBezUsluge/{SalonID}")]
        public async Task<ActionResult> VratiRadnikeBezUsluge(int SalonID)
        {
            try
            {
                var salon = await Context.Saloni.Where(p => p.ID == SalonID).FirstAsync();
                if (salon == null)
                    throw new Exception("Salon ne postoji!");
                var radnici = await Context.Radnici.Where(p => p.Usluge.Count == 0 && p.Salon.ID==SalonID).ToListAsync();
                return Ok(radnici);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [EnableCors("CORS")]
        [Route("OtkaziKlijenta/{KlijentID}/{UslugaID}")]
        public async Task<ActionResult> OtkaziKlijenta(int KlijentID, int UslugaID)
        {
            try
            {
           var klijent = await Context.Klijenti.Where(p => p.ID == KlijentID).FirstAsync();
                if (klijent == null)
                    throw new Exception("Ne postoji klijent sa zadatim ID-jem!");
                var usluga = await Context.Usluge.Where(p => p.ID == UslugaID).FirstAsync();
                if (usluga == null)
                    throw new Exception("Ne postoji usluga sa zadatim ID-jem!");

                var kor = await Context.KoristiUslugu.Where(p => p.Usluga.ID == UslugaID && p.Klijent.ID == KlijentID).FirstOrDefaultAsync();
                if (kor == null)
                    throw new Exception("Greska, nema takve usluge ili klijenta!");
                Context.Remove(kor);
                await Context.SaveChangesAsync();
                return Ok("Otkazan klijent!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}