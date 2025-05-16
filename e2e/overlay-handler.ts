import { Page } from '@playwright/test';

/**
 * Fonction qui gère l'overlay webpack en le cachant s'il est présent
 */
export async function handleWebpackOverlay(page: Page): Promise<void> {
  try {
    // Vérifier si l'overlay est présent
    const overlay = await page.$('#webpack-dev-server-client-overlay');
    if (overlay) {
      console.log('Overlay webpack détecté, tentative de suppression...');
      
      // Exécuter du JavaScript dans la page pour supprimer l'overlay
      await page.evaluate(() => {
        const overlay = document.getElementById('webpack-dev-server-client-overlay');
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      });
      
      console.log('Overlay webpack supprimé.');
    }
  } catch (error) {
    console.error('Erreur lors de la gestion de l\'overlay:', error);
  }
}
