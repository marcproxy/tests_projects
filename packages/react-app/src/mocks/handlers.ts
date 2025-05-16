// src/mocks/handlers.ts
import { rest } from 'msw';

// Données de test
const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson' }
];

export const handlers = [
  // Intercepter toutes les requêtes GET vers /users, quelle que soit l'URL de base
  rest.get('*/users', (req: any, res: any, ctx: any) => {
    console.log('MSW: Intercepted GET /users request');
    return res(
      // Ajouter des headers pour éviter les problèmes CORS
      ctx.status(200),
      ctx.json(users)
    );
  }),
  
  rest.get('/users', (req: any, res: any, ctx: any) => {
    console.log('MSW: Intercepted GET /users request (relative URL)');
    return res(
      ctx.status(200),
      ctx.json(users)
    );
  }),
  
  // Pour être sûr, ajoutez aussi l'URL complète
  rest.get('http://localhost/users', (req: any, res: any, ctx: any) => {
    console.log('MSW: Intercepted GET http://localhost/users request');
    return res(
      ctx.status(200),
      ctx.json(users)
    );
  }),
  
  // Intercepter les requêtes POST de la même manière
  rest.post('/users', async (req: any, res: any, ctx: any) => {
    const { name } = await req.json();
    
    if (!name) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'Le nom est requis' })
      );
    }
    
    const newUser = {
      id: users.length + 1,
      name
    };
    
    users.push(newUser);
    
    return res(
      ctx.status(201),
      ctx.json(newUser)
    );
  })
];
