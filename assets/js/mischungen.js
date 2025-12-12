(async () => {
    let allData = []; 
    const tbody = document.querySelector('#t tbody');
    const btnPdf = document.getElementById('toPdf');
    const btnHtml = document.getElementById('toHtml');

    try {
        allData = await window.$util.loadRecipes();
        renderTable(allData);
    } catch (e) { console.error("Ladefehler:", e); }

    function renderTable(data) {
        if (!tbody) return;
        tbody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            const mixId = row.mix_id || row.id_neu || '';
            
            // Checkbox mit Label-Ersatz für Edge
            const tdCb = document.createElement('td');
            tdCb.innerHTML = `<input type="checkbox" class="mix-checkbox" value="${mixId}" title="Auswählen">`;
            tr.appendChild(tdCb);

            ['name_deutsch', 'herkunft', 'kategorie_multi', 'sensorik_multi'].forEach(key => {
                const td = document.createElement('td');
                // Falls die Spalte nicht exakt so heißt, suchen wir den passenden Header
                const actualKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase()) || key;
                td.textContent = row[actualKey] || '';
                tr.appendChild(td);
            });

            tr.onclick = (e) => {
                if (e.target.type !== 'checkbox') window.open(`./mischung_rezepte.html?id=${mixId}`, '_blank');
            };
            tbody.appendChild(tr);
        });
    }

    function startExport(isPdf) {
        const checked = Array.from(document.querySelectorAll('.mix-checkbox:checked')).map(cb => cb.value);
        if (checked.length === 0) return alert("Bitte markiere zuerst mindestens ein Rezept.");
        
        // Öffnet die Rezeptseite mit den IDs und dem Print-Befehl
        const url = `./mischung_rezepte.html?ids=${checked.join(',')}${isPdf ? '&print=1' : ''}`;
        window.open(url, '_blank');
    }

    if (btnPdf) btnPdf.onclick = () => startExport(true);
    if (btnHtml) btnHtml.onclick = () => startExport(false);
})();