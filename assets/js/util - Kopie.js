/* assets/js/util.js */
window.$util = {
    // Universelle CSV-Ladefunktion
    loadCsv: async (url) => {
        return new Promise((resolve, reject) => {
            if (typeof Papa === 'undefined') {
                console.error("PapaParse fehlt! Bitte im HTML Head einbinden.");
                reject("PapaParse fehlt"); 
                return;
            }
            
            Papa.parse(url, {
                download: true,
                header: true,
                skipEmptyLines: true,
                delimiter: ";", // Semikolon für deine Dateien
                complete: (results) => resolve(results.data),
                error: (err) => reject(err.message)
            });
        });
    },

    // Sicherheitsfunktion für Textausgabe
    safe: (t) => {
        if (t === null || t === undefined) return "";
        return String(t)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    },

    // Tags formatieren (A|B|C -> HTML Badges)
    formatTags: (str) => {
        if (!str) return "";
        return str.split('|')
            .map(s => s.trim())
            .filter(Boolean)
            .map(x => `<span class="tag">${window.$util.safe(x)}</span>`)
            .join(' ');
    }
};