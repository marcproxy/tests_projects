#!/bin/bash

echo "=== Configuration de la couverture de code (coverage) pour les tests ==="

# 1. Mise à jour du package.json pour ajouter les scripts de couverture
echo -e "\n=== Mise à jour du package.json pour la couverture de code ==="
cat > packages/react-app/package.json << 'EOF'
{
  "name": "react-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^29.5.0",
    "@types/node": "^16.18.12",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "DISABLE_ESLINT_PLUGIN=true react-scripts build",
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/index.{js,jsx,ts,tsx}",
      "!src/serviceWorker.{js,jsx,ts,tsx}",
      "!src/reportWebVitals.{js,jsx,ts,tsx}",
      "!src/setupTests.{js,jsx,ts,tsx}",
      "!src/mocks/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    },
    "coverageReporters": [
      "text",
      "lcov",
      "html"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@testing-library/react-hooks": "^8.0.1",
    "@types/testing-library__jest-dom": "^5.14.5",
    "msw": "^0.47.4"
  },
  "msw": {
    "workerDirectory": "public"
  }
}
EOF

# 2. Mise à jour du package.json racine pour ajouter des scripts de couverture globaux
echo -e "\n=== Mise à jour du package.json racine pour la couverture de code ==="
node -e "
const fs = require('fs');
const path = require('path');

// Chemin vers le package.json racine
const packageJsonPath = path.join(process.cwd(), 'package.json');

// Lire le fichier
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Ajouter les scripts de couverture
packageJson.scripts = packageJson.scripts || {};
packageJson.scripts['coverage'] = 'yarn workspace react-app test:coverage';
packageJson.scripts['e2e:coverage'] = 'PLAYWRIGHT_TEST_COVERAGE=1 yarn e2e';

// Écrire le fichier mis à jour
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('package.json racine mis à jour avec succès.');
"

# 3. Création d'un fichier de test unitaire pour App.tsx avec une meilleure couverture
echo -e "\n=== Création d'un test unitaire pour App.tsx ==="
mkdir -p packages/react-app/src/__tests__
cat > packages/react-app/src/__tests__/App.test.tsx << 'EOF'
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
  test('renders user management header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Gestion des utilisateurs/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('allows adding a new user', () => {
    render(<App />);
    
    // Vérifier l'état initial
    expect(screen.getByText(/Aucun utilisateur/i)).toBeInTheDocument();
    
    // Saisir un nom d'utilisateur
    const input = screen.getByPlaceholderText(/Nom de l'utilisateur/i);
    fireEvent.change(input, { target: { value: 'Diane' } });
    
    // Cliquer sur le bouton Créer
    const button = screen.getByText('Créer');
    fireEvent.click(button);
    
    // Vérifier que l'utilisateur a été ajouté
    expect(screen.getByText('Diane')).toBeInTheDocument();
    
    // Vérifier que le champ a été vidé
    expect(input).toHaveValue('');
  });

  test('does not add empty user names', () => {
    render(<App />);
    
    // Vérifier l'état initial
    expect(screen.getByText(/Aucun utilisateur/i)).toBeInTheDocument();
    
    // Saisir un nom d'utilisateur vide (juste des espaces)
    const input = screen.getByPlaceholderText(/Nom de l'utilisateur/i);
    fireEvent.change(input, { target: { value: '   ' } });
    
    // Cliquer sur le bouton Créer
    const button = screen.getByText('Créer');
    fireEvent.click(button);
    
    // Vérifier qu'aucun utilisateur n'a été ajouté
    expect(screen.getByText(/Aucun utilisateur/i)).toBeInTheDocument();
  });

  test('can add multiple users', () => {
    render(<App />);
    
    const input = screen.getByPlaceholderText(/Nom de l'utilisateur/i);
    const button = screen.getByText('Créer');
    
    // Ajouter le premier utilisateur
    fireEvent.change(input, { target: { value: 'Diane' } });
    fireEvent.click(button);
    
    // Ajouter le deuxième utilisateur
    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(button);
    
    // Vérifier que les deux utilisateurs sont affichés
    expect(screen.getByText('Diane')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
EOF

# 4. Configuration de Playwright pour la couverture de code
echo -e "\n=== Configuration de Playwright pour la couverture de code ==="
cat > e2e/playwright.coverage.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: ['html', 'line'],
  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
        
        // Configuration pour la couverture de code
        launchOptions: {
          args: [
            '--disable-web-security', // Pour permettre la collecte de couverture entre origines
            '--allow-file-access-from-files', // Pour accéder aux fichiers locaux
          ]
        }
      },
    },
  ],
  
  webServer: {
    command: 'cd ../packages/react-app && cross-env NODE_ENV=test REACT_APP_COVERAGE=true react-scripts start',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    env: {
      BROWSER: 'none', // Empêcher l'ouverture automatique du navigateur
      PORT: '3000',
    },
  },
});
EOF

