(function () {
  // Ordner relativ zur HTML
  const BASE = "assets/img/backgrounds/";

  // BG-Set 1..4 zufällig wählen (du kannst das fixen: z.B. const set=1;)
  const set = 1 + Math.floor(Math.random() * 4);

  // Device & Orientation
  const w = window.innerWidth || document.documentElement.clientWidth;
  const h = window.innerHeight || document.documentElement.clientHeight;
  const ratio = w / Math.max(1, h);
  const isPortrait = window.matchMedia && window.matchMedia("(orientation: portrait)").matches;

  // Gruppen & gewünschter Suffix
  let suffix;
  if (w < 720) {
    // Mobile
    suffix = isPortrait ? "Mobile" : "Mobile-Landscape";
  } else if (w < 1024) {
    // Tablet / iPad
    suffix = isPortrait ? "iPad-Portrait" : "iPad-Landscape";
  } else {
    // Desktop
    // 16x9 bei breitem Verhältnis, ansonsten 16x10
    suffix = (ratio >= 1.65) ? "16x9" : "16x10";
  }

  // Mögliche Fallback-Kandidaten in sinnvoller Reihenfolge
  function candidates(bgSet, suf) {
    const pre = `EinLexikonDerAromen-DuefteDerWelt_BG${bgSet}_`;
    const list = [];

    // Wunschdatei zuerst
    list.push(`${pre}${suf}.jpg`);

    // Fallback-Regeln je Gruppe
    if (suf.startsWith("Mobile")) {
      list.push(`${pre}Mobile-Landscape.jpg`, `${pre}Mobile.jpg`, `${pre}iPad-Landscape.jpg`, `${pre}iPad-Portrait.jpg`, `${pre}16x9.jpg`, `${pre}16x10.jpg`);
    } else if (suf.startsWith("iPad")) {
      list.push(`${pre}iPad-Landscape.jpg`, `${pre}iPad-Portrait.jpg`, `${pre}Mobile-Landscape.jpg`, `${pre}Mobile.jpg`, `${pre}16x9.jpg`, `${pre}16x10.jpg`);
    } else {
      // Desktop
      list.push(`${pre}16x9.jpg`, `${pre}16x10.jpg`, `${pre}iPad-Landscape.jpg`, `${pre}iPad-Portrait.jpg`, `${pre}Mobile-Landscape.jpg`, `${pre}Mobile.jpg`);
    }
    // Duplikate entfernen
    return [...new Set(list)];
  }

  const tryList = candidates(set, suffix);

  // Versuche nacheinander zu laden; setze CSS-Var, wenn eins klappt
  (function loadNext(i=0){
    if (i >= tryList.length) return; // give up silently
    const src = BASE + tryList[i];
    const img = new Image();
    img.onload = function(){
      document.documentElement.style.setProperty("--dynamic-bg", `url("${src}")`);
      document.body.style.backgroundImage = `var(--dynamic-bg)`;
    };
    img.onerror = function(){ loadNext(i+1); };
    img.src = src;
  })();
})();
