import { Usluga } from "./Usluga.js";
import { Klijent } from "./Klijent.js";
import { Radnik } from "./Radnik.js";
import { kreirajDiviLabel, kreirajDivTextITextBox } from "./function.js";
import { kreirajDivButton } from "./function.js";
import { removeAllChildNodes } from "./function.js";
import { kreirajDivDvaDugmeta } from "./function.js";
import { kreirajDivSaLbliLblSaIDjem } from "./function.js";

export class UslugaForma {
    constructor() 
    {
        this.listaUsluga = [];
        this.listaKlijenta = [];
        this.radnik = new Radnik(-1, "", "", 0, 0);
        this.listaRadnika = [];
        this.kont==null;
    }


    izbrisiUslugu(UslugaID) {
        if (confirm("Stvarno zelis da obrises ovu uslugu?")) {
            fetch("https://localhost:5001/Usluga/ObrisiUslugu/" + UslugaID, { method: "DELETE" }).then(p => {
                if (!p.ok) {
                    window.alert("Nije moguce obrisati uslugu!");
                }
                this.pribaviUsluge();
            });
            window.alert("Uspesno obrisana usluga!");
        }
    }

    dodajUslugu() 
    {

        let selRadnik = this.kont.querySelector(".selectRadnik");
        let RadnikID = selRadnik.options[selRadnik.selectedIndex].value;

        let Naziv = this.kont.querySelector(".uslugaNaziv");
    
        let Cena = this.kont.querySelector(".uslugaCena");
        let salonID = document.querySelector(".seSalon").value;
    


        fetch("https://localhost:5001/Usluga/DodajUslugu/" + Naziv.value + "/" + Cena.value + "/" + RadnikID + "/" + salonID, { method: "POST" }).then(p => {
            if (!p.ok) {
                window.alert("Nije moguce dodati uslugu!");
            }
            this.pribaviUsluge();
            this.pribaviRadnike();
            Naziv.value = "";
            Cena.value = "";
        });

    }

    pribaviRadnike() {
        
       
        this.listaRadnika.length = 0;
        let salonID = document.querySelector(".seSalon").value;

        fetch("https://localhost:5001/Koristi/VratiRadnikeBezUsluge/"+ salonID).then(p => {
            if (!p.ok) {
                window.alert("Nije moguce pribaviti radnike!");
            } else {
                p.json().then(radnici => {
                    radnici.forEach(radnik=> {
                        this.listaRadnika.push(new Radnik(radnik.id, radnik.ime, radnik.prezime, radnik.ocena,radnik.datumZap));

                    });
                    let selRadnik = document.querySelector(".selectRadnik");
                    removeAllChildNodes(selRadnik);
                    this.listaRadnika.forEach(radnik => {
                        let por = document.createElement("option");
                        por.innerHTML = radnik.Ime + " " + radnik.Prezime;
                        por.value = radnik.ID;
                        selRadnik.appendChild(por);
                    });
                });
            }
        });
    }

    zameniRadnikaTr(UslugaID) {
        let selRadnik = this.kont.querySelector(".selectRadnik");
        let RadnikID = selRadnik.options[selRadnik.selectedIndex].value;

        fetch("https://localhost:5001/Usluga/ZameniRadnika/" + UslugaID + "/" + RadnikID, { method: "PUT" }).then(p => {
            if (!p.ok) {
                window.alert("Nije moguce zameniti trenutnog radnika!");
            }
            window.alert("Uspesno zamenjen radnik!");
            this.pribaviUsluge();
            this.pribaviRadnike();
            

        });


    }
 

    pribaviUsluge() {
     
        let salonID = document.querySelector(".seSalon").value;
        this.listaUsluga.length = 0;

        fetch("https://localhost:5001/Usluga/VratiUslugeZaSalon/" + salonID).then(p => {
            p.json().then(usluge => {
                if (!p.ok) {
                    window.alert("Nije moguce pribaviti uslugu!");
                } else {
                    usluge.forEach(u => {
                        let usl = new Usluga(u.uslugaID, u.uslugaNaziv, u.uslugaCena, u.radnikID);
                        this.listaUsluga.push(usl);
                    });
                    this.updateListuUsluga();
                    this.updateInfo();
                }
            });
        });



    }

    nadjiKlijenteKojiKoristeUslugu(idUsluge) {
        this.listaKlijenta.length = 0;
        fetch("https://localhost:5001/Koristi/PreuzmiKlijentezaZadatuUslugu/" + idUsluge).then(p => {
            p.json().then(klijenti => {
                if (!p.ok) {
                    window.alert("Nije moguce pribaviti klijente!");
                } else {
                    klijenti.forEach(klijent => {
                        let kl = new Klijent(klijent.klijentID, klijent.ime, klijent.prezime, klijent.brojtelefona, klijent.emailklijenta, idUsluge, klijent.datumZak);
                        
                        this.listaKlijenta.push(kl);
                    });
                    this.updateListuKlijenta();
                    this.updateInfo();
                }
            });
        });

    }

