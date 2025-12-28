import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const { data } = await client.get('/api/auth/me');
                setUser(data);
            }
        } catch (error) {
            console.error('Failed to fetch user', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await client.post('/api/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user || null); // Ensure user is set if returned, otherwise checkUser will fetch it
        if (!data.user) await checkUser();
    };

    const register = async (username, email, password) => {
        await client.post('/api/auth/register', { username, email, password });
        // After register, usually we ask to login or auto-login. 
        // Let's assume auto-login or redirect.
        // For now, let's just return true/void
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
