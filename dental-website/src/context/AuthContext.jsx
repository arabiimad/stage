import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Assume axios is installed

// Configure Axios base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_BASE_URL;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadUser = async (currentToken) => {
        if (!currentToken) {
            setLoading(false);
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
        try {
            const response = await axios.get('/auth/me');
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to load user:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            loadUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { access_token, user_details } = response.data; // Assuming backend sends user_details or just token

            localStorage.setItem('token', access_token);
            setToken(access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            // Option 1: Backend sends user details on login
            if (user_details) {
                setUser(user_details);
            } else {
            // Option 2: Fetch user details after login
                await loadUser(access_token);
            }
            setIsAuthenticated(true);
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            console.error('Login failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('/auth/register', { username, email, password });
            // Optionally, log the user in directly or handle as per app flow
            // For now, just return the response, user should go to login page.
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
        // Optionally, redirect or call a backend logout endpoint
        // window.location.href = '/login'; // Or use useNavigate if within Router context
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, register, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
