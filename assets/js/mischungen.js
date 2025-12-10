// assets/js/mischungen.js (Vollständiger Code mit Link-Korrektur)

(async () => {
    // ... (Datenlade-Logik, COL-Mapping, setupTableHeader bleibt gleich) ...
    
    // --- FUNKTIONEN ---

    // ... (setupTableHeader bleibt gleich) ...

    /**
     * Rendert die Daten in die Tabelle.
     */
    function renderTable(dataToRender) {
        // ... (Logik zum Leeren des tbody und Fehlermeldung bei leeren Daten bleibt gleich) ...

        dataToRender.forEach((row) => {
            const tr = document.createElement('tr');
            const mixId = row[COL.id];
            
            // ... (Logik zum Erstellen der Checkbox und Zellen bleibt gleich) ...

            // Event-Listener für Klick auf die Zeile (öffnet das Rezept direkt)
            tr.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                     // *** KORREKTUR: Link von 'rezept' auf 'rezepte' (Mehrzahl) korrigiert ***
                     window.open(`./mischung_rezepte.html?id=${mixId}`, '_blank');
                }
            });

            tbody.appendChild(tr);
        });
    }

    // ... (filterData, search, getSelectedMixIds bleibt gleich) ...

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
            // *** KORREKTUR: Link von 'rezept' auf 'rezepte' (Mehrzahl) korrigiert ***
            const url = `./mischung_rezepte.html?ids=${idsParam}`;
            window.open(url, '_blank');
        } else if (format === 'pdf') {
            // *** KORREKTUR: Link von 'rezept' auf 'rezepte' (Mehrzahl) korrigiert ***
            const url = `./mischung_rezepte.html?ids=${idsParam}&print=1`;
            window.open(url, '_blank');
        }
    }

    // --- INITIALISIERUNG & EVENT-LISTENER (bleibt gleich) ---
    setupTableHeader(); 
    renderTable(allData); 
    
    // ... (Event-Listener für Buttons bleiben gleich) ...

})();
