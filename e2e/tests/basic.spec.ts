
import { test, expect } from '@playwright/test';

// Test simple qui devrait toujours être trouvé
test('Basic test', async ({ page }) => {
  // Test très simple qui échoue délibérément avec un message explicite
  await page.goto('about:blank');
  
  // Log le chemin complet du test pour vérifier qu'il est bien exécuté
  console.log('Test exécuté depuis:', __filename);
  
  // Ajoutez une assertion simple qui réussira toujours
  expect(true).toBe(true);
});