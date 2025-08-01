import React, { useEffect, useState } from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, Grid, TextField, Typography, Box, CssBaseline, InputAdornment } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdUpdate } from 'react-icons/md';
import { AiFillCloseCircle, AiFillDelete, AiOutlineFileDone } from 'react-icons/ai';
import { RiEyeFill, RiEyeOffFill, RiLockPasswordLine } from 'react-icons/ri';
import { TiArrowBackOutline } from 'react-icons/ti';
import { Transition } from '../../Constants/Constant'; // Assuming this constant exists
import PropTypes from 'prop-types';

const UpdateDetails = () => {
    const [openAlert, setOpenAlert] = useState(false); // State for delete account confirmation dialog
    const [loading, setLoading] = useState(true); // Loading state for fetching user data
    const navigate = useNavigate();
    const authToken = localStorage.getItem('Authorization'); // Get auth token

    // State for user details form
    const [userDetails, setUserDetails] = useState({
        firstName: '', lastName: '', phoneNumber: '', email: '',
        address: '', zipCode: '', city: '', userState: '',
    });
    // State for password reset form
    const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
    // States for password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Effect to fetch user data on component mount or auth token change
    useEffect(() => {
        const getUserData = async () => {
            if (authToken) {
                try {
                    const { data } = await axiosInstance.get(`/api/auth/getuser`, {
                        headers: { 'Authorization': authToken }
                    });
                    // CRITICAL FIX: Access user details from 'data.user' as per backend standardization
                    if (data.success && data.user) {
                        setUserDetails({
                            firstName: data.user.firstName || '', lastName: data.user.lastName || '',
                            email: data.user.email || '', phoneNumber: data.user.phoneNumber || '',
                            address: data.user.address || '', zipCode: data.user.zipCode || '',
                            city: data.user.city || '', userState: data.user.userState || '',
                        });
                    } else {
                        // Handle cases where success is false or user data is missing
                        toast.error(data.message || "Failed to fetch user data.", { theme: 'colored' });
                        navigate('/login'); // Redirect if user data can't be fetched
                    }
                } catch (error) {
                    // Use backend's standardized 'message' field for error toasts
                    toast.error(error.response?.data?.message || "Error fetching user data.", { theme: 'colored' });
                    navigate('/login'); // Redirect on API error
                } finally {
                    setLoading(false); // Always set loading to false
                }
            } else {
                navigate('/login'); // Redirect to login if no auth token
            }
        };
        getUserData();
    }, [authToken, navigate]); // Dependencies: authToken and navigate

    // Handles changes in user details form fields
    const handleOnChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    // Handles changes in password reset form fields
    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    // Handles submission of user details update form
    const handleSubmitDetails = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosInstance.put(`/api/auth/updateuser`, userDetails, {
                headers: { 'Authorization': authToken }
            });
            // Backend now returns { success: true, message: "...", user: {...} }
            if (data.success) {
                toast.success(data.message || "Profile Updated Successfully", { theme: 'colored' }); // Use data.message
            } else {
                toast.error(data.message || "Something went wrong during profile update.", { theme: 'colored' });
            }
        } catch (error) {
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Profile update failed.", { theme: 'colored' });
        }
    };

    // Handles submission of password reset form (for logged-in user)
    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosInstance.post(`/api/password/reset/password`, password, {
                headers: { 'Authorization': authToken }
            });
            // Backend now returns { success: true, message: "..." }
            if (data.success) {
                toast.success(data.message || "Password reset successfully.", { theme: 'colored' }); // Use data.message
                setPassword({ currentPassword: "", newPassword: "" }); // Clear password fields
            } else {
                toast.error(data.message || "Password reset failed.", { theme: 'colored' });
            }
        } catch (error) {
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Password reset failed.", { theme: 'colored' });
        }
    };

    // Handles account deletion
    const deleteAccount = async () => {
        try {
            const { data } = await axiosInstance.delete(`/api/auth/delete/user`, {
                headers: { 'Authorization': authToken }
            });
            // Backend now returns { success: true, message: "..." }
            if (data.success) {
                toast.success(data.message || "Account deleted successfully", { theme: 'colored' }); // Use data.message
                localStorage.clear(); // Clear local storage
                sessionStorage.clear(); // Clear session storage
                navigate("/login"); // Navigate to login page
            } else {
                toast.error(data.message || "Failed to delete account.", { theme: 'colored' });
            }
        } catch (error) {
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Failed to delete account.", { theme: 'colored' });
        } finally {
            setOpenAlert(false); // Close confirmation dialog
        }
    };

    // Custom styles for Material-UI TextField components
    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#444' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
        },
        '& .MuiInputLabel-root': { color: '#cccccc', fontFamily: 'Cooper Black, serif' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
        '& .MuiInputBase-input': { color: 'white', fontFamily: 'Cooper Black, serif' },
        '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: '#cccccc' },
    };

    // Common styles for section boxes
    const sectionBoxSx = {
        bgcolor: '#1e1e1e', p: 4, borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
        border: '1px solid #333', width: '100%', maxWidth: '800px',
    };

    // Show loading indicator while fetching user data
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Typography variant='h4' sx={{ color: 'white' }}>Loading Profile...</Typography></Box>;
    }

    return (
        <>
            <CssBaseline />
            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 10, mt: 10, bgcolor: '#000000' }}>
                {/* Personal Information Section */}
                <Typography variant='h4' sx={{ mb: 3, color: 'white', fontWeight: 'bold' }}>Personal Information</Typography>
                <Box component="form" onSubmit={handleSubmitDetails} sx={sectionBoxSx}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}><TextField label="First Name" name='firstName' value={userDetails.firstName} onChange={handleOnChange} fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Last Name" name='lastName' value={userDetails.lastName} onChange={handleOnChange} fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Contact Number" name='phoneNumber' value={userDetails.phoneNumber} onChange={handleOnChange} fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Email" name='email' value={userDetails.email} onChange={handleOnChange} fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12}><TextField label="Address" name='address' value={userDetails.address} onChange={handleOnChange} fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="City" name='city' value={userDetails.city} onChange={handleOnChange} fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Postal/Zip Code" name='zipCode' value={userDetails.zipCode} onChange={handleOnChange} fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12}><TextField label="Province/State" name='userState' value={userDetails.userState} onChange={handleOnChange} fullWidth required sx={textFieldSx} /></Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                        <Button variant='contained' endIcon={<TiArrowBackOutline />} onClick={() => navigate(-1)} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Back</Button>
                        <Button variant='contained' endIcon={<AiOutlineFileDone />} type='submit' sx={{ bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#e6c200' } }}>Save</Button>
                    </Box>
                </Box>

                {/* Reset Password Section */}
                <Typography variant='h4' sx={{ mt: 7, mb: 3, color: 'white', fontWeight: 'bold' }}>Reset Password</Typography>
                <Box component="form" onSubmit={handleResetPassword} sx={sectionBoxSx}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}><TextField label="Current Password" name='currentPassword' type={showPassword ? "text" : "password"} value={password.currentPassword} onChange={handlePasswordChange} fullWidth required sx={textFieldSx} InputProps={{ endAdornment: (<InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} sx={{ cursor: 'pointer' }}>{showPassword ? <RiEyeFill /> : <RiEyeOffFill />}</InputAdornment>) }} /></Grid>
                        <Grid item xs={12}><TextField label="New Password" name='newPassword' type={showNewPassword ? "text" : "password"} value={password.newPassword} onChange={handlePasswordChange} fullWidth required sx={textFieldSx} InputProps={{ endAdornment: (<InputAdornment position="end" onClick={() => setShowNewPassword(!showNewPassword)} sx={{ cursor: 'pointer' }}>{showNewPassword ? <RiEyeFill /> : <RiEyeOffFill />}</InputAdornment>) }} /></Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button variant='contained' endIcon={<RiLockPasswordLine />} type='submit' sx={{ bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#e6c200' } }}>Reset</Button>
                    </Box>
                </Box>

                {/* Delete Account Section */}
                <Typography variant='h4' sx={{ mt: 7, mb: 3, color: 'white', fontWeight: 'bold' }}>Delete Account</Typography>
                <Box sx={{ ...sectionBoxSx, textAlign: 'center' }}>
                    <Typography sx={{ mb: 2, color: '#cccccc' }}>Once you delete your account, there is no going back. Please be certain.</Typography>
                    <Button variant='contained' endIcon={<AiFillDelete />} onClick={() => setOpenAlert(true)} sx={{ bgcolor: '#8B0000', '&:hover': { bgcolor: '#B22222' } }}>Delete My Account</Button>
                </Box>

                {/* Delete Account Confirmation Dialog */}
                <Dialog open={openAlert} TransitionComponent={Transition} keepMounted onClose={() => setOpenAlert(false)} PaperProps={{ sx: { bgcolor: '#1e1e1e', color: 'white', borderRadius: '12px', border: '1px solid #333' } }}>
                    <DialogContent sx={{ p: 4 }}><Typography sx={{ textAlign: 'center', fontFamily: 'Cooper Black, serif' }}>Are you sure? Your account and all data will be permanently erased.</Typography></DialogContent>
                    <DialogActions sx={{ justifyContent: 'space-evenly', pb: 3 }}>
                        <Button variant='contained' endIcon={<AiFillDelete />} onClick={deleteAccount} sx={{ bgcolor: '#8B0000', '&:hover': { bgcolor: '#B22222' } }}>Delete</Button>
                        <Button variant='contained' endIcon={<AiFillCloseCircle />} onClick={() => setOpenAlert(false)} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

UpdateDetails.propTypes = {
    // No props are passed to this component.
};

export default UpdateDetails;
