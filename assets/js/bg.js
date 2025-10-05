// Random Responsive Background Selector
(function () {
  // Konfiguration: Dateinamen je Device-Gruppe
  const BG = {
    mobile:  ["BG1_mobile.jpg", "BG2_mobile.jpg", "BG3_mobile.jpg", "BG4_mobile.jpg"],
    tablet:  ["BG1_tablet.jpg", "BG2_tablet.jpg", "BG3_tablet.jpg", "BG4_tablet.jpg"],
    desktop: ["BG1_desktop.jpg","BG2_desktop.jpg","BG3_desktop.jpg","BG4_desktop.jpg"]
  };

  const w = window.innerWidth || document.documentElement.clientWidth;
  const group = w < 720 ? "mobile" : (w < 1024 ? "tablet" : "desktop");
  const pool = (BG[group] || BG.desktop).filter(Boolean);
  const pick = pool[Math.floor(Math.random() * pool.length)];

  if (!pick) return;

  const url = `assets/img/backgrounds/${pick}`;
  // Setze dynamisch die CSS-Variable auf <body>
  document.documentElement.style.setProperty("--dynamic-bg", `url("${url}")`);

  // Optional: Fallback falls styles.css fixe Variablen gesetzt hat
  document.body.style.backgroundImage = `var(--dynamic-bg)`;
})();
