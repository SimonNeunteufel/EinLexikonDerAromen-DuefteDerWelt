<script>
/** Simple CSV loader for ; -delimited files (no heavy libs) */
async function loadCSV(path, delimiter=";"){
  const res = await fetch(path);
  const txt = await res.text();
  const lines = txt.replace(/\r/g,"").split("\n").filter(Boolean);
  const headers = lines[0].split(delimiter).map(h=>h.trim());
  return lines.slice(1).map(line=>{
    // naive split; works because delimiter = ; and your fields are unquoted
    const cells = line.split(delimiter);
    const row = {};
    headers.forEach((h,i)=> row[h] = (cells[i] ?? "").trim());
    return row;
  });
}

function uniq(arr){ return [...new Set(arr)]; }
function by(arr, key){ return arr.reduce((m, r)=>{ const k=r[key]||""; (m[k]=m[k]||[]).push(r); return m; },{}); }
function fmtInt(n){ return Number(n||0).toLocaleString(); }

async function loadMasters(){
  const [idx, rec] = await Promise.all([
    loadCSV("data/MasterIndex_v2.csv"),
    loadCSV("data/MasterRecipes_v2.csv")
  ]);
  return {index: idx, recipes: rec};
}

// tiny helper for filters
function filterRows(rows, preds){ 
  return rows.filter(r=> preds.every(fn=> fn(r)));
}

window._DataAPI = { loadCSV, loadMasters, uniq, by, filterRows, fmtInt };
</script>
