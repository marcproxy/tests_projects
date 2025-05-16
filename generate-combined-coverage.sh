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
