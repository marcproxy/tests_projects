// __tests__/users.advanced.test.ts
import request from 'supertest';
import { app } from '../src/server';
import { resetStore, createUser } from '../src/usersStore';
import * as fixtures from './fixtures';
import * as externalApi from '../src/externalApi';

describe('API Users – tests avancés', () => {
  // Avant chaque test, on initialise le store avec nos fixtures
  beforeEach(() => {
    resetStore();
    
    // Créer réellement les utilisateurs au lieu de simplement les mocker
    fixtures.initialUsers.forEach(user => {
      createUser(user.name);
    });
  });

  describe('GET /users/:id', () => {
    const cases = [
      { id: 1, expected: { id: 1, name: fixtures.alice.name }, status: 200 },
      { id: 2, expected: { id: 2, name: fixtures.bob.name }, status: 200 },
      { id: 3, expected: { error: 'User not found' }, status: 404 }
    ] as const;

    test.each(cases)('id=$id → $status', async ({ id, expected, status }) => {
      // On mocke le store pour renvoyer fixtures.initialUsers
      jest.spyOn(externalApi, 'fetchUserData').mockResolvedValue({ extra: 'info' });
      
      // On appelle
      const res = await request(app).get(`/users/${id}`);
      expect(res.status).toBe(status);
      expect(res.body).toEqual(expected);
    });
  });

  it('PUT /users/1 sans body.name → 400', async () => {
    const res = await request(app).put('/users/1').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'name is required' });
  });

  it('PUT /users/99 non existant → 404', async () => {
    const res = await request(app).put('/users/99').send({ name: 'New' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });

  it('PUT /users/2 avec name → 200 & user mis à jour', async () => {
    // Les fixtures sont déjà créées dans beforeEach, pas besoin de créer Bob à nouveau
    const res = await request(app).put('/users/2').send({ name: 'Bobby' });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.name).toBe('Bobby');
  });
});