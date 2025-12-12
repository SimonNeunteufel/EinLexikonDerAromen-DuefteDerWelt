// assets/js/mischungen.js (FINAL: Checkbox-Fix und Kategorie-Priorisierung)

(async () => {
    let allData = []; 
    let filteredData = []; 

    // --- DOM-Elemente abrufen ---
    const thead = document.querySelector('#t thead');
    const tbody = document.querySelector('#t tbody');
    const q = document.getElementById('q');
    const btnGo = document.getElementById('go');
    const btnHtml = document.getElementById('toHtml');
    const btnPdf = document.getElementById('toPdf');
    const cbAll = document.getElementById('all');

    if (!thead || !tbody) {
        console.error("Tabellen-Elemente (#t thead / #t tbody) nicht gefunden.");
        return; 
    }

    try {
        allData = await window.$util.loadRecipes();
    } catch (e) {
        window.$util.err(
            'Daten konnten nicht geladen werden. ' +
            'Prüfe, ob MasterRecipes.csv korrekt formatiert ist. (Fehler: ' + e + ')'
        );
        return;
    }

    if (!allData.length) {
        window.$util.err('Keine Mischungsdaten in der geladenen Datei gefunden.');
        return;
    }

    const S = window.$util.safe;
    const keys = Object.keys(allData[0] || {});

    // ACHTUNG: Die Suche muss IMMER in Kleinbuchstaben erfolgen!
    const findCol = (candidates) =>
        candidates.find(c => keys.includes(c.toLowerCase())) || null;

    // --- FINALE PRÄZISIERTE SPALTEN-MAPPING (KATEGORIE KORREKTUR) ---
    const COL = {
        id: findCol(['mix_id', 'mix_id', 'id_neu', 'recipe_id']),
        name: findCol(['name_deutsch', 'original_name', 'mix_name', 'mischungsname']),
        origin: findCol(['herkunft', 'region_norm', 'original_region', 'region_summary']),
        // FIX: Priorisiert inhaltsreiche Spalten (kategorie_multi) vor dem simplen Typ (mix_typ)
        category: findCol(['kategorie_multi', 'anwendungsbereich_multi', 'kategorie', 'mix_typ']),
        sensorik: findCol(['sensorik', 'sensorik_multi', 'sensorikprofil'])
    };

    const visibleCols = [
        { key: 'name', label: 'Mischungs Name' },
        { key: 'origin', label: 'Herkunft' },
        { key: 'category', label: 'Anwendungsbereich / Kategorie' },
        { key: 'sensorik', label: 'Sensorik' }
    ];

    function setupTableHeader() {
        const tr = document.createElement('tr');
        const headerAllCheckbox = document.createElement('input');
        headerAllCheckbox.type = 'checkbox';
        headerAllCheckbox.id = 'header-all';
        
        tr.innerHTML = '<th></th>' + 
            visibleCols.map(col => `<th>${col.label}</th>`).join('');
        
        thead.innerHTML = '';
        thead.appendChild(tr);
        
        tr.querySelector('th').appendChild(headerAllCheckbox); 

        headerAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            document.querySelectorAll('#t tbody input.mix-checkbox').forEach(cb => {
                cb.checked = isChecked;
            });
            if(cbAll) cbAll.checked = isChecked;
        });
    }

    function renderTable(dataToRender) {
        tbody.innerHTML = '';
        
        if (!dataToRender.length) {
            tbody.innerHTML = '<tr><td colspan="5">Keine Ergebnisse gefunden.</td></tr>';
            filteredData = [];
            const headerAll = document.getElementById('header-all');
            if(headerAll) headerAll.checked = false;
            if(cbAll) cbAll.checked = false;
            return;
        }

        filteredData = dataToRender;

        dataToRender.forEach((row) => {
            const tr = document.createElement('tr');
            const mixId = row[COL.id]; 
            
            const checkboxCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'mix-checkbox';
            checkbox.value = mixId;
            checkboxCell.appendChild(checkbox);
            tr.appendChild(checkboxCell);

            visibleCols.forEach(colConfig => {
                const td = document.createElement('td');
                const value = row[COL[colConfig.key]] || ''; 
                td.textContent = value;
                td.title = value; 
                tr.appendChild(td);
            });

            tr.addEventListener('click', (e) => {
                // FIX: Stoppt die Propagation, wenn Checkbox oder Button geklickt wird
                if (e.target.type === 'checkbox' || e.target.tagName === 'BUTTON') {
                    e.stopPropagation(); 
                    return;
                }
                
                // Öffne das Einzelrezept
                window.open(`./mischung_rezepte.html?id=${mixId}`, '_blank');
            });

            tbody.appendChild(tr);
        });
    }
    
    function filterData(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return allData;

        return allData.filter(row => {
            const searchFields = [
                row[COL.name],
                row[COL.origin],
                row[COL.category],
                row[COL.sensorik]
            ].filter(Boolean).map(v => String(v).toLowerCase());

            return searchFields.some(field => field.includes(term));
        });
    }

    function search() {
        const searchTerm = q.value;
        const results = filterData(searchTerm);
        renderTable(results);
    }

    function getSelectedMixIds() {
        // Wird nur für die Buttons benötigt
        const checkboxes = document.querySelectorAll('#t tbody input.mix-checkbox:checked'); 
        return Array.from(checkboxes).map(cb => cb.value).filter(Boolean);
    }

    function handleRecipeOutput(format) {
        const selectedIds = getSelectedMixIds();
        
        if (selectedIds.length === 0) {
            alert('Bitte wählen Sie zuerst mindestens eine Mischung aus.');
            return;
        }

        const idsParam = encodeURIComponent(selectedIds.join(','));

        if (format === 'html') {
            const url = `./mischung_rezepte.html?ids=${idsParam}`;
            window.open(url, '_blank');
        } else if (format === 'pdf') {
            const url = `./mischung_rezepte.html?ids=${idsParam}&print=1`;
            window.open(url, '_blank');
        }
    }


    // --- INITIALISIERUNG & EVENT-LISTENER ---

    setupTableHeader(); 
    renderTable(allData); 

    if (btnGo) btnGo.addEventListener('click', search);
    
    if (q) q.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            search();
        }
    });

    if (btnHtml) btnHtml.addEventListener('click', () => handleRecipeOutput('html'));
    if (btnPdf) btnPdf.addEventListener('click', () => handleRecipeOutput('pdf'));

    if (cbAll) cbAll.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll('#t input[type="checkbox"]').forEach(cb => {
            cb.checked = isChecked;
        });
    });

})();