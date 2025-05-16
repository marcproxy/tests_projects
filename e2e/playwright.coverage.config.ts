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
