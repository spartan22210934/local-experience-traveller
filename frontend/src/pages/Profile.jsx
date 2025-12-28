import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import PostCard from '../components/PostCard';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchUserPosts();
    }, [user]);

    const fetchUserPosts = async () => {
        try {
            const { data } = await client.get(`/api/posts/user/${user._id}`);
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container profile-page">
            <div className="profile-header card glass">
                <div className="profile-avatar">
                    <img src={user.avatar || 'https://placehold.co/200'} alt={user.username} />
                </div>
                <div className="profile-info">
                    <h2>@{user.username}</h2>
                    <p>{user.email}</p>
                    <p className="bio">{user.bio || 'No bio yet.'}</p>
                    <div className="profile-stats">
                        <div className="stat"><strong>{posts.length}</strong> Experiences Shared</div>
                    </div>
                </div>
            </div>

            <h3 className="section-title">My Experiences</h3>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="posts-grid">
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                    {posts.length === 0 && <p>You haven't posted anything yet.</p>}
                </div>
            )}
        </div>
    );
};

export default Profile;
