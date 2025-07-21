import '../Login/login.css' 
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Button, Checkbox, CssBaseline, FormControlLabel, Grid, InputAdornment, TextField, Typography, CircularProgress } from '@mui/material' 
import { Box, Container } from '@mui/material' 
import { toast } from 'react-toastify'
import CopyRight from '../../Components/CopyRight/CopyRight'
import { MdLockOutline } from 'react-icons/md'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';


const Register = () => {

  const [credentials, setCredentials] = useState({ firstName: "", lastName: '', email: "", phoneNumber: '', password: "" })
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state for button

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
  }, [navigate]) // Added navigate to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); // Start loading
    let phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gm;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    try {
      if (!credentials.email || !credentials.firstName || !credentials.password || !credentials.phoneNumber || !credentials.lastName) { // Use || for "all fields required"
        toast.error("All fields are required", { autoClose: 500, theme: 'colored' })
      }
      else if (credentials.firstName.length < 1 || credentials.lastName.length < 1) {
        toast.error("Please enter valid name", { autoClose: 500, theme: 'colored' })
      }
      else if (emailRegex.test(credentials.email) === false) { 
        toast.error("Please enter valid email", { autoClose: 500, theme: 'colored' })
      }
      else if (phoneRegex.test(credentials.phoneNumber) === false) { 
        toast.error("Please enter a valid phone number", { autoClose: 500, theme: 'colored' })
        console.log(1);
      }
      else if (credentials.password.length < 5) {
        toast.error("Please enter password with more than 5 characters", { autoClose: 500, theme: 'colored' })
      }
      else { 
        const sendAuth = await axios.post(`${process.env.REACT_APP_REGISTER}`,
          {
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            email: credentials.email,
            phoneNumber: credentials.phoneNumber,
            password: credentials.password,
          })
        const receive = await sendAuth.data
        if (receive.success === true) {
          toast.success("Registered Successfully", { autoClose: 500, theme: 'colored' })
          localStorage.setItem('Authorization', receive.authToken)
          navigate('/')
          console.log(receive);
        }
        else {
          toast.error(receive.message || "Something went wrong, Please try again", { autoClose: 500, theme: 'colored' }) 
          
        }
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data?.error || error.message); 
      
      error.response?.data?.error?.length === 1 ?
        toast.error(error.response.data.error[0].msg, { autoClose: 500, theme: 'colored' })
        : toast.error(error.response?.data?.error || "Registration failed, please try again", { autoClose: 500, theme: 'colored' })
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
    <>
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
          <Avatar sx={{ m: 1, bgcolor: '#FFD700' }}> {}
            <MdLockOutline sx={{ color: '#000000' }} /> {}
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3, fontFamily: 'Cooper Black, serif !important', color: '#ffffff' }}> {}
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  value={credentials.firstName}
                  onChange={handleOnChange}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  sx={textFieldSx} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={credentials.lastName}
                  onChange={handleOnChange}
                  autoComplete="family-name"
                  sx={textFieldSx} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={credentials.email}
                  onChange={handleOnChange}
                  autoComplete="email"
                  sx={textFieldSx} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Contact Number"
                  name="phoneNumber"
                  value={credentials.phoneNumber}
                  onChange={handleOnChange}
                  inputMode='numeric'
                  sx={textFieldSx} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                      </InputAdornment>
                    )
                  }}
                  value={credentials.password}
                  onChange={handleOnChange}
                  autoComplete="new-password"
                  sx={textFieldSx} 
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" sx={{ color: '#FFD700' }} />} 
                  label={<Typography sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif !important' }}>I want to receive inspiration, marketing promotions and updates via email.</Typography>} 
                />
              </Grid>
            </Grid>
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
              {loading ? <CircularProgress size={24} sx={{ color: '#000000' }} /> : 'Sign Up'} {}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif !important' }}> {}
                  Already have an account?
                  <Link to='/login' style={{ textDecoration: 'none' }}>
                    <span style={{ color: '#FFD700', marginLeft: 3, '&:hover': { textDecoration: 'underline' } }}> {}
                      Sign in
                    </span>
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box sx={{ mt: 10 }}> {}
          <CopyRight />
        </Box>
      </Container>
    </>
  )
}

export default Register
