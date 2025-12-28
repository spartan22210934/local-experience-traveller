import { useState, useEffect } from 'react';
import client from '../api/client';
import PostCard from '../components/PostCard';
import './Home.css';
import { Compass, TrendingUp } from 'lucide-react';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('recent'); // recent, trending

    useEffect(() => {
        fetchPosts();
    }, [activeTab]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let url = '/api/posts'; // Default: recent
            if (activeTab === 'trending') {
                url = '/api/explore/trending';
            }

            const { data } = await client.get(url);
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container home-page">
            <header className="home-header">
                <h1>Discover Local Experiences</h1>
                <p className="subtitle">Find the best food, concerts, and events near you.</p>

                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recent')}
                    >
                        <Compass size={18} /> Recent
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trending')}
                    >
                        <TrendingUp size={18} /> Trending
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="loading">Loading experiences...</div>
            ) : (
                <div className="posts-grid">
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                    {posts.length === 0 && (
                        <div className="no-posts">
                            <p>No experiences found. Be the first to share!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
