
(() => {
  const bands = [{'id': 'band0', 'num': 0, 'title': 'Einleitung & Grundlagen'}, {'id': 'band1', 'num': 1, 'title': 'Aromen – Überblick & Geschichte'}, {'id': 'band2', 'num': 2, 'title': 'Gewürze & Kräuter – Kernauswahl'}, {'id': 'band3', 'num': 3, 'title': 'Mischungen – Klassisch bis Modern'}];
  const select = document.getElementById("bandSelect");
  const toHtmlBtn = document.getElementById("openHtml");
  const toPdfBtn = document.getElementById("openPdf");

  function label(b){ return `Band ${b.num} — ${b.title}`; }

  bands.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.id; opt.textContent = label(b);
    select.appendChild(opt);
  });

  function currentBand(){ return bands.find(b => b.id === select.value); }

  toHtmlBtn.addEventListener("click", () => {
    const b = currentBand(); if(!b) return;
    location.href = `./bands/${b.id}.html`;
  });

  toPdfBtn.addEventListener("click", () => {
    const b = currentBand(); if(!b) return;
    window.open(`./data/pdfs/${b.id}.pdf`, "_blank");
  });
})();
