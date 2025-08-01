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
                toast.success(data.message, { theme: 'colored' }); // Use data.message for success
                setIsSentMail(true); // Update state to show email sent confirmation
            } else {
                // Handle cases where success is false but no error is thrown
                toast.error(data.message || "Something went wrong, please try again.", { theme: 'colored' });
            }
        } catch (error) {
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Something went wrong, please try again.", { theme: 'colored' });
        } finally {
            setLoading(false); // Reset loading state
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
    };

    return (
        <>
            <CssBaseline />
            <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)' }}>
                {!isSentMail ? (
                    // Form to request password reset link
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
                    // Confirmation message after email is sent
                    <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                        <Avatar sx={{ m: 'auto', bgcolor: '#FFD700' }}><MdMailOutline sx={{ color: '#1a1a1a' }} /></Avatar>
                        <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 2, color: '#FFD700' }}>Email Sent</Typography>
                        <Typography sx={{ color: '#cccccc', mb: 3 }}>A password reset link has been sent to your email address.</Typography>
                        <Button
                            component="a"
                            href="https://mail.google.com/" // Direct link to Gmail (can be generalized)
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
    // This component does not receive props.
};

export default ForgotPasswordForm;
