#!/bin/bash

echo "=== Choisir la version de MSW ==="
echo "1. MSW v0.47.4 (ancienne syntaxe)"
echo "2. MSW v1+ (nouvelle syntaxe)"
read -p "Votre choix (1 ou 2): " choice

if [ "$choice" = "1" ]; then
    echo "=== Installation de MSW v0.47.4 ==="
    npm uninstall msw
    npm install --save-dev msw@0.47.4 --legacy-peer-deps
    cp packages/react-app/package.msw-v0.json packages/react-app/package.json
elif [ "$choice" = "2" ]; then
    echo "=== Migration vers MSW v1 ==="
    npm uninstall msw
    npm install --save-dev msw@latest --legacy-peer-deps
    cp packages/react-app/package.msw-v1.json packages/react-app/package.json
    
    # Renommer les fichiers handlers, browser et server
    mv packages/react-app/src/mocks/handlers-v1.ts packages/react-app/src/mocks/handlers.ts
    mv packages/react-app/src/mocks/browser-v1.ts packages/react-app/src/mocks/browser.ts
    mv packages/react-app/src/mocks/server-v1.ts packages/react-app/src/mocks/server.ts
else
    echo "Choix non valide. Aucune modification effectuée."
fi
