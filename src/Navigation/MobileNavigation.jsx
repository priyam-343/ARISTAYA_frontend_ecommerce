import React, { useContext, useEffect, useState } from 'react';
import {
    BottomNavigation, BottomNavigationAction, Box, Badge, Avatar,
    Menu, MenuItem, Typography, ListItemIcon
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsCartFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineUser, AiOutlineLogout, AiOutlineHome, AiOutlineEdit } from 'react-icons/ai';
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
    
    // NEW: State for the profile menu
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

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
        handleMenuClose();
        logout();
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' });
        navigate('/');
    };

    // NEW: Handlers for the profile menu
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        handleMenuClose();
        navigate('/update');
    };

    const handleOrdersClick = () => {
        handleMenuClose();
        navigate('/myorders');
    };

    const handleProfileNavigation = (event) => {
        if (isLoggedIn) {
            handleMenuOpen(event);
        } else {
            navigate('/login');
        }
    };

    const getCurrentValue = () => {
        const { pathname } = location;
        if (pathname === '/') return 'home';
        if (pathname === '/cart') return 'cart';
        if (pathname === '/wishlist') return 'wishlist';
        if (pathname === '/myorders' || pathname === '/update') return 'profile';
        if (pathname === '/login') return 'login';
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
                
                {/* NEW: Single button for Profile/Login */}
                <BottomNavigationAction
                    label={isLoggedIn ? "Profile" : "Login"}
                    value={isLoggedIn ? "profile" : "login"}
                    icon={profileIcon}
                    onClick={handleProfileNavigation}
                    sx={navActionStyles}
                />
            </BottomNavigation>
            
            {/* NEW: Profile menu for logged-in users */}
            {isLoggedIn && (
                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'profile-button',
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    PaperProps={{
                        sx: {
                            bgcolor: '#1a1a1a',
                            border: '1px solid #333',
                            borderRadius: '12px',
                            minWidth: 180,
                            mt: '-65px',
                        },
                    }}
                >
                    <MenuItem onClick={handleProfileClick} sx={{ color: 'white' }}>
                        <ListItemIcon><AiOutlineEdit size={24} style={{ color: '#FFD700' }} /></ListItemIcon>
                        <Typography sx={{ fontFamily: 'Cooper Black, serif' }}>My Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleOrdersClick} sx={{ color: 'white' }}>
                        <ListItemIcon><FaShippingFast size={24} style={{ color: '#FFD700' }} /></ListItemIcon>
                        <Typography sx={{ fontFamily: 'Cooper Black, serif' }}>My Orders</Typography>
                    </MenuItem>
                    <MenuItem onClick={logoutUser} sx={{ color: 'white' }}>
                        <ListItemIcon><AiOutlineLogout size={24} style={{ color: '#FFD700' }} /></ListItemIcon>
                        <Typography sx={{ fontFamily: 'Cooper Black, serif' }}>Logout</Typography>
                    </MenuItem>
                </Menu>
            )}
        </Box>
    );
};

export default MobileNavigation;