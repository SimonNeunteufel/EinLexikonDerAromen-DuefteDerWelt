
(async () => {
  const {loadJSON, safe, debounce} = window.$util;
  const data = await loadJSON("./data/master_index.json");

  // dynamic columns minus IDs
  const keys = Object.keys(data[0]||{});
  const hidden = ["id","id_neu","recipe_id","rezept_id","parent_id","parent_id_neu","parent_mix","qr-id","illu-id","qr_id","illu_id"];
  const columns = keys.filter(k => !hidden.some(h=>k.toLowerCase().includes(h)));

  const thead = document.querySelector("#tbl thead");
  thead.innerHTML = "<tr>" + columns.map(c=>`<th>${c}</th>`).join("") + "</tr>";

  const tbody = document.querySelector("#tbl tbody");
  function render(rows){
    tbody.innerHTML = rows.map(r =>
      "<tr>"+columns.map(c=>`<td>${safe(r[c])}</td>`).join("")+"</tr>"
    ).join("");
  }
  render(data);

  const input = document.getElementById("q");
  const doFilter = debounce(() => {
    const s = input.value.trim().toLowerCase();
    if(!s){ render(data); return; }
    const filtered = data.filter(r =>
      columns.some(c => (safe(r[c]).toString().toLowerCase()).includes(s))
    );
    render(filtered);
  }, 200);
  input.addEventListener("input", doFilter);
})();
