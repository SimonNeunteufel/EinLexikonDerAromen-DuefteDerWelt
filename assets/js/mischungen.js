/* assets/js/mischungen.js */
(async () => {
    // DOM Elemente
    const tbody = document.querySelector('#t tbody');
    const thead = document.querySelector('#t thead');
    const searchInput = document.getElementById('q');
    const btnGo = document.getElementById('go');
    const btnHtml = document.getElementById('toHtml');
    const cbAll = document.getElementById('all');
    const info = document.getElementById('info');

    // Hilfsfunktionen
    const S = window.$util.safe;
    const T = window.$util.formatTags;

    let data = [];

    // 1. Daten laden
    try {
        data = await window.$util.loadCsv('./assets/data/MasterRecipes.csv');
    } catch (e) {
        if(tbody) tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;color:red">Fehler: ${e}</td></tr>`;
        return;
    }

    // 2. Tabellen-Header setzen
    if (thead) {
        thead.innerHTML = `
            <tr>
                <th style="width:40px; text-align:center">✓</th>
                <th>ID</th>
                <th>Name (DE / Original)</th>
                <th>Typ / Form</th>
                <th>Herkunft</th>
                <th>Tags</th>
            </tr>
        `;
    }

    // 3. Render Funktion
    const render = (list) => {
        if (!tbody) return;
        
        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#999;">Keine Ergebnisse.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(r => `
            <tr>
                <td class="col-cb" style="text-align:center">
                    <input type="checkbox" class="sel" value="${S(r.MIX_ID)}" data-name="${S(r.Name_DE)}">
                </td>
                <td class="col-id" style="font-family:monospace; color:#888">${S(r.MIX_ID)}</td>
                <td>
                    <b>${S(r.Name_DE)}</b>
                    <div style="color:#666; font-style:italic; font-size:0.9em">${S(r.Name_Original)}</div>
                </td>
                <td>
                    ${r.MIX_Typ === 'G' ? '<b>Grundrezept</b>' : 'Variante'}<br>
                    <small style="color:#666">${S(r.Form)}</small>
                </td>
                <td>${S(r.Herkunft_Hierarchie).replace('>', '›')}</td>
                <td>${T(r.Sensorik_Tags)} ${T(r.Kategorie_Tags)}</td>
            </tr>
        `).join('');
        
        updateBadges();
    };

    // 4. Suche
    const search = () => {
        const term = searchInput.value.trim().toLowerCase();
        if (!term) { render(data); return; }
        
        const hits = data.filter(r => {
            const txt = [
                r.MIX_ID, r.Name_DE, r.Name_Original, 
                r.Herkunft_Hierarchie, r.Zutaten_Tags, r.Sensorik_Tags
            ].join(' ').toLowerCase();
            return txt.includes(term);
        });
        render(hits);
    };

    // 5. Interaktion
    const updateBadges = () => {
        if (!info) return;
        const selected = Array.from(document.querySelectorAll('.sel:checked'));
        info.innerHTML = selected.length 
            ? selected.map(el => `<span class="badge">${el.dataset.name}</span>`).join('') 
            : '<span style="color:#bbb;padding:5px">Keine Auswahl</span>';
    };

    if (btnGo) btnGo.onclick = search;
    if (searchInput) searchInput.addEventListener('keydown', e => { if(e.key === 'Enter') search(); });

    // Event Delegation für Checkboxen
    document.addEventListener('change', e => {
        if (e.target.classList.contains('sel')) updateBadges();
    });

    if (cbAll) {
        cbAll.addEventListener('change', e => {
            document.querySelectorAll('.sel').forEach(cb => cb.checked = e.target.checked);
            updateBadges();
        });
    }

    if (btnHtml) {
        btnHtml.onclick = () => {
            const ids = Array.from(document.querySelectorAll('.sel:checked')).map(cb => cb.value);
            if (!ids.length) return alert('Bitte mindestens ein Rezept auswählen.');
            window.open(`./mischung_rezepte.html?ids=${encodeURIComponent(ids.join(','))}`, '_blank');
        };
    }

    // Start
    render(data);
})();