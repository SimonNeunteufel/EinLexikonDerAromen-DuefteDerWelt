// mischungen.js – Suchtabelle für Mischungen (mit Klartext-Codes, ohne ID-Spalte)

(async function () {
  const qEl  = document.getElementById("q");
  const mEl  = document.getElementById("mix");
  const sEl  = document.getElementById("sensorik");
  const pEl  = document.getElementById("form");
  const btn  = document.getElementById("btnSearch");
  const tbody = document.querySelector("#tbl tbody");

  const { index, recipes } = await _DataAPI.loadMasters();
  const mixes = index.filter(r => (r.Kategorie || "").toLowerCase() === "mischungen");

  // Code-Mappings
  const mapMix = {
    M1:"Scharfe Mischung", M2:"Süsse Mischung", M3:"Saure Mischung", 
    M4:"Bittere Mischung", M5:"Neutrale Mischung", M6:"Räuchermischung",
    M7:"Würzmischung", M8:"Kräutermischung", M9:"Salzmischung",
    M10:"Ölmischung", M11:"Teemischung", M12:"Harzmischung", M13:"Fruchtmischung"
  };
  const mapSens = {S1:"scharf", S2:"süss", S3:"bitter", S4:"säuerlich", S5:"neutral"};
  const mapPhys = {P1:"Pulver", P2:"Paste", P3:"Öl", P4:"Essenz", P5:"Kristallisch"};

  // Dropdowns befüllen
  mEl.innerHTML = `<option value="">Mischungstyp</option>` +
    Object.entries(mapMix).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
  sEl.innerHTML = `<option value="">Sensorik</option>` +
    Object.entries(mapSens).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
  pEl.innerHTML = `<option value="">Form</option>` +
    Object.entries(mapPhys).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");

  const byParentId = _DataAPI.by(recipes.filter(r => r.Parent_ID_Neu), "Parent_ID_Neu");
  const byParentName = _DataAPI.by(recipes, "Parent_Name");

  function recipeCountFor(row){
    const id=row.ID_Neu||"", name=row.Name||"";
    if(id && byParentId[id]) return byParentId[id].length;
    return (byParentName[name]||[]).length;
  }
  function firstRecipeIdFor(row){
    const id=row.ID_Neu||"", name=row.Name||"";
    if(id && byParentId[id] && byParentId[id][0]) return byParentId[id][0].Rezept_ID||"";
    const arr=byParentName[name]||[];
    return arr[0]?.Rezept_ID||"";
  }

  function render(rows){
    const html = rows.map(r=>{
      const rid=firstRecipeIdFor(r);
      return `
        <tr>
          <td>${r.Name || ""}</td>
          <td>${mapMix[r.Mix_Typ] || r.Mix_Typ || ""}</td>
          <td>${mapSens[r.SensorikProfil] || r.SensorikProfil || ""}</td>
          <td>${mapPhys[r.PhysikalischeForm] || r.PhysikalischeForm || ""}</td>
          <td>${_DataAPI.fmtInt(recipeCountFor(r))}</td>
          <td>${
            rid ? `<a href="recipe_view.html?id=${encodeURIComponent(rid)}">
                      <button class="search-btn" style="padding:4px 8px;font-size:12px;">Rezept</button>
                    </a>` : ""
          }</td>
        </tr>`;
    }).join("");
    tbody.innerHTML = html || `<tr><td colspan="6">Keine Treffer.</td></tr>`;
  }

  function apply(){
    const q=(qEl.value||"").toLowerCase();
    const mix=mEl.value, s=sEl.value, p=pEl.value;
    const rows = mixes.filter(r=>{
      const okQ=!q||(r.Name||"").toLowerCase().includes(q);
      const okM=!mix||r.Mix_Typ===mix;
      const okS=!s||r.SensorikProfil===s;
      const okP=!p||r.PhysikalischeForm===p;
      return okQ && okM && okS && okP;
    }).slice(0,2000);
    render(rows);
  }

  ["input","change"].forEach(evt=>{
    qEl.addEventListener(evt,apply);
    mEl.addEventListener(evt,apply);
    sEl.addEventListener(evt,apply);
    pEl.addEventListener(evt,apply);
  });
  btn.addEventListener("click",apply);
  qEl.addEventListener("keypress",e=>{if(e.key==="Enter"){e.preventDefault();apply();}});

  render(mixes.slice(0,200));
})();