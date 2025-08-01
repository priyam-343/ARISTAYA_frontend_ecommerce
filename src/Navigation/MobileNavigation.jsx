import React, { useContext, useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Badge } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsCartFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineUser, AiOutlineLogout, AiOutlineHome } from 'react-icons/ai';
import { ContextFunction } from '../Context/Context';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { FaShippingFast } from 'react-icons/fa'; // Import Orders icon

const MobileNavigation = () => {
    const { cart, setCart, wishlistData, setWishlistData, setLoginUser } = useContext(ContextFunction);
    const location = useLocation();
    const navigate = useNavigate();
    const authToken = localStorage.getItem('Authorization');
    const isLoggedIn = !!authToken;

    useEffect(() => {
        const fetchNavData = async () => {
            if (isLoggedIn) {
                try {
                    const [cartResponse, wishlistResponse] = await Promise.all([
                        axiosInstance.get(process.env.REACT_APP_GET_CART, { headers: { 'Authorization': authToken } }),
                        axiosInstance.get(process.env.REACT_APP_GET_WISHLIST, { headers: { 'Authorization': authToken } })
                    ]);
                    // CRITICAL FIX: Access the 'cart' array from cartResponse.data
                    // Backend now returns { success: true, cart: [...] }
                    if (cartResponse.data.success) {
                        setCart(cartResponse.data.cart || []);
                    } else {
                        toast.error(cartResponse.data.message || "Failed to load cart data.", { theme: 'colored' });
                    }

                    // CRITICAL FIX: Access the 'wishlistItems' array from wishlistResponse.data
                    // Backend now returns { success: true, wishlistItems: [...] }
                    if (wishlistResponse.data.success) {
                        setWishlistData(wishlistResponse.data.wishlistItems || []);
                    } else {
                        toast.error(wishlistResponse.data.message || "Failed to load wishlist data.", { theme: 'colored' });
                    }

                } catch (error) {
                    // Use backend's standardized 'message' field for error toasts
                    toast.error(error.response?.data?.message || "Couldn't load cart or wishlist.", { theme: 'colored' });
                }
            }
        };
        fetchNavData();
    }, [isLoggedIn, setCart, setWishlistData, authToken]); // Dependencies: login status, setters, and auth token

    // Handles user logout
    const logoutUser = () => {
        localStorage.clear(); // Clear all local storage
        setLoginUser({}); // Clear global login user state
        setCart([]); // Clear global cart state
        setWishlistData([]); // Clear global wishlist state
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' });
        navigate('/'); // Navigate to home page
    };

    // Determines the currently active navigation tab based on the URL pathname
    const getCurrentValue = () => {
        const { pathname } = location;
        if (pathname === '/') return 'home';
        if (pathname === '/cart') return 'cart';
        if (pathname === '/wishlist') return 'wishlist';
        if (pathname === '/myorders') return 'orders'; // Handle 'orders' path
        if (pathname === '/login' || pathname === '/update') return 'profile';
        return false; // No active tab
    };

    // Styles for BottomNavigationAction components
    const navActionStyles = {
        color: '#cccccc', // Default icon/label color
        fontFamily: 'Cooper Black, serif',
        '&.Mui-selected': {
            color: '#FFD700', // Selected icon/label color (golden)
        },
        '& .MuiBottomNavigationAction-label': {
            fontFamily: 'Cooper Black, serif', // Font family for labels
        }
    };

    return (
        <Box sx={{
            display: { xs: 'block', md: 'none' }, // Visible only on extra-small to medium screens
            position: 'fixed', // Fixed position at the bottom
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100, // High z-index to stay on top
            borderTop: '1px solid #1e1e1e', // Top border for separation
            boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.6)', // Shadow for depth
        }}>
            <BottomNavigation
                showLabels // Show labels below icons
                value={getCurrentValue()} // Set active tab based on current route
                sx={{ backgroundColor: '#000000', height: '60px' }} // Dark background
            >
                {/* Home Button */}
                <BottomNavigationAction
                    label="Home"
                    value="home"
                    icon={<AiOutlineHome size={24} />}
                    component={Link}
                    to="/"
                    sx={navActionStyles}
                />
                {/* Cart Button with Badge */}
                <BottomNavigationAction
                    label="Cart"
                    value="cart"
                    icon={
                        <Badge badgeContent={isLoggedIn ? cart.length : 0} sx={{ '& .MuiBadge-badge': { backgroundColor: '#FFD700', color: '#000000', fontFamily: 'Cooper Black, serif' } }}>
                            <BsCartFill size={22} />
                        </Badge>
                    }
                    component={Link}
                    to="/cart"
                    sx={navActionStyles}
                />
                {/* Wishlist Button with Badge */}
                <BottomNavigationAction
                    label="Wishlist"
                    value="wishlist"
                    icon={
                        <Badge badgeContent={isLoggedIn ? wishlistData.length : 0} sx={{ '& .MuiBadge-badge': { backgroundColor: '#FFD700', color: '#000000', fontFamily: 'Cooper Black, serif' } }}>
                            <AiFillHeart size={24} />
                        </Badge>
                    }
                    component={Link}
                    to="/wishlist"
                    sx={navActionStyles}
                />
                {/* Orders Button (visible only when logged in) */}
                {isLoggedIn && (
                    <BottomNavigationAction
                        label="Orders"
                        value="orders"
                        icon={<FaShippingFast size={24} />}
                        component={Link}
                        to="/myorders"
                        sx={navActionStyles}
                    />
                )}

                {/* Conditional Login/Logout/Profile Button */}
                {isLoggedIn ? (
                    <BottomNavigationAction
                        label="Logout"
                        value="logout"
                        icon={<AiOutlineLogout size={24} />}
                        onClick={logoutUser}
                        sx={navActionStyles}
                    />
                ) : (
                    <BottomNavigationAction
                        label="Profile"
                        value="profile"
                        icon={<AiOutlineUser size={24} />}
                        component={Link}
                        to="/login"
                        sx={navActionStyles}
                    />
                )}
            </BottomNavigation>
        </Box>
    );
};

export default MobileNavigation;
