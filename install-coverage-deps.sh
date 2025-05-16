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
