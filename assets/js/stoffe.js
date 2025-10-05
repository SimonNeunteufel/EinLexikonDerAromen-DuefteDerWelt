// Suchtabelle – STOFFE (alles außer Mischungen)
(async function () {
  const qEl = document.getElementById("q");
  const katEl = document.getElementById("kat");
  const sEl = document.getElementById("sensorik");
  const pEl = document.getElementById("form");
  const tbody = document.querySelector("#tbl tbody");

  const { index } = await _DataAPI.loadMasters();
  const stoffe = index.filter(r => (r.Kategorie || "").toLowerCase() !== "mischungen");

  // Kategorien auffüllen
  const cats = _DataAPI.uniq(stoffe.map(r => r.Kategorie).filter(Boolean)).sort();
  katEl.innerHTML = `<option value="">Kategorie</option>` + cats.map(c => `<option>${c}</option>`).join("");

  function render(rows) {
    const html = rows.map(r => `
      <tr>
        <td><span class="badge">${r.ID_Neu || ""}</span></td>
        <td>${r.Name || ""}</td>
        <td>${r.Kategorie || ""}</td>
        <td>${r.SensorikProfil || ""}</td>
        <td>${r.PhysikalischeForm || ""}</td>
      </tr>
    `).join("");
    tbody.innerHTML = html || `<tr><td colspan="5">Keine Treffer.</td></tr>`;
  }

  function apply() {
    const q = (qEl.value || "").toLowerCase();
    const kat = katEl.value;
    const s = sEl.value;
    const p = pEl.value;

    const rows = stoffe.filter(r => {
      const okQ = !q || (r.Name || "").toLowerCase().includes(q);
      const okK = !kat || r.Kategorie === kat;
      const okS = !s || (r.SensorikProfil || "") === s;
      const okP = !p || (r.PhysikalischeForm || "") === p;
      return okQ && okK && okS && okP;
    }).slice(0, 2000);

    render(rows);
  }

  ["input", "change"].forEach(evt => {
    qEl.addEventListener(evt, apply);
    katEl.addEventListener(evt, apply);
    sEl.addEventListener(evt, apply);
    pEl.addEventListener(evt, apply);
  });

  // initial
  render(stoffe.slice(0, 200));
  // Button bind
document.getElementById("btnSearch").addEventListener("click", apply);

// Enter-Taste triggert Suche
document.getElementById("q").addEventListener("keypress", e=>{
  if(e.key==="Enter"){ e.preventDefault(); apply(); }
});

})();
