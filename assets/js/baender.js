// Alter Code:
// <label for="s">Band wählen:</label>
// <select id="s" class="btn"></select>
// <button class="btn" id="h">HTML öffnen</button>
// <button class="btn" id="p">PDF öffnen</button>

// ... JS-Teil ...
  // HTML öffnen (gleiches Fenster)
  document.getElementById('h').onclick = () => {
    const id = select.value; // z.B. "band00"
    if (!id) return;
    location.href = `./bands/${id}.html`;
  };

  // PDF öffnen (neuer Tab)
  document.getElementById('p').onclick = () => {
    const id = select.value;
    if (!id) return;
    window.open(`./data/pdfs/${id}.pdf`, '_blank');
  };