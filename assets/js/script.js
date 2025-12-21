// Datenmapping für Länder
const geoMap = {
    "Asien": ["Indien", "Vietnam", "Indonesien", "China", "Japan", "Sri Lanka"],
    "Europa": ["Frankreich", "Italien", "Spanien", "Deutschland", "Bulgarien"],
    "Afrika": ["Madagaskar", "Marokko", "Ägypten", "Äthiopien", "Tunesien"],
    "Amerika": ["Brasilien", "Mexiko", "USA", "Peru", "Paraguay"]
};

/**
 * Aktualisiert das Länder-Dropdown basierend auf den gewählten Kontinenten
 */
function syncCountryDropdown() {
    const selectedContinents = Array.from(document.querySelectorAll('input[name="continent"]:checked')).map(cb => cb.value);
    const dropdown = document.getElementById('countrySelect');
    
    // Aktuelle Auswahl merken, um sie nicht zu verlieren
    const currentSelection = Array.from(dropdown.selectedOptions).map(opt => opt.value);
    
    // Dropdown leeren
    dropdown.innerHTML = '<option value="" disabled>Spezifische Länder wählen...</option>';
    
    let countriesToShow = [];
    
    if (selectedContinents.length === 0) {
        // Zeige alle Länder, wenn kein Kontinent gewählt ist
        countriesToShow = Object.values(geoMap).flat();
    } else {
        // Zeige nur Länder der gewählten Kontinente
        selectedContinents.forEach(cont => {
            if (geoMap[cont]) countriesToShow.push(...geoMap[cont]);
        });
    }
    
    // Länder sortieren und hinzufügen
    countriesToShow.sort().forEach(country => {
        const opt = document.createElement('option');
        opt.value = country;
        opt.textContent = country;
        if (currentSelection.includes(country)) opt.selected = true;
        dropdown.appendChild(opt);
    });

    // Sofortiger Vorfilter-Effekt
    applyAllFilters();
}

/**
 * Haupt-Filterfunktion
 */
function applyAllFilters() {
    const searchText = document.getElementById('txtSearch').value.toLowerCase();
    const activeCategories = Array.from(document.querySelectorAll('input[name="cat"]:checked')).map(cb => cb.value);
    const selectedCountries = Array.from(document.getElementById('countrySelect').selectedOptions).map(opt => opt.value);

    console.log("Filtere nach:", { searchText, activeCategories, selectedCountries });

    // Hier implementierst du deine Tabellen-Logik:
    // rows.forEach(row => {
    //    const matchSearch = row.text.includes(searchText);
    //    const matchCat = activeCategories.length === 0 || activeCategories.includes(row.category);
    //    const matchCountry = selectedCountries.length === 0 || selectedCountries.includes(row.country);
    //    row.style.display = (matchSearch && matchCat && matchCountry) ? '' : 'none';
    // });
}

// Initialisierung beim Laden
window.onload = () => {
    syncCountryDropdown();
};