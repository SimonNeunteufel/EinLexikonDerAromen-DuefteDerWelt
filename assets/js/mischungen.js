// assets/js/mischungen.js (Vollständig und Link-korrigiert)

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
        // Daten laden (benötigt korrigierte util.js)
        allData = await window.$util.loadRecipes();
    } catch (e) {
        window.$util.err(
            'Daten konnten nicht geladen werden. ' +
            'Lege <code>MasterRecipes.csv</code> oder <code>master_recipes.json</code> ' +
            'in <code>/data/</code> oder <code>/assets/data/</code> ab. (Fehler: ' + e + ')'
        );
        return;
    }

    if (!allData.length) {
        window.$util.err('Keine Mischungsdaten in der geladenen Datei gefunden.');
        return;
    }

    // Initialisierung der Elemente
    const S = window.$util.safe;
    const keys = Object.keys(allData[0] || {});

    const findCol = (candidates) =>
        candidates.find(c => keys.includes(c)) || null;

    // --- PRÄZISIERTE SPALTEN-MAPPING ---
    const COL = {
        // ID: Spalte A (MIX_ID)
        id: findCol(['MIX_ID', 'Mix_ID', 'ID_Neu', 'Recipe_ID', 'Rezept_ID', 'id']),

        // Name: Spalte F (Name_deutsch)
        name: findCol(['Name_deutsch', 'Original_Name', 'Mix_Name', 'Mischungsname', 'Mischung_Name']),

        // Herkunft / Region: Spalte O (Region_norm)
        origin: findCol(['Region_norm', 'Original_Region', 'Herkunft', 'Region_Summary', 'Herkunft_Summary']),

        // Kategorie / Anwendungsbereich: Spalte J (Anwendungsbereich_multi) oder G (Kategorie_multi)
        category: findCol(['Anwendungsbereich_multi', 'Kategorie_multi', 'Mix_Typ', 'Kategorie', 'Mischungskategorie']),

        // Sensorik: Spalte K (Sensorik_multi)
        sensorik: findCol(['Sensorik_multi', 'SensorikProfil', 'Sensorik_Profil', 'Sensorik'])
    };

    // Gewünschte sichtbare Spalten im Array
    const visibleCols = [
        { key: 'name', label: 'Mischungs Name' },
        { key: 'origin', label: 'Herkunft' },
        { key: 'category', label: 'Anwendungsbereich / Kategorie' },
        { key: 'sensorik', label: 'Sensorik' }
    ];

    // --- FUNKTIONEN ---

    /**
     * Erstellt den Tabellenkopf (<thead>) mit Checkbox-Spalte und gewünschten Spalten.
     */
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

    /**
     * Rendert die Daten in die Tabelle.
     */
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
            
            // Checkbox zur Auswahl
            const checkboxCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'mix-checkbox';
            checkbox.value = mixId;
            checkboxCell.appendChild(checkbox);
            tr.appendChild(checkboxCell);

            // Mischungs-Infos
            visibleCols.forEach(colConfig => {
                const td = document.createElement('td');
                const value = row[COL[colConfig.key]] || '';
                td.textContent = value;
                td.title = value; 
                tr.appendChild(td);
            });

            // Event-Listener für Klick auf die Zeile 
            tr.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                     // *** KORRIGIERTER LINK ***
                     window.open(`./mischung_rezepte.html?id=${mixId}`, '_blank');
                }
            });

            tbody.appendChild(tr);
        });
    }

    /**
     * Filtert die Daten basierend auf dem Suchbegriff.
     */
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

    /**
     * Führt die Suche durch und rendert die gefilterten Daten neu.
     */
    function search() {
        const searchTerm = q.value;
        const results = filterData(searchTerm);
        renderTable(results);
    }

    /**
     * Ermittelt die IDs der aktuell ausgewählten Mischungen.
     */
    function getSelectedMixIds() {
        const checkboxes = document.querySelectorAll('#t tbody input.mix-checkbox:checked'); 
        return Array.from(checkboxes).map(cb => cb.value);
    }

    /**
     * Leitet zur Rezeptansicht weiter (HTML oder PDF).
     */
    function handleRecipeOutput(format) {
        const selectedIds = getSelectedMixIds();
        
        if (selectedIds.length === 0) {
            alert('Bitte wählen Sie zuerst mindestens eine Mischung aus.');
            return;
        }

        const idsParam = encodeURIComponent(selectedIds.join(','));

        if (format === 'html') {
            // *** KORRIGIERTER LINK ***
            const url = `./mischung_rezepte.html?ids=${idsParam}`;
            window.open(url, '_blank');
        } else if (format === 'pdf') {
            // *** KORRIGIERTER LINK ***
            const url = `./mischung_rezepte.html?ids=${idsParam}&print=1`;
            window.open(url, '_blank');
        }
    }


    // --- INITIALISIERUNG & EVENT-LISTENER ---

    setupTableHeader(); 
    renderTable(allData); 

    // Event-Listener für Buttons
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