import { Router, Request, Response } from 'express';
import { getUsers, createUser, getUserById, updateUserName } from './usersStore';

const router = Router();

// GET /users/:id
router.get('/:id', (req: any, res: any) => {
  const id = Number(req.params.id);
  const user = getUserById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PUT /users/:id
router.put('/:id', (req: any, res: any) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const updated = updateUserName(id, name);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
});

// Garder GET /users et POST /users...
export default router;