    ispisiKlijenta(uslugaID) {
        let klijentID = this.kont.querySelector(".selektovanRed");
        if (klijentID != null) {
            if (confirm("Da li stvarno zelis da otkazes klijenta?")) {
                fetch("https://localhost:5001/Koristi/OtkaziKlijenta/" + klijentID.value + "/" + uslugaID, { method: 'DELETE' })
                    .then(p => {
                        if (!p.ok) {
                            window.alert("Nije moguce otkazati!");
                        }
                        this.nadjiKlijenteKojiKoristeUslugu(uslugaID);
                        fetch("https://localhost:5001/Klijent/ObrisiKlijenta/" + klijentID.value, { method: "DELETE" }).then(p => {
                            if (!p.ok) {
                                window.alert("Nije moguce obrisati klijenta!");
                            }
                        });
                    });

            }
        } else {
            window.alert("Selektuj klijenta prvo!");
        }
    }



    promeniDatumKlijentu(UslugaID) {
        let klijentID = this.kont.querySelector(".selektovanRed");
        let datum = this.kont.querySelector(".datumUpis");
        
        if (klijentID != null) {
            fetch("https://localhost:5001/Koristi/PromeniDatum/" + klijentID.value + "/" + UslugaID + "/" + datum.value, { method: 'PUT' })
                .then(p => {
                    if (!p.ok) {
                        window.alert("Nije moguce promeniti termin!");
                    }
                    this.nadjiKlijenteKojiKoristeUslugu(UslugaID);
                    datum.value = "";
                });
        } else {
            window.alert("Selektuj ucenika prvo!");
        }
        window.alert("Uspesno promenjen termin!");
    }

    promeniCenu(UslugaID)
    {
        let cena = this.kont.querySelector(".uslugaCena");
     

        fetch("https://localhost:5001/Usluga/ZameniCenu/" + UslugaID + "/" + cena.value, { method: "PUT" }).then(p => {
            
            if (!p.ok) {
                window.alert("Nije moguce zameniti cenu!");
            }
            
            this.pribaviUsluge();
            cena.value="";
          
        });
        window.alert("Uspesno promenjena cena!");
        
            

        
    }

    updateInfo() 
    {
        let selectUsluga = this.kont.querySelector(".selectUsluga");
        let index = selectUsluga.selectedIndex;
        let usluga = this.listaUsluga[index];

        fetch("https://localhost:5001/Radnik/VratiRadnika/" + usluga.RadnikID).then(p => {
            if (!p.ok) {
                window.alert("Nije moguce pribaviti radnika!");
            } else {
                p.json().then(r => {
                    this.radnik.ID = r.id;
                    this.radnik.Ime = r.ime;
                    this.radnik.Prezime = r.prezime;
                    this.radnik.ocena = r.ocena;
                    this.radnik.DatumZap=r.datumZap;
                    this.dodajInfo();
                });
            }
        });

    }

    updateListuUsluga() 
    {
        let selectUsluga = this.kont.querySelector(".selectUsluga");
        removeAllChildNodes(selectUsluga);
        let usluga;
        this.listaUsluga.forEach(usl => {
            usluga = document.createElement("option");
            usluga.innerHTML = usl.Naziv;
            usluga.value = usl.ID;
            selectUsluga.appendChild(usluga);
        });
        this.nadjiKlijenteKojiKoristeUslugu(selectUsluga.options[selectUsluga.selectedIndex].value);
        this.updateInfoRadnik();
        this.updateInfo();
    }

    updateListuKlijenta() {
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

            let dtm = document.createElement("td");
            dtm.innerHTML = klijent.Datum;
            red.appendChild(dtm);
        });
    }

    dodajKontrolu(kontrola) {
        let uslugaSelectDiv = document.createElement("div");
        uslugaSelectDiv.classList += "divKontrola";
        kontrola.appendChild(uslugaSelectDiv);

        let lblusluga = document.createElement("label");
        lblusluga.innerHTML = "Usluga";
        lblusluga.classList += "lblKontrola";
        uslugaSelectDiv.appendChild(lblusluga);


        let selectUsluga = document.createElement("select");
        selectUsluga.className += "selKontrola";
        selectUsluga.classList.add("selectUsluga");
        selectUsluga.onchange = (ev) => {
            let uslugaID = selectUsluga.options[selectUsluga.selectedIndex].value;
            this.nadjiKlijenteKojiKoristeUslugu(uslugaID);
            this.updateInfoRadnik();
        }
        uslugaSelectDiv.appendChild(selectUsluga);

        

        kontrola.appendChild(kreirajDivSaLbliLblSaIDjem("divKontrola", "Cena:  ", "lblCenaUsl", "lblKontrola"));

        kontrola.appendChild(kreirajDiviLabel("divKontrolaNaslov", "Radnik ", "lblKontrola lblKontrolaNaslov"));

        kontrola.appendChild(kreirajDivSaLbliLblSaIDjem("divKontrola", "Ime:  ", "imeRadnik", "lblKontrola"));

        kontrola.appendChild(kreirajDivSaLbliLblSaIDjem("divKontrola", "Prezime:  ", "prezimeRadnik", "lblKontrola"));

        kontrola.appendChild(kreirajDivSaLbliLblSaIDjem("divKontrola", "Ocena:  ", "ocenaRadnik", "lblKontrola"));

    }

    dodajZaglavljaTabeli(tabela) {
    

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


        el = document.createElement("th");
        el.innerHTML = "Datum i vreme termina"
        red.appendChild(el);
    }
    dodajTabelu(divTabela) 
    {
        let tabela = document.createElement("table");

        tabela.className = "tabela";
        tabela.id = "tabela";
        divTabela.appendChild(tabela);

        this.dodajZaglavljaTabeli(tabela);

    }

    dodajInfo()
    {
        let ime = this.kont.querySelector(".imeRadnik");
        ime.innerHTML = this.radnik.Ime;

        let prezime = this.kont.querySelector(".prezimeRadnik");
        prezime.innerHTML = this.radnik.Prezime;

        let oc = this.kont.querySelector(".ocenaRadnik");
        oc.innerHTML = this.radnik.ocena;
    }

    dodajInfoKontrolu(host) 
    {
        let selectUsluga = this.kont.querySelector(".selectUsluga");

        host.appendChild(kreirajDivButton("btnKontrola", "Otkazi klijenta", "divKontrola", (ev) => {
            this.ispisiKlijenta(selectUsluga.options[selectUsluga.selectedIndex].value);
        }));

        host.appendChild(kreirajDivTextITextBox("Novi termin", "lbKontrola", "tbxKontrola", "datetime-local", "datumUpis", "divKontrola"));
        host.appendChild(kreirajDivButton("btnKontrola", "Promeni termin", "divKontrola", (ev) => { 
            
            this.promeniDatumKlijentu(selectUsluga.options[selectUsluga.selectedIndex].value); }));

        host.appendChild(kreirajDiviLabel("divKontrolaNaslov", "Usluge", "lblKontrola lblKontrolaNaslov"));

        host.appendChild(kreirajDivTextITextBox("Naziv", "lblKontrola", "tbxKontrola", "text", "uslugaNaziv", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Cena", "lblKontrola", "tbxKontrola", "number", "uslugaCena", "divKontrola"));

      



        let divSelRadnik = document.createElement("div");
        divSelRadnik.className = "divKontrola";

        let lblSelRadnik = document.createElement("label");
        lblSelRadnik.className = "lblKontrola";
        lblSelRadnik.innerHTML = "Radnik";
        divSelRadnik.appendChild(lblSelRadnik);

        let selRadnik = document.createElement("select");
        selRadnik.className = "selKontrola";
        selRadnik.classList.add("selectRadnik");
        divSelRadnik.appendChild(selRadnik);

        host.appendChild(divSelRadnik);

       

        host.appendChild(kreirajDivDvaDugmeta("divKontrola", "btnKontrola", "Dodaj uslugu", (e) => { this.dodajUslugu(); }, "btnKontrola",  "Izbriši uslugu",  (e) => { this.izbrisiUslugu(selectUsluga.options[selectUsluga.selectedIndex].value); }));
       
        host.appendChild(kreirajDivDvaDugmeta("divKontrola", "btnKontrola", "Promeni cenu", (e) => { this.promeniCenu(selectUsluga.options[selectUsluga.selectedIndex].value); }, "btnKontrola", "Zameni radnika ", (e) => { this.zameniRadnikaTr(selectUsluga.options[selectUsluga.selectedIndex].value); }));
        this.pribaviRadnike();
    }

    updateInfoRadnik() {
      
        let lblCena = this.kont.querySelector(".lblCenaUsl");
        let selectUsluga = this.kont.querySelector(".selectUsluga");
        let index = selectUsluga.selectedIndex;
        let usluga = this.listaUsluga[index];
        lblCena.innerHTML = usluga.Cena;
    }
    crtaj(host) {

        this.kont=host;

        let kontrola = document.createElement("div");
        kontrola.classList += "kontrola";
        host.appendChild(kontrola);

        this.dodajKontrolu(kontrola);

        let divTabela = document.createElement("div");
        divTabela.classList += "divTabela";
        host.appendChild(divTabela);

        this.dodajTabelu(divTabela);

        let info = document.createElement("div");
        info.className = "kontrola";
        host.appendChild(info);

        this.dodajInfoKontrolu(info);

        this.pribaviUsluge();
    }

}