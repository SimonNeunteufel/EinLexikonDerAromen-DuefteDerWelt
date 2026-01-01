/* assets/js/stoffe.js */

/**
 * Initialisiert die Stoff-Datenbank-Logik
 * @param {Array} data - Die geladenen CSV-Daten
 * @param {Function} renderFn - Die Funktion zum Zeichnen der Tabelle
 */
window.initStoffeLogic = function(data, renderFn) {
    const qInput = document.getElementById('q');
    const catFilters = document.querySelectorAll('#catFilters input');

    const performSearch = () => {
        const query = qInput.value.trim().toLowerCase();
        
        // Sammelt die Kürzel der aktiven Checkboxen (z.B. ["SPC", "HRB"])
        const activeCodes = Array.from(document.querySelectorAll('#catFilters input:checked'))
                                 .map(cb => cb.value.toUpperCase());

        const filteredHits = data.filter(r => {
            // 1. Kategorie-Filter (Extrahiert das Kürzel aus der STOFF_ID)
            // Beispiel: "STOFF-SPC-000001" -> ["STOFF", "SPC", "000001"] -> "SPC"
            const idParts = (r.STOFF_ID || "").split('-');
            const currentCode = idParts.length > 1 ? idParts[1].toUpperCase() : "";
            
            const matchesCat = activeCodes.length === 0 || activeCodes.includes(currentCode);
            
            // 2. Textsuche in allen Feldern der Zeile
            const matchesText = !query || Object.values(r).join(' ').toLowerCase().includes(query);
            
            return matchesCat && matchesText;
        });

        renderFn(filteredHits);
    };

    // Event-Listener für Textsuche (Suchen während dem Tippen)
    qInput.addEventListener('input', performSearch);
    
    // Event-Listener für den "Suchen" Button
    const goBtn = document.getElementById('go');
    if (goBtn) goBtn.onclick = performSearch;

    // Event-Listener für alle Filter-Checkboxen
    catFilters.forEach(cb => {
        cb.addEventListener('change', performSearch);
    });

    // Initialer Aufruf, um die Tabelle beim Laden zu füllen
    performSearch();
};