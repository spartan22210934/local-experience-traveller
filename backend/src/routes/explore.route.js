import express from 'express';
import { getTrendingPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.get('/trending', getTrendingPosts);
// router.get('/nearby', getNearbyPosts); // Placeholder

export default router;
