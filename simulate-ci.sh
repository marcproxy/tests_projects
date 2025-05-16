#!/bin/bash

echo "========================================================"
echo "=== SIMULATION DE LA PIPELINE CI/CD GITHUB ACTIONS  ==="
echo "========================================================"

# Définir des couleurs pour une meilleure lisibilité
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour exécuter une commande et afficher un statut
run_step() {
  local command="$1"
  local description="$2"
  
  echo -e "\n${YELLOW}>>> $description${NC}"
  echo -e "Commande: ${YELLOW}$command${NC}"
  
  if eval "$command"; then
    echo -e "${GREEN}✓ SUCCÈS${NC}"
    return 0
  else
    echo -e "${RED}✗ ÉCHEC${NC}"
    return 1
  fi
}

# Fonction pour gérer les erreurs
handle_error() {
  echo -e "\n${RED}!!! ERREUR: $1${NC}"
  echo "Cette étape a échoué, mais la simulation continue."
}

# 1. Lint & Type-Check
echo -e "\n${YELLOW}==== JOB: Lint & Type-Check ====${NC}"

run_step "yarn lint" "Exécution du linting" || handle_error "Lint a échoué"
run_step "yarn workspace node tsc --noEmit" "Vérification des types Node" || handle_error "TypeCheck Node a échoué"
run_step "yarn workspace react-app tsc --noEmit" "Vérification des types React" || handle_error "TypeCheck React a échoué"
run_step "yarn workspace ng-app tsc --noEmit" "Vérification des types Angular" || handle_error "TypeCheck Angular a échoué"

# 2. Backend Tests (Node)
echo -e "\n${YELLOW}==== JOB: Backend Tests ====${NC}"

cd packages/node || handle_error "Le répertoire packages/node n'existe pas"
run_step "yarn test" "Exécution des tests backend" || handle_error "Tests backend échoués"
cd ../..

# 3. Frontend Tests (React & Angular)
echo -e "\n${YELLOW}==== JOB: Frontend Tests (React) ====${NC}"

cd packages/react-app || handle_error "Le répertoire packages/react-app n'existe pas"
run_step "yarn test:coverage" "Exécution des tests React avec couverture" || handle_error "Tests React échoués"
cd ../..

echo -e "\n${YELLOW}==== JOB: Frontend Tests (Angular) ====${NC}"

cd packages/ng-app || handle_error "Le répertoire packages/ng-app n'existe pas"
run_step "yarn test --watch=false --browsers=ChromeHeadless" "Exécution des tests Angular" || handle_error "Tests Angular échoués"
cd ../..

# 4. E2E Tests (Playwright)
echo -e "\n${YELLOW}==== JOB: E2E Tests ====${NC}"

run_step "yarn e2e" "Exécution des tests E2E" || handle_error "Tests E2E échoués"

# Rapport final
echo -e "\n${YELLOW}==== RAPPORT FINAL ====${NC}"
echo "La simulation de la pipeline CI/CD est terminée."
echo "Vérifiez les résultats ci-dessus pour voir si toutes les étapes ont réussi."
echo "N'oubliez pas que cette simulation n'inclut pas toutes les fonctionnalités de GitHub Actions."