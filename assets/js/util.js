
window.$util={
  async tryPaths(paths, loader){
    const errors=[];
    for(const p of paths){
      try{ return await loader(p); }catch(e){ errors.push(p); }
    }
    const err = new Error("Alle Ladeversuche fehlgeschlagen: "+errors.join(", "));
    err._paths = errors;
    throw err;
  },
  async fetchText(p){
    const r = await fetch(p, {cache: 'no-store'});
    if(!r.ok) throw new Error("HTTP "+r.status+" "+p);
    return await r.text();
  },
  parseCSV(text){
    const lines=text.split(/\r?\n/).filter(x=>x.trim().length);
    if(lines.length===0) return [];
    const head=lines.shift().split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(h=>h.trim().replace(/^"|"$/g,''));
    return lines.map(row=>{
      const cells=row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c=>c.trim().replace(/^"|"$/g,''));
      const obj={}; head.forEach((h,i)=>obj[h]=cells[i]||""); return obj;
    });
  },
  async loadCSV(p){ const t = await this.fetchText(p); return this.parseCSV(t); },
  async loadJSON(p){ const t = await this.fetchText(p); return JSON.parse(t); },
  debounce(fn,ms=250){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)};},
  safe(v){return(v==null||v===undefined)?'':v},
  async loadIndexAny(){
    const csvCandidates = ['./data/MasterIndex.csv','./data/masterindex.csv','./data/master_index.csv','./data/masterIndex.csv'];
    const jsonCandidates = ['./data/master_index.json','./data/MasterIndex.json'];
    try{ return await this.tryPaths(csvCandidates, p=>this.loadCSV(p)); }
    catch(_){ return await this.tryPaths(jsonCandidates, p=>this.loadJSON(p)); }
  },
  async loadRecipesAny(){
    const csvCandidates = ['./data/MasterRecipes.csv','./data/masterrecipes.csv','./data/master_recipes.csv','./data/masterRecipes.csv'];
    const jsonCandidates = ['./data/master_recipes.json','./data/MasterRecipes.json'];
    try{ return await this.tryPaths(csvCandidates, p=>this.loadCSV(p)); }
    catch(_){ return await this.tryPaths(jsonCandidates, p=>this.loadJSON(p)); }
  },
  showError(msg){
    let el=document.getElementById("errorBanner");
    if(!el){
      el=document.createElement("div");
      el.id="errorBanner";
      el.style.cssText="position:sticky;top:0;z-index:999;background:#fee;border:1px solid #f99;color:#600;padding:10px;border-radius:10px;margin:8px 0;";
      const page=document.querySelector(".page"); page?.insertBefore(el,page.firstChild.nextSibling);
    }
    el.innerHTML = msg;
  }
};
