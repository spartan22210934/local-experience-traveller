import express from 'express';
import { createPost, getPosts, getPost, getUserPosts, likePost, upvotePost, addComment, getComments } from '../controllers/post.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/user/:userId', getUserPosts);
router.patch('/:id/like', verifyToken, likePost);
router.patch('/:id/upvote', verifyToken, upvotePost);
router.post('/:id/comments', verifyToken, addComment);
router.get('/:id/comments', getComments);

export default router;
