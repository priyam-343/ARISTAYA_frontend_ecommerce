import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, CssBaseline, Grid, InputAdornment, TextField, Typography, CircularProgress, Paper, Box, Container, Checkbox, FormControlLabel } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdLockOutline } from 'react-icons/md';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { ContextFunction } from '../../Context/Context';
import PropTypes from 'prop-types';

const Login = () => {
  const { setLoginUser } = useContext(ContextFunction);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirects to home page if user is already logged in
    if (localStorage.getItem('Authorization')) {
      navigate("/");
    }
  }, [navigate]);

  // Handles input changes for email and password fields
  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handles the login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true during API call
    try {
      // Make POST request to login endpoint
      const { data } = await axiosInstance.post(process.env.REACT_APP_LOGIN, credentials);
      if (data.success) {
        // Show success toast notification
        toast.success("Login Successfully", { autoClose: 1500, theme: 'colored' });
        // Store authentication token in local storage
        localStorage.setItem('Authorization', data.authToken);
        // Update global login user state with user data from response
        setLoginUser(data.user);
        // Navigate to the home page
        navigate('/');
      }
    } catch (error) {
      // Show error toast notification, using backend's 'message' field for consistency
      toast.error(error.response?.data?.message || "Login failed. Please try again.", { theme: 'colored' });
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
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Ensure it takes full viewport height for alignment
        paddingTop: '120px', // Extra space at the top to allow scrolling
        paddingBottom: '60px', // Extra space at the bottom (optional, but good for symmetrical scroll)
        boxSizing: 'border-box' // Include padding in element's total width and height
      }}
    >
      <CssBaseline />
      {/* Admin Login Button - Visible only on desktop */}
      <Box sx={{ position: 'absolute', top: 100, right: 20, zIndex: 1000, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: '#cccccc' }}>Admin?</Typography>
        <Link to="/admin/login" style={{ textDecoration: 'none' }}>
          <Button variant="contained" sx={{ borderRadius: '8px', bgcolor: '#FFD700', color: '#1a1a1a', '&:hover': { bgcolor: '#e6c200' }, fontFamily: 'Cooper Black, serif' }}>Login</Button>
        </Link>
      </Box>

      {/* Login Form Paper */}
      <Paper elevation={6} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Avatar sx={{ m: 'auto', bgcolor: '#FFD700' }}><MdLockOutline sx={{ color: '#1a1a1a' }} /></Avatar>
        <Typography component="h1" variant="h5" sx={{ mt: 2, mb: 3, color: '#FFD700' }}>Sign In</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name='email' value={credentials.email} onChange={handleOnChange} autoComplete="email" autoFocus sx={textFieldSx} />
          <TextField
            margin="normal" required fullWidth name='password' label="Password" type={showPassword ? "text" : "password"} id="password" value={credentials.password} onChange={handleOnChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} sx={{ cursor: 'pointer' }}>
                  {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                </InputAdornment>
              )
            }}
            sx={textFieldSx}
          />
          {/* Remember Me Checkbox */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <FormControlLabel
              control={<Checkbox value="remember" sx={{ color: '#444', '&.Mui-checked': { color: '#FFD700' } }} />}
              label={<Typography sx={{ color: '#cccccc' }}>Remember me</Typography>}
            />
          </Box>
          {/* Sign In Button */}
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, bgcolor: '#FFD700', color: '#1a1a1a', borderRadius: '8px', p: 1.5, '&:hover': { bgcolor: '#e6c200' } }}>
            {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : 'Sign In'}
          </Button>
          {/* Forgot Password and Sign Up Links */}
          <Grid container>
            <Grid item xs>
              <Link to="/forgotpassword" style={{ textDecoration: 'none' }}><Typography variant="body2" sx={{ color: '#FFD700', '&:hover': { textDecoration: 'underline' } }}>Forgot password?</Typography></Link>
            </Grid>
            <Grid item>
              <Typography variant="body2" sx={{ color: '#cccccc' }}>
                {"Don't have an account? "}
                <Link to="/register" style={{ textDecoration: 'none' }}><Typography component="span" sx={{ color: '#FFD700', '&:hover': { textDecoration: 'underline' } }}>Sign Up</Typography></Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

Login.propTypes = {
  // This component does not receive props.
};

export default Login;
