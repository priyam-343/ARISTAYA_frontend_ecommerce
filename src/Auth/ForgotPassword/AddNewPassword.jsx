import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, CssBaseline, InputAdornment, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { MdLockOutline } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-toastify'
import CopyRight from '../../Components/CopyRight/CopyRight'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';


const AddNewPassword = () => {
    const { id, token } = useParams()
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    let navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            const { data } = await axios.post(`${process.env.REACT_APP_FORGOT_PASSWORD}/${id}/${token}`, { newPassword: password })
            if (data.msg.name == "TokenExpiredError") {
                toast.error("Token is expired Please try again", { autoClose: 500, theme: 'colored' })
                navigate('/login')
            }
            else {
                toast.success(data.msg, { autoClose: 500, theme: 'colored' })
                navigate('/login')
            }

        } catch (error) {
            toast.error(error.response?.data?.msg || "An unexpected error occurred.", { autoClose: 500, theme: 'colored' })
        }
    }




    return (
        <Container component="main" maxWidth="xs" sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000000', // Explicitly set black background for this page
            color: '#ffffff',
            fontFamily: "'Cooper Black', serif",
            padding: '20px',
            boxSizing: 'border-sizing', // Changed from box-border to box-sizing for consistency
        }}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 0,
                    marginBottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#1e1e1e',
                    borderRadius: '15px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                    border: '1px solid #333333',
                    padding: '30px',
                    width: '100%',
                    maxWidth: '500px',
                    textAlign: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#FFD700', color: '#1a1a1a' }}>
                    <MdLockOutline />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{
                    color: '#ffffff !important',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontFamily: "'Cooper Black', serif !important",
                    mb: 2,
                }}>
                    Reset Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Enter New Password"
                        value={password}
                        name='password'
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer', color: '#cccccc' }}>
                                    {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                </InputAdornment>
                            ),
                            sx: {
                                color: '#ffffff',
                                borderRadius: '8px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#444444',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#666666',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#FFD700',
                                },
                            }
                        }}
                        InputLabelProps={{
                            sx: {
                                color: '#cccccc',
                                '&.Mui-focused': {
                                    color: '#FFD700',
                                },
                            }
                        }}
                        sx={{
                            borderRadius: '8px',
                        }}
                        autoFocus
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#FFD700', // Gold background for button
                            color: '#1a1a1a !important', // <-- CHANGED THIS TO DARK GREY/BLACK TEXT
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            textTransform: 'uppercase',
                            fontWeight: 500,
                            transition: 'all 0.3s ease-in-out',
                            fontFamily: "'Cooper Black', serif !important",
                            '&:hover': {
                                backgroundColor: '#e6c200',
                                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        SUBMIT
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 4, color: '#ffffff', fontFamily: "'Cooper Black', serif !important" }}>
                <Box sx={{ mt: 10 }}>
        <          CopyRight />
                </Box>
            </Box>
        </Container>
    )
}

export default AddNewPassword;

