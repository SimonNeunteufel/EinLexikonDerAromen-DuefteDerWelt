// assets/js/util.js (FINALE Version, lesbar und extrem robust gegen Header-Fehler)
window.$util = {
    async _f(p) {
        const r = await fetch(p, { cache: 'no-store' });
        if (!r.ok) throw 0;
        return r.text()
    },
    
    // FINALE CSV-PARSING-FUNKTION (aggressives Trimmen + Normalisierung auf Lowercase)
    csv(t) {
        const separator = ';'; 
        const splitRegex = new RegExp(separator + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g');
        
        const L = t.split(/\r?\n/).filter(Boolean);
        if (!L.length) return [];
        
        // Header-Parsing: EXTREM aggressiv trimmen und in Lowercase umwandeln
        const H = L.shift().split(splitRegex)
            .map(h => h.replace(/^"|"$/g, '') // Anführungszeichen entfernen
                       .replace(/[\uFEFF\xA0\s]/g, '') // Unicode-Whitespace entfernen
                       .trim()
                       .toLowerCase()); // ALLES in Kleinbuchstaben
        
        return L.map(r => {
            // Datenzeilen: Nur trimmen und parsen
            const C = r.split(splitRegex)
                .map(c => c.replace(/^"|"$/g, '').trim());
            const o = {};
            H.forEach((h, i) => o[h] = C[i] || '');
            return o
        })
    },

    async loadCSV(p) {
        for (const x of p) {
            try { return this.csv(await this._f(x)) } catch (e) { console.error("Fehler beim Laden oder Parsen von CSV:", x, e); }
        }
        throw "Ladefehler: Alle CSV-Pfade fehlgeschlagen.";
    },
    async loadJSON(p) {
        for (const x of p) {
            try { return JSON.parse(await this._f(x)) } catch (_) { }
        }
        throw 0
    },
    async loadRecipes() {
        try { return await this.loadCSV(['./assets/data/MasterRecipes.csv', './data/MasterRecipes.csv']) }
        catch (e) { 
            console.error(e);
            return await this.loadJSON(['./assets/data/master_recipes.json', './data/master_recipes.json']) 
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