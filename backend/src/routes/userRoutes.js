import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.get('/', getUsers);           // GET /users
router.get('/:id', getUserById);     // GET /users/:id
router.put('/:id', updateUser);      // PUT /users/:id
router.delete('/:id', deleteUser);   // DELETE /users/:id

export default router;
