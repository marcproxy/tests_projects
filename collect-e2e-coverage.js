const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script pour collecter la couverture de code des tests E2E
 */
async function collectE2ECoverage() {
  console.log('Collecte de la couverture de code des tests E2E...');

  try {
    // Créer le répertoire de couverture s'il n'existe pas
    const coverageDir = path.join(__dirname, 'coverage');
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir, { recursive: true });
    }

    // Exécuter les tests E2E avec Istanbul
    console.log('Exécution des tests E2E avec couverture...');
    execSync('npx cross-env NODE_ENV=test REACT_APP_COVERAGE=true npx playwright test --config=e2e/playwright.coverage.config.ts', {
      stdio: 'inherit'
    });

    // Générer le rapport de couverture
    console.log('Génération du rapport de couverture...');
    execSync('npx nyc report --reporter=html --reporter=text --reporter=lcov', {
      stdio: 'inherit'
    });

    console.log('Rapport de couverture généré avec succès dans le répertoire ./coverage');
  } catch (error) {
    console.error('Erreur lors de la collecte de la couverture:', error);
    process.exit(1);
  }
}

collectE2ECoverage();
