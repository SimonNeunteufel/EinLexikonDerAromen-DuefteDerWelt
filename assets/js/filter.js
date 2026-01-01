// Konfiguration der Länder pro Kontinent
const geoMapping = {
    "Asien": ["Indien", "Vietnam", "Indonesien", "China", "Japan", "Sri Lanka", "Thailand"],
    "Europa": ["Frankreich", "Italien", "Spanien", "Deutschland", "Bulgarien", "Ungarn"],
    "Afrika": ["Madagaskar", "Marokko", "Ägypten", "Äthiopien"],
    "Amerika": ["Brasilien", "Mexiko", "USA", "Peru", "Venezuela"]
};

/**
 * Aktualisiert das Länder-Menü basierend auf Kontinenten
 */
function updateCountryList() {
    const activeContinents = Array.from(document.querySelectorAll('input[name="continent"]:checked')).map(cb => cb.value);
    const dropdown = document.getElementById('countrySelect');
    
    // Bestehende Auswahl merken
    const savedSelection = Array.from(dropdown.selectedOptions).map(o => o.value);
    
    dropdown.innerHTML = '<option value="" disabled>Spezifische Länder wählen...</option>';
    
    let countries = [];
    if (activeContinents.length === 0) {
        countries = Object.values(geoMapping).flat();
    } else {
        activeContinents.forEach(c => { if(geoMapping[c]) countries.push(...geoMapping[c]); });
    }
    
    // Eindeutig sortieren und einfügen
    [...new Set(countries)].sort().forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (savedSelection.includes(c)) opt.selected = true;
        dropdown.appendChild(opt);
    });
    
    applyAllFilters();
}

/**
 * Kernfunktion zum Filtern der Tabelle
 */
function applyAllFilters() {
    const searchVal = document.getElementById('mainSearch').value.toLowerCase();
    const checkedCats = Array.from(document.querySelectorAll('input[name="cat"]:checked')).map(c => c.value);
    const selectedCountries = Array.from(document.getElementById('countrySelect').selectedOptions).map(o => o.value);

    const rows = document.querySelectorAll('#tableContainer tbody tr'); // Pfad anpassen falls nötig

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const cat = row.getAttribute('data-category'); // Falls du Data-Attribute nutzt, sonst Zellen-Index
        const country = row.getAttribute('data-origin');

        const matchSearch = text.includes(searchVal);
        const matchCat = checkedCats.length === 0 || checkedCats.includes(cat);
        const matchCountry = selectedCountries.length === 0 || selectedCountries.includes(country);

        row.style.display = (matchSearch && matchCat && matchCountry) ? '' : 'none';
    });
}

// Initialisierung
window.addEventListener('DOMContentLoaded', updateCountryList);