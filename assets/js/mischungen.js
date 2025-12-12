(async () => {
    let allData = []; 
    const thead = document.querySelector('#t thead');
    const tbody = document.querySelector('#t tbody');
    const q = document.getElementById('q');
    const btnGo = document.getElementById('go');
    const btnHtml = document.getElementById('toHtml');
    const btnPdf = document.getElementById('toPdf'); // Verknüpfung zum Button
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
        category: findCol(['kategorie_multi', 'anwendungsbereich_multi']),
        sensorik: findCol(['sensorik', 'sensorik_multi'])
    };

    function renderTable(data) {
        tbody.innerHTML = '';
        data.forEach((row) => {
            const tr = document.createElement('tr');
            const mixId = row[COL.id]; 
            
            const tdCb = document.createElement('td');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'mix-checkbox';
            cb.value = mixId;
            cb.title = "Diese Mischung auswählen"; // Accessibility Fix
            tdCb.appendChild(cb);
            tr.appendChild(tdCb);

            const visibleCols = ['name', 'origin', 'category', 'sensorik'];
            visibleCols.forEach(key => {
                const td = document.createElement('td');
                td.textContent = row[COL[key]] || '';
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

    // --- PDF & HTML LOGIK ---
    
    function getSelectedIds() {
        const checked = document.querySelectorAll('.mix-checkbox:checked');
        return Array.from(checked).map(cb => cb.value);
    }

    function openRecipes(isPdf) {
        const ids = getSelectedIds();
        if (ids.length === 0) {
            alert("Bitte wählen Sie zuerst mindestens ein Rezept über die Checkboxen aus.");
            return;
        }
        
        // Erzeugt die URL: ids=1,2,3 und optional &print=1 für den Auto-Druck
        const url = `./mischung_rezepte.html?ids=${ids.join(',')}${isPdf ? '&print=1' : ''}`;
        window.open(url, '_blank');
    }

    // Event-Listener zuweisen
    if (btnHtml) btnHtml.onclick = () => openRecipes(false);
    if (btnPdf) btnPdf.onclick = () => openRecipes(true); // Hier wird die PDF-Funktion aktiviert

    if (btnGo) btnGo.onclick = () => {
        const term = q.value.toLowerCase();
        renderTable(allData.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(term))));
    };

    renderTable(allData);
})();