// assets/js/mischungen.js
(async () => {
  // --- Daten laden ---------------------------------------------------------
  let data = [];
  try {
    // zentrale Loader-Funktion aus util.js
    data = await window.$util.loadRecipes();
  } catch (e) {
    window.$util.err(
      'Daten konnten nicht geladen werden. ' +
      'Lege <code>MasterRecipes.csv</code> oder <code>master_recipes.json</code> ' +
      'in <code>/data/</code> oder <code>/assets/data/</code> ab.'
    );
    return;
  }

  if (!data.length) {
    window.$util.err('Keine Mischungsdaten gefunden.');
    return;
  }

  const S = window.$util.safe;

  // --- Spaltenanalyse ------------------------------------------------------
  const keys = Object.keys(data[0] || {});

  const findCol = (candidates) =>
    candidates.find(c => keys.includes(c)) || null;

  // robuste ID-Erkennung (MIX_ID, Mix_ID, Mix ID, id, …)
  const MIX_ID_KEY =
    keys.find(k => /mix[_\s\-]*id/i.test(k)) ||   // MIX_ID, Mix_ID, MIX ID
    keys.find(k => /^id$/i.test(k)) ||            // Fallback: id
    null;

  // ID aus Datensatz extrahieren
  function getId(row) {
    return (MIX_ID_KEY && row[MIX_ID_KEY]) ||
           row.MIX_ID ||
           row.ID_Neu ||
           row.Recipe_ID ||
           row.Rezept_ID ||
           row.id ||
           '';
  }

  // Anzeige-Spalten
  const COL = {
    id:       MIX_ID_KEY || findCol(['MIX_ID','Mix_ID','ID_Neu','Recipe_ID','Rezept_ID','id']),
    name:     findCol(['Mix_Name','Mischungsname','Mischung_Name','Name']),
    origin:   findCol(['Herkunft','Region','Region_Summary','Herkunft_Summary']),
    category: findCol(['Mix_Typ','Kategorie','Mix_Kategorie','Mischungskategorie']),
    sensorik: findCol(['SensorikProfil','Sensorik_Profil','Sensorik','Sensorik_Profil_Summary'])
  };

  const visibleCols = [
    { key: 'name',     label: 'Mischung' },
    { key: 'origin',   label: 'Herkunft' },
    { key: 'category', label: 'Kategorie' },
    { key: 'sensorik', label: 'Sensorik' }
  ];

  // --- DOM-Elemente --------------------------------------------------------
  const thead = document.querySelector('#t thead');
  const tbody = document.querySelector('#t tbody');
  const q     = document.getElementById('q');
  const btnGo    = document.getElementById('go');
  const btnHtml  = document.getElementById('toHtml');
  const btnPdf   = document.getElementById('toPdf');
  const chkAll   = document.getElementById('all');

  if (!thead || !tbody) {
    console.error('Tabelle #t nicht gefunden.');
    return;
  }

  // --- Tabellenkopf bauen ---------------------------------------------------
  thead.innerHTML =
    '<tr><th></th>' +
    visibleCols.map(c => `<th>${c.label}</th>`).join('') +
    '</tr>';

  // --- Tabelle rendern ------------------------------------------------------
  function render(rows) {
    tbody.innerHTML = rows.map(r => {
      const idVal = S(getId(r));
      const cells = visibleCols.map(c => {
        const colName = COL[c.key];
        return `<td>${colName ? S(r[colName]) : ''}</td>`;
      }).join('');
      return `<tr>
        <td><input class="sel" type="checkbox" data-id="${idVal}"></td>
        ${cells}
      </tr>`;
    }).join('');
  }

  // initial laden
  render(data);

  // --- Suche ---------------------------------------------------------------
  function filteredRows() {
    const s = (q?.value || '').trim().toLowerCase();
    if (!s) return data;
    return data.filter(r =>
      Object.values(r).some(v => (S(v) + '').toLowerCase().includes(s))
    );
  }

  btnGo?.addEventListener('click', () => render(filteredRows()));

  q?.addEventListener('keydown', e => {
    if (e.key === 'Enter') render(filteredRows());
  });

  // --- Alles wählen ---------------------------------------------------------
  chkAll?.addEventListener('change', e => {
    const checked = e.target.checked;
    document.querySelectorAll('input.sel').forEach(x => {
      x.checked = checked;
    });
  });

  function selectedIds() {
    return [...document.querySelectorAll('input.sel:checked')]
      .map(x => x.dataset.id)
      .filter(Boolean);
  }

  // --- Buttons Rezepte ------------------------------------------------------
  btnHtml?.addEventListener('click', () => {
    const ids = selectedIds();
    if (!ids.length) {
      alert('Bitte Mischung(en) auswählen.');
      return;
    }
    window.open(
      './mischung_rezepte.html?ids=' + encodeURIComponent(ids.join(',')),
      '_blank'
    );
  });

  btnPdf?.addEventListener('click', () => {
    const ids = selectedIds();
    if (!ids.length) {
      alert('Bitte Mischung(en
