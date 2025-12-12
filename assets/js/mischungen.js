(async () => {
    let allData = []; 
    const thead = document.querySelector('#t thead');
    const tbody = document.querySelector('#t tbody');
    const q = document.getElementById('q');
    const btnGo = document.getElementById('go');
    const btnHtml = document.getElementById('toHtml');
    const btnPdf = document.getElementById('toPdf');
    const cbAll = document.getElementById('all');

    try {
        allData = await window.$util.loadRecipes();
    } catch (e) {
        window.$util.err('Fehler beim Laden: ' + e);
        return;
    }

    const S = window.$util.safe;
    const keys = Object.keys(allData[0] || {});
    const findCol = (candidates) => candidates.find(c => keys.includes(c.toLowerCase())) || null;

    const COL = {
        id: findCol(['mix_id', 'id_neu']),
        name: findCol(['name_deutsch', 'mix_name']),
        origin: findCol(['region_norm', 'herkunft']),
        // FIX: kategorie_multi bevorzugen für vollen Text statt nur "G/V"
        category: findCol(['kategorie_multi', 'anwendungsbereich_multi', 'mix_typ']),
        sensorik: findCol(['sensorik', 'sensorik_multi'])
    };

    const visibleCols = [
        { key: 'name', label: 'Mischungs Name' },
        { key: 'origin', label: 'Herkunft' },
        { key: 'category', label: 'Anwendungsbereich / Kategorie' },
        { key: 'sensorik', label: 'Sensorik' }
    ];

    function setupTableHeader() {
        const tr = document.createElement('tr');
        const thCb = document.createElement('th');
        const headerAllCheckbox = document.createElement('input');
        headerAllCheckbox.type = 'checkbox';
        headerAllCheckbox.id = 'header-all';
        // Accessibility Fix
        headerAllCheckbox.title = "Alle Mischungen auswählen"; 
        thCb.appendChild(headerAllCheckbox);
        tr.appendChild(thCb);

        visibleCols.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.label;
            tr.appendChild(th);
        });
        thead.innerHTML = '';
        thead.appendChild(tr);

        headerAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            document.querySelectorAll('.mix-checkbox').forEach(cb => cb.checked = isChecked);
            if(cbAll) cbAll.checked = isChecked;
        });
    }

    function renderTable(data) {
        tbody.innerHTML = '';
        data.forEach((row) => {
            const tr = document.createElement('tr');
            const mixId = row[COL.id]; 
            
            const tdCb = document.createElement('td');
// In mischungen.js innerhalb der renderTable Schleife:
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.className = 'mix-checkbox';
cb.value = mixId;
cb.title = "Diesen Eintrag auswählen"; // Fügt das notwendige Label-Ersatz-Attribut hinzu
tdCb.appendChild(cb);            tr.appendChild(tdCb);

            visibleCols.forEach(col => {
                const td = document.createElement('td');
                td.textContent = row[COL[col.key]] || '';
                tr.appendChild(td);
            });

            tr.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    window.open(`./mischung_rezepte.html?id=${mixId}`, '_blank');
                }
            });
            tbody.appendChild(tr);
        });
    }

    setupTableHeader();
    renderTable(allData);

    const search = () => {
        const term = q.value.toLowerCase();
        const filtered = allData.filter(r => 
            Object.values(r).some(v => String(v).toLowerCase().includes(term))
        );
        renderTable(filtered);
    };

    if (btnGo) btnGo.onclick = search;
    if (btnHtml) btnHtml.onclick = () => {
        const ids = Array.from(document.querySelectorAll('.mix-checkbox:checked')).map(cb => cb.value);
        if (ids.length) window.open(`./mischung_rezepte.html?ids=${ids.join(',')}`, '_blank');
    };
    if (cbAll) cbAll.onchange = (e) => {
        document.getElementById('header-all').checked = e.target.checked;
        document.querySelectorAll('.mix-checkbox').forEach(cb => cb.checked = e.target.checked);
    };
})();