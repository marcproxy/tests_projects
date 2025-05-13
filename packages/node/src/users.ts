import { Router } from 'express';
import { getUsers, createUser, getUserById, updateUserName } from './usersStore';

const router = Router();

// GET /users - liste des utilisateurs
router.get("/", (_req, res) => {
  res.status(200).json(getUsers());
});

// POST /users - création d'utilisateur
router.post("/", (req: any, res: any) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  const user = createUser(name);
  return res.status(201).json(user);
});

// GET /users/:id - détail d'un utilisateur
router.get('/:id', (req: any, res: any) => {
  const id = Number(req.params.id);
  const user = getUserById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.status(200).json(user);
});

// PUT /users/:id - mise à jour d'un utilisateur
router.put('/:id', (req: any, res: any) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const updated = updateUserName(id, name);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.status(200).json(updated);
});

export default router;