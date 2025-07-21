import React, { useContext } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Badge } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { BsCartFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineUser, AiOutlineLogout, AiOutlineHome } from 'react-icons/ai';
import { ContextFunction } from '../Context/Context';
import { toast } from 'react-toastify';

const MobileNavigation = () => {
    const { cart, wishlistData, setLoginUser, setCart, setWishlistData } = useContext(ContextFunction);
    const location = useLocation();
    let authToken = localStorage.getItem('Authorization');

    const logout = () => {
        localStorage.clear();
        setLoginUser({});
        setCart([]);
        setWishlistData([]);
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' });
    };

    
    const getCurrentValue = () => {
        if (location.pathname === '/') return 'home';
        if (location.pathname === '/cart') return 'cart';
        if (location.pathname === '/wishlist') return 'wishlist';
        if (location.pathname === '/login' || location.pathname === '/update') return 'profile'; 
        return false; 
    };

    return (
        <Box sx={{ 
            display: { xs: 'block', md: 'none' }, 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1100, 
            backgroundColor: '#000000', 
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
                    icon={<AiOutlineHome fontSize={20} />}
                    component={Link}
                    to="/"
                    sx={{ 
                        color: location.pathname === '/' ? '#FFD700' : '#cccccc', 
                        fontFamily: 'Cooper Black, serif !important',
                        '&.Mui-selected': { color: '#FFD700' }, 
                        '&:hover': { color: '#FFD700' } 
                    }}
                />
                <BottomNavigationAction
                    label="Cart"
                    value="cart"
                    icon={
                        <Badge badgeContent={cart?.length} color="secondary" sx={{ '& .MuiBadge-badge': { backgroundColor: '#FFD700', color: '#000000', fontFamily: 'Cooper Black, serif !important' } }}>
                            <BsCartFill fontSize={20} />
                        </Badge>
                    }
                    component={Link}
                    to="/cart"
                    sx={{ 
                        color: location.pathname === '/cart' ? '#FFD700' : '#cccccc',
                        fontFamily: 'Cooper Black, serif !important',
                        '&.Mui-selected': { color: '#FFD700' },
                        '&:hover': { color: '#FFD700' }
                    }}
                />
                <BottomNavigationAction
                    label="Wishlist"
                    value="wishlist"
                    icon={
                        <Badge badgeContent={wishlistData?.length} color="secondary" sx={{ '& .MuiBadge-badge': { backgroundColor: '#FFD700', color: '#000000', fontFamily: 'Cooper Black, serif !important' } }}>
                            <AiFillHeart fontSize={20} />
                        </Badge>
                    }
                    component={Link}
                    to="/wishlist"
                    sx={{ 
                        color: location.pathname === '/wishlist' ? '#FFD700' : '#cccccc',
                        fontFamily: 'Cooper Black', 
                        '&.Mui-selected': { color: '#FFD700' },
                        '&:hover': { color: '#FFD700' }
                    }}
                />
                {authToken ? (
                    <BottomNavigationAction
                        label="Logout"
                        value="logout"
                        icon={<AiOutlineLogout fontSize={20} />}
                        onClick={logout}
                        sx={{ 
                            color: '#cccccc', 
                            fontFamily: 'Cooper Black, serif !important',
                            '&:hover': { color: '#FFD700' } 
                        }}
                    />
                ) : (
                    <BottomNavigationAction
                        label="Profile"
                        value="profile"
                        icon={<AiOutlineUser fontSize={20} />}
                        component={Link}
                        to="/login"
                        sx={{ 
                            color: (location.pathname === '/login' || location.pathname === '/update') ? '#FFD700' : '#cccccc', 
                            fontFamily: 'Cooper Black, serif !important',
                            '&.Mui-selected': { color: '#FFD700' },
                            '&:hover': { color: '#FFD700' }
                        }}
                    />
                )}
            </BottomNavigation>
        </Box>
    );
};

export default MobileNavigation;
