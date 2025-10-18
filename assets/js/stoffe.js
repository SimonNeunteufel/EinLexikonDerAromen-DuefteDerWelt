
(async()=>{
  const {loadJSON,safe,debounce}=window.$util;
  const data=await loadJSON("../data/master_index.json");
  const keys=Object.keys(data[0]||{});
  const show=["Name","Kategorie","EntityType","Region","Land","Kontinent","SensorikProfil","PhysikalischeForm","Quelle","Status","Priorität"].filter(c=>keys.includes(c));
  const thead=document.querySelector("#tbl thead");
  thead.innerHTML="<tr><th><input type='checkbox' id='headSelect'></th>"+show.map(c=>`<th>${c}</th>`).join("")+"</tr>";
  const tbody=document.querySelector("#tbl tbody");
  const info=document.getElementById("selectionInfo");
  function rowId(r){return r.ID_Neu||r.id||r.Rezept_ID||r.Recipe_ID||""}
  function rowName(r){return r.Name||r["Lateinischer Name/Typ"]||rowId(r)||"(ohne Name)"}
  function render(rows){
    tbody.innerHTML=rows.map(r=>{
      const rid=rowId(r);
      const cells=show.map(c=>`<td>${safe(r[c])}</td>`).join("");
      return `<tr data-id="${rid}"><td><input class="sel" type="checkbox" data-id="${rid}" data-name="${safe(rowName(r))}"></td>${cells}</tr>`;
    }).join("");
    updateInfo();
  }
  render(data);
  const q=document.getElementById("q");
  const doFilter=debounce(()=>{
    const s=q.value.trim().toLowerCase();
    const filtered=!s?data:data.filter(r=>Object.values(r).some(v=>(safe(v)+"").toLowerCase().includes(s)));
    render(filtered);
  },200);
  q.addEventListener("input",doFilter);
  function selected(){ const arr=[]; document.querySelectorAll("input.sel:checked").forEach(ch=>arr.push({id:ch.getAttribute("data-id"),name:ch.getAttribute("data-name")})); return arr; }
  function updateInfo(){ const arr=selected(); info.innerHTML=arr.map(x=>`<span class="badge">${x.name}</span>`).join(""); }
  document.addEventListener("change",e=>{ if(e.target.classList.contains("sel")) updateInfo(); });
  const head=document.getElementById("headSelect"); const all=document.getElementById("selectAll");
  function setAll(c){ document.querySelectorAll("input.sel").forEach(x=>x.checked=c); updateInfo(); }
  head&&head.addEventListener("change",e=>setAll(e.target.checked)); all&&all.addEventListener("change",e=>setAll(e.target.checked));
  function idsParam(){ return encodeURIComponent(selected().map(x=>x.id).filter(Boolean).join(",")); }
  document.getElementById("btnHtml").addEventListener("click",()=>{
    const p=idsParam(); if(!p){ alert("Bitte mindestens einen Stoff auswählen."); return; }
    window.open(`./stoff_datasheet.html?ids=${p}`,"_blank");
  });
  document.getElementById("btnPdf").addEventListener("click",()=>{
    const p=idsParam(); if(!p){ alert("Bitte mindestens einen Stoff auswählen."); return; }
    window.open(`./stoff_datasheet.html?ids=${p}&print=1`,"_blank");
  });
})();