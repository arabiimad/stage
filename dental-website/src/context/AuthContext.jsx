import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Use 'authToken' as the key for localStorage as per subtask instructions
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // True initially to indicate auth status is being checked

    // This useEffect handles initial auth status check based on token in localStorage
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('authToken');
        if (tokenFromStorage) {
            // console.log("AuthContext: Found token in storage, attempting to load user.");
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromStorage}`;
            setToken(tokenFromStorage); // Set token in state

            axios.get('/auth/me')
                .then(response => {
                    // Backend /me route returns { user: { ... } }
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                    // console.log("AuthContext: User loaded successfully.", response.data.user);
                })
                .catch(error => {
                    console.error('AuthContext: Failed to load user with stored token.', error.response || error.message);
                    // Token is invalid or expired, clear it
                    localStorage.removeItem('authToken');
                    delete axios.defaults.headers.common['Authorization'];
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // console.log("AuthContext: No token in storage.");
            setLoading(false); // No token, not loading anymore
        }
    }, []); // Empty dependency array means this runs once on mount

    const login = async (email, password) => {
        setLoading(true); // Indicate loading state during login attempt
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { access_token, user: userData } = response.data; // Backend returns 'user' object directly

            localStorage.setItem('authToken', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            setToken(access_token);
            setUser(userData); // Set user directly from login response
            setIsAuthenticated(true);
            // console.log("AuthContext: Login successful.", userData);
            setLoading(false);
            return response.data; // Return response.data which contains user, tokens, msg
        } catch (error) {
            setLoading(false);
            // console.error('AuthContext: Login failed:', error.response ? error.response.data : error.message);
            // Clear any potentially stale auth headers if login fails
            delete axios.defaults.headers.common['Authorization'];
            throw error; // Re-throw to be caught by calling component
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('/auth/register', { username, email, password });
            const { access_token, user: userData } = response.data; // Backend register returns token and user

            // Automatically log in the user after successful registration
            if (access_token && userData) {
                localStorage.setItem('authToken', access_token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                setToken(access_token);
                setUser(userData);
                setIsAuthenticated(true);
                // console.log("AuthContext: Registration successful, user auto-logged in.", userData);
            }
            // If backend doesn't return token/user on register, the above block won't run,
            // and user would need to login manually. Current backend setup does return them.
            setLoading(false);
            return response.data; // Return response.data
        } catch (error) {
            setLoading(false);
            // console.error('AuthContext: Registration failed:', error.response ? error.response.data : error.message);
            throw error; // Re-throw
        }
    };

    const logout = () => {
        // console.log("AuthContext: Logging out.");
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        // No need to call backend logout unless it invalidates tokens server-side,
        // which is good practice for refresh tokens but not always done for access tokens.
    };

    // The loadUser function is effectively replaced by the useEffect hook for initial load.
    // If manual refresh of user data is needed elsewhere, a similar function could be exposed.
    // For this refactor, we assume initial load and login/register cover user data setting.

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) { // Check if context is undefined, not null
        throw new Error('useAuth must be used within an AuthProvider');

    }
    return false;
  };

  const register = async (username, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return res.ok;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
