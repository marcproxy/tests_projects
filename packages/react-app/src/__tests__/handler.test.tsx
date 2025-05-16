// src/__tests__/handlers.test.tsx
import { handlers } from '../mocks/handlers';
import { setupServer } from 'msw/node';
import 'whatwg-fetch'; // Polyfill fetch pour Node.js

// Configurer le serveur MSW
const server = setupServer(...handlers);

// Fonction utilitaire pour vérifier la structure d'un utilisateur
const isValidUser = (user: any) => {
  return typeof user.id === 'number' && typeof user.name === 'string';
};

describe('Handlers MSW', () => {
  // Active le serveur MSW avant tous les tests
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  
  // Réinitialise les handlers entre les tests
  afterEach(() => server.resetHandlers());
  
  // Ferme le serveur après tous les tests
  afterAll(() => server.close());

  it('les handlers sont correctement définis', () => {
    // Vérifier que les handlers existent
    expect(handlers.length).toBeGreaterThan(0);
    
    // Vérifier qu'il y a au moins un handler GET et un handler POST
    const hasGetHandler = handlers.some((handler: any) => 
      handler.info.method === 'GET' && handler.info.path.includes('users')
    );
    const hasPostHandler = handlers.some((handler: any) => 
      handler.info.method === 'POST' && handler.info.path.includes('users')
    );
    
    expect(hasGetHandler).toBe(true);
    expect(hasPostHandler).toBe(true);
  });
  
  // Test simplifié qui vérifie la structure des gestionnaires
  it('le handler GET est correctement configuré', () => {
    // Trouver un handler GET pour /users
    const getUserHandler = handlers.find((handler: any) => 
      handler.info.method === 'GET' && handler.info.path.includes('users')
    );
    
    expect(getUserHandler).toBeDefined();
    
    // Vérifier que le handler GET est une fonction
    expect(typeof getUserHandler.resolver).toBe('function');
  });
  
  it('le handler POST est correctement configuré', () => {
    // Trouver un handler POST pour /users
    const postUserHandler = handlers.find((handler: any) => 
      handler.info.method === 'POST' && handler.info.path.includes('users')
    );
    
    expect(postUserHandler).toBeDefined();
    
    // Vérifier que le handler POST est une fonction
    expect(typeof postUserHandler.resolver).toBe('function');
  });
  
  // Test des URLs supportées
  it('supporte différentes formes d\'URL pour les requêtes GET', () => {
    // Vérifier les différents patterns d'URL
    const urlPatterns = handlers
      .filter((handler: any) => handler.info.method === 'GET')
      .map((handler: any) => handler.info.path);
    
    // Vérifier qu'au moins une des formes suivantes est supportée
    const hasWildcardPattern = urlPatterns.some(pattern => pattern.includes('*'));
    const hasRelativePattern = urlPatterns.some(pattern => pattern === '/users');
    const hasAbsolutePattern = urlPatterns.some(pattern => pattern.includes('localhost'));
    
    expect(hasWildcardPattern || hasRelativePattern || hasAbsolutePattern).toBe(true);
  });
});