// src/Context/Context.jsx (Example structure - adapt to your actual file)

import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Assuming you use axiosInstance here too

// Create the context
export const ContextFunction = createContext();

// Create the provider component
const Context = ({ children }) => {
    // State for cart
    const [cart, setCart] = useState([]);
    // State for wishlist
    const [wishlistData, setWishlistData] = useState([]);
    // State for logged-in user details
    const [loginUser, setLoginUser] = useState({}); // <--- THIS IS CRUCIAL: Define loginUser state

    // You might have other states and functions here, e.g., for fetching user data on app load
    useEffect(() => {
        const fetchUserData = async () => {
            const authToken = localStorage.getItem('Authorization');
            if (authToken) {
                try {
                    const { data } = await axiosInstance.get('/api/auth/getuser', { // Example API endpoint
                        headers: { 'Authorization': authToken }
                    });
                    setLoginUser(data); // Set the user data
                } catch (error) {
                    console.error("Error fetching user data in context:", error);
                    // Handle error, e.g., clear auth token if invalid
                    localStorage.removeItem('Authorization');
                    setLoginUser({});
                }
            } else {
                setLoginUser({}); // Ensure it's empty if no token
            }
        };
        fetchUserData();
    }, []); // Run once on component mount to check auth status

    // The value prop makes these states and setters available to consuming components
    const contextValue = {
        cart,
        setCart,
        wishlistData,
        setWishlistData,
        loginUser, // Provide the loginUser state
        setLoginUser, // <--- THIS IS CRUCIAL: Provide the setLoginUser function
    };

    return (
        <ContextFunction.Provider value={contextValue}>
            {children}
        </ContextFunction.Provider>
    );
};

export default Context;

