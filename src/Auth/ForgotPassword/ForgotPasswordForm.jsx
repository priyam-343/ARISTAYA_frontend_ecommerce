import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Typography, CircularProgress, Box, Container, Paper } from '@mui/material';
import { MdLockOutline, MdMailOutline } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState(''); // State for the email input
    const [isSentMail, setIsSentMail] = useState(false); // State to track if the email has been sent
    const [loading, setLoading] = useState(false); // Loading state for API call

    // Handles the form submission for sending the password reset link
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true
        try {
            // Make POST request to the forgot password endpoint
            const { data } = await axiosInstance.post(process.env.REACT_APP_FORGOT_PASSWORD, { email });
            // Backend now returns { success: true, message: "..." }
            if (data.success) {
                toast.success(data.message, { theme: 'colored' }); 
                setIsSentMail(true); 
            } else {
                
                toast.error(data.message || "Something went wrong, please try again.", { theme: 'colored' });
            }
        } catch (error) {
            
            toast.error(error.response?.data?.message || "Something went wrong, please try again.", { theme: 'colored' });
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
    };

    return (
        <>
            <CssBaseline />
            <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)' }}>
                {!isSentMail ? (
                    
                    <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                        <Avatar sx={{ m: 'auto', bgcolor: '#FFD700' }}><MdLockOutline sx={{ color: '#1a1a1a' }} /></Avatar>
                        <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3, color: '#FFD700' }}>Forgot Password</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                value={email}
                                name='email'
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                autoFocus
                                sx={textFieldSx}
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
                ) : (
                    
                    <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                        <Avatar sx={{ m: 'auto', bgcolor: '#FFD700' }}><MdMailOutline sx={{ color: '#1a1a1a' }} /></Avatar>
                        <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 2, color: '#FFD700' }}>Email Sent</Typography>
                        <Typography sx={{ color: '#cccccc', mb: 3 }}>A password reset link has been sent to your email address.</Typography>
                        <Button
                            component="a"
                            href="https://mail.google.com/" 
                            target='_blank'
                            rel='noreferrer'
                            variant='contained'
                            endIcon={<MdMailOutline />}
                            sx={{ bgcolor: '#FFD700', color: '#1a1a1a', borderRadius: '8px', p: 1.5, '&:hover': { bgcolor: '#e6c200' } }}
                        >
                            Open Mail
                        </Button>
                    </Paper>
                )}
            </Container>
        </>
    );
};

ForgotPasswordForm.propTypes = {
    
};

export default ForgotPasswordForm;
