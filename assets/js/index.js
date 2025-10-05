// Index-Seite – KPIs + kleiner Health-Check
(async function () {
  const root = document.getElementById("kpis");
  root.innerHTML = `<span class="pill">Lade Daten…</span>`;

  try {
    const { index, recipes } = await _DataAPI.loadMasters();
    const total = index.length;
    const mixes = index.filter(r => (r.Kategorie || "").toLowerCase() === "mischungen").length;
    const stoffe = total - mixes;
    const recCount = recipes.length;

    root.innerHTML = `
      <span class="pill">Einträge gesamt: <b>${_DataAPI.fmtInt(total)}</b></span>
      <span class="pill">Stoffe: <b>${_DataAPI.fmtInt(stoffe)}</b></span>
      <span class="pill">Mischungen: <b>${_DataAPI.fmtInt(mixes)}</b></span>
      <span class="pill">Rezepte: <b>${_DataAPI.fmtInt(recCount)}</b></span>
    `;

    // Optional: Mini-Healthcheck (zeigt, ob Parent-ID-Verknüpfungen ok sind)
    const byParentId = _DataAPI.by(recipes.filter(r => r.Parent_ID_Neu), "Parent_ID_Neu");
    const orphanById = Object.keys(byParentId).filter(id => !index.find(x => x.ID_Neu === id));
    if (orphanById.length) {
      const warn = document.createElement("div");
      warn.className = "pill";
      warn.style.borderColor = "#f6c";
      warn.textContent = `Warnung: ${orphanById.length} Rezepte haben Parent_ID_Neu ohne Index-Eintrag`;
      root.appendChild(warn);
    }
  } catch (e) {
    root.innerHTML = `<span class="pill">Fehler beim Laden der Daten.</span>`;
    console.error(e);
  }
})();
