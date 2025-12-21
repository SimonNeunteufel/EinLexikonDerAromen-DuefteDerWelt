/* assets/js/util.js */
window.$util = {
    // CSV Laden mit PapaParse
    loadCsv: async (url) => {
        return new Promise((resolve, reject) => {
            // Prüfen, ob PapaParse geladen ist
            if (typeof Papa === 'undefined') {
                console.error("PapaParse ist nicht geladen!");
                reject("Fehler: Bibliothek 'PapaParse' fehlt im HTML head!");
                return;
            }

            Papa.parse(url, {
                download: true,
                header: true,
                skipEmptyLines: true,
                delimiter: ";", // WICHTIG: Wir nutzen Semikolon in den CSVs
                complete: (results) => {
                    console.log("CSV geladen:", url, results.data.length, "Zeilen");
                    resolve(results.data);
                },
                error: (err) => {
                    console.error("CSV Fehler:", err);
                    reject(err.message);
                }
            });
        });
    },

    // HTML-Injection sicher machen (Sicherheitsfunktion)
    safe: (t) => {
        if (!t) return "";
        return String(t)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    },

    // Tags formatieren (Pipe | zu HTML Badges)
    formatTags: (str) => {
        if (!str) return "";
        return str.split('|')
            .map(s => s.trim())
            .filter(Boolean)
            .map(x => `<span class="tag">${window.$util.safe(x)}</span>`)
            .join(' ');
    }
};