// Définition des murs invisibles pour le plateau de jeu
// Les valeurs par défaut sont sur toute la hauteur du canvas, à gauche et à droite
// Modifiez wallThickness pour ajuster la largeur des murs


// Définition des limites de murs invisibles pour le plateau de jeu
// Modifiez ces valeurs selon la taille de vos murs sur le décor

// Les murs sont proportionnels à la taille du canvas
export function getWallBounds(canvas) {
  return {
    left: canvas.width * 0.015,    // 1.5% largeur
    right: canvas.width * 0.088,   // 8.8% largeur
    top: canvas.height * 0.284,    // 28.4% hauteur
    bottom: canvas.height * 0.033  // 3.3% hauteur
  };
}

export function clampToBounds(x, y, size, canvas) {
  // Récupère les murs dynamiques
  const wallBounds = getWallBounds(canvas);
  const minX = wallBounds.left + size;
  const maxX = canvas.width - wallBounds.right - size;
  const minY = wallBounds.top + size;
  const maxY = canvas.height - wallBounds.bottom - size;
  return {
    x: Math.max(minX, Math.min(x, maxX)),
    y: Math.max(minY, Math.min(y, maxY))
  };
}
