// assets/js/util.js (FINALE Version, lesbar und auf Semikolon (;) optimiert)
// Ersetzen Sie den GESAMTEN INHALT Ihrer util.js-Datei durch DIESEN BLOCK:
window.$util = {
    async _f(p) {
        const r = await fetch(p, { cache: 'no-store' });
        if (!r.ok) throw 0;
        return r.text()
    },
    
    // KORRIGIERTE CSV-PARSING-FUNKTION (vereinfacht für Semikolon)
// Ausschnitt aus util.js (Finale, ultra-robuste CSV-Funktion)
// ACHTUNG: Nur diesen Teil in Ihre funktionierende util.js integrieren!
csv(t) {
    const separator = ';'; 
    
    // RegEx zur Trennung (ignoriert Semikolon in Anführungszeichen)
    const splitRegex = new RegExp(separator + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g');
    
    const L = t.split(/\r?\n/).filter(Boolean);
    if (!L.length) return [];
    
    // Kopfzeile parsen & EXTREM aggressiv trimmen (inkl. unsichtbarer Zeichen)
    const H = L.shift().split(splitRegex)
        .map(h => h.replace(/^"|"$/g, '').replace(/[\uFEFF\xA0\s]/g, '').trim()); // <-- HIER DIE KORREKTUR
    
    return L.map(r => {
        // Datenzeilen parsen & EXTREM aggressiv trimmen
        const C = r.split(splitRegex)
            .map(c => c.replace(/^"|"$/g, '').replace(/[\uFEFF\xA0\s]/g, '').trim()); // <-- HIER DIE KORREKTUR
        const o = {};
        H.forEach((h, i) => o[h] = C[i] || '');
        return o
    })
}

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
    // Die Funktion, die von mischungen.js aufgerufen wird:
    async loadRecipes() {
        try { return await this.loadCSV(['./assets/data/MasterRecipes.csv', './data/MasterRecipes.csv']) }
        catch (e) { 
            console.error(e);
            return await this.loadJSON(['./assets/data/master_recipes.json', './data/master_recipes.json']) 
        }
    },
    
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