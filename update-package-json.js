const fs = require('fs');
const path = require('path');

// Chemin vers le package.json racine
const packageJsonPath = path.join(__dirname, 'package.json');

// Lire le fichier
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Modifier le script start:react
packageJson.scripts['start:react:no-overlay'] = 'node start-react-no-overlay.js';

// Écrire le fichier mis à jour
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('package.json mis à jour avec succès.');
