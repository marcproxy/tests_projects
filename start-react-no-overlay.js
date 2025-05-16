// start-react-no-overlay.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Chemin vers le dossier node_modules de react-scripts dans le workspace
const reactScriptsPath = path.join(__dirname, 'packages/react-app/node_modules/react-scripts');

// Vérifier si le fichier webpack.config.js existe
const webpackConfigPath = path.join(reactScriptsPath, 'config/webpack.config.js');

// Fonction pour modifier le fichier webpack.config.js pour désactiver l'overlay
function disableOverlay() {
  if (fs.existsSync(webpackConfigPath)) {
    console.log('Modification du fichier webpack.config.js pour désactiver l\'overlay...');
    
    let content = fs.readFileSync(webpackConfigPath, 'utf8');
    
    // Vérifier si la modification a déjà été appliquée
    if (content.includes('overlay: false')) {
      console.log('La configuration overlay: false est déjà présente.');
      return;
    }
    
    // Ajouter overlay: false dans la configuration de devServer
    content = content.replace(
      /devServer: {/,
      'devServer: {\n      overlay: false,'
    );
    
    fs.writeFileSync(webpackConfigPath, content, 'utf8');
    console.log('Configuration webpack modifiée avec succès.');
  } else {
    console.log('Fichier webpack.config.js non trouvé à ' + webpackConfigPath);
  }
}

// Exécuter la modification
disableOverlay();

// Démarrer l'application React comme d'habitude
console.log('Démarrage de l\'application React...');
const reactApp = spawn('yarn', ['workspace', 'react-app', 'start'], {
  stdio: 'inherit',
  shell: true
});

reactApp.on('close', (code) => {
  console.log(`L'application React s'est arrêtée avec le code ${code}`);
});
