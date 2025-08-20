import { Router } from 'express';
import {
  assignGenres,
  getGenresByUser
} from '../controllers/userGenreController.js';

const router = Router();

router.post('/assign', assignGenres); // Recibe { user_id, genre_ids: [1,2,3] }
router.get('/:userId', getGenresByUser);

export default router;
