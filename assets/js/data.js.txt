<script>
/* Lädt direkt MasterIndex.csv & MasterRecipes.csv */
async function loadCSV(path, delimiter=";"){
  const res = await fetch(path);
  if (!res.ok) throw new Error(`404 for ${path}`);
  const txt0 = await res.text();
  const txt = txt0.replace(/^\uFEFF/, "").replace(/\r/g,"");
  const lines = txt.split("\n").filter(l => l.trim().length);
  const headers = lines[0].split(delimiter).map(h=>h.trim());
  return lines.slice(1).map(line=>{
    const cells = line.split(delimiter);
    const row = {};
    headers.forEach((h,i)=> row[h] = (cells[i] ?? "").trim());
    return row;
  });
}

async function loadMasters(){
  const [idx, rec] = await Promise.all([
    loadCSV("data/MasterIndex.csv"),
    loadCSV("data/MasterRecipes.csv")
  ]);
  console.log("✅ MasterIndex:", idx.length, "Datensätze");
  console.log("✅ MasterRecipes:", rec.length, "Rezepte");
  return { index: idx, recipes: rec };
}

function uniq(arr){ return [...new Set(arr)]; }
function by(arr, key){ return arr.reduce((m, r)=>{ const k=r[key]||""; (m[k]=m[k]||[]).push(r); return m; },{}); }
function filterRows(rows, preds){ return rows.filter(r=> preds.every(fn=> fn(r))); }
function fmtInt(n){ return Number(n||0).toLocaleString("de"); }

window._DataAPI = { loadCSV, loadMasters, uniq, by, filterRows, fmtInt };
</script>
