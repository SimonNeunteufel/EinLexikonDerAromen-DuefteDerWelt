// Lexika Bänder – Gruppierung & Anzeige
(async function () {
  const tblBody = document.querySelector("#tbl tbody");
  tblBody.innerHTML = `<tr><td colspan="2">Lade…</td></tr>`;

  try {
    const { index } = await _DataAPI.loadMasters();
    const bandKey = index[0] && Object.keys(index[0]).find(k => /band|band\s*ref/i.test(k)) || null;

    const counts = {};
    index.forEach(r => {
      const b = bandKey ? (r[bandKey] || "Unbekannt") : "Band 27";
      counts[b] = (counts[b] || 0) + 1;
    });

    const rows = Object.entries(counts)
      .sort((a,b)=> String(a[0]).localeCompare(String(b[0]), "de"))
      .map(([band, n]) => `<tr><td>${band}</td><td>${_DataAPI.fmtInt(n)}</td></tr>`)
      .join("");

    tblBody.innerHTML = rows || `<tr><td colspan="2">Keine Daten gefunden.</td></tr>`;
  } catch (e) {
    console.error(e);
    tblBody.innerHTML = `<tr><td colspan="2">Fehler beim Laden.</td></tr>`;
  }
})();
