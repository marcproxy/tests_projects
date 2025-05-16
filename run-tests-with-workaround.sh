#!/bin/bash

echo "=== Exécution des tests E2E avec contournement de l'overlay ==="

# 1. Copier le test mis à jour
cp e2e/tests/user-workflow-fixed.spec.ts e2e/tests/user-workflow.spec.ts
cp e2e/tests/user-workflow-fixed.spec.ts e2e/tests/user.spec.ts

# 2. Démarrer React dans un terminal séparé
echo -e "\n=== Démarrage de l'application React sans overlay (attendez quelques secondes) ==="
yarn start:react:no-overlay &
REACT_PID=$!

# Attendre que l'application démarre
echo "Attente du démarrage de l'application (10 secondes)..."
sleep 10

# 3. Exécuter les tests
echo -e "\n=== Exécution des tests E2E ==="
yarn e2e

# 4. Arrêter l'application React
echo -e "\n=== Arrêt de l'application React ==="
kill $REACT_PID

echo -e "\n=== Tests terminés ==="
