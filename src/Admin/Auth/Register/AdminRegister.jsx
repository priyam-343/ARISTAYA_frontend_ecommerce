import React, { useContext, useState } from 'react';
import { Avatar, Button, CssBaseline, Grid, InputAdornment, TextField, Typography, Box, Container, Paper, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axiosInstance';
import { MdLockOutline } from 'react-icons/md';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { ContextFunction } from '../../../Context/Context';

const AdminRegister = () => {
    
    const { setLoginUser } = useContext(ContextFunction);
    const [credentials, setCredentials] = useState({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "", key: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // CRITICAL FIX: The API endpoint path has been corrected to match the backend's `index.js`.
            // It should be '/api/admin/register'
            const { data } = await axiosInstance.post('/api/admin/register', credentials);
            
            if (data.success) {
                // The new success message from the backend is more descriptive.
                // We'll display this message and then redirect.
                toast.success(data.message, { autoClose: 3500, theme: 'colored' });
                
                // CRITICAL FIX: The old code that automatically logged the user in has been removed.
                // We now redirect to the login page after a delay to reflect the new approval flow.
                setTimeout(() => {
                    navigate('/admin/login');
                }, 3500);
            }
        } catch (error) {
            // Error handling remains the same, but the backend now sends more specific messages.
            toast.error(error.response?.data?.message || "Registration failed. Please check your details and admin key.", { theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#444' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
        },
        '& .MuiInputLabel-root': { color: '#cccccc', fontFamily: 'Cooper Black, serif' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
        '& .MuiInputBase-input': { color: 'white', fontFamily: 'Cooper Black, serif' },
        '& .MuiInputAdornment-root': { color: '#cccccc' },
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: '#000000',
            paddingTop: '120px',
            paddingBottom: '60px'
        }}>
            <CssBaseline />
            <Box sx={{ position: 'absolute', top: 100, right: 30, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>Not an Admin?</Typography>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" sx={{ borderRadius: '8px', bgcolor: '#FFD700', color: '#1a1a1a', '&:hover': { bgcolor: '#e6c200' }, fontFamily: 'Cooper Black, serif' }}>Register</Button>
                </Link>
            </Box>

            <Container component="main" maxWidth="xs" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <Avatar sx={{ m: 'auto', bgcolor: '#FFD700' }}><MdLockOutline sx={{ color: '#1a1a1a' }} /></Avatar>
                    <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3, color: '#FFD700' }}>Sign Up (Admin)</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}><TextField name="firstName" required fullWidth id="firstName" label="First Name" value={credentials.firstName} onChange={handleOnChange} autoFocus sx={textFieldSx} /></Grid>
                            <Grid item xs={12} sm={6}><TextField required fullWidth id="lastName" label="Last Name" name="lastName" value={credentials.lastName} onChange={handleOnChange} sx={textFieldSx} /></Grid>
                            <Grid item xs={12}><TextField required fullWidth id="email" label="Email Address" name="email" value={credentials.email} onChange={handleOnChange} sx={textFieldSx} /></Grid>
                            <Grid item xs={12}><TextField required fullWidth id="phoneNumber" label="Contact Number" name="phoneNumber" value={credentials.phoneNumber} onChange={handleOnChange} sx={textFieldSx} /></Grid>
                            <Grid item xs={12}><TextField
                                required fullWidth name="password" label="Password" type={showPassword ? "text" : "password"} id="password" value={credentials.password} onChange={handleOnChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} sx={{ cursor: 'pointer', color: '#cccccc' }}>
                                            {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </InputAdornment>
                                    )
                                }}
                                sx={textFieldSx}
                            /></Grid>
                            <Grid item xs={12}><TextField required fullWidth name='key' label="Admin Secret Key" type="password" value={credentials.key} onChange={handleOnChange} sx={textFieldSx} /></Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, bgcolor: '#FFD700', color: '#1a1a1a', borderRadius: '8px', p: 1.5, '&:hover': { bgcolor: '#e6c200' } }}>
                            {}
                            {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : 'REQUEST APPROVAL'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                                    Already have an admin account?{' '}
                                    <Link to="/admin/login" style={{ textDecoration: 'none' }}><Typography component="span" sx={{ color: '#FFD700', '&:hover': { textDecoration: 'underline' } }}>Sign in</Typography></Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminRegister;
