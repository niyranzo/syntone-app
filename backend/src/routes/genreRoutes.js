import { Router } from 'express';
import {
  getGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
} from '../controllers/genreController.js';

const router = Router();

router.get('/', getGenres);           // GET /genres
router.get('/:id', getGenreById);     // GET /genres/:id
router.post('/', createGenre);        // POST /genres
router.put('/:id', updateGenre);      // PUT /genres/:id
router.delete('/:id', deleteGenre);   // DELETE /genres/:id

export default router;
