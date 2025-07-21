import React, { useState } from 'react'
import { Avatar, Button, CssBaseline, TextField, Typography, CircularProgress } from '@mui/material'
import { Box, Container } from '@mui/material'
import { MdLockOutline, MdMailOutline } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-toastify'
import CopyRight from '../../Components/CopyRight/CopyRight'


const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('')
    const [isSentMail, setIsSentMail] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            const sendEmail = await axios.post(`${process.env.REACT_APP_FORGOT_PASSWORD}`, { email: email })
            toast.success(sendEmail.data.msg, { autoClose: 500, theme: 'colored' })
            setIsSentMail(true);
        } catch (error) {
            console.error("Forgot Password Error:", error.response?.data?.msg || error.message);
            toast.error(error.response?.data?.msg || "Something went wrong, please try again", { autoClose: 500, theme: 'colored' })
        } finally {
            setLoading(false);
        }
    }

    // Common TextField styling for ARISTAYA theme
    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#444444', // Default border color
            },
            '&:hover fieldset': {
                borderColor: '#666666', // Hover border color
            },
            '&.Mui-focused fieldset': {
                borderColor: '#FFD700', // Focused border color (gold)
            },
            backgroundColor: '#1e1e1e', // Input field background
            borderRadius: '8px',
        },
        '& .MuiInputLabel-outlined': {
            color: '#cccccc', // Label color
        },
        '& .MuiInputLabel-outlined.Mui-focused': {
            color: '#FFD700', // Focused label color (gold)
        },
        '& .MuiInputBase-input': {
            fontFamily: 'Cooper Black, serif !important', // Apply Cooper Black to input text
            color: '#ffffff !important', // Force input text color to white
        },
    };

    return (
        <>
            {!isSentMail ?
                <Container component="main" maxWidth="xs" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 180px)',
                    backgroundColor: '#000000',
                    padding: '20px'
                }}>
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 4,
                            bgcolor: '#1e1e1e',
                            borderRadius: '12px',
                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                            border: '1px solid #333333',
                            width: '100%',
                            maxWidth: '400px',
                            boxSizing: 'border-box',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: '#FFD700' }}>
                            <MdLockOutline sx={{ color: '#000000' }} />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ mb: 3, fontFamily: 'Cooper Black, serif !important', color: '#ffffff' }}>
                            Forgot Password
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#FFD700 !important',
                                    color: '#000000 !important',
                                    borderRadius: '8px',
                                    padding: '12px 30px',
                                    fontFamily: 'Cooper Black, serif !important',
                                    '&:hover': {
                                        backgroundColor: '#e6b800 !important',
                                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
                                    },
                                    '&.Mui-disabled': {
                                        backgroundColor: '#555555 !important',
                                        color: '#aaaaaa !important',
                                        cursor: 'not-allowed',
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: '#000000' }} /> : 'Submit'}
                            </Button>
                        </Box>

                    </Box>
                    <Box sx={{ mt: 10 }}>
                        <CopyRight />
                    </Box>
                </Container >
                :
                // This entire block is now wrapped in a Container for centering
                <Container component="main" maxWidth="xs" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 180px)', // Ensure it takes full height to center content
                    backgroundColor: '#000000', // Consistent background
                    padding: '20px'
                }}>
                    <Box
                        sx={{
                            marginTop: 8, // Adjust as needed, but 8 is consistent with the form above
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 4,
                            bgcolor: '#1e1e1e',
                            borderRadius: '12px',
                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                            border: '1px solid #333333',
                            width: '100%',
                            maxWidth: '400px',
                            boxSizing: 'border-box',
                            minHeight: '200px',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography component="h2" variant="h6" sx={{ margin: "20px 0", color: '#FFD700', fontFamily: 'Cooper Black, serif !important', textAlign: 'center' }}>
                            Email Sent Successfully
                        </Typography>
                        <a href="https://mail.google.com/mail/" target='_blank' rel='noreferrer' style={{ textDecoration: 'none' }}>
                            <Button
                                endIcon={<MdMailOutline />}
                                variant='contained'
                                sx={{
                                    backgroundColor: '#FFD700 !important',
                                    color: '#000000 !important',
                                    borderRadius: '8px',
                                    padding: '12px 30px',
                                    fontFamily: 'Cooper Black, serif !important',
                                    '&:hover': {
                                        backgroundColor: '#e6b800 !important',
                                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
                                    },
                                }}
                            >
                                Open Mail
                            </Button>
                        </a>
                    </Box>
                    <Box sx={{ mt: 10 }}>
                        <CopyRight />
                    </Box> {/* Consistent spacing for CopyRight */}
                </Container>
            }
        </>
    )
}

export default ForgotPasswordForm
