// Rezept-Detailansicht (lädt nach URL-Parameter ?id=Rezept-xxxx)
(async function () {
  const params = new URLSearchParams(window.location.search);
  const rid = params.get("id");
  const { index, recipes } = await _DataAPI.loadMasters();

  if (!rid) {
    document.getElementById("title").textContent = "Kein Rezept ausgewählt";
    return;
  }

  // Suche das Rezept
  const rec = recipes.find(r => (r.Rezept_ID || "").trim() === rid);
  if (!rec) {
    document.getElementById("title").textContent = "Rezept nicht gefunden";
    return;
  }

  const parentName = rec.Parent_Name || "Unbekannt";
  const variantName = rec.Variant_Name || "";
  const fullTitle = variantName && variantName !== parentName ? `${parentName} – ${variantName}` : parentName;
  document.getElementById("title").textContent = fullTitle;
  document.getElementById("subtitle").textContent = rid;

  // Illustration laden, falls vorhanden
  const illu = rec.Illu_Variant_Path || rec.Illu_Path || "";
  if (illu) {
    const img = document.getElementById("illu");
    img.src = illu;
    document.getElementById("illu-card").style.display = "block";
  }

  // Zutatenliste aufbauen
  const zutatenTbody = document.querySelector("#zutaten tbody");
  const zutatCols = Object.keys(rec).filter(k => /^Zutat/i.test(k));
  if (zutatCols.length === 0) {
    zutatenTbody.innerHTML = `<tr><td colspan="2">Keine Angaben vorhanden.</td></tr>`;
  } else {
    zutatenTbody.innerHTML = zutatCols.map(k => {
      const mengeKey = k.replace(/Zutat/i, "Menge");
      const menge = rec[mengeKey] || "";
      return `<tr><td>${rec[k]}</td><td>${menge}</td></tr>`;
    }).join("");
  }

  // Metadatenblock
  const metaFields = [
    ["Parent_ID_Neu", "Parent-ID"],
    ["Mix_Typ", "Mix-Typ"],
    ["SensorikProfil", "Sensorik"],
    ["PhysikalischeForm", "Form"],
    ["Parent_Name", "Übergeordnete Mischung"]
  ];
  const metaHTML = metaFields.map(([f,label]) => {
    if (!rec[f]) return "";
    return `<b>${label}:</b> ${rec[f]}<br>`;
  }).join("");
  document.getElementById("meta-info").innerHTML = metaHTML || "Keine Metadaten verfügbar.";

})();