# 5. Création d'un script pour collecter la couverture des tests E2E
echo -e "\n=== Création d'un script pour collecter la couverture des tests E2E ==="
cat > collect-e2e-coverage.js << 'EOF'
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
EOF

# 6. Installer les dépendances nécessaires pour la couverture
echo -e "\n=== Installation des dépendances nécessaires pour la couverture ==="
cat > install-coverage-deps.sh << 'EOF'
#!/bin/bash

# Installer les dépendances globales
npm install --save-dev nyc cross-env @istanbuljs/nyc-config-typescript istanbul-lib-coverage

# Installer les dépendances dans react-app
cd packages/react-app
npm install --save-dev nyc @istanbuljs/nyc-config-typescript istanbul-lib-coverage

# Créer la configuration nyc
cd ../..
cat > .nycrc << 'NYCCONTENT'
{
  "extends": "@istanbuljs/nyc-config-typescript",
  "all": true,
  "check-coverage": true,
  "include": [
    "packages/react-app/src/**/*.{js,jsx,ts,tsx}"
  ],
  "exclude": [
    "**/*.{test,spec}.{js,jsx,ts,tsx}",
    "**/node_modules/**",
    "**/coverage/**",
    "**/*.d.ts",
    "**/serviceWorker.{js,jsx,ts,tsx}",
    "**/reportWebVitals.{js,jsx,ts,tsx}",
    "**/setupTests.{js,jsx,ts,tsx}",
    "**/mocks/**"
  ],
  "reporter": [
    "html",
    "lcov",
    "text",
    "text-summary"
  ],
  "branches": 70,
  "lines": 70,
  "functions": 70,
  "statements": 70
}
NYCCONTENT

echo "Dépendances installées avec succès !"
EOF
chmod +x install-coverage-deps.sh

# 7. Création d'un rapport de couverture combiné (tests unitaires + E2E)
echo -e "\n=== Création d'un script pour générer un rapport de couverture combiné ==="
cat > generate-combined-coverage.sh << 'EOF'
#!/bin/bash

echo "=== Génération d'un rapport de couverture combiné (tests unitaires + E2E) ==="

# 1. Exécuter les tests unitaires avec couverture
echo -e "\n=== Exécution des tests unitaires avec couverture ==="
yarn workspace react-app test:coverage

# 2. Exécuter les tests E2E avec couverture
echo -e "\n=== Exécution des tests E2E avec couverture ==="
node collect-e2e-coverage.js

# 3. Combiner les rapports de couverture
echo -e "\n=== Combinaison des rapports de couverture ==="
npx nyc merge ./coverage ./coverage/coverage-final.json

# 4. Générer le rapport combiné
echo -e "\n=== Génération du rapport combiné ==="
npx nyc report --reporter=html --reporter=text --reporter=lcov --temp-dir=./coverage

echo -e "\n=== Rapport de couverture combiné généré avec succès ==="
echo "Vous pouvez consulter le rapport dans le répertoire ./coverage/index.html"
EOF
chmod +x generate-combined-coverage.sh

# 8. Mise à jour du fichier index.tsx pour instrumenter la couverture
echo -e "\n=== Mise à jour du fichier index.tsx pour instrumenter la couverture ==="
cat > packages/react-app/src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Fonction pour envoyer la couverture au serveur à la fin des tests E2E
function setupCoverage() {
  if (process.env.REACT_APP_COVERAGE) {
    // @ts-ignore
    if (typeof window.__coverage__ !== 'undefined') {
      const originalBeforeUnload = window.onbeforeunload;
      window.onbeforeunload = function() {
        // Envoyer la couverture au serveur
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/coverage/client', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        // @ts-ignore
        xhr.send(JSON.stringify(window.__coverage__));
        
        if (originalBeforeUnload) {
          return originalBeforeUnload.apply(this, arguments);
        }
      };
      
      console.log('Instrumentation de couverture activée');
    }
  }
}

setupCoverage();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo -e "\n=== Configuration de la couverture de code terminée ! ==="
echo "Pour générer les rapports de couverture :"
echo "1. Installez les dépendances nécessaires : ./install-coverage-deps.sh"
echo "2. Exécutez les tests unitaires pour la couverture : yarn coverage"
echo "3. Pour un rapport complet (tests unitaires + E2E) : ./generate-combined-coverage.sh"