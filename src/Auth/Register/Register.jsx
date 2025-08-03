import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, CssBaseline, Grid, InputAdornment, TextField, Typography, CircularProgress, Paper, Box, Container, Checkbox, FormControlLabel } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdLockOutline } from 'react-icons/md';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { ContextFunction } from '../../Context/Context';
import PropTypes from 'prop-types';

const Register = () => {
    const { setLoginUser } = useContext(ContextFunction);
    const [credentials, setCredentials] = useState({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('Authorization')) {
            navigate("/");
        }
    }, [navigate]);

    const handleOnChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axiosInstance.post(process.env.REACT_APP_REGISTER, credentials);
            if (data.success) {
                toast.success(data.message || "Registration successful! Please check your email to verify your account.", { autoClose: 3000, theme: 'colored' });
                setRegistrationSuccess(true);
                setCredentials({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed. Please try again.", { theme: 'colored' });
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

    if (registrationSuccess) {
        return (
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    paddingTop: '120px',
                    paddingBottom: '60px',
                    boxSizing: 'border-box'
                }}
            >
                <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <h1 style={{ color: '#FFD700', fontFamily: 'Cooper Black, serif', marginBottom: '16px' }}>
                        Success!
                    </h1>
                    <p style={{ color: '#cccccc', fontFamily: 'Cooper Black, serif', fontSize: '1rem', lineHeight: '1.5' }}>
                        Please check your email to verify your account and complete your registration.
                        You will receive an email with a "WELCOME" link.
                    </p>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/login')}
                        sx={{
                            mt: 3,
                            bgcolor: '#FFD700',
                            color: '#1a1a1a',
                            borderRadius: '8px',
                            p: 1.5,
                            '&:hover': { bgcolor: '#e6c200' },
                            fontFamily: 'Cooper Black, serif'
                        }}
                    >
                        Go to Login
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                paddingTop: '120px',
                paddingBottom: '60px',
                boxSizing: 'border-box'
            }}
        >
            <CssBaseline />
            <Box sx={{ position: 'absolute', top: 100, right: 20, zIndex: 1000, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>Admin?</Typography>
                <Link to="/admin/register" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" sx={{ borderRadius: '8px', bgcolor: '#FFD700', color: '#1a1a1a', '&:hover': { bgcolor: '#e6c200' }, fontFamily: 'Cooper Black, serif' }}>REGISTER</Button>
                </Link>
            </Box>
            
            <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <Avatar sx={{ m: 'auto', bgcolor: '#FFD700' }}><MdLockOutline sx={{ color: '#1a1a1a' }} /></Avatar>
                <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3, color: '#FFD700', fontFamily: 'Cooper Black, serif' }}>Sign Up</Typography>
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
                                    <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} sx={{ cursor: 'pointer' }}>
                                        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                    </InputAdornment>
                                )
                            }}
                            sx={textFieldSx}
                        /></Grid>
                        {}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, bgcolor: '#FFD700', color: '#1a1a1a', borderRadius: '8px', p: 1.5, '&:hover': { bgcolor: '#e6c200' } }}>
                        {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : 'Sign Up'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif' }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ textDecoration: 'none' }}><Typography component="span" sx={{ color: '#FFD700', '&:hover': { textDecoration: 'underline' }, fontFamily: 'Cooper Black, serif' }}>Sign in</Typography></Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

Register.propTypes = {
    
};

export default Register;
