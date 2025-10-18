
window.$util={
  async loadText(p){const r=await fetch(p,{cache:'no-store'});if(!r.ok) throw new Error(p);return r.text();},
  async loadCSV(p){
    const t=await this.loadText(p);
    // simple CSV parser (handles quoted commas)
    const lines=t.split(/\r?\n/).filter(x=>x.trim().length);
    const head=lines.shift().split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(h=>h.trim().replace(/^"|"$/g,''));
    return lines.map(row=>{
      const cells=row.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(c=>c.trim().replace(/^"|"$/g,''));
      const obj={}; head.forEach((h,i)=>obj[h]=cells[i]||""); return obj;
    });
  },
  debounce(fn,ms=250){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}},
  safe(v){return(v==null||v===undefined)?'':v}
};
