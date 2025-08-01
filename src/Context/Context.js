import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify'; // Import toast for notifications

// Create the context that components will consume.
export const ContextFunction = createContext();

// The Context Provider component that will wrap the entire application.
const Context = ({ children }) => {
    // Global state for the shopping cart.
    const [cart, setCart] = useState([]);
    // Global state for the user's wishlist.
    const [wishlistData, setWishlistData] = useState([]);
    // Global state to hold the currently logged-in user's data.
    const [loginUser, setLoginUser] = useState({});

    // This useEffect runs once when the application first loads.
    // Its purpose is to check for a valid auth token and fetch user data
    // to maintain a persistent login session across page reloads.
    useEffect(() => {
        const fetchUserData = async () => {
            const authToken = localStorage.getItem('Authorization');
            if (authToken) {
                try {
                    const { data } = await axiosInstance.get('/api/auth/getuser', {
                        headers: { 'Authorization': authToken }
                    });
                    // CRITICAL FIX: Access the 'user' object from the response data
                    // Backend now returns { success: true, user: {...} }
                    if (data.success && data.user) {
                        setLoginUser(data.user);
                    } else {
                        // If API returns success:false or no user, clear token
                        localStorage.removeItem('Authorization');
                        setLoginUser({});
                        // Optionally, show a toast here if the user was expecting to be logged in
                        // toast.info("Your session has expired or is invalid. Please log in again.", { theme: 'colored' });
                    }
                } catch (error) {
                    // If the token is invalid or expired, the API will return an error (e.g., 401).
                    // In this case, we clear the invalid token and log the user out.
                    localStorage.removeItem('Authorization');
                    setLoginUser({});
                    // Use error.response?.data?.message for standardized backend error messages
                    toast.error(error.response?.data?.message || "Session expired. Please log in again.", { theme: 'colored' });
                }
            }
        };
        fetchUserData();
    }, []); // The empty dependency array ensures this runs only once.

    // The value object holds all the global state and state-updating functions
    // that will be made available to any component that consumes this context.
    const contextValue = {
        cart,
        setCart,
        wishlistData,
        setWishlistData,
        loginUser,
        setLoginUser,
    };

    return (
        <ContextFunction.Provider value={contextValue}>
            {children}
        </ContextFunction.Provider>
    );
};

export default Context;
