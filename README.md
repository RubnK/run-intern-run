# Run, Intern, Run !

Jeu d’arcade 8-bits en JavaScript/TypeScript (canvas)

---

## Installation & Lancement

1. **Cloner le dépôt**
	```sh
	git clone <repo-url>
	cd run-intern-run
	```
2. **Installer les dépendances**
	```sh
	npm install -g serve
	```
3. **Compiler le menu TypeScript**
	```sh
	npx tsc
	```
4. **Lancer le serveur local**
	```sh
	serve .
	```
5. **Jouer**
	- Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## Architecture du projet

```
run-intern-run/
│
├── index.html                # Page unique (menu + jeu)
├── style/
│   └── style.css             # Styles 8-bits, boutons, modales, etc.
├── script/
│   ├── menu.ts               # Logique du menu (TypeScript)
│   ├── menu.js               # (Généré) Menu compilé
│   ├── game.js               # Logique du jeu (canvas, collisions, sons...)
│   ├── intern.js             # Classe Intern (joueur)
│   ├── boss.js               # Classe Boss (adversaire)
│   └── walls.js              # Limites invisibles du plateau
├── assets/
│   ├── background/
│   │   └── background.png    # Image de fond
│   ├── sound/
│   │   ├── background.mp3    # Musique de fond
│   │   └── cashsound.mp3     # Son de gain d’argent
│   └── sprites/
│       ├── intern.png        # Sprite du joueur
│       ├── Boss.png          # Sprite du boss
│       ├── heart_full.png    # Vie pleine
│       ├── heart_empty.png   # Vie perdue
│       └── PixelOfficeAssets.png # Décor pixel art
├── tsconfig.json             # Config TypeScript (ES2020, outDir script/)
└── README.md                 # Ce fichier
```

---

## Fonctionnalités principales
- **Menu principal** (TypeScript) : Jouer, Paramètres (clavier, volume), Crédits
- **Jeu** (JavaScript) :
  - Mouvement intern (flèches), boss (ZQSD ou WASD)
  - Collisions murs, obstacles, bureaux
  - Système de vies (sprites coeurs)
  - Argent qui monte, animations + sons
  - Musique de fond, volume réglable
  - Boutons Rejouer/Menu, écran de fin 8-bits

---

## Lien GitHub
- https://github.com/RubnK/run-intern-run

## Auteurs
- Alpino & RubnK — EFREI 2025