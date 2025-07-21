import '../Login/login.css' // Assuming this CSS provides general login/register styling
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Button, Checkbox, CssBaseline, FormControlLabel, Grid, InputAdornment, TextField, Typography, CircularProgress } from '@mui/material' // Added CircularProgress
import { Box, Container } from '@mui/material' // FIXED: Box, Container from @mui/system to @mui/material
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
      else if (emailRegex.test(credentials.email) === false) { // Strict comparison
        toast.error("Please enter valid email", { autoClose: 500, theme: 'colored' })
      }
      else if (phoneRegex.test(credentials.phoneNumber) === false) { // Strict comparison
        toast.error("Please enter a valid phone number", { autoClose: 500, theme: 'colored' })
        console.log(1);
      }
      else if (credentials.password.length < 5) {
        toast.error("Please enter password with more than 5 characters", { autoClose: 500, theme: 'colored' })
      }
      else { // Proceed with API call only if all validations pass
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
          toast.error(receive.message || "Something went wrong, Please try again", { autoClose: 500, theme: 'colored' }) // Use backend message if available
          // navigate('/') // Avoid navigating on error unless specifically desired
        }
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data?.error || error.message); // Log full error
      // Improved error handling for backend messages
      error.response?.data?.error?.length === 1 ?
        toast.error(error.response.data.error[0].msg, { autoClose: 500, theme: 'colored' })
        : toast.error(error.response?.data?.error || "Registration failed, please try again", { autoClose: 500, theme: 'colored' })
    } finally {
      setLoading(false); // End loading
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
    // Style for eye icon
    '& .MuiInputAdornment-root': {
      color: '#cccccc !important', // Eye icon color
    }
  };


  return (
    <>
      <Container component="main" maxWidth="xs" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 180px)', // Adjust height to push footer down
        backgroundColor: '#000000', // Dark background for the page
        padding: '20px'
      }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4, // Padding around the box content
            bgcolor: '#1e1e1e', // Dark card background
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
            border: '1px solid #333333',
            width: '100%',
            maxWidth: '400px', // Max width for the form box
            boxSizing: 'border-box', // Include padding in width calculation
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#FFD700' }}> {/* Themed Avatar background to gold */}
            <MdLockOutline sx={{ color: '#000000' }} /> {/* Lock icon color black */}
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3, fontFamily: 'Cooper Black, serif !important', color: '#ffffff' }}> {/* Themed typography */}
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
                  sx={textFieldSx} // Apply themed styling
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
                  sx={textFieldSx} // Apply themed styling
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
                  sx={textFieldSx} // Apply themed styling
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
                  sx={textFieldSx} // Apply themed styling
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
                  sx={textFieldSx} // Apply themed styling
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
              disabled={loading} // Disable button during loading
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#FFD700 !important', // Gold button for primary action
                color: '#000000 !important', // Black text
                borderRadius: '8px',
                padding: '12px 30px',
                fontFamily: 'Cooper Black, serif !important',
                '&:hover': {
                  backgroundColor: '#e6b800 !important', // Darker gold on hover
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
                },
                '&.Mui-disabled': { // Style for disabled state
                  backgroundColor: '#555555 !important',
                  color: '#aaaaaa !important',
                  cursor: 'not-allowed',
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#000000' }} /> : 'Sign Up'} {/* Loading spinner */}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif !important' }}> {/* Themed text */}
                  Already have an account?
                  <Link to='/login' style={{ textDecoration: 'none' }}>
                    <span style={{ color: '#FFD700', marginLeft: 3, '&:hover': { textDecoration: 'underline' } }}> {/* Themed link */}
                      Sign in
                    </span>
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box sx={{ mt: 10 }}> {/* Maintaining your current spacing for CopyRight */}
          <CopyRight />
        </Box>
      </Container>
    </>
  )
}

export default Register
