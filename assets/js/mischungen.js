(async () => {
    let allData = [];
    // DOM Elemente suchen
    const tbody = document.querySelector('#t tbody');
    const qInput = document.getElementById('q');
    const btnGo = document.getElementById('go');
    const btnPdf = document.getElementById('toPdf');
    const btnHtml = document.getElementById('toHtml');

    try {
        // Daten über util.js laden
        allData = await window.$util.loadRecipes();
        
        // Initiales Rendern
        renderTable(allData);

        // Suche aktivieren
        const performSearch = () => {
            const term = qInput.value.toLowerCase();
            const filtered = allData.filter(row => 
                Object.values(row).some(val => String(val).toLowerCase().includes(term))
            );
            renderTable(filtered);
        };

        if (btnGo) btnGo.onclick = performSearch;
        if (qInput) qInput.onkeyup = (e) => { if (e.key === 'Enter') performSearch(); };

        // PDF & HTML Export Logik
        const openExport = (isPdf) => {
            const checkedIds = Array.from(document.querySelectorAll('.mix-checkbox:checked')).map(cb => cb.value);
            if (!checkedIds.length) return alert("Bitte markieren Sie mindestens eine Mischung.");
            const url = `./mischung_rezepte.html?ids=${checkedIds.join(',')}${isPdf ? '&print=1' : ''}`;
            window.open(url, '_blank');
        };

        if (btnPdf) btnPdf.onclick = () => openExport(true);
        if (btnHtml) btnHtml.onclick = () => openExport(false);

    } catch (e) {
        console.error("Fehler in mischungen.js:", e);
    }

    function renderTable(data) {
        if (!tbody) return;
        tbody.innerHTML = '';

        data.forEach(row => {
            // Flexible Erkennung der ID-Spalte
            const idKey = Object.keys(row).find(k => k.toLowerCase().includes('id')) || Object.keys(row)[0];
            const mixId = String(row[idKey]).trim();

            const tr = document.createElement('tr');
            
            // Checkbox Spalte
            const tdCb = document.createElement('td');
            tdCb.innerHTML = `<input type="checkbox" class="mix-checkbox" value="${mixId}" title="Auswählen">`;
            tr.appendChild(tdCb);

            // Daten Spalten (Name, Herkunft, Kategorie, Sensorik)
            const displayKeys = ['name', 'herkunft', 'kategorie', 'sensorik'];
            displayKeys.forEach(dk => {
                const actualKey = Object.keys(row).find(k => k.toLowerCase().includes(dk)) || '';
                const td = document.createElement('td');
                td.textContent = row[actualKey] || '';
                tr.appendChild(td);
            });

            // Klick auf Zeile öffnet Einzelansicht
            tr.onclick = (e) => {
                if (e.target.type !== 'checkbox') window.open(`./mischung_rezepte.html?id=${mixId}`, '_blank');
            };
            tbody.appendChild(tr);
        });
    }
})();