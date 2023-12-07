using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using System.Collections.Generic;

namespace Saloni.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KlijentController : ControllerBase
    {

        public SalonContext Context { get; set; }
        public KlijentController(SalonContext context)
        {
            Context = context;
        }

        [EnableCors("CORS")]
        [Route("DodajKlijenta/{SalonID}/{Ime}/{Prezime}/{BrTel}/{Email}")]
        [HttpPost]
        public async Task<ActionResult> DodajKlijenta(int SalonID,string Ime, string Prezime, string BrTel, string Email)
        {
            if (string.IsNullOrWhiteSpace(Ime) || Ime.Length > 50)
                return BadRequest($"Parametar 'Ime klijenta' : {Ime} nije pravilno unet!");

            if (string.IsNullOrWhiteSpace(Prezime) || Prezime.Length > 50)
                return BadRequest($"Parametar 'Prezime klijenta' : {Prezime} nije pravilno unet!");

            if (string.IsNullOrWhiteSpace(BrTel) || BrTel.Length > 13)
                return BadRequest($"Parametar 'Broj telefona klijenta' : {BrTel} nije pravilno unet!");

            if (string.IsNullOrWhiteSpace(Email))
                return BadRequest($"Parametar 'Email klijenta' : {Email} nije pravilno unet!");

            bool brojt = true;
            char[] charList = BrTel.ToCharArray();
            int i = 0;
            while (i < charList.Count() && brojt)
            {
                if (charList[i] < '0' || charList[i] > '9')
                    brojt = false;
                i++;
            }

            if (!brojt)
                return BadRequest($"Parametar 'Broj telefona klijenta' nevalidan!");

            try
            {
                var salon = await Context.Saloni.Where(p => p.ID == SalonID).FirstOrDefaultAsync();
                if (salon == null)
                    throw new Exception("Ne postoji salon sa tim ID-jem!");
                Klijent klijent = new Klijent();
                klijent.Ime = Ime;
                klijent.Prezime = Prezime;
                klijent.BrojTelefonaKlijenta = BrTel;
                klijent.EmailKlijenta = Email;
                klijent.Salon=salon;

                Context.Klijenti.Add(klijent);
                salon.Klijenti.Add(klijent);
                await Context.SaveChangesAsync();

                return Ok($"Klijent je dodat : {klijent.Ime} {klijent.Prezime}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        

        [HttpGet]
        [Route("PretraziKlijenta/{BrojTelefonaKlijenta}")]
        [EnableCors("CORS")]
        public async Task<ActionResult> PretraziKlijenta(string BrojTelefonaKlijenta)
        {
            if (string.IsNullOrWhiteSpace(BrojTelefonaKlijenta) || BrojTelefonaKlijenta.Length > 13)
                return BadRequest($"Parametar 'Broj telefona klijenta' : {BrojTelefonaKlijenta} nije pravilno unet!");

            bool brojt = true;
            char[] charList =BrojTelefonaKlijenta.ToCharArray();
            int i = 0;
            while (i < charList.Count() && brojt)
            {
                if (charList[i] < '0' || charList[i] > '9')
                    brojt = false;
                i++;
            }

            if (!brojt)
                return BadRequest($"Parametar 'Broj telefona klijenta' nevalidan!");

            try
            {
                var klijent= await Context.Klijenti.Where(p => p.BrojTelefonaKlijenta.Equals(BrojTelefonaKlijenta)).ToListAsync();
                if (klijent == null)
                    throw new Exception("Klijent sa zadatim brojem telefona ne postoji!");
                return Ok(klijent);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete]
        [EnableCors("CORS")]
        [Route("ObrisiKlijenta/{KlijentID}")]
        public async Task<ActionResult> ObrisiKlijenta(int KlijentID)
        {
            try
            {
                var klijent = await Context.Klijenti.Where(p => p.ID == KlijentID).FirstAsync();
                if (klijent == null)
                    throw new Exception("Ne postoji klijent sa zadatim ID-jem!");
                var listaKoristi = await Context.KoristiUslugu.Where(p => p.Klijent.ID == KlijentID).ToListAsync();

                foreach (var kor in listaKoristi)
                {
                    Context.Remove(kor);
                }
                Context.Remove(klijent);
                await Context.SaveChangesAsync();
                return Ok($"Obrisan klijent sa ID-jem {KlijentID}!");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [EnableCors("CORS")]
        [Route("VratiKlijenteUSalonu/{SalonID}")]
        public async Task<ActionResult> VratiKlijente(int SalonID)
        {
            try
            {
                var salon = await Context.Saloni.Where(p => p.ID == SalonID).FirstAsync();
                if (salon == null)
                    throw new Exception("Salon ne postoji!");

                var klijenti = await Context.Klijenti.Include(p => p.ListaUsluga).Where(p => p.ListaUsluga.Count==0 && p.Salon.ID==SalonID ).Select(
                    p => new
                    {
                        
                        p.ID,
                        p.Ime,
                        p.Prezime,
                        p.BrojTelefonaKlijenta,
                        p.EmailKlijenta
                        
                    }
                ).ToListAsync();
                return Ok(klijenti);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}