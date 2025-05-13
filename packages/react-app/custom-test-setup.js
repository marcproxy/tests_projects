#!/usr/bin/env node

// Charger les polyfills nécessaires pour MSW
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Charger whatwg-fetch pour la compatibilité fetch
require('whatwg-fetch');

// Exécuter le script de test de react-scripts
require('child_process').execSync(
  'react-scripts test --env=jsdom --coverage --watchAll=false',
  { stdio: 'inherit' }
);
