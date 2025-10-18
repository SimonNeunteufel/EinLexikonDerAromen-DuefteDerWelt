
(async () => {
  const {loadJSON, safe, debounce} = window.$util;
  const data = await loadJSON("./data/master_recipes.json");

  // Columns to display (hide technical IDs). Include a selection checkbox column.
  const keys = Object.keys(data[0]||{});
  const hiddenSubs = ["id","id_neu","recipe_id","rezept_id","parent_id","parent_id_neu","parent_mix","qr-id","illu-id","qr_id","illu_id"];
  const showCols = ["Mix_Name","Kategorie","Mix_Typ","SensorikProfil","PhysikalischeForm","Region","Land","Quelle","Source"]
    .filter(c => keys.includes(c));
  const thead = document.querySelector("#tbl thead");
  thead.innerHTML = "<tr><th><input type='checkbox' id='headSelect'></th>" + showCols.map(c=>`<th>${c}</th>`).join("") + "</tr>";

  // Map S/P/M codes to text (short version for table)
  const mapS = {S1:"sauer",S2:"süß",S3:"bitter",S4:"scharf",S5:"neutral/umami"};
  const mapP = {P1:"Pulver",P2:"Paste",P3:"Öl/Infusion",P4:"Harz/Granulat",P5:"Hybrid"};
  function mapM(v){
    const m = String(v||"").match(/^M(\d{1,2})/i);
    if(!m) return v||"";
    const n = +m[1];
    const names = {
      1:"Gewürzmischungen",2:"Kräuter-/Würzsalze",3:"Öl/Essig/Fett-Infusionen",4:"Süß-/Dessert-Mischungen",
      5:"Fermentierte Mischungen & Pasten",6:"Räucher-/Harzmischungen",7:"Spirituosen & Bar",
      8:"Parfüm & Sensorik",9:"Hybrid-Mischungen",10:"Rituell & ethnobotanisch",11:"Bar-/Pharma-Aromen & Bitterstoffe",
      12:"Technisch/regulatorisch",13:"Experimentell/interdisziplinär"
    };
    return names[n] ? `M${n} – ${names[n]}` : v;
  }

  const tbody = document.querySelector("#tbl tbody");

  function rowId(r){
    return r["ID_Neu"] || r["Recipe_ID"] || r["Rezept_ID"] || r["id"] || "";
  }

  function render(rows){
    tbody.innerHTML = rows.map(r => {
      const rid = rowId(r);
      const cells = showCols.map(c => {
        let val = safe(r[c]);
        if(c==="SensorikProfil" && mapS[val]) val = mapS[val];
        if(c==="PhysikalischeForm" && mapP[val]) val = mapP[val];
        if(c==="Mix_Typ") val = mapM(val);
        return `<td>${val}</td>`;
      }).join("");
      return `<tr data-id="${rid}"><td><input class="sel" type="checkbox" data-id="${rid}"></td>${cells}</tr>`;
    }).join("");
  }

  // initial
  render(data);

  // Filtering
  const q = document.getElementById("q");
  const sFilter = document.getElementById("sFilter");
  const pFilter = document.getElementById("pFilter");

  function applyFilter(){
    const s = q.value.trim().toLowerCase();
    const sCode = sFilter.value;
    const pCode = pFilter.value;

    const filtered = data.filter(r => {
      const okText = !s || Object.values(r).some(v => (safe(v)+"").toLowerCase().includes(s));
      const okS = !sCode || r["SensorikProfil"] === sCode;
      const okP = !pCode || r["PhysikalischeForm"] === pCode;
      return okText && okS && okP;
    });
    render(filtered);
  }
  q.addEventListener("input", debounce(applyFilter, 200));
  sFilter.addEventListener("change", applyFilter);
  pFilter.addEventListener("change", applyFilter);

  // Select all
  const headSelect = document.getElementById("headSelect");
  const selectAll = document.getElementById("selectAll");
  function setAll(checked){
    document.querySelectorAll("input.sel").forEach(ch => ch.checked = checked);
  }
  headSelect?.addEventListener("change", e => setAll(e.target.checked));
  selectAll?.addEventListener("change", e => setAll(e.target.checked));

  // Build links for selected IDs
  function selectedIds(){
    const ids = [];
    document.querySelectorAll("input.sel:checked").forEach(ch => ids.push(ch.getAttribute("data-id")));
    return ids.filter(Boolean);
  }

  document.getElementById("btnHtml").addEventListener("click", () => {
    const ids = selectedIds();
    if(!ids.length){ alert("Bitte mindestens eine Mischung auswählen."); return; }
    const url = `./recipes/recipes.html?ids=${encodeURIComponent(ids.join(","))}`;
    window.open(url, "_blank");
  });

  document.getElementById("btnPdf").addEventListener("click", () => {
    const ids = selectedIds();
    if(!ids.length){ alert("Bitte mindestens eine Mischung auswählen."); return; }
    const url = `./recipes/recipes.html?ids=${encodeURIComponent(ids.join(","))}&print=1`;
    window.open(url, "_blank");
  });
})();
