import { Radnik } from "./Radnik.js";
import { kreirajDivTextITextBox } from "./function.js";
import { kreirajDivButton } from "./function.js";
import { removeAllChildNodes } from "./function.js";
import { kreirajDiviLabel } from "./function.js";
import { kreirajDivDvaDugmeta } from "./function.js";

export class RadnikForma 
{
    constructor() 
    {
        this.listaRadnika = [];
        this.kont==null;
    }
    ObrisiRadnika() 
    {
        if (confirm("Da li zelis da izbrises radnika?")) {
            let red = this.kont.querySelector(".selektovanRed");
            if (red != null) {
                let RadnikID = red.value;
             
                fetch("https://localhost:5001/Radnik/ObrisiRadnika/" + RadnikID, { method: "DELETE" }).then(p => {
                    this.pribaviRadnike();
                    if (!p.ok) {
                        window.alert("Nije moguce obrisati radnika!");
                    }
                });
            } else {
                window.alert("Selektuj radnika!");
            }

            window.alert("Uspesno obrisan radnik!");
        }
    }
  
    
    zameniOcena() 
    {
        let tbxOcena = this.kont.querySelector(".OcenaRadnikaNovo");
        let Ocena = tbxOcena.value;
        
        tbxOcena.value = "";
        let RadnikID = this.kont.querySelector(".selektovanRed").value;
        
        fetch("https://localhost:5001/Radnik/ZameniOcenu/" + RadnikID + "/" + Ocena, { method: "PUT" }).then(p => {
            this.pribaviRadnike();
            if (!p.ok) 
            {
                window.alert("Nije moguce zameniti ocenu!");
            }
        });

        window.alert("Uspesno zamenjena ocena!");
    }
    pribaviRadnike() 
    {
        let salonID = document.querySelector(".seSalon").value;
        //console.log(salonID);
        this.listaRadnika.length = 0;
        fetch("https://localhost:5001/Radnik/VratiRadnikeUSalonu/" + salonID).then(p => {
            if (!p.ok) {
                window.alert("Nije moguce pribaviti radnike!");
            } else {
                p.json().then(radnici => {
                    radnici.forEach(radnik => 
                        {
                       
                        this.listaRadnika.push(new Radnik(radnik.id, radnik.ime, radnik.prezime, radnik.ocena,radnik.datumZap));
                        //console.log(radnik);
    
                    });
                    this.updateTabelu();
                });
            }
        })

    }

    dodajRadnika() 
    {
        
        let Ime = this.kont.querySelector(".imeRadnika").value;
        let Prezime = this.kont.querySelector(".prezimeRadnika").value;
        let Ocena = this.kont.querySelector(".OcenaRadnika").value;
        let salonID = document.querySelector(".seSalon").value;
        if(Ime == "" || Prezime ==="" || Ocena ==="")

        {

            window.alert("Morate uneti sve podatke!");
            return;

        }
        this.kont.querySelector(".imeRadnika").value = "";
        this.kont.querySelector(".prezimeRadnika").value = "";
        this.kont.querySelector(".OcenaRadnika").value = "";
        fetch("https://localhost:5001/Radnik/DodajRadnika/" + salonID + "/"+ Ime + "/" + Prezime + "/" + Ocena, { method: "POST" }).then(p => {
            if (!p.ok) {
                window.alert("Nije moguce dodati radnika!");
                return;
            }
            this.pribaviRadnike();
        });

        window.alert("Uspesno dodat radnik!");

    }
    pribaviRadnkeBezUsluge() 
    {
     
        let salonID = document.querySelector(".seSalon").value;
        this.listaRadnika.length = 0;

        fetch("https://localhost:5001/Koristi/VratiRadnikeBezUsluge/" + salonID).then(p => {
            p.json().then(radnici => {
                if (!p.ok) {
                    window.alert("Nije moguce pribaviti radnike!");
                } else {
                    radnici.forEach(radnik => {
                        let rd = new Radnik(radnik.id, radnik.ime, radnik.prezime, radnik.ocena,radnik.datumZap);
                        this.listaRadnika.push(rd);
                    });
                    this.updateTabelu();
                    
                }
            });
        });



    }

    
    crtajDivDodaj(host)
    {
        host.appendChild(kreirajDiviLabel("divKontrolaNaslov", "Dodaj novog radnika", "lblKontrola lblKontrolaNaslov"));
        host.appendChild(kreirajDivTextITextBox("Ime", "lblKontrola", "tbxKontrola", "text", "imeRadnika", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Prezime", "lblKontrola", "tbxKontrola", "text", "prezimeRadnika", "divKontrola"));
        host.appendChild(kreirajDivTextITextBox("Ocena", "lblKontrola", "tbxKontrola", "number", "OcenaRadnika", "divKontrola"));
        let navigacija = document.createElement("div");
        navigacija.className = "navigacija";
        host.appendChild(navigacija);
        let divRadioButton = document.createElement("div");
        divRadioButton.className="DivRB22";
        
        let niz = ["Bez iskustva"];
        let rbDiv;
        let rb;
        let lbl;
        niz.forEach((el,index) => {
                rbDiv = document.createElement("div");
                rb = document.createElement("input");
                rb.setAttribute("name","rb");
                rb.className = "rButton";
                rb.type = "radio";
                rb.onclick = () => this.prikaz() ;
                
                rb.value = index;
                rbDiv.appendChild(rb);
    
                lbl = document.createElement("label");
                lbl.innerHTML = el;
                rbDiv.appendChild(lbl);
                divRadioButton.appendChild(rbDiv);
        });
    
        navigacija.appendChild(divRadioButton);
        host.appendChild(kreirajDivButton("btnKontrola", "Dodaj Radnika", "divKontrola", (ev) => { this.dodajRadnika(); }));
       
    

    }
    prikaz()
    {
        let checkID = this.kont.querySelectorAll("input[type='radio']:checked"); 
        let  check = checkID[0].value;
        if(check == 0){
            this.kont.querySelector(".OcenaRadnika").value=5;
        }
        
        
    }
  
   

    crtajTabelu(divTabela) 
    {
        let tabela = document.createElement("table");
        tabela.className = "tabela";
        tabela.classList.add("tabela");
        divTabela.appendChild(tabela);
    
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
        el.innerHTML = "Ocena"
        red.appendChild(el);

        el = document.createElement("th");
        el.innerHTML = "Datum Zaposlenja"
        red.appendChild(el);

    }

    updateTabelu()
    {
        let tabelaRadnika = this.kont.querySelector(".tabela");
        removeAllChildNodes(tabelaRadnika);
    
        this.dodajZaglavljaTabeli(tabelaRadnika);
    
        this.listaRadnika.forEach((radnik) => {
            var red = document.createElement("tr");
            red.className = "redUTabeli";
    
            red.value = radnik.ID;
    
            red.addEventListener("click", () => {
                tabelaRadnika.childNodes.forEach(p => {
                    if (p.className != "zaglavlje") {
                        p.className = "redUTabeli";
                        p.id="";
                    }
                });
                red.classList += " selektovanRed";
                
            });
    
            tabelaRadnika.appendChild(red);
            
    
            let ime = document.createElement("td");
            ime.innerHTML = radnik.Ime;
            red.appendChild(ime);
    
            let prezime = document.createElement("td");
            prezime.innerHTML = radnik.Prezime;
            red.appendChild(prezime);
    
    
            let oc = document.createElement("td");
            oc.innerHTML = radnik.Ocena;
            red.appendChild(oc); 
            
           

            var date=new Date(radnik.DatumZap);
            var dd = date.getDate();
            var mm = date.getMonth()+1;
            var yyyy = date.getFullYear();
      
            if(dd<10) {dd = '0'+dd} 
            if(mm<10) {mm = '0'+mm} 
          
            var prikaz = mm + '/' + dd + '/' + yyyy;
 

            let datt = document.createElement("td");
            datt.innerHTML = prikaz;
            red.appendChild(datt);
    
            
        });

    }
    pribaviRadnikeBez()
    {
     
        let salonID = document.querySelector(".seSalon").value;
        this.listaRadnika.length = 0;

        fetch("https://localhost:5001/Radnik/VratiRadnikeBez/" + salonID).then(p => {
            p.json().then(radnici => {
                if (!p.ok) {
                    window.alert("Nije moguce pribaviti radnike!");
                } else {
                    radnici.forEach(radnik => {
                        let rd = new Radnik(radnik.id, radnik.ime, radnik.prezime, radnik.ocena,radnik.datumZap);
                        this.listaRadnika.push(rd);
                    });
                    this.updateTabelu();
                    
                }
            });
        });



    }
    crtajKontrolu(host) 
    {
        host.appendChild(kreirajDivTextITextBox("Ocena", "lblKontrola", "tbxKontrola", "number", "OcenaRadnikaNovo", "divKontrola"));
        host.appendChild(kreirajDivButton("btnKontrola", "Zameni ocenu radnika", "divKontrola", (e) => { this.zameniOcena(); }));
        host.appendChild(kreirajDivButton("btnKontrola", "Radnici bez iskustva", "divKontrola", (ev) => { this.pribaviRadnikeBez(); }));
        host.appendChild(kreirajDivDvaDugmeta("divKontrola", "btnKontrola", "Radnici sa uslugama", (ev) => { this.pribaviRadnike(); },   "btnKontrola", "Radnici bez usluge " ,(ev) => { this.pribaviRadnkeBezUsluge(); }))
        host.appendChild(kreirajDivButton("btnKontrola", "Obrisi radnika", "divKontrola", (e) => { this.ObrisiRadnika(); }));
    }
    crtaj(host)
    {
        this.kont=host;


        let divDodaj = document.createElement("div");
        divDodaj.className = "kontrola";
        host.appendChild(divDodaj);
        this.crtajDivDodaj(divDodaj);
    
        let divTabela = document.createElement("div");
        divTabela.className = "divTabela";
        host.appendChild(divTabela);
        this.crtajTabelu(divTabela);
    
        let divKontrola = document.createElement("div");
        divKontrola.className = "kontrola";
        host.appendChild(divKontrola);
        this.crtajKontrolu(divKontrola);
    
        this.pribaviRadnike();

    }


}


