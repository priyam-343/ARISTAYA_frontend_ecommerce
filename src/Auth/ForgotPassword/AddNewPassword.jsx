import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, CssBaseline, InputAdornment, TextField, Typography, Box, Container, Paper, CircularProgress } from '@mui/material';
import { MdLockOutline } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import PropTypes from 'prop-types';

const AddNewPassword = () => {
    const { id, token } = useParams(); 
    const [password, setPassword] = useState(''); // State for the new password input
    const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
    const [loading, setLoading] = useState(false); // Loading state for API call
    const navigate = useNavigate();

    // Handles the form submission for setting a new password
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Client-side validation for password length
        if (password.length < 5) {
            return toast.error("Password must be at least 5 characters.", { theme: 'colored' });
        }
        setLoading(true); 
        try {
            
            const { data } = await axiosInstance.post(`${process.env.REACT_APP_FORGOT_PASSWORD}/${id}/${token}`, { newPassword: password });
            
            if (data.success) {
                toast.success(data.message || "Password has been reset successfully.", { theme: 'colored' }); 
                navigate('/login'); 
            } else {
                
                toast.error(data.message || "The password reset link is invalid or has expired. Please try again.", { theme: 'colored' }); 
                navigate('/forgotpassword'); 
            }
        } catch (error) {
            
            toast.error(error.response?.data?.message || "An error occurred. Please try again.", { theme: 'colored' });
            navigate('/forgotpassword'); 
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
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000000' }}>
            <CssBaseline />
            <Container component="main" maxWidth="xs" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', textAlign: 'center' }}>
                    <Avatar sx={{ m: 'auto', bgcolor: '#FFD700' }}><MdLockOutline sx={{ color: '#1a1a1a' }} /></Avatar>
                    <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3, color: '#FFD700' }}>Reset Password</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Enter New Password"
                            value={password}
                            name='password'
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} sx={{ cursor: 'pointer' }}>
                                        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldSx}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, bgcolor: '#FFD700', color: '#1a1a1a', borderRadius: '8px', p: 1.5, '&:hover': { bgcolor: '#e6c200' } }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : 'Submit'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

AddNewPassword.propTypes = {
    
};

export default AddNewPassword;
