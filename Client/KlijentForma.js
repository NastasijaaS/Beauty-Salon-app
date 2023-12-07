import { Usluga } from "./Usluga.js";
import { Klijent } from "./Klijent.js";
import { kreirajDivTextITextBox } from "./function.js";
import { kreirajDivButton } from "./function.js";
import { removeAllChildNodes } from "./function.js";
import { kreirajDiviLabel } from "./function.js";
import { kreirajDivDvaDugmeta } from "./function.js";

export class KlijentForma 
{
    constructor() {
        this.listaKlijenta = [];
        this.listaUsluga = [];
        this.kont == null;
    }

    pribaviUslugu() 
    {
        
        let salonID = document.querySelector(".seSalon").value;
        this.listaUsluga.length = 0;

        fetch("https://localhost:5001/Usluga/VratiUslugeZaSalon/" + salonID).then(p => {
            p.json().then(usluge => {
                usluge.forEach(u => {
                    let usl = new Usluga(u.uslugaID, u.uslugaNaziv, u.uslugaCena, u.radnikID);
                    this.listaUsluga.push(usl);
                });

                let selectUsluga = this.kont.querySelector(".selUsluga");
            
                let usluga;
                this.listaUsluga.forEach(usl => {
                    usluga = document.createElement("option");
                    usluga.innerHTML = usl.Naziv;
                    usluga.value = usl.ID;
                    selectUsluga.appendChild(usluga);
                });
            });
        });
    }

    pribaviKlijente() 
    {
     
        let salonID = document.querySelector(".seSalon").value;
        this.listaKlijenta.length = 0;

        fetch("https://localhost:5001/Klijent/VratiKlijenteUSalonu/" + salonID).then(p => {
            p.json().then(klijenti => {
                if (!p.ok) {
                    window.alert("Nije moguce pribaviti klijente!");
                } else {
                    klijenti.forEach(u => {
                        let kl = new Klijent(u.id, u.ime, u.prezime, u.brojTelefonaKlijenta, u.emailKlijenta, "", 0);
                        this.listaKlijenta.push(kl);
                    });
                    this.updateTabeluKlijenta();
                    
                }
            });
        });



    }


    dodajKlijenta() {
        
        let Ime = this.kont.querySelector(".tbxImeKontrola").value;
        let Prezime = this.kont.querySelector(".tbxPrezimeKontrola").value;
        let BrojTelefonaKlijenta = this.kont.querySelector(".tbxBrojKontrola").value;
        let Email = this.kont.querySelector(".tbxEmailKontrola").value;
        let salonID = document.querySelector(".seSalon").value;
        if(Email == "" || BrojTelefonaKlijenta ==="" || Ime ==="" || Prezime ==="")
        {

            window.alert("Morate uneti sve podatke!");

            return;

        }

        const mail = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$";

            if( !Email.match(mail))

            {

                window.alert("Morate uneti ispravan mail!");

                return;

            }
        
        this.kont.querySelector(".tbxImeKontrola").value = "";
        this.kont.querySelector(".tbxPrezimeKontrola").value = "";
        this.kont.querySelector(".tbxBrojKontrola").value = "";
        this.kont.querySelector(".tbxEmailKontrola").value = "";
        fetch("https://localhost:5001/Klijent/DodajKlijenta/"+ salonID + "/" + Ime + "/" + Prezime + "/" + BrojTelefonaKlijenta + "/" + Email , { method: "POST" }).then(p => {
            this.pribaviKlijente();
            if (!p.ok) {
                window.alert("Podaci o klijentu nisu validni!");
            }
        });
    }

    upisiKlijenta(UslugaID) 
    {
        let red = this.kont.querySelector(".selektovanRed");
        let datumm=this.kont.querySelector(".datumTer");

        if (red != null) 
        {
            let KlijentID = red.value;
            fetch("https://localhost:5001/Koristi/UpisiKlijenta/" + KlijentID + "/" + UslugaID+ "/" + datumm.value, { method: "POST" }).then(p => {
                this.pribaviKlijente();
                if (!p.ok) {
                    window.alert("Nije moguce dodati klijenta!");
                }
                else
                {
                    window.alert("Uspesno upisan klijent");
                }

                datumm.value="";

                
            });
        } 
        else 
        {
            window.alert("Selektuj klijenta!");
        }

        
    }

    pretraziKlijenta() {
        let brTel = this.kont.querySelector(".tbxBrojTelefonaPretraga").value;
        if (brTel.length === 0) {
            window.alert("Unesi broj telefona klijenta za pretragu!");
        } else {
            fetch("https://localhost:5001/Klijent/PretraziKlijenta/" + brTel).then(p => {
                if (!p.ok) {
                    window.alert("Nema takvog klijenta!");
                } else {
                    p.json().then(klijenti => {
                        this.listaKlijenta.length = 0;
                        if (klijenti.length === 0)
                            window.alert("Nije pronadjen ni jedan klijent!");
                        klijenti.forEach(klijent => {
                            this.listaKlijenta.push(new Klijent(klijent.id, klijent.ime, klijent.prezime, klijent.brojTelefonaKlijenta, klijent.emailKlijenta, "", 0));
                            this.updateTabeluKlijenta();
                        });
                    });
                }
            });
        }
    }

    obrisiKlijenta() 
    {
        if (confirm("Da li zelis da izbrises klijenta?")) {
            let red = this.kont.querySelector(".selektovanRed");
            if (red != null) {
                let KlijentID = red.value;
                fetch("https://localhost:5001/Klijent/ObrisiKlijenta/" + KlijentID, { method: "DELETE" }).then(p => {
                    this.pribaviKlijente();
                    if (!p.ok) {
                        window.alert("Nije moguce obrisati klijenta!");
                    }
                });
            } else {
                window.alert("Selektuj klijenta!");
            }

            window.alert("Uspesno obrisan klijent!");
        }
    }

