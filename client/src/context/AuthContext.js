import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);

    useEffect(() => {
        if (userEmail) {
            setLoggedIn(true);
        }
    }, [userEmail]);

    const login = (email) => {
        setLoggedIn(true);
        setUserEmail(email);
        localStorage.setItem('userEmail', email);
    };

    const logout = () => {
        setLoggedIn(false);
        setUserEmail(null);
        localStorage.removeItem('userEmail');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
