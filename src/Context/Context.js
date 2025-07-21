

import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance'; 


export const ContextFunction = createContext();


const Context = ({ children }) => {
    
    const [cart, setCart] = useState([]);
    
    const [wishlistData, setWishlistData] = useState([]);
    
    const [loginUser, setLoginUser] = useState({}); 

    
    useEffect(() => {
        const fetchUserData = async () => {
            const authToken = localStorage.getItem('Authorization');
            if (authToken) {
                try {
                    const { data } = await axiosInstance.get('/api/auth/getuser', { 
                        headers: { 'Authorization': authToken }
                    });
                    setLoginUser(data); 
                } catch (error) {
                    console.error("Error fetching user data in context:", error);
                    
                    localStorage.removeItem('Authorization');
                    setLoginUser({});
                }
            } else {
                setLoginUser({}); 
            }
        };
        fetchUserData();
    }, []); 

    
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

