
(async()=>{
  const {loadJSON,safe,debounce}=window.$util;
  const data=await loadJSON("../data/master_recipes.json");
  const keys=Object.keys(data[0]||{});
  const show=["Mix_Name","Kategorie","Mix_Typ","SensorikProfil","PhysikalischeForm","Region","Land","Quelle","Source"].filter(c=>keys.includes(c));
  const thead=document.querySelector("#tbl thead");
  thead.innerHTML="<tr><th><input type='checkbox' id='headSelect'></th>"+show.map(c=>`<th>${c}</th>`).join("")+"</tr>";
  const tbody=document.querySelector("#tbl tbody");
  function rowId(r){
  return r.MIX_ID       // neue Haupt-ID aus MasterRecipes
      || r.ID_Neu
      || r.Recipe_ID
      || r.Rezept_ID
      || r.id
      || "";
}

  const mapS={S1:"sauer",S2:"süß",S3:"bitter",S4:"scharf",S5:"neutral/umami"};
  const mapP={P1:"Pulver",P2:"Paste",P3:"Öl/Infusion",P4:"Harz/Granulat",P5:"Hybrid"};
  function mapM(v){const m=String(v||"").match(/^M(\d{1,2})/i);if(!m)return v||"";const n=+m[1];const names={1:"Gewürzmischungen",2:"Kräuter-/Würzsalze",3:"Öl/Essig/Fett-Infusionen",4:"Süß-/Dessert-Mischungen",5:"Fermentierte Mischungen & Pasten",6:"Räucher-/Harzmischungen",7:"Spirituosen & Bar",8:"Parfüm & Sensorik",9:"Hybrid-Mischungen",10:"Rituell & ethnobotanisch",11:"Bar-/Pharma-Aromen & Bitterstoffe",12:"Technisch/regulatorisch",13:"Experimentell/interdisziplinär"};return names[n]?`M${n} – ${names[n]}`:v}
  function render(rows){
    tbody.innerHTML=rows.map(r=>{
      const rid=rowId(r);
      const cells=show.map(c=>{let val=safe(r[c]); if(c==="SensorikProfil"&&mapS[val]) val=mapS[val]; if(c==="PhysikalischeForm"&&mapP[val]) val=mapP[val]; if(c==="Mix_Typ") val=mapM(val); return `<td>${val}</td>`;}).join("");
      return `<tr data-id="${rid}"><td><input class="sel" type="checkbox" data-id="${rid}"></td>${cells}</tr>`;
    }).join("");
  }
  render(data);
  const q=document.getElementById("q"), sF=document.getElementById("sFilter"), pF=document.getElementById("pFilter");
  function apply(){const s=q.value.trim().toLowerCase(); const sCode=sF.value; const pCode=pF.value;
    const f=data.filter(r=>{const okT=!s||Object.values(r).some(v=>(safe(v)+"").toLowerCase().includes(s)); const okS=!sCode||r["SensorikProfil"]===sCode; const okP=!pCode||r["PhysikalischeForm"]===pCode; return okT&&okS&&okP;}); render(f);}
  q.addEventListener("input",debounce(apply,200)); sF.addEventListener("change",apply); pF.addEventListener("change",apply);
  function setAll(c){ document.querySelectorAll("input.sel").forEach(x=>x.checked=c); }
  const head=document.getElementById("headSelect"), all=document.getElementById("selectAll");
  head&&head.addEventListener("change",e=>setAll(e.target.checked)); all&&all.addEventListener("change",e=>setAll(e.target.checked));
  function selected(){ const a=[]; document.querySelectorAll("input.sel:checked").forEach(ch=>a.push(ch.getAttribute("data-id"))); return a.filter(Boolean); }
  document.getElementById("btnHtml").addEventListener("click",()=>{ const ids=selected(); if(!ids.length){ alert('Bitte mindestens eine Mischung auswählen.'); return; } window.open(`./mischung_rezepte.html?ids=${encodeURIComponent(ids.join(","))}`,"_blank"); });
  document.getElementById("btnPdf").addEventListener("click",()=>{ const ids=selected(); if(!ids.length){ alert('Bitte mindestens eine Mischung auswählen.'); return; } window.open(`./mischung_rezepte.html?ids=${encodeURIComponent(ids.join(","))}&print=1`,"_blank"); });
})();