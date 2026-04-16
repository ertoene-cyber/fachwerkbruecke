const regler1 = document.getElementById("hoehenregler1");
const regler2 = document.getElementById("personenregler2");
const anzeige1 = document.getElementById("hoehenwert");
const anzeige2 = document.getElementById("personenwert")
const einwirkungWert = document.getElementById("einwirkungWert")

let einwirkung = 3139.2

const svg = document.getElementById("fachwerk");


  regler1.addEventListener("input", function() {
    anzeige1.textContent = regler1.value + " m";
    const ergebnisse = zeichneFachwerk();
    fülltabelle(ergebnisse);
  });

  regler2.addEventListener("input", function() {
    anzeige2.textContent = regler2.value
    einwirkungWert.textContent = einwirkung.toFixed(1) + " N"
    einwirkung = 80 * regler2.value * 9.81
    const ergebnisse = zeichneFachwerk()
    fülltabelle(ergebnisse)
  })


  const ergebnisse = zeichneFachwerk();
  fülltabelle(ergebnisse);
  

  function zeichneLinie(x1, x2, y1, y2, kraft, nummer, dx, dy, maxKraft, beschriftungStäbeGröße) {

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

    const beschriftungStab = document.createElementNS("http://www.w3.org/2000/svg", "text");

    const mitteX = (x1 + x2) / 2
    const mitteY = (y1 + y2) / 2

    beschriftungStab.setAttribute("x", mitteX + dx);
    beschriftungStab.setAttribute("y", mitteY + dy);
    beschriftungStab.textContent = nummer;
    beschriftungStab.setAttribute("font-size", beschriftungStäbeGröße);
    beschriftungStab.setAttribute("font-weight", 20);

    svg.appendChild(beschriftungStab);

    return  {kraft: kraft, knicklast: fKrit}

  }


  function zeichneFachwerk()  {

    svg.innerHTML = "";

    const hPixel = Number(regler1.value) * 50;
    const hMeter = Number(regler1.value);
    const F = einwirkung;
    const l = 4;
    const alpha = Math.atan((2 * hMeter) / l);

    const beschriftungStäbeGröße = Math.min(7.5 + hPixel * 0.05, 16.25);

    const S1 = -F / (2 * Math.sin(alpha));
    const S2 = F / (2 * Math.tan(alpha));
    const S3 = F / (2 * Math.sin(alpha));
    const S4 = -F / (2 * Math.tan(alpha));
    const S5 = -F / (2 * Math.sin(alpha));
    const S6 = 3 * F / (2 * Math.tan(alpha));
    const S7 = F / (2 * Math.sin(alpha));
    const S8 = -2 * F / (Math.tan(alpha));

    const stäbe = [ 
      { x1: 50, x2: 137.5, y1: 275, y2: 275 - hPixel, kraft: S1, nummer: 1, dx: -20, dy: 0 },  // 1 
      { x1: 50, x2: 225, y1: 275, y2: 275, kraft: S2, nummer: 2, dx: 0, dy: 20 },   // 2
      { x1: 137.5, x2: 225, y1: 275 - hPixel, y2: 275, kraft: S3, nummer: 3, dx: 10, dy: 0 },  // 3
      { x1: 137.5, x2: 312.5, y1: 275 - hPixel, y2: 275 - hPixel, kraft: S4, nummer: 4, dx: 0, dy: -10 },   // 4
      { x1: 225, x2: 312.5, y1: 275, y2: 275 - hPixel, kraft: S5, nummer: 5, dx: -20, dy: 0 },  // 5
      { x1: 225, x2: 400, y1: 275, y2: 275, kraft: S6, nummer: 6, dx: 0, dy: 20 },  // 6
      { x1: 312.5, x2: 400, y1: 275 - hPixel, y2: 275, kraft: S7, nummer: 7, dx: 10, dy: 0 },  // 7
      { x1: 312.5, x2: 487.5, y1: 275 - hPixel, y2: 275 - hPixel, kraft: S8, nummer: 8, dx: 0, dy: -10 },  // 8
      { x1: 400, x2: 487.5, y1: 275, y2: 275 - hPixel, kraft: S7, nummer: 9, dx: -20, dy: 0 },  // 9
      { x1: 400, x2: 575, y1: 275, y2: 275, kraft: S6, nummer: 10, dx: 0, dy: 20 },   // 10
      { x1: 487.5, x2: 575, y1: 275 - hPixel, y2: 275, kraft: S5, nummer: 11, dx: 10, dy: 0 },  // 11
      { x1: 487.5, x2: 662.5, y1: 275 - hPixel, y2: 275 - hPixel, kraft: S4, nummer: 12, dx: 0, dy: -10 },  // 12
      { x1: 575, x2: 662.5, y1: 275, y2: 275 - hPixel, kraft: S3, nummer: 13, dx: -25, dy: 0 },  // 13
      { x1: 575, x2: 750, y1: 275, y2: 275, kraft: S2, nummer: 14, dx: 0, dy: 20 },  // 14
      { x1: 662.5, x2: 750, y1: 275 - hPixel, y2: 275, kraft: S1, nummer: 15, dx: 10, dy: 0 },  // 15 
    ]

    const maxKraft = 0.9*einwirkung / Math.tan(Math.atan(2 * 1 / 4));

    const ergebnisse = stäbe.map(function(stab)  {
      return zeichneLinie(stab.x1, stab.x2, stab.y1, stab.y2, stab.kraft, stab.nummer, stab.dx, stab.dy, maxKraft, beschriftungStäbeGröße);
    });

    zeichneKnoten(50, 275, "I", -25, 5)
    zeichneKnoten(225, 275, "III", -8, 20)
    zeichneKnoten(400, 275, "V", -6.4, -10 - 0.1*hPixel)
    zeichneKnoten(575, 275, "VII", -8, 20)
    zeichneKnoten(750, 275, "IX", 10, 5)
    
    zeichneKnoten(137.5, 275 - hPixel, "II", -10, -8)
    zeichneKnoten(312.5, 275 - hPixel, "IV", -10, -8)
    zeichneKnoten(487.5, 275 - hPixel, "VI", -10, -8)
    zeichneKnoten(662.5, 275 - hPixel, "VIII", -20, -8)

    const pfeilende = 275 + einwirkung*0.01
    zeichnePfeil(400, 275, 400, pfeilende)

    svg.setAttribute("height", pfeilende + 20);

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

    const beschriftungF = document.createElementNS("http://www.w3.org/2000/svg", "text");

    const höheF = Math.max((y1 + y2) / 2 + 10, 296.772)

    beschriftungF.setAttribute("x", x1 + 10);
    beschriftungF.setAttribute("y", höheF); 
    beschriftungF.textContent = "F";
    beschriftungF.setAttribute("font-size", 20); 
    beschriftungF.setAttribute("font-weight", 20);
    beschriftungF.setAttribute("fill", "red");

    svg.appendChild(beschriftungF);
    
  }
