import { Router } from 'express';
import {
  getComments,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';

const router = Router();

router.get('/', getComments);               // GET /comments
router.get('/post/:postId', getCommentsByPost); // GET /comments/post/:postId
router.post('/', createComment);            // POST /comments
router.put('/:id', updateComment);           // PUT /comments/:id
router.delete('/:id', deleteComment);        // DELETE /comments/:id

export default router;
