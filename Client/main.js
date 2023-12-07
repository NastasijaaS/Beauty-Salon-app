import { Salon } from "./Salon.js";
import { UslugaForma } from "./UslugaForma.js";
import { KlijentForma } from "./KlijentForma.js";
import { kreirajOpcijuZaSelekt } from "./function.js";
import { removeAllChildNodes } from "./function.js";
import { RadnikForma } from "./RadnikForma.js";


let sviSaloni = [];

start();
function kreirajStranicu() {
    let stranica = document.createElement("div");
    stranica.className = "stranica";
    document.body.appendChild(stranica);

    let gornjiBar = document.createElement("div");
    gornjiBar.className = "gornjiBar";
    stranica.appendChild(gornjiBar);

    let naslovDiv = document.createElement("div");
    naslovDiv.className = "divGBNaslov";

   

    let divSelectSalone = document.createElement("div");
    divSelectSalone.className = "divKontrolaN";
    gornjiBar.appendChild(divSelectSalone);

    let divLblSaloni = document.createElement("div");
    divLblSaloni.className = "divKontrolaNaslov";
    let lblSaloni = document.createElement("label");
    lblSaloni.innerHTML = "Saloni Lepote "
    lblSaloni.className = "lblKontrolaNaslov";
    divLblSaloni.appendChild(lblSaloni);


    let divSelectSalon = document.createElement("div");
    divSelectSalon.className="divSelectSalon";
    let seSalon= document.createElement("select");
    seSalon.className = "seSalon";
    seSalon.onchange= (e) => prikazRadnici();

    
        
    divSelectSalon.appendChild(seSalon);


    divSelectSalone.appendChild(divLblSaloni);
    divSelectSalone.appendChild(divSelectSalon);
    upisiSalone();
 
    let navigacija = document.createElement("div");
    navigacija.className = "navigacija";
    gornjiBar.appendChild(navigacija);
    kreairajNavigaciju(navigacija);

    let sredina = document.createElement("div");
    sredina.className = "sredina";
    stranica.appendChild(sredina);



    let sadrzaj = document.createElement("div");
    sadrzaj.className = "sadrzaj";
    sadrzaj.classList.add("sadrzaj");
    sredina.appendChild(sadrzaj);
    let donjiBar = document.createElement("div");
    donjiBar.className = "donjiBar";
    stranica.appendChild(donjiBar);

    let lblDB = document.createElement("label");
    lblDB.innerHTML = "Nastasija Stankovic";
    donjiBar.appendChild(lblDB);
}

function kreairajNavigaciju(nav) {
   

    let divRadioButton = document.createElement("div");
    divRadioButton.className="DivRB";
    let niz = ["Radnici", "Klijenti", "Usluge"];
    let rbDiv;
    let rb;
    let lbl;
    niz.forEach((el,index) => {
            rbDiv = document.createElement("div");
            rb = document.createElement("input");
            rb.setAttribute("name","rb");
            rb.className = "rButton";
            rb.type = "radio";
            rb.onclick = () => prikaz() ;
            
            rb.value = index;
            rbDiv.appendChild(rb);

            lbl = document.createElement("label");
            lbl.innerHTML = el;
            rbDiv.appendChild(lbl);
            divRadioButton.appendChild(rbDiv);
    });

    nav.appendChild(divRadioButton);
}
function prikaz()
{
    let checkID = document.querySelectorAll("input[type='radio']:checked"); 
    if( checkID === null ||  checkID.length != 1 ){
        alert("Morate izabrati samo jedan deo za prikaz!");
        return;
    }
    let  check = checkID[0].value;
    if(check == 0){
        prikazRadnici();
    }
    else if( check == 1){
        prikazZaKlijente();
    }
    else if( check == 2 ){
        prikazZaUsluge();
    }
}
function prikazRadnici() {
    let sadrzaj = document.querySelector(".sadrzaj");
    removeAllChildNodes(sadrzaj);

    let radForma = new RadnikForma();
    radForma.crtaj(sadrzaj);
}

function prikazZaUsluge() {
    let sadrzaj = document.querySelector(".sadrzaj");
    removeAllChildNodes(sadrzaj);

    let uslForma = new UslugaForma();
    uslForma.crtaj(sadrzaj);
}

function upisiSalone() {
    let slSalone = document.querySelector(".seSalon");
    
    
    sviSaloni.forEach(sl => {
        let salon = document.createElement("option");
        salon.innerHTML = sl.Naziv;
        salon.value = sl.ID;
       
        slSalone.appendChild(salon);
    })
}
function start(){
    fetch("https://localhost:5001/Salon/PreuzmiSalone").then(s => {
        if (!s.ok) {
            window.alert("Nije moguce ucitati salone!");
        } else {

            s.json().then(saloni => {
                saloni.forEach(salon => {
                    let sl = new Salon(salon.id, salon.naziv, salon.tip);
                    sviSaloni.push(sl);
                });  
                

                kreirajStranicu();
                prikazRadnici();

            });
        }
    });
}


function prikazZaKlijente() {
    let sadrzaj = document.querySelector(".sadrzaj");
    removeAllChildNodes(sadrzaj);

    let klijentForma = new KlijentForma();
    klijentForma.crtaj(sadrzaj);
}