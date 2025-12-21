/* assets/js/bg_loader.js */
(function() {
    const body = document.body;
    // Sucht die Klasse im Body, z.B. "BG1" oder "BG7"
    const match = (body.className || '').match(/BG(\d+)/i);
    
    if (match) {
        const bgNum = match[1];
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;

        let suffix = "16x9"; // Standard für Desktop

        // Logik zur Auswahl des richtigen Dateiformats basierend auf deinen Bildern
        if (width <= 480) {
            suffix = "mobile_portrait";
        } else if (width <= 900 && aspect < 1) {
            suffix = "tablet_portrait";
        } else if (width <= 1024 && aspect >= 1) {
            suffix = "tablet_landscape";
        } else if (aspect > 1.6) {
            suffix = "16x9";
        } else {
            suffix = "16x10";
        }

        // Pfad zusammenbauen (entspricht exakt deiner Dateistruktur)
        const fileName = `EinLexikonDerAromen-DuefteDerWelt_BG${bgNum}_${suffix}.jpg`;
        const fullPath = `./assets/img/backgrounds/${fileName}`;

        // Bild im Hintergrund vorladen
        const img = new Image();
        img.onload = function() {
            body.style.backgroundImage = `url('${fullPath}')`;
            body.style.backgroundSize = "cover";
            body.style.backgroundPosition = "center center";
            body.style.backgroundAttachment = "fixed";
            body.classList.add('bg-loaded');
        };

        // Fehlerbehandlung: Falls das spezifische Format fehlt, versuche das Standard-16x9
        img.onerror = function() {
            const fallbackPath = `./assets/img/backgrounds/EinLexikonDerAromen-DuefteDerWelt_BG${bgNum}_16x9.jpg`;
            body.style.backgroundImage = `url('${fallbackPath}')`;
        };

        img.src = fullPath;
    }
})();