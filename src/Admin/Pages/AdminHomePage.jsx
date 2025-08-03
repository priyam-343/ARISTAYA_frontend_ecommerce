import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Box, Typography, CircularProgress, Paper, Button, CssBaseline } from '@mui/material';
import BasicTabs from '../Components/AdminTabs';

const AdminHomePage = () => {
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    
    const getUsersInfo = useCallback(async () => {
        const authToken = localStorage.getItem("Authorization");
        if (!authToken) {
            navigate('/admin/login');
            return;
        }
        try {
            
            const { data } = await axios.get(process.env.REACT_APP_ADMIN_GET_ALL_USERS, {
                headers: { 'Authorization': authToken }
            });
            if (data.success) {
                setUsers(data.users || []); 
            } else {
                
                toast.error(data.message || "Failed to refresh user list.", { theme: "colored" });
            }
        } catch (error) {
            console.error("Error fetching all users info for refresh:", error);
            
            toast.error(error.response?.data?.message || "Failed to refresh user list.", { theme: "colored" });
        }
    }, [navigate]);

    useEffect(() => {
        let isMounted = true;

        const verifyAdminAndFetchData = async () => {
            const authToken = localStorage.getItem("Authorization");
            if (!authToken) {
                toast.error("Please log in to access the admin panel.", { theme: "colored" });
                navigate('/admin/login');
                if (isMounted) setLoading(false);
                return;
            }

            try {
                
                const { data } = await axios.get(process.env.REACT_APP_ADMIN_GET_ALL_USERS, {
                    headers: { 'Authorization': authToken }
                });
                if (isMounted) {
                    if (data.success) {
                        setUsers(data.users || []);
                        setIsAdmin(true);
                    } else {
                        
                        toast.error(data.message || "Admin verification failed.", { theme: "colored" });
                        setIsAdmin(false);
                        navigate('/admin/login');
                    }
                }
            } catch (error) {
                console.error("Admin verification or initial user fetch failed:", error);
                
                toast.error(error.response?.data?.message || "Your session is invalid or you lack admin privileges. Please log in again.", { theme: "colored" });
                localStorage.removeItem("Authorization");
                if (isMounted) {
                    setIsAdmin(false);
                    navigate('/admin/login');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        verifyAdminAndFetchData();

        return () => {
            isMounted = false;
        };
    }, [navigate, getUsersInfo]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, bgcolor: '#000000', py: 5 }}>
            <CssBaseline />
            <Container component="main" maxWidth="xl">
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress size={60} sx={{ color: '#FFD700' }} />
                        <Typography variant="h6" sx={{ ml: 2, color: '#FFD700' }}>Verifying Admin Access...</Typography>
                    </Box>
                ) : isAdmin ? (
                    <Paper elevation={6} sx={{
                        p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',
                        borderRadius: '15px', bgcolor: '#1e1e1e', border: '1px solid #333',
                        width: '100%', maxWidth: '1200px', mx: 'auto'
                    }}>
                        <Typography
                            component="h1" variant="h2"
                            sx={{
                                mb: 4, color: '#FFD700', fontFamily: 'Cooper Black, serif',
                                textAlign: 'center', fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' }
                            }}
                        >
                            ADMIN DASHBOARD
                        </Typography>
                        <BasicTabs user={users} getUsersInfo={getUsersInfo} /> 
                    </Paper>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                        <Typography variant="h5" sx={{ color: '#FFD700', mb: 2 }}>Access Denied</Typography>
                        <Typography variant="body1" sx={{ color: '#cccccc', mb: 3 }}>
                            You do not have administrative privileges.
                        </Typography>
                        <Button component={Link} to="/admin/login" variant="contained" sx={{ bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#e6c200' } }}>
                            Go to Admin Login
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default AdminHomePage;