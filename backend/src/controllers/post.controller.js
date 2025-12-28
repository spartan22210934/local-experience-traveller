import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';

export const createPost = async (req, res) => {
    try {
        const post = new Post({ ...req.body, author: req.userId });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTrendingPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ upvotes: -1 }).limit(10);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username avatar');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.userId)) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter(id => id.toString() !== req.userId);
        }
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const upvotePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.upvotes.includes(req.userId)) {
            post.upvotes.push(req.userId);
        } else {
            post.upvotes = post.upvotes.filter(id => id.toString() !== req.userId);
        }
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const comment = new Comment({
            postId: req.params.id,
            author: req.userId,
            text: req.body.text
        });
        await comment.save();

        // Update post comment count
        await Post.findByIdAndUpdate(req.params.id, { $inc: { commentCount: 1 } });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.id }).populate('author', 'username avatar').sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