    crtajDivDodaj(host) {
        host.appendChild(kreirajDiviLabel("divKontrolaNaslov", "Dodaj novog klijenta", "lblKontrola lblKontrolaNaslov"));
        host.appendChild(kreirajDivTextITextBox("Ime", "lblKontrola", "tbxKontrola", "text", "tbxImeKontrola", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Prezime", "lblKontrola", "tbxKontrola", "text", "tbxPrezimeKontrola", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Broj telefona klijenta", "lblKontrola", "tbxKontrola", "number", "tbxBrojKontrola", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Email klijenta", "lblKontrola", "tbxKontrola", "text", "tbxEmailKontrola", "divKontrola"));

        let divBtnDodaj = document.createElement("div");
        divBtnDodaj.className = "divKontrola";
        let btnDodaj = document.createElement("button");
        btnDodaj.className = "btnKontrola";
        btnDodaj.innerHTML = "Dodaj Klijenta";
        btnDodaj.onclick = (ev) => { this.dodajKlijenta(); }
        divBtnDodaj.appendChild(btnDodaj);
        host.appendChild(divBtnDodaj);

    }

    crtajTabelu(host) 
    {
        let tabela = document.createElement("table");
        tabela.className = "tabela";
        tabela.classList.add("tabela");
        host.appendChild(tabela);

        this.dodajZaglavljaTabeli(tabela);
    }

    dodajZaglavljaTabeli(tabela)
     {
        

        let red = document.createElement("tr");
        red.className = "zaglavlje"
        tabela.appendChild(red);

        let el = document.createElement("th");
        el.innerHTML = "Ime"
        red.appendChild(el);

        el = document.createElement("th");
        el.innerHTML = "Prezime"
        red.appendChild(el);


        el = document.createElement("th");
        el.innerHTML = "Broj telefona klijenta";
        red.appendChild(el);

        el = document.createElement("th");
        el.innerHTML = "Email klijenta"
        red.appendChild(el);
    }

    updateTabeluKlijenta() {
        let tabelaKlijenta = this.kont.querySelector(".tabela");
        removeAllChildNodes(tabelaKlijenta);

        
        this.dodajZaglavljaTabeli(tabelaKlijenta);

        this.listaKlijenta.forEach((klijent) => {
            var red = document.createElement("tr");
            red.className = "redUTabeli";

            red.value = klijent.ID;

            red.addEventListener("click", () => {
                tabelaKlijenta.childNodes.forEach(p => {
                    if (p.className != "zaglavlje") {
                        p.className = "redUTabeli";
                        p.id = "";
                    }
                });
                red.classList += " selektovanRed";
                
            });

            tabelaKlijenta.appendChild(red);
    

            let ime = document.createElement("td");
            ime.innerHTML = klijent.Ime;
            red.appendChild(ime);

            let prezime = document.createElement("td");
            prezime.innerHTML = klijent.Prezime;
            red.appendChild(prezime);

            let br = document.createElement("td");
            br.innerHTML = klijent.BrojTelefonaKlijenta;
            red.appendChild(br);

            let em = document.createElement("td");
            em.innerHTML = klijent.EmailKlijenta;
            red.appendChild(em);

       
        });
    }

    crtajKontrolu(host) 
    {
        
        let divUsluga = document.createElement("div");
        divUsluga.className = "divKontrola";
        host.appendChild(divUsluga);

        let lblUsluga = document.createElement("label");
        lblUsluga.className = "lblKontrola";
        lblUsluga.innerHTML = "Usluga";
        divUsluga.appendChild(lblUsluga);

        let selUsluga = document.createElement("select");
        selUsluga.className = "selKontrola";
        selUsluga.classList.add("selUsluga");
        divUsluga.appendChild(selUsluga);


        

        host.appendChild(kreirajDivTextITextBox("Datum i vreme termina", "lbKontrola", "tbxKontrola", "datetime-local", "datumTer", "divKontrola"));
        host.appendChild(kreirajDivButton("btnKontrola", "Upisi Klijenta", "divKontrola", (ev) => { this.upisiKlijenta(selUsluga.options[selUsluga.selectedIndex].value); }));

        
        host.appendChild(kreirajDivTextITextBox("Broj telefona klijenta", "lblKontrola", "tbxKontrola", "number", "tbxBrojTelefonaPretraga", "divKontrola"));

        
        host.appendChild(kreirajDivButton("btnKontrola", "Pretraži klijenta", "divKontrola", (ev) => { this.pretraziKlijenta() }))

        host.appendChild(kreirajDivDvaDugmeta("divKontrola", "btnKontrola", "Obrisi klijenta", (ev) => { this.obrisiKlijenta(); },   "btnKontrola", "Prikazi klijente " ,(ev) => { this.pribaviKlijente(); }));
        

    }

    crtaj(host) {

        this.kont = host;


        let divDodaj = document.createElement("div");
        divDodaj.className = "kontrola";
        this.kont.appendChild(divDodaj);
        this.crtajDivDodaj(divDodaj);

        let divTabela = document.createElement("div");
        divTabela.className = "divTabela";
        this.kont.appendChild(divTabela);
        this.crtajTabelu(divTabela);

        let divKontrola = document.createElement("div");
        divKontrola.className = "kontrola";
        this.kont.appendChild(divKontrola);
        this.crtajKontrolu(divKontrola);

        this.pribaviUslugu();
        this.pribaviKlijente();
    }

}