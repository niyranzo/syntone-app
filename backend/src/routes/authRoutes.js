import express from 'express';
import { login, logout, register } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { changePassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/change-password', authMiddleware, changePassword);

export default router;
