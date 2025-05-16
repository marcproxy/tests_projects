// src/mocks/handlers.ts - Version pour MSW v1+
import { http, HttpResponse } from 'msw'

// Données de test
const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson' }
];

export const handlers = [
  // Intercepter les requêtes GET
  http.get('*/users', () => {
    console.log('MSW: Intercepted GET /users request');
    return HttpResponse.json(users);
  }),
  
  http.get('/users', () => {
    console.log('MSW: Intercepted GET /users request (relative URL)');
    return HttpResponse.json(users);
  }),
  
  http.get('http://localhost/users', () => {
    console.log('MSW: Intercepted GET http://localhost/users request');
    return HttpResponse.json(users);
  }),
  
  // Intercepter les requêtes POST
  http.post('/users', async ({ request }) => {
    const data = await request.json();
    const { name } = data;
    
    if (!name) {
      return new HttpResponse(
        JSON.stringify({ message: 'Le nom est requis' }),
        { status: 400 }
      );
    }
    
    const newUser = {
      id: users.length + 1,
      name
    };
    
    users.push(newUser);
    
    return HttpResponse.json(newUser, { status: 201 });
  })
];
