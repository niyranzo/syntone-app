import { Router } from 'express';
import {
  getPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';

const router = Router();

router.get('/', getPosts);                 // GET /posts
router.get('/:id', getPostById);           // GET /posts/:id
router.get('/user/:userId', getPostsByUser); // GET /posts/user/:userId
router.post('/', createPost);              // POST /posts
router.put('/:id', updatePost);            // PUT /posts/:id
router.delete('/:id', deletePost);         // DELETE /posts/:id

export default router;
