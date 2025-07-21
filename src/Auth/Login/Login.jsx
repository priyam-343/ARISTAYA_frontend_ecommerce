import './login.css'
import { Avatar, Button, Checkbox, CssBaseline, FormControlLabel, Grid, InputAdornment, TextField, Typography, CircularProgress } from '@mui/material'
import { Box, Container } from '@mui/material'
import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MdLockOutline } from 'react-icons/md'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

import CopyRight from '../../Components/CopyRight/CopyRight'


const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  useEffect(() => {
    let auth = localStorage.getItem('Authorization');
    if (auth) {
      navigate("/")
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    try {
      if (!credentials.email || !credentials.password) {
        toast.error("All fields are required", { autoClose: 500, theme: 'colored' })
      }
      else if (!emailRegex.test(credentials.email)) {
        toast.error("Please enter a valid email", { autoClose: 500, theme: 'colored' })
      }
      else if (credentials.password.length < 5) {
        toast.error("Please enter valid password", { autoClose: 500, theme: 'colored' })
      }
      else if (credentials.email && credentials.password) {
        const sendAuth = await axios.post(`${process.env.REACT_APP_LOGIN}`, { email: credentials.email, password: credentials.password })
        const receive = await sendAuth.data
        if (receive.success === true) {
          toast.success("Login Successfully", { autoClose: 500, theme: 'colored' })
          localStorage.setItem('Authorization', receive.authToken)
          navigate('/')
        }
        else{
          toast.error("Something went wrong, Please try again", { autoClose: 500, theme: 'colored' })
          navigate('/')
        }
      }
    }
    catch (error) {
      error.response.data.error.length === 1 ?
        toast.error(error.response.data.error[0].msg, { autoClose: 500, theme: 'colored' })
        : toast.error(error.response.data.error, { autoClose: 500, theme: 'colored' })
    } finally {
      setLoading(false);
    }
  }

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#444444', 
        },
        '&:hover fieldset': {
            borderColor: '#666666', 
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FFD700', 
        },
        backgroundColor: '#1e1e1e', 
        borderRadius: '8px',
    },
    '& .MuiInputLabel-outlined': {
        color: '#cccccc', 
    },
    '& .MuiInputLabel-outlined.Mui-focused': {
        color: '#FFD700', 
    },
    '& .MuiInputBase-input': {
        fontFamily: 'Cooper Black, serif !important', 
        color: '#ffffff !important', 
    },
    '& .MuiInputAdornment-root': {
      color: '#cccccc !important', 
    }
  };


  return (
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            value={credentials.email}
            name='email'
            onChange={handleOnChange}
            autoComplete="email"
            autoFocus
            sx={textFieldSx}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            value={credentials.password}
            name='password'
            onChange={handleOnChange}
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={handleClickShowPassword} sx={{cursor:'pointer'}}>
                  {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                </InputAdornment>
              )
            }}
            autoComplete="current-password"
            sx={textFieldSx}
          />
          <FormControlLabel
            control={<Checkbox value="remember" sx={{ color: '#FFD700' }} />}
            label={<Typography sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif !important' }}>Remember me</Typography>}
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
            {loading ? <CircularProgress size={24} sx={{ color: '#000000' }} /> : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgotpassword" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#FFD700', fontFamily: 'Cooper Black, serif !important', '&:hover': { textDecoration: 'underline' } }}>
                  Forgot password?
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              {}
              <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif !important' }}>
                Don't have an account?{' '} {}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Typography component="span" sx={{ color: '#FFD700', fontFamily: 'Cooper Black, serif !important', '&:hover': { textDecoration: 'underline' } }}>
                    Sign Up
                  </Typography>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ mt: 10 }}>
        <CopyRight />
      </Box>
    </Container>
  )
}

export default Login
