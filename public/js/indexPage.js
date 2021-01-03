
// Kreiranje slideshow-a:

var i = 0; 			// početna varijabla koja će se koristiti za niz
var slike = [];	// niz slika koje će se prikazivati
var vrijeme = 3000;	// vrijeme između svake slike, 2s (2000ms)
	 
// Lista slika
slike[0] = "prva.jpg";
slike[1] = "druga.jpg";
slike[2] = "treca.jpg";

// Promjena slika:
function changeImg(){
	document.slide.src = slike[i]; // u područje s imenom "slide" pohranjujemo niz

	// Izmjena indeksa:
	if(i < slike.length - 1){ // dužina niza je 3 (0,1,2) ali brojevi idu samo do 2, pa se koristi length-1
	  i++; 
	} else { 
		i = 0;
	}

	// Funkcija se ponavlja svakih "vrijeme" sekundi (2000ms)
	//setTimeout("changeImg()", vrijeme);
}

function prev(){
	// Izmjena indeksa:
	if(i==0) {
		document.slide.src = slike[2];
		i=2;
	} else if(i==1) {
		document.slide.src = slike[0];
		i--;
	} else if(i==2) {
		document.slide.src = slike[1];
		i--;
	}
}

function next(){
	// Izmjena indeksa:
	if(i==0) {
		document.slide.src = slike[1];
		i++;
	} else if(i==1) {
		document.slide.src = slike[2];
		i++;
	} else if(i==2) {
		document.slide.src = slike[0];
		i=0;
	}
}


// funkcija se poziva čim se otvori prozor
window.onload=changeImg;



