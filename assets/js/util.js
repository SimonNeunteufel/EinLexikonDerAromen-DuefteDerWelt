// assets/js/util.js (FINALE VERSION: Korrigiert Anführungszeichen im Header)
window.$util = {
    async _f(p) {
        const r = await fetch(p, { cache: 'no-store' });
        if (!r.ok) {
            console.error(`Fetch error for ${p}: Status ${r.status}`);
            throw new Error(`Fetch failed: ${p}`);
        }
        return r.text()
    },
    
    // FINALE CSV-PARSING-FUNKTION (Robuste Spaltennormalisierung)
    csv(t) {
        const separator = ';'; 
        const splitRegex = new RegExp(separator + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g');
        
        const L = t.split(/\r?\n/).filter(Boolean);
        if (!L.length) return [];
        
        // 1. Header-Parsing: Normalisierung auf Lowercase
        const H = L.shift().split(splitRegex)
            .map(h => h.replace(/[\uFEFF\xA0\s]/g, '') // Entfernt Unicode-Leerzeichen
                        .trim()
                        .toLowerCase()); // ALLES in Kleinbuchstaben
        
        if (H.some(h => !h) || H.length < 5) {
            console.error("Kritischer Header-Fehler: Header-Spalten nach Parsen ungültig oder zu kurz.");
            throw new Error(`Kritischer Header-Fehler: Ungültige oder zu kurze Header-Liste (${H.length} Spalten gefunden).`);
        }

        return L.map(r => {
            // Die Datenfelder (C) müssen die äußeren Anführungszeichen entfernen, falls sie da sind
            const C = r.split(splitRegex)
                .map(c => c.replace(/^"|"$/g, '').trim()); // Entfernt äußere Anführungszeichen nur an den Enden

            const o = {};
            H.forEach((h, i) => o[h] = C[i] || '');
            return o
        })
    },

    async loadCSV(p) {
        for (const x of p) {
            try { return this.csv(await this._f(x)) } catch (e) { 
                console.error("Fehler beim Laden oder Parsen von CSV:", x, e); 
                throw e; 
            }
        }
        throw "Ladefehler: Alle CSV-Pfade fehlgeschlagen.";
    },

    async loadJSON(p) {
        for (const x of p) {
            try { 
                const text = await this._f(x);
                return JSON.parse(text);
            } catch (e) { 
                console.error("Fehler beim Laden oder Parsen von JSON:", x, e); 
            }
        }
        throw 0
    },

    async loadRecipes() {
        try { 
            // Nur der korrekte Pfad
            return await this.loadCSV(['./assets/data/MasterRecipes.csv']);
        }
        catch (e) { 
            console.warn("CSV-Laden fehlgeschlagen. Versuche JSON Fallback...", e);
            return await this.loadJSON(['./assets/data/master_recipes.json', './data/master_recipes.json']);
        }
    },
    
    safe: v => v == null ? '' : v, 
    
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