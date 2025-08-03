import React, { useContext, useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Badge, Avatar } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsCartFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineUser, AiOutlineLogout, AiOutlineHome } from 'react-icons/ai';
import { ContextFunction } from '../Context/Context';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import { FaShippingFast } from 'react-icons/fa';

const MobileNavigation = () => {
    const { cart, setCart, wishlistData, setWishlistData, loginUser, setLoginUser, logout } = useContext(ContextFunction);
    const location = useLocation();
    const navigate = useNavigate();
    const authToken = localStorage.getItem('Authorization');
    const isLoggedIn = !!authToken && !!loginUser._id; 
    const isProfilePage = location.pathname === '/update';

    useEffect(() => {
        const fetchNavData = async () => {
            const token = localStorage.getItem('Authorization');
            const onAdminPage = location.pathname.startsWith('/admin');
            
            if (token && isLoggedIn && !onAdminPage) {
                try {
                    const [cartResponse, wishlistResponse] = await Promise.all([
                        axiosInstance.get(process.env.REACT_APP_GET_CART, { headers: { 'Authorization': token } }),
                        axiosInstance.get(process.env.REACT_APP_GET_WISHLIST, { headers: { 'Authorization': token } })
                    ]);
                    if (cartResponse.data.success) {
                        setCart(cartResponse.data.cart || []);
                    }
                    if (wishlistResponse.data.success) {
                        setWishlistData(wishlistResponse.data.wishlistItems || []);
                    }
                } catch (error) {
                    console.error("Error fetching mobile navigation data:", error.response?.data?.message || error.message);
                }
            } else {
                
                setCart([]);
                setWishlistData([]);
            }
        };
        fetchNavData();
    }, [authToken, isLoggedIn, location.pathname, setCart, setWishlistData]);

    const logoutUser = () => {
        logout();
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' });
        navigate('/');
    };

    const getCurrentValue = () => {
        const { pathname } = location;
        if (pathname === '/') return 'home';
        if (pathname === '/cart') return 'cart';
        if (pathname === '/wishlist') return 'wishlist';
        if (pathname === '/myorders') return 'orders';
        if (pathname === '/login' || pathname === '/update') return 'profile';
        return false;
    };

    const navActionStyles = {
        color: '#cccccc',
        fontFamily: 'Cooper Black, serif',
        '&.Mui-selected': {
            color: '#FFD700',
        },
        '& .MuiBottomNavigationAction-label': {
            fontFamily: 'Cooper Black, serif',
        }
    };

    const profileIcon = loginUser?.profileImage ? (
      <Avatar src={loginUser.profileImage} alt="Profile" sx={{ width: 24, height: 24 }} />
    ) : (
      <AiOutlineUser size={24} />
    );

    return (
        <Box sx={{
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            borderTop: '1px solid #1e1e1e',
            boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.6)',
        }}>
            <BottomNavigation
                showLabels
                value={getCurrentValue()}
                sx={{ backgroundColor: '#000000', height: '60px' }}
            >
                <BottomNavigationAction
                    label="Home"
                    value="home"
                    icon={<AiOutlineHome size={24} />}
                    component={Link}
                    to="/"
                    sx={navActionStyles}
                />
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

                {isLoggedIn ? (
                    <>
                        <BottomNavigationAction
                            label="Profile"
                            value="profile"
                            icon={profileIcon}
                            component={Link}
                            to="/update"
                            sx={navActionStyles}
                        />
                        <BottomNavigationAction
                            label="Logout"
                            value="logout"
                            icon={<AiOutlineLogout size={24} />}
                            onClick={logoutUser}
                            sx={navActionStyles}
                        />
                    </>
                ) : (
                    <BottomNavigationAction
                        label="Login" 
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
