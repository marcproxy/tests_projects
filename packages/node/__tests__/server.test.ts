import request from 'supertest';
import { app, startServer } from '../src/server';
import { expect } from '@jest/globals';

describe('Server', () => {
  // Test que l'application Express est configurée correctement
  test('express app is defined', () => {
    expect(app).toBeDefined();
  });

  // Test que l'application a le middleware JSON configuré
  test('app has JSON middleware configured', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'TestUser' });
    
    expect(response.status).toBe(201);
  });

  // Test que le routeur users est correctement monté
  test('users router is mounted at /users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test d'une route inexistante
  test('nonexistent routes return 404', async () => {
    const response = await request(app).get('/this-route-does-not-exist');
    expect(response.status).toBe(404);
  });

  // Test de la fonction startServer
  test('startServer function returns a server instance', () => {
    // Mock de app.listen
    const originalListen = app.listen;
    const mockServer = { close: jest.fn() };
    app.listen = jest.fn().mockImplementation((port, callback) => {
      if (callback) callback();
      return mockServer;
    });
    
    // Mock de console.log pour éviter l'affichage pendant les tests
    const originalConsoleLog = console.log;
    console.log = jest.fn();
    
    // Appel de la fonction startServer
    const server = startServer(3000);
    
    // Vérifications
    expect(app.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(server).toBe(mockServer);
    
    // Restauration des fonctions originales
    app.listen = originalListen;
    console.log = originalConsoleLog;
  });
});
