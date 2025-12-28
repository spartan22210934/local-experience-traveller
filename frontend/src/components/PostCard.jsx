import { Heart, ArrowBigUp, MessageSquare, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './PostCard.css';

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes.length);
    const [upvotes, setUpvotes] = useState(post.upvotes.length);
    const [liked, setLiked] = useState(user ? post.likes.includes(user._id) : false);
    const [upvoted, setUpvoted] = useState(user ? post.upvotes.includes(user._id) : false);

    const handleLike = async (e) => {
        e.preventDefault();
        if (!user) return alert('Login required');
        try {
            await client.patch(`/api/posts/${post._id}/like`);
            setLiked(!liked);
            setLikes(prev => liked ? prev - 1 : prev + 1);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpvote = async (e) => {
        e.preventDefault();
        if (!user) return alert('Login required');
        try {
            await client.patch(`/api/posts/${post._id}/upvote`);
            setUpvoted(!upvoted);
            setUpvotes(prev => upvoted ? prev - 1 : prev + 1);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Link to={`/post/${post._id}`} className="post-card-link">
            <div className="card post-card">
                <div className="post-image-container">
                    <img
                        src={post.images?.[0] || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=500'}
                        alt={post.title}
                        className="post-image"
                    />
                    <div className="category-badge">{post.category}</div>
                </div>

                <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-location">
                        <MapPin size={14} /> {post.location?.city || 'Unknown City'}
                    </p>
                    <p className="post-desc">{post.description.substring(0, 100)}...</p>

                    <div className="post-footer">
                        <div className="post-stats">
                            <button className={`stat-btn ${liked ? 'active-like' : ''}`} onClick={handleLike}>
                                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                                <span>{likes}</span>
                            </button>
                            <button className={`stat-btn ${upvoted ? 'active-upvote' : ''}`} onClick={handleUpvote}>
                                <ArrowBigUp size={20} fill={upvoted ? 'currentColor' : 'none'} />
                                <span>{upvotes}</span>
                            </button>
                            <div className="stat-item">
                                <MessageSquare size={18} />
                                <span>{post.commentCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard;
