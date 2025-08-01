import React, { useContext, useState } from 'react';
import { Avatar, Button, CssBaseline, Grid, InputAdornment, TextField, Typography, CircularProgress, Paper, Box, Container, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axiosInstance';
import { MdLockOutline } from 'react-icons/md';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { ContextFunction } from '../../../Context/Context';

const AdminLogin = () => {
    const { setLoginUser } = useContext(ContextFunction);
    const [credentials, setCredentials] = useState({ email: "", password: "", key: "" });
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
            const { data } = await axiosInstance.post(process.env.REACT_APP_ADMIN_LOGIN, credentials);
            if (data.success) {
                toast.success("Admin Login Successful!", { autoClose: 1500, theme: 'colored' });
                localStorage.setItem('Authorization', data.authToken);
                setLoginUser(data.user);
                navigate('/admin/home');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please check credentials and admin key.", { theme: 'colored' });
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
            // CRITICAL FIX: Added padding to push content down and allow scrolling
            paddingTop: '120px',
            paddingBottom: '60px'
        }}>
            <CssBaseline />
            {/* "Not an Admin?" button with adjusted top position */}
            <Box sx={{ position: 'absolute', top: 100, right: 30, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>Not an Admin?</Typography>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" sx={{ borderRadius: '8px', bgcolor: '#FFD700', color: '#1a1a1a', '&:hover': { bgcolor: '#e6c200' }, fontFamily: 'Cooper Black, serif' }}>Login</Button>
                </Link>
            </Box>

            <Container component="main" maxWidth="xs" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <Avatar sx={{ m: 'auto', bgcolor: '#FFD700' }}><MdLockOutline sx={{ color: '#1a1a1a' }} /></Avatar>
                    <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3, color: '#FFD700' }}>Sign In (Admin)</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField margin="normal" required fullWidth id="email" label="Email Address" name='email' value={credentials.email} onChange={handleOnChange} autoFocus sx={textFieldSx} />
                        <TextField
                            margin="normal" required fullWidth name='password' label="Password" type={showPassword ? "text" : "password"} id="password" value={credentials.password} onChange={handleOnChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} sx={{ cursor: 'pointer', color: '#cccccc' }}>
                                        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                    </InputAdornment>
                                )
                            }}
                            sx={textFieldSx}
                        />
                        <TextField margin="normal" required fullWidth name='key' label="Admin Secret Key" type="password" value={credentials.key} onChange={handleOnChange} sx={textFieldSx} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <FormControlLabel
                                control={<Checkbox value="remember" sx={{ color: '#444', '&.Mui-checked': { color: '#FFD700' } }} />}
                                label={<Typography sx={{ color: '#cccccc' }}>Remember me</Typography>}
                            />
                        </Box>
                        <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, bgcolor: '#FFD700', color: '#1a1a1a', borderRadius: '8px', p: 1.5, '&:hover': { bgcolor: '#e6c200' } }}>
                            {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : 'Sign In'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                                    {"Don't have an admin account? "}
                                    <Link to="/admin/register" style={{ textDecoration: 'none' }}><Typography component="span" sx={{ color: '#FFD700', '&:hover': { textDecoration: 'underline' } }}>Sign Up</Typography></Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminLogin;
