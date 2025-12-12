(async () => {
    const tbody = document.querySelector('#t tbody');
    const qInput = document.getElementById('q');
    const btnGo = document.getElementById('go');
    const btnPdf = document.getElementById('toPdf');
    const btnHtml = document.getElementById('toHtml');

    try {
        const allData = await window.$util.loadRecipes();
        const keys = Object.keys(allData[0] || {});
        
        // Helfer zur Spaltensuche (Groß-/Kleinschreibung ignorieren)
        const find = (cands) => cands.find(c => keys.some(k => k.toLowerCase() === c.toLowerCase())) || keys[0];
        
        // Spalten-Priorität: name_deutsch wird bevorzugt
        const COL = {
            id: find(['mix_id', 'id_neu', 'id']),
            name: find(['name_deutsch', 'mix_name', 'name']),
            origin: find(['region_norm', 'herkunft']),
            cat: find(['kategorie_multi', 'anwendungsbereich_multi']),
            sens: find(['sensorik_multi', 'sensorik'])
        };

        const render = (data) => {
            if (!tbody) return;
            tbody.innerHTML = '';
            data.forEach(row => {
                const tr = document.createElement('tr');
                const mid = String(row[COL.id] || '').trim();

                // Checkbox mit title-Attribut gegen den Konsolen-Fehler
                const tdCb = document.createElement('td');
                tdCb.innerHTML = `<input type="checkbox" class="mix-checkbox" value="${mid}" title="Auswählen">`;
                tr.appendChild(tdCb);

                // Spalten rendern (Deutsch bevorzugt)
                [COL.name, COL.origin, COL.cat, COL.sens].forEach(key => {
                    const td = document.createElement('td');
                    td.textContent = row[key] || '';
                    tr.appendChild(td);
                });

                tr.onclick = (e) => {
                    if (e.target.type !== 'checkbox') window.open(`./mischung_rezepte.html?id=${mid}`, '_blank');
                };
                tbody.appendChild(tr);
            });
        };

        render(allData);

        // Export Logik für PDF und HTML
        const openExp = (isPdf) => {
            const ids = Array.from(document.querySelectorAll('.mix-checkbox:checked')).map(cb => cb.value);
            if (!ids.length) return alert("Bitte markieren Sie zuerst Rezepte in der Liste.");
            window.open(`./mischung_rezepte.html?ids=${ids.join(',')}${isPdf ? '&print=1' : ''}`, '_blank');
        };

        if (btnPdf) btnPdf.onclick = () => openExp(true);
        if (btnHtml) btnHtml.onclick = () => openExp(false);
        if (btnGo) btnGo.onclick = () => {
            const t = qInput.value.toLowerCase();
            render(allData.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(t))));
        };

    } catch (e) { console.error("Fehler in mischungen.js:", e); }
})();