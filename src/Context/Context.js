import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export const ContextFunction = createContext();

const Context = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlistData, setWishlistData] = useState([]);
    const [loginUser, setLoginUser] = useState({});

    const fetchUserData = useCallback(async (token = null) => {
      const authToken = token || localStorage.getItem('Authorization');
      if (authToken) {
          try {
              
              const { data } = await axiosInstance.get(process.env.REACT_APP_GET_USER_DETAILS, {
                  headers: { 'Authorization': authToken }
              });
              if (data.success && data.user) {
                  setLoginUser(data.user);
                  return data.user;
              } else {
                  localStorage.removeItem('Authorization');
                  setLoginUser({});
              }
          } catch (error) {
              localStorage.removeItem('Authorization');
              setLoginUser({});
              console.error("Error fetching user data:", error);
              toast.error(error.response?.data?.message || "Session expired. Please log in again.", { theme: 'colored' });
          }
      }
      return null;
    }, []);

    const logout = () => {
        localStorage.removeItem('Authorization');
        setLoginUser({});
        setCart([]);
        setWishlistData([]);
    };
    
    const getInitialData = async (token = null) => {
        console.log("getInitialData called. Implement logic here to fetch initial app data.");
    };

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const contextValue = {
        cart,
        setCart,
        wishlistData,
        setWishlistData,
        loginUser,
        setLoginUser,
        fetchUserData,
        getInitialData,
        logout
    };

    return (
        <ContextFunction.Provider value={contextValue}>
            {children}
        </ContextFunction.Provider>
    );
};

export default Context;
