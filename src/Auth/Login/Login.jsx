import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, CssBaseline, Grid, InputAdornment, TextField, Typography, CircularProgress, Paper, Box, Container, Checkbox, FormControlLabel } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdLockOutline } from 'react-icons/md';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { ContextFunction } from '../../Context/Context';
import PropTypes from 'prop-types';


import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import { Google } from '@mui/icons-material';

const Login = () => {
  const { setLoginUser } = useContext(ContextFunction);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('Authorization')) {
      navigate("/");
    }
  }, [navigate]);

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(process.env.REACT_APP_LOGIN, credentials);
      if (data.success) {
        toast.success("Login Successfully", { autoClose: 1500, theme: 'colored' });
        localStorage.setItem('Authorization', data.authToken);
        setLoginUser(data.user);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.", { theme: 'colored' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const firebaseIdToken = await user.getIdToken();

      const backendResponse = await axiosInstance.post('/api/auth/google', { idToken: firebaseIdToken });

      const { success, authToken, user: loggedInUser, message } = backendResponse.data;

      if (success) {
        toast.success(message || "Login Successfully with Google", { autoClose: 1500, theme: 'colored' });
        localStorage.setItem('Authorization', authToken);
        setLoginUser(loggedInUser);
        navigate('/');
      } else {
        toast.error(message || "Login with Google failed.", { theme: 'colored' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
      console.error("Google Sign-in Error:", error);
      toast.error(errorMessage, { theme: 'colored' });
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
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '60px',
        boxSizing: 'border-box'
      }}
    >
      <CssBaseline />
      <Box sx={{ position: 'absolute', top: 100, right: 20, zIndex: 1000, display: { xs: 'flex', md: 'flex' }, alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: '#cccccc' }}>Admin?</Typography>
        <Link to="/admin/login" style={{ textDecoration: 'none' }}>
          <Button variant="contained" sx={{ borderRadius: '8px', bgcolor: '#FFD700', color: '#1a1a1a', '&:hover': { bgcolor: '#e6c200' }, fontFamily: 'Cooper Black, serif' }}>Login</Button>
        </Link>
      </Box>

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
          {}
          
          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, bgcolor: '#FFD700', color: '#1a1a1a', borderRadius: '8px', p: 1.5, '&:hover': { bgcolor: '#e6c200' } }}>
            {loading ? <CircularProgress size={24} sx={{ color: '#1a1a1a' }} /> : 'Sign In'}
          </Button>

          {}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              borderRadius: '8px',
              p: 1.5,
              color: '#FFD700',
              borderColor: '#FFD700',
              '&:hover': {
                bgcolor: '#333333',
                borderColor: '#e6c200',
              },
              fontFamily: 'Cooper Black, serif',
            }}
          >
            Sign in with Google
          </Button>

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
  
};

export default Login;
