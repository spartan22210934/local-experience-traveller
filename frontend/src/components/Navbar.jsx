import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, PlusSquare, User, LogOut, Search } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="navbar glass">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    <MapPin size={24} color="var(--secondary)" />
                    <span>Local<span className="accent">XP</span></span>
                </Link>

                {/* Search Bar - Optional for now or redirect to search page */}
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Explore places..." />
                </div>

                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/create" className="nav-item">
                                <PlusSquare size={20} />
                                <span>Create</span>
                            </Link>
                            <Link to="/profile" className="nav-item">
                                <div className="avatar-small">
                                    <img src={user.avatar || 'https://placehold.co/100'} alt="Profile" />
                                </div>
                            </Link>
                            <button onClick={logout} className="btn-icon" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
