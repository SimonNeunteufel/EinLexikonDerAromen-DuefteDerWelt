// mischungen.js – Suchtabelle für Mischungen inkl. "Rezept"-Button

(async function () {
  // UI-Elemente
  const qEl  = document.getElementById("q");
  const mEl  = document.getElementById("mix");
  const sEl  = document.getElementById("sensorik");
  const pEl  = document.getElementById("form");
  const btn  = document.getElementById("btnSearch");
  const tbody = document.querySelector("#tbl tbody");

  // Daten laden
  const { index, recipes } = await _DataAPI.loadMasters();
  const mixes = index.filter(r => (r.Kategorie || "").toLowerCase() === "mischungen");

  // Auswahlfelder befüllen
  const mixOptions = ["", "M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12","M13"];
  const sensOptions = ["", "S1","S2","S3","S4","S5"];
  const formOptions = ["", "P1","P2","P3","P4","P5"];

  mEl.innerHTML = mixOptions.map(v => v ? `<option>${v}</option>` : `<option value="">Mix-Typ</option>`).join("");
  sEl.innerHTML = sensOptions.map(v => v ? `<option>${v}</option>` : `<option value="">Sensorik</option>`).join("");
  pEl.innerHTML = formOptions.map(v => v ? `<option>${v}</option>` : `<option value="">Form</option>`).join("");

  // Precompute: Rezepte gruppiert → Counts + erste Rezept-ID je Parent
  const byParentId   = _DataAPI.by(recipes.filter(r => r.Parent_ID_Neu), "Parent_ID_Neu");
  const byParentName = _DataAPI.by(recipes, "Parent_Name");

  function recipeCountFor(row) {
    const id = row.ID_Neu || "";
    if (id && byParentId[id]) return byParentId[id].length;
    const name = row.Name || "";
    return (byParentName[name] || []).length;
  }

  function firstRecipeIdFor(row) {
    const id = row.ID_Neu || "";
    if (id && byParentId[id] && byParentId[id][0]) return byParentId[id][0].Rezept_ID || "";
    const name = row.Name || "";
    const arr = byParentName[name] || [];
    return arr[0]?.Rezept_ID || "";
  }

  function render(rows) {
    const html = rows.map(r => {
      const rid = firstRecipeIdFor(r);
      const nameCell = `
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span>${r.Name || ""}</span>
          ${rid ? `
            <a href="recipe_view.html?id=${encodeURIComponent(rid)}" title="Zum Rezept">
              <button class="search-btn" style="padding:4px 8px;font-size:12px;">Rezept</button>
            </a>` : ""}
        </div>`;

      return `
        <tr>
          <td><span class="badge">${r.ID_Neu || ""}</span></td>
          <td>${nameCell}</td>
          <td>${r.Mix_Typ || ""}</td>
          <td>${r.SensorikProfil || ""}</td