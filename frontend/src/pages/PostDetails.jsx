import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import client from '../api/client';
import { MapPin, User, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './PostDetails.css';

const PostDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [postRes, commentsRes] = await Promise.all([
                client.get(`/api/posts/${id}`),
                client.get(`/api/posts/${id}/comments`)
            ]);
            setPost(postRes.data);
            setComments(commentsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await client.post(`/api/posts/${id}/comments`, { text: newComment }); // Assuming payload is { text } or similar
            setNewComment('');
            // Refresh comments
            const { data } = await client.get(`/api/posts/${id}/comments`);
            setComments(data);
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    if (loading) return <div className="container loading">Loading...</div>;
    if (!post) return <div className="container loading">Post not found</div>;

    return (
        <div className="container post-details-page">
            <div className="post-header">
                <img
                    src={post.images?.[0] || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=1200'}
                    alt={post.title}
                    className="detail-image"
                />
                <div className="detail-meta">
                    <span className="detail-category">{post.category}</span>
                    <span className="detail-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="detail-content card glass">
                <h1>{post.title}</h1>
                <div className="detail-location">
                    <MapPin size={16} /> {post.location?.city}, {post.location?.address}
                </div>
                <p className="detail-desc">{post.description}</p>

                <div className="comments-section">
                    <h3>Comments ({comments.length})</h3>

                    <div className="comments-list">
                        {comments.map(comment => (
                            <div key={comment._id} className="comment-item">
                                <div className="comment-avatar">
                                    <User size={20} />
                                </div>
                                <div className="comment-body">
                                    {/* Depending on if comment populates author */}
                                    <span className="comment-author">{comment.author?.username || 'User'}</span>
                                    <p>{comment.text || comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {user ? (
                        <form className="comment-form" onSubmit={handleCommentSubmit}>
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                            />
                            <button type="submit" className="btn btn-primary btn-icon-only">
                                <Send size={18} />
                            </button>
                        </form>
                    ) : (
                        <p className="login-prompt">Login to comment</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
