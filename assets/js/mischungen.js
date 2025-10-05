// Suchtabelle – MISCHUNGEN (mit Rezept-Count)
(async function () {
  const qEl = document.getElementById("q");
  const mEl = document.getElementById("mix");
  const sEl = document.getElementById("sensorik");
  const pEl = document.getElementById("form");
  const tbody = document.querySelector("#tbl tbody");

  const { index, recipes } = await _DataAPI.loadMasters();
  const mixes = index.filter(r => (r.Kategorie || "").toLowerCase() === "mischungen");

  // Precompute: Rezepte pro Parent (ID_Neu → count)
  const byParentId = _DataAPI.by(recipes.filter(r => r.Parent_ID_Neu), "Parent_ID_Neu");
  // Fallback: Name → count (falls Parent_ID_Neu fehlt)
  const byParentName = _DataAPI.by(recipes, "Parent_Name");

  function recipeCountFor(row) {
    const id = row.ID_Neu || "";
    if (id && byParentId[id]) return byParentId[id].length;
    const name = row.Name || "";
    return (byParentName[name] || []).length;
  }

  function render(rows) {
    const html = rows.map(r => `
      <tr>
        <td><span class="badge">${r.ID_Neu || ""}</span></td>
        <td>${r.Name || ""}</td>
        <td>${r.Mix_Typ || ""}</td>
        <td>${r.SensorikProfil || ""}</td>
        <td>${r.PhysikalischeForm || ""}</td>
        <td>${recipeCountFor(r)}</td>
      </tr>
    `).join("");
    tbody.innerHTML = html || `<tr><td colspan="6">Keine Treffer.</td></tr>`;
  }

  function apply() {
    const q = (qEl.value || "").toLowerCase();
    const mix = mEl.value;
    const s = sEl.value;
    const p = pEl.value;

    const rows = mixes.filter(r => {
      const okQ = !q || (r.Name || "").toLowerCase().includes(q);
      const okM = !mix || (r.Mix_Typ || "") === mix;
      const okS = !s || (r.SensorikProfil || "") === s;
      const okP = !p || (r.PhysikalischeForm || "") === p;
      return okQ && okM && okS && okP;
    }).slice(0, 2000);

    render(rows);
  }

  ["input", "change"].forEach(evt => {
    qEl.addEventListener(evt, apply);
    mEl.addEventListener(evt, apply);
    sEl.addEventListener(evt, apply);
    pEl.addEventListener(evt, apply);
  });

  // initial
  render(mixes.slice(0, 200));
})();
