// assets/js/util.js (Korrigierte und vollständige, lesbare Version)
window.$util = {
    async _f(p) {
        const r = await fetch(p, { cache: 'no-store' });
        if (!r.ok) throw 0;
        return r.text()
    },
    
    // KORRIGIERTE CSV-PARSING-FUNKTION (unterstützt Semikolon als Trennzeichen)
    csv(t) {
        const separator = ';'; // <-- PRIMÄRES TRENNZEICHEN
        
        const L = t.split(/\r?\n/).filter(Boolean);
        if (!L.length) return [];
        
        // Kopfzeile parsen (Semikolon)
        const H = L.shift().split(new RegExp(separator + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g')).map(h => h.replace(/^"|"$/g, ''));
        
        // Fallback-Logik (wenn Semikolon fehlschlägt und Komma vorhanden ist)
        let effectiveSeparator = separator;
        if (H.length <= 1 && t.includes(',')) {
            effectiveSeparator = ',';
            // Versucht, die Kopfzeile erneut mit Komma zu parsen
            const tempH = (t.split(/\r?\n/)[0] || '').split(new RegExp(effectiveSeparator + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g')).map(h => h.replace(/^"|"$/g, ''));
            if (tempH.length > 1) {
                H.splice(0, H.length, ...tempH);
                // Wenn wir den Separator wechseln, müssen wir die Datenzeilen neu laden (wird hier vereinfacht)
                const originalLines = t.split(/\r?\n/).slice(1).filter(Boolean);
                L.splice(0, L.length, ...originalLines);
            }
        }
        
        return L.map(r => {
            // Datenzeilen parsen
            const C = r.split(new RegExp(effectiveSeparator + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g')).map(c => c.replace(/^"|"$/g, ''));
            const o = {};
            H.forEach((h, i) => o[h] = C[i] || '');
            return o
        })
    },

    // --- KRITISCHE FUNKTIONEN, DIE IN IHREM CODE FEHLTEN ---

    async loadCSV(p) {
        for (const x of p) {
            try { return this.csv(await this._f(x)) } catch (_) { }
        }
        throw 0
    },
    async loadJSON(p) {
        for (const x of p) {
            try { return JSON.parse(await this._f(x)) } catch (_) { }
        }
        throw 0
    },
    // Wird von mischungen.js aufgerufen:
    async loadRecipes() {
        try { return await this.loadCSV(['./assets/data/MasterRecipes.csv', './data/MasterRecipes.csv']) }
        catch (_) { return await this.loadJSON(['./assets/data/master_recipes.json', './data/master_recipes.json']) }
    },
    
    // Die sichere Ausgabefunktion, die im HTML verwendet wird:
    safe: v => v == null ? '' : v, 
    
    // Die Fehleranzeige-Funktion:
    err(m) {
        let e = document.getElementById('errorBanner');
        if (!e) {
            e = document.createElement('div');
            e.id = 'errorBanner';
            e.style.cssText = 'background:#fee;border:1px solid #f99;color:#600;padding:10px;border-radius:10px;margin:8px 0';
            document.querySelector('.page')?.prepend(e)
        }
        e.innerHTML = m
    }
};