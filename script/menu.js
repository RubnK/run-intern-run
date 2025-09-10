"use strict";
// menu.ts : gère l'affichage dynamique du menu, des boutons, des modales et du jeu
// Ce fichier sera compilé en menu.js et importé dans index.html
// On attend que le DOM soit prêt
window.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container';
    menuContainer.innerHTML = `
    <div class="menu-title">RUN, INTERN, RUN !</div>
    <button class="menu-btn" id="playBtn">Jouer</button>
    <button class="menu-btn" id="paramBtn">Paramètres</button>
    <button class="menu-btn" id="creditsBtn">Crédits</button>
    <!-- Modale paramètres -->
    <div id="paramModal" class="modal-8bit" style="display:none;">
      <div class="modal-content-8bit" style="font-size:2.1rem;">
        <div class="modal-title-8bit" style="font-size:5rem;">Paramètres</div>
        <div>
          <label for="layout">Clavier :</label>
          <select id="layout">
            <option value="azerty">AZERTY</option>
            <option value="qwerty">QWERTY</option>
          </select>
        </div>
        <div>
          <label for="volume">Volume du jeu :</label>
          <input type="range" id="volume" min="0" max="100" value="50">
          <span id="volumeValue">50</span>%
        </div>
  <button class="modal-x-8bit" id="closeParam" title="Fermer">X</button>
      </div>
    </div>
    <!-- Modale crédits -->
    <div id="creditsModal" class="modal-8bit" style="display:none;">
      <div class="modal-content-8bit" style="font-size:2.1rem;">
        <div class="modal-title-8bit" style="font-size:5rem;">Crédits</div>
        <div class="credits-text">
          Jeu réalisé par <b>Alpino</b> & <b>RubnK</b> dans le cadre d'un projet à l'EFREI.<br>
          <span style="font-size:0.95em;opacity:0.7;">&copy; Tous droits réservés.</span>
        </div>
  <button class="modal-x-8bit" id="closeCredits" title="Fermer">X</button>
      </div>
    </div>
  `;
    const root = document.getElementById('menu-container');
    if (root)
        root.replaceWith(menuContainer);
    else
        document.body.appendChild(menuContainer);
    // Gestion des boutons
    const playBtn = document.getElementById('playBtn');
    const paramBtn = document.getElementById('paramBtn');
    const creditsBtn = document.getElementById('creditsBtn');
    const paramModal = document.getElementById('paramModal');
    const creditsModal = document.getElementById('creditsModal');
    const closeParam = document.getElementById('closeParam');
    const closeCredits = document.getElementById('closeCredits');
    // Affichage/masquage des modales
    paramBtn?.addEventListener('click', () => paramModal.style.display = 'flex');
    creditsBtn?.addEventListener('click', () => creditsModal.style.display = 'flex');
    closeParam?.addEventListener('click', () => paramModal.style.display = 'none');
    closeCredits?.addEventListener('click', () => creditsModal.style.display = 'none');
    // Volume dynamique
    const volumeSlider = document.getElementById('volume');
    const volumeValue = document.getElementById('volumeValue');
    if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', e => {
            volumeValue.textContent = e.target.value;
        });
    }
    // Stockage des préférences
    const layoutSelect = document.getElementById('layout');
    layoutSelect?.addEventListener('change', e => {
        localStorage.setItem('keyboardLayout', e.target.value);
    });
    volumeSlider?.addEventListener('change', e => {
        localStorage.setItem('gameVolume', e.target.value);
    });
    // Charger préférences
    const layout = localStorage.getItem('keyboardLayout');
    if (layout)
        layoutSelect.value = layout;
    const vol = localStorage.getItem('gameVolume');
    if (vol) {
        volumeSlider.value = vol;
        if (volumeValue) {
            volumeValue.textContent = vol;
        }
    }
    // Affichage/masquage du jeu
    const gameContainer = document.getElementById('game-container');
    playBtn?.addEventListener('click', () => {
        menuContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        // Lancer le jeu JS (fonction exportée par game.js)
        import('./game.js').then(mod => {
            if (mod && typeof mod.startGame === 'function')
                mod.startGame();
        });
    });
    // Bouton "Menu principal" dans le jeu
    const menuBtn = document.getElementById('menuBtn');
    menuBtn?.addEventListener('click', () => {
        gameContainer.style.display = 'none';
        menuContainer.style.display = 'flex';
        // Arrêter le jeu si besoin (fonction exportée par game.js)
        import('./game.js').then(mod => {
            if (mod && typeof mod.stopGame === 'function')
                mod.stopGame();
        });
    });
});
