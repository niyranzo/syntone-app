import { Router } from 'express';
import {
  getFavoritesByUser,
  addFavorite,
  deleteFavorite
} from '../controllers/favoriteController.js';

const router = Router();

router.get('/user/:userId', getFavoritesByUser);               // GET favoritos por usuario
router.post('/', addFavorite);                                 // POST nuevo favorito
router.delete('/:userId/:spotifyId', deleteFavorite);          // DELETE favorito

export default router;
