const regler1 = document.getElementById("hoehenregler1");
const regler2 = document.getElementById("personenregler2");
const anzeige1 = document.getElementById("hoehenwert");
const anzeige2 = document.getElementById("personenwert")

let einwirkung = 2943

const svg = document.getElementById("fachwerk");


  regler1.addEventListener("input", function() {
    anzeige1.textContent = regler1.value + " m";
    const ergebnisse = zeichneFachwerk();
    fülltabelle(ergebnisse);
  });

  regler2.addEventListener("input", function() {
    anzeige2.textContent = regler2.value
    einwirkung = 80 * regler2.value * 9.81
    const ergebnisse = zeichneFachwerk()
    fülltabelle(ergebnisse)
  })


  const ergebnisse = zeichneFachwerk();
  fülltabelle(ergebnisse);
  

  function zeichneLinie(x1, x2, y1, y2, kraft, maxKraft) {

    const linie = document.createElementNS("http://www.w3.org/2000/svg", "line");

    const intensität = Math.abs(kraft) / maxKraft;
    const farbwert = Math.round(255 * (1 - intensität)); 

    const längePX = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
    const längeM = längePX * (4/175);

    const E = 210000000000
    const r = 0.02
    const I = (Math.PI * r**4 / 4)
    const fKrit = (Math.PI**2 * E * I) / längeM**2

    let farbe;
    if (kraft < 0)  {
      farbe = `rgb(255, ${farbwert}, ${farbwert})`;
    } else {
      farbe = `rgb(${farbwert}, ${farbwert}, 255)`;
    }

    linie.setAttribute("x1", x1);
    linie.setAttribute("y1", y1);
    linie.setAttribute("x2", x2);
    linie.setAttribute("y2", y2);
    linie.setAttribute("stroke", farbe);
    linie.setAttribute("stroke-width", 2.5);

    svg.appendChild(linie);

    return  {kraft: kraft, knicklast: fKrit}

  }


  function zeichneFachwerk()  {

    svg.innerHTML = "";

    const hPixel = Number(regler1.value) * 50;
    const hMeter = Number(regler1.value);
    const F = einwirkung;
    const l = 4 
    const alpha = Math.atan((2 * hMeter) / l);

    const S1 = -F / (2 * Math.sin(alpha));
    const S2 = F / (2 * Math.tan(alpha));
    const S3 = F / (2 * Math.sin(alpha));
    const S4 = -F / (2 * Math.tan(alpha));
    const S5 = -F / (2 * Math.sin(alpha));
    const S6 = 3 * F / (2 * Math.tan(alpha));
    const S7 = F / (2 * Math.sin(alpha));
    const S8 = -2 * F / (Math.tan(alpha));

    const stäbe = [ 
      { x1: 50, x2: 137.5, y1: 275, y2: 275 - hPixel, kraft: S1 },  // 1 
      { x1: 50, x2: 225, y1: 275, y2: 275, kraft: S2 },   // 2
      { x1: 137.5, x2: 225, y1: 275 - hPixel, y2: 275, kraft: S3 },  // 3 
      { x1: 137.5, x2: 312.5, y1: 275 - hPixel, y2: 275 - hPixel, kraft: S4 },   // 4
      { x1: 225, x2: 312.5, y1: 275, y2: 275 - hPixel, kraft: S5 },  // 5 
      { x1: 225, x2: 400, y1: 275, y2: 275, kraft: S6 },  // 6 
      { x1: 312.5, x2: 400, y1: 275 - hPixel, y2: 275, kraft: S7 },  // 7 
      { x1: 312.5, x2: 487.5, y1: 275 - hPixel, y2: 275 - hPixel, kraft: S8 },  // 8
      { x1: 400, x2: 487.5, y1: 275, y2: 275 - hPixel, kraft: S7 },  // 9
      { x1: 400, x2: 575, y1: 275, y2: 275, kraft: S6 },   // 10 
      { x1: 487.5, x2: 575, y1: 275 - hPixel, y2: 275, kraft: S5 },  // 11
      { x1: 487.5, x2: 662.5, y1: 275 - hPixel, y2: 275 - hPixel, kraft: S4 },  // 12 
      { x1: 575, x2: 662.5, y1: 275, y2: 275 - hPixel, kraft: S3 },  // 13 
      { x1: 575, x2: 750, y1: 275, y2: 275, kraft: S2 },  // 14 
      { x1: 662.5, x2: 750, y1: 275 - hPixel, y2: 275, kraft: S1 },  // 15 
    ]

    const maxKraft = einwirkung / Math.tan(Math.atan(2 * 1 / 4));

    const ergebnisse = stäbe.map(function(stab)  {
      return zeichneLinie(stab.x1, stab.x2, stab.y1, stab.y2, stab.kraft, maxKraft);
    });

    zeichneKnoten(50, 275, "I", -25, 5)
    zeichneKnoten(225, 275, "III", -8, 20)
    zeichneKnoten(400, 275, "V", -7, 20)
    zeichneKnoten(575, 275, "VII", -8, 20)
    zeichneKnoten(750, 275, "IX", 10, 5)
    
    zeichneKnoten(137.5, 275 - hPixel, "II", -10, -8)
    zeichneKnoten(312.5, 275 - hPixel, "IV", -10, -8)
    zeichneKnoten(487.5, 275 - hPixel, "VI", -10, -8)
    zeichneKnoten(662.5, 275 - hPixel, "VIII", -20, -8)

    zeichnePfeil(400, 275, 400, 325)

    return ergebnisse
  }


  function fülltabelle(ergebnisse)  {
    
    const inhalt1 = document.getElementById("tabellenKoerper1");
    const inhalt2 = document.getElementById("tabellenKoerper2");
    
    inhalt1.innerHTML = "";
    inhalt2.innerHTML = "";

    ergebnisse.forEach(function(eintrag, index) {

      let inhalt;
      if (index < 8) {
        inhalt = inhalt1
      } else {
        inhalt = inhalt2
      }

      const zeile = inhalt.insertRow();

      const zelle1 = zeile.insertCell();
      zelle1.textContent = index + 1

      const zelle2 = zeile.insertCell();
      zelle2.textContent = eintrag.kraft.toFixed(0)

      const zelle3 = zeile.insertCell();
      zelle3.textContent = eintrag.knicklast.toFixed(0)
    })

  }


  function zeichneKnoten(x, y, name, dx, dy) {

    const knoten = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    knoten.setAttribute("cx", x);
    knoten.setAttribute("cy", y);
    knoten.setAttribute("r", 4);
    knoten.setAttribute("fill", "black");

    svg.appendChild(knoten);

    const beschriftung = document.createElementNS("http://www.w3.org/2000/svg", "text");

    beschriftung.setAttribute("x", x + dx);
    beschriftung.setAttribute("y", y + 1.15*dy);
    beschriftung.textContent = name;
    beschriftung.setAttribute("font-size", 20);
    beschriftung.setAttribute("font-weight", 100);

    svg.appendChild(beschriftung)

  }


  function zeichnePfeil(x1, y1, x2, y2) {

    const pfeil = document.createElementNS("http://www.w3.org/2000/svg", "line");

    pfeil.setAttribute("x1", x1);
    pfeil.setAttribute("y1", y1);
    pfeil.setAttribute("x2", x2);
    pfeil.setAttribute("y2", y2);
    pfeil.setAttribute("stroke", "red");
    pfeil.setAttribute("stroke-width", 2)

    svg.appendChild(pfeil)

    const spitze = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    spitze.setAttribute("points", `${x2-4},${y2} ${x2+4},${y2} ${x2},${y2+10}`);
    spitze.setAttribute("fill", "red")

    svg.appendChild(spitze)
    
  }
