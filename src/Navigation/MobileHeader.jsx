// src/Navigation/MobileHeader.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ContextFunction } from '../Context/Context';

const MobileHeader = () => {
    const { loginUser } = useContext(ContextFunction);
    const isLoggedIn = !!localStorage.getItem('Authorization');
    const isAdmin = loginUser?.isAdmin || false;
    const onAdminPage = window.location.pathname.startsWith('/admin');

    return (
        <Box component="header" sx={{
            display: { xs: 'flex', md: 'none' }, // Visible on mobile, hidden on desktop
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            height: '60px',
            bgcolor: '#000000',
            borderBottom: '1px solid #1e1e1e',
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1100,
            boxSizing: 'border-box'
        }}>
            <Link to='/' style={{ textDecoration: 'none', color: '#FFD700', fontSize: '1.5rem', fontFamily: 'Cooper Black, serif' }}>
                ARISTAYA
            </Link>
            {isLoggedIn && isAdmin && (
                <Button
                    component={Link}
                    to={onAdminPage ? "/" : "/admin/home"}
                    variant="contained"
                    sx={{
                        bgcolor: '#FFD700',
                        color: '#000000',
                        fontFamily: 'Cooper Black, serif',
                        borderRadius: '8px',
                        '&:hover': { bgcolor: '#e6c200' }
                    }}
                >
                    {onAdminPage ? "User" : "Admin"}
                </Button>
            )}
        </Box>
    );
};

export default MobileHeader;