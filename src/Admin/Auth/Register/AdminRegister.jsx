import React, { useContext, useState } from 'react'; // Removed useEffect as it was empty
import { Avatar, Button, CssBaseline, Grid, InputAdornment, TextField, Typography, Box, Container, Paper, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axiosInstance'; // Assumes axiosInstance is correctly configured for your backend URL
import { MdLockOutline } from 'react-icons/md';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
// Removed CopyRight import as it's handled globally
import { ContextFunction } from '../../../Context/Context';
// Removed PropTypes import as component does not receive props

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
            // Ensure process.env.REACT_APP_ADMIN_REGISTER points to your correct backend admin register endpoint
            const { data } = await axiosInstance.post(process.env.REACT_APP_ADMIN_REGISTER, credentials);
            if (data.success) {
                toast.success("Admin Registered Successfully!", { autoClose: 1500, theme: 'colored' });
                localStorage.setItem('Authorization', data.authToken);
                setLoginUser(data.user);
                navigate('/admin/home'); // Navigate to admin dashboard on successful registration
            }
        } catch (error) {
            // Display error message from the backend, or a generic one if unavailable
            toast.error(error.response?.data?.message || "Registration failed. Please check your details and admin key.", { theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    // Consistent styling for TextFields
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
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000000' }}>
            <CssBaseline />
            {/* "Not an Admin?" button positioned at the top right for easy access to user registration. */}
            <Box sx={{ position: 'absolute', top: { xs: 20, md: 30 }, right: { xs: 20, md: 30 }, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                            {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : 'Sign Up'}
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