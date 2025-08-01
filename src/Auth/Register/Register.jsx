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
    const navigate = useNavigate();

    useEffect(() => {
        // Redirects to home page if user is already logged in
        if (localStorage.getItem('Authorization')) {
            navigate("/");
        }
    }, [navigate]);

    // Handles input changes for all form fields
    const handleOnChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // Handles the registration form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true during API call
        try {
            // Make POST request to register endpoint
            const { data } = await axiosInstance.post(process.env.REACT_APP_REGISTER, credentials);
            if (data.success) {
                // Show success toast notification
                toast.success("Registered Successfully", { autoClose: 1500, theme: 'colored' });
                // Store authentication token in local storage
                localStorage.setItem('Authorization', data.authToken);
                // Update global login user state with user data from response
                setLoginUser(data.user);
                // Navigate to the home page
                navigate('/');
            }
        } catch (error) {
            // Show error toast notification, using backend's 'message' field for consistency
            // The backend now sends validation errors in the 'message' field directly.
            toast.error(error.response?.data?.message || "Registration failed. Please try again.", { theme: 'colored' });
        } finally {
            setLoading(false); // Reset loading state after API call
        }
    };

    // Custom styles for Material-UI TextField components
    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#444' }, // Default border color
            '&:hover fieldset': { borderColor: '#666' }, // Border color on hover
            '&.Mui-focused fieldset': { borderColor: '#FFD700' }, // Border color when focused
            backgroundColor: '#1a1a1a', // Background color of the input field
            borderRadius: '8px', // Rounded corners for the input field
        },
        '& .MuiInputLabel-root': { color: '#cccccc', fontFamily: 'Cooper Black, serif' }, // Label color
        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' }, // Label color when focused
        '& .MuiInputBase-input': { color: 'white', fontFamily: 'Cooper Black, serif' }, // Input text color
        '& .MuiInputAdornment-root': { color: '#cccccc' }, // Adornment icon color
    };

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
                paddingTop: '120px', // Added extra space at the top
                paddingBottom: '60px',
                boxSizing: 'border-box'
            }}
        >
            <CssBaseline />
            {/* Admin Register Button - Links to a hypothetical admin registration page */}
            <Box sx={{ position: 'absolute', top: 100, right: 20, zIndex: 1000, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>Admin?</Typography>
                <Link to="/admin/register" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" sx={{ borderRadius: '8px', bgcolor: '#FFD700', color: '#1a1a1a', '&:hover': { bgcolor: '#e6c200' }, fontFamily: 'Cooper Black, serif' }}>REGISTER</Button>
                </Link>
            </Box>
            
            <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <Avatar sx={{ m: 'auto', bgcolor: '#FFD700' }}><MdLockOutline sx={{ color: '#1a1a1a' }} /></Avatar>
                <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3, color: '#FFD700' }}>Sign Up</Typography>
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
                        <Grid item xs={12}><FormControlLabel
                            control={<Checkbox value="allowExtraEmails" sx={{ color: '#444', '&.Mui-checked': { color: '#FFD700' } }} />}
                            label={<Typography sx={{ color: '#cccccc', fontSize: '0.9rem' }}>I want to receive inspiration and updates via email.</Typography>}
                        /></Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, bgcolor: '#FFD700', color: '#1a1a1a', borderRadius: '8px', p: 1.5, '&:hover': { bgcolor: '#e6c200' } }}>
                        {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : 'Sign Up'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Typography variant="body2" sx={{ color: '#cccccc' }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ textDecoration: 'none' }}><Typography component="span" sx={{ color: '#FFD700', '&:hover': { textDecoration: 'underline' } }}>Sign in</Typography></Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

Register.propTypes = {
    // This component does not receive props.
};

export default Register;
