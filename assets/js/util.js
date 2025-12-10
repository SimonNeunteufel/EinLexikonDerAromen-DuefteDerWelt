// Ausschnitt aus util.js (Änderung der csv Funktion)
window.$util={
    async _f(p){const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw 0;return r.text()},
    
    // --- HIER IST DIE KORREKTUR ---
    csv(t){
        // Ersetzt Komma (,) durch Semikolon (;) als Trennzeichen für DE-Formate
        const separator = ';'; 
        
        const L=t.split(/\r?\n/).filter(Boolean);
        if(!L.length)return[];
        
        // Split nach Semikolon (oder Komma, falls Semikolon nicht funktioniert)
        const H=L.shift().split(new RegExp(separator + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g')).map(h=>h.replace(/^"|"$/g,''));
        
        // Fallback: Wenn Semikolon nur eine Spalte liefert, versuchen wir Komma
        let effectiveSeparator = separator;
        if (H.length <= 1 && t.includes(',')) {
             effectiveSeparator = ',';
             // Kopfzeile neu parsen
             const firstLine = L.slice(0, 1)[0] || '';
             const tempH = (t.split(/\r?\n/)[0] || '').split(new RegExp(effectiveSeparator + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g')).map(h=>h.replace(/^"|"$/g,''));
             if (tempH.length > 1) H.splice(0, H.length, ...tempH); // H durch Komma-Splitting ersetzen
             L.splice(0, L.length, ...t.split(/\r?\n/).slice(1).filter(Boolean)); // Datenzeilen neu anpassen
        }

        return L.map(r=>{
            const C=r.split(new RegExp(effectiveSeparator + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g')).map(c=>c.replace(/^"|"$/g,''));
            const o={};
            H.forEach((h,i)=>o[h]=C[i]||'');
            return o
        })
    },
    // ... Rest der util.js bleibt unverändert ...
};