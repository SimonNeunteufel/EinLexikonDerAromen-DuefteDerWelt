// stoffe.js – Suchtabelle für Grundstoffe (mit Klartext-Codes, ohne ID)

(async function () {
  const qEl  = document.getElementById("q");
  const katEl= document.getElementById("kat");
  const sEl  = document.getElementById("sensorik");
  const pEl  = document.getElementById("form");
  const btn  = document.getElementById("btnSearch");
  const tbody= document.querySelector("#tbl tbody");

  const { index } = await _DataAPI.loadMasters();
  const stoffe = index.filter(r => (r.Kategorie || "").toLowerCase() !== "mischungen");

  // Klartext-Mappings (wie oben)
  const mapSens = {S1:"scharf", S2:"süss", S3:"bitter", S4:"säuerlich", S5:"neutral"};
  const mapPhys = {P1:"Pulver", P2:"Paste", P3:"Öl", P4:"Essenz", P5:"Kristallisch"};

  // Kategorien
  const cats = _DataAPI.uniq(stoffe.map(r => r.Kategorie).filter(Boolean)).sort();
  katEl.innerHTML = `<option value="">Kategorie</option>` +
    cats.map(c=>`<option>${c}</option>`).join("");
  sEl.innerHTML = `<option value="">Sensorik</option>` +
    Object.entries(mapSens).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
  pEl.innerHTML = `<option value="">Form</option>` +
    Object.entries(mapPhys).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");

  function render(rows){
    const html = rows.map(r=>`
      <tr>
        <td>${r.Name || ""}</td>
        <td>${r.Kategorie || ""}</td>
        <td>${mapSens[r.SensorikProfil] || r.SensorikProfil || ""}</td>
        <td>${mapPhys[r.PhysikalischeForm] || r.PhysikalischeForm || ""}</td>
      </tr>`).join("");
    tbody.innerHTML = html || `<tr><td colspan="4">Keine Treffer.</td></tr>`;
  }

  function apply(){
    const q=(qEl.value||"").toLowerCase();
    const kat=katEl.value, s=sEl.value, p=pEl.value;
    const rows = stoffe.filter(r=>{
      const okQ=!q||(r.Name||"").toLowerCase().includes(q);
      const okK=!kat||r.Kategorie===kat;
      const okS=!s||r.SensorikProfil===s;
      const okP=!p||r.PhysikalischeForm===p;
      return okQ && okK && okS && okP;
    }).slice(0,2000);
    render(rows);
  }

  ["input","change"].forEach(evt=>{
    qEl.addEventListener(evt,apply);
    katEl.addEventListener(evt,apply);
    sEl.addEventListener(evt,apply);
    pEl.addEventListener(evt,apply);
  });
  btn.addEventListener("click",apply);
  qEl.addEventListener("keypress",e=>{if(e.key==="Enter"){e.preventDefault();apply();}});

  render(stoffe.slice(0,200));
})();