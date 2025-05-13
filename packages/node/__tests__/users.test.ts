import request from 'supertest';
import { app } from '../src/server';
import { resetStore } from '../src/usersStore';

beforeEach(() => {
  resetStore();
});

// Test GET /users initial
test('GET /users returns empty array initially', async () => {
  const response = await request(app).get('/users');
  expect(response.status).toBe(200);
  expect(response.body).toEqual([]);
});

// Test POST /users sans name
test('POST /users without name returns 400', async () => {
  const response = await request(app)
    .post('/users')
    .send({});
  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    error: 'name is required'
  });
});

// Test avec name vide
test('POST /users with empty name returns 400', async () => {
  const response = await request(app)
    .post('/users')
    .send({ name: '' });
  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    error: 'name is required'
  });
});

// Test POST /users avec name valide
test('POST /users with name returns 201 and user', async () => {
  const response = await request(app)
    .post('/users')
    .send({ name: 'Alice' });
  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
  expect(response.body.name).toBe('Alice');
});

// Test POST /users avec des attributs supplémentaires
test('POST /users with extra attributes still works', async () => {
  const response = await request(app)
    .post('/users')
    .send({ name: 'Bob', extraField: 'should be ignored' });
  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
  expect(response.body.name).toBe('Bob');
  // Vérifie que les champs supplémentaires ne sont pas inclus
  expect(response.body.extraField).toBeUndefined();
});

// Test GET /users après création
test('GET /users after creation returns list with user', async () => {
  await request(app).post('/users').send({ name: 'Alice' });
  const response = await request(app).get('/users');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].id).toBeDefined();
  expect(response.body[0].name).toBe('Alice');
});

// Test création de plusieurs utilisateurs
test('can create multiple users and get them all', async () => {
  await request(app).post('/users').send({ name: 'Alice' });
  await request(app).post('/users').send({ name: 'Bob' });
  await request(app).post('/users').send({ name: 'Charlie' });
  
  const response = await request(app).get('/users');
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(3);
  
  const names = response.body.map((user: any) => user.name);
  expect(names).toContain('Alice');
  expect(names).toContain('Bob');
  expect(names).toContain('Charlie');
});