import { Avatar, Button, CssBaseline, Grid, InputAdornment, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { useEffect, useState } from 'react' // Removed useCallback
import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstance
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CgProfile } from 'react-icons/cg'
import CopyRight from '../../Components/CopyRight/CopyRight'
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { AiFillCloseCircle, AiFillDelete, AiOutlineFileDone } from 'react-icons/ai'
import { RiLockPasswordLine } from 'react-icons/ri'
import { TiArrowBackOutline } from 'react-icons/ti';
import { Transition } from '../../Constants/Constant'
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';


const UpdateDetails = () => {
    const [userData, setUserData] = useState([]) // Stores the fetched user data
    const [openAlert, setOpenAlert] = useState(false); // State for delete confirmation dialog
    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    // Removed loading state

    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '', // Reverted to 'email'
        address: '',
        zipCode: '',
        city: '',
        userState: '',
    })
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    // Reverted new password toggle to original anonymous function in JSX
    let navigate = useNavigate()

    // --- DIAGNOSTIC LOGS START ---
    console.log("UpdateDetails Component Rendered");
    console.log("REACT_APP_GET_USER_DETAILS (from .env):", process.env.REACT_APP_GET_USER_DETAILS);
    console.log("REACT_APP_UPDATE_USER (from .env):", process.env.REACT_APP_UPDATE_USER);
    console.log("REACT_APP_RESET_PASSWORD (from .env):", process.env.REACT_APP_RESET_PASSWORD);
    console.log("REACT_APP_DELETE_USER (from .env):", process.env.REACT_APP_DELETE_USER);
    console.log("Axios Instance BaseURL:", axiosInstance.defaults.baseURL);
    // --- DIAGNOSTIC LOGS END ---

    useEffect(() => {
        console.log("UpdateDetails useEffect triggered for getUserData. setProceed:", setProceed);
        setProceed ? getUserData() : navigate('/') // Reverted navigation logic
    }, [setProceed, navigate]) // Added navigate to dependency array

    const getUserData = async () => {
        try {
            console.log("Attempting GET request for user data to:", `${axiosInstance.defaults.baseURL}/api/auth/getuser`);
            const { data } = await axiosInstance.get(`/api/auth/getuser`, {
                headers: {
                    'Authorization': authToken
                }
            })
            setUserDetails({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email, // Reverted to data.email
                phoneNumber: data.phoneNumber,
                address: data.address || '',
                zipCode: data.zipCode || '',
                city: data.city || '',
                userState: data.userState || '',
            })
            setUserData(data);
            console.log("User data fetched successfully:", data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Error fetching user data", { autoClose: 500, theme: 'colored' })
        }
    }

    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    let phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!userDetails.email || !userDetails.firstName || !userDetails.phoneNumber || !userDetails.lastName || !userDetails.address || !userDetails.city || !userDetails.userState || !userDetails.zipCode) {
                toast.error("Please Fill all the Fields", { autoClose: 500, theme: 'colored' })
            }
            else if (userDetails.firstName.length < 3 || userDetails.lastName.length < 3) {
                toast.error("Please enter name with more than 3 characters", { autoClose: 500, theme: 'colored' })
            }
            else if (!emailRegex.test(userDetails.email)) {
                toast.error("Please enter valid email", { autoClose: 500, theme: 'colored' })
            }
            else if (!phoneRegex.test(userDetails.phoneNumber)) {
                toast.error("Please enter a valid phone number", { autoClose: 500, theme: 'colored' })
            }
            else if (!userDetails.address) {
                toast.error("Please add address", { autoClose: 500, theme: 'colored' })
            }
            else if (!userDetails.city) {
                toast.error("Please add city", { autoClose: 500, theme: 'colored' })
            }
            else if (!userDetails.zipCode) {
                toast.error("Please enter valid Zip code", { autoClose: 500, theme: 'colored' })
            }
            else if (!userDetails.userState) {
                toast.error("Please add state", { autoClose: 500, theme: 'colored' })
            }
            else {
                console.log("Attempting PUT request for user details update to:", `${axiosInstance.defaults.baseURL}/api/auth/updateuser`);
                const { data } = await axiosInstance.put(`/api/auth/updateuser`,
                    {
                        firstName: userDetails.firstName,
                        lastName: userDetails.lastName,
                        email: userDetails.email, // Reverted to email
                        phoneNumber: userDetails.phoneNumber,
                        address: userDetails.address,
                        zipCode: userDetails.zipCode,
                        city: userDetails.city,
                        userState: userDetails.userState,
                    },
                    {
                        headers: {
                            'Authorization': authToken
                        }
                    })
                if (data.success === true) {
                    toast.success("Updated Successfully", { autoClose: 500, theme: 'colored' })
                    getUserData()
                }
                else {
                    toast.error("Something went wrong", { autoClose: 500, theme: 'colored' })
                }
            }
        }
        catch (error) {
            console.error("Error updating user details:", error);
            if (error.response && error.response.data && error.response.data.error && error.response.data.error[0] && error.response.data.error[0].msg) {
                toast.error(error.response.data.error[0].msg, { autoClose: 500, theme: 'colored' })
            } else if (error.response && error.response.data) {
                toast.error(error.response.data, { autoClose: 500, theme: 'colored' })
            }
            else {
                toast.error("An unexpected error occurred.", { autoClose: 500, theme: 'colored' })
            }
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        try {
            if (!password.currentPassword || !password.newPassword) {
                toast.error("Please Fill all the Fields", { autoClose: 500, theme: 'colored' })
            }
            else if (password.currentPassword.length < 5) {
                toast.error("Please enter valid current password (min 5 chars)", { autoClose: 500, theme: 'colored' })
            }
            else if (password.newPassword.length < 5) {
                toast.error("Please enter new password with more than 5 characters", { autoClose: 500, theme: 'colored' })
            }
            else {
                console.log("Attempting POST request for password reset to:", `${axiosInstance.defaults.baseURL}/api/password/reset/password`);
                const { data } = await axiosInstance.post(`/api/password/reset/password`, {
                    id: userData._id,
                    currentPassword: password.currentPassword,
                    newPassword: password.newPassword,
                }, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                toast.success(data, { autoClose: 500, theme: 'colored' })
                setPassword({ currentPassword: "", newPassword: "" })
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            if (error.response && error.response.data) {
                toast.error(error.response.data, { autoClose: 500, theme: 'colored' })
            } else {
                toast.error("An unexpected error occurred.", { autoClose: 500, theme: 'colored' })
            }
        }
    }

    const deleteAccount = async () => {
        try {
            console.log("Attempting DELETE request for account deletion to:", `${axiosInstance.defaults.baseURL}/api/auth/delete/user/${userData._id}`);
            await axiosInstance.delete(`/api/auth/delete/user/${userData._id}`, {
                headers: {
                    'Authorization': authToken
                }
            });
            toast.success("Account deleted successfully", { autoClose: 500, theme: 'colored' })
            localStorage.removeItem('Authorization');
            sessionStorage.removeItem('totalAmount');
            // Removed setLoginUser({})
            navigate("/login")
        } catch (error) {
            console.error("Error deleting account:", error);
            if (error.response && error.response.data) {
                toast.error(error.response.data, { autoClose: 500, theme: 'colored' })
            } else {
                toast.error("An unexpected error occurred.", { autoClose: 500, theme: 'colored' })
            }
        } finally {
            setOpenAlert(false);
        }
    }

    // Common TextField styling
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
        '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#ffffff !important',
            color: '#ffffff !important',
            opacity: 1,
        },
        '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: '#1e1e1e !important',
            color: '#ffffff !important',
        },
        '& .MuiInputAdornment-root .MuiSvgIcon-root': {
            color: '#cccccc !important',
        },
    };

    // Removed loading conditional render

    return (
        <>
            <CssBaseline />
            <Container sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 10,
                marginTop: 10,
                padding: '20px',
                backgroundColor: '#000000',
                minHeight: 'calc(100vh - 180px)'
            }}>
                {/* Personal Information Section */}
                <Typography variant='h4' sx={{ margin: '20px 0', color: '#ffffff', fontWeight: 'bold', fontFamily: 'Cooper Black, serif !important' }}>
                    Personal Information
                </Typography>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                    sx={{
                        backgroundColor: '#1e1e1e',
                        padding: '40px',
                        borderRadius: '15px',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                        border: '1px solid #333333',
                        width: '100%',
                        maxWidth: '800px',
                        boxSizing: 'border-box',
                        mb: 5
                    }}
                >
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="First Name" name='firstName' value={userDetails.firstName || ''} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Last Name" name='lastName' value={userDetails.lastName || ''} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Contact Number" type='tel' name='phoneNumber' value={userDetails.phoneNumber || ''} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Email" name='email' value={userDetails.email || ''} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Address" name='address' value={userDetails.address || ''} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="City" name='city' value={userDetails.city || ''} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField type='tel' label="Postal/Zip Code" name='zipCode' value={userDetails.zipCode || ''} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField label="Province/State" name='userState' value={userDetails.userState || ''} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', gap: { xs: 2, md: 5 }, justifyContent: 'center', marginTop: 5, flexWrap: 'wrap' }}>
                        <Button variant='contained' endIcon={<TiArrowBackOutline />} onClick={() => navigate(-1)}
                            sx={{
                                backgroundColor: '#333333 !important',
                                color: 'white !important',
                                border: '1px solid #444444',
                                '&:hover': { backgroundColor: '#444444 !important' },
                                fontFamily: 'Cooper Black, serif !important',
                                padding: '12px 30px'
                            }}>
                            Back
                        </Button>
                        <Button variant='contained' endIcon={<AiOutlineFileDone />} type='submit'
                            sx={{
                                backgroundColor: '#FFD700 !important',
                                color: '#000000 !important',
                                border: '1px solid #FFD700',
                                '&:hover': { backgroundColor: '#e6b800 !important' },
                                fontFamily: 'Cooper Black, serif !important',
                                padding: '12px 30px'
                            }}>
                            Save
                        </Button>
                    </Container>
                </Box>

                {/* Reset Password Section */}
                <Typography variant='h4' sx={{ margin: '40px 0 20px', color: '#ffffff', fontWeight: 'bold', fontFamily: 'Cooper Black, serif !important' }}>
                    Reset Password
                </Typography>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleResetPassword}
                    sx={{
                        backgroundColor: '#1e1e1e',
                        padding: '40px',
                        borderRadius: '15px',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                        border: '1px solid #333333',
                        width: '100%',
                        maxWidth: '800px',
                        boxSizing: 'border-box',
                        mb: 5
                    }}
                >
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <TextField
                                label="Current Password"
                                name='currentPassword'
                                type={showPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                                            {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </InputAdornment>
                                    )
                                }}
                                value={password.currentPassword || ''}
                                onChange={
                                    (e) => setPassword({
                                        ...password, [e.target.name]: e.target.value
                                    })
                                }
                                variant="outlined"
                                fullWidth
                                sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="New Password"
                                name='newPassword'
                                type={showNewPassword ? "text" : "password"}
                                id="password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" onClick={() => setShowNewPassword(!showNewPassword)} sx={{ cursor: 'pointer' }}> {/* Reverted to original anonymous function */}
                                            {showNewPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                        </InputAdornment>
                                    )
                                }}
                                value={password.newPassword || ''}
                                onChange={
                                    (e) => setPassword({
                                        ...password, [e.target.name]: e.target.value
                                    })
                                }
                                variant="outlined"
                                fullWidth
                                sx={textFieldSx} />
                        </Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                        <Button variant='contained' endIcon={<RiLockPasswordLine />} type='submit'
                            sx={{
                                backgroundColor: '#FFD700 !important',
                                color: '#000000 !important',
                                border: '1px solid #FFD700',
                                '&:hover': { backgroundColor: '#e6b800 !important' },
                                fontFamily: 'Cooper Black, serif !important',
                                padding: '12px 30px'
                            }}>
                            Reset
                        </Button>
                    </Container>
                </Box>

                {/* Delete Account Section */}
                <Typography variant='h4' sx={{ margin: '40px 0 20px', color: '#ffffff', fontWeight: 'bold', fontFamily: 'Cooper Black, serif !important' }}>
                    Delete Your Account?
                </Typography>
                <Box
                    sx={{
                        backgroundColor: '#1e1e1e',
                        padding: '40px',
                        borderRadius: '15px',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                        border: '1px solid #333333',
                        width: '100%',
                        maxWidth: '800px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 5
                    }}
                >
                    <Button variant='contained' endIcon={<AiFillDelete />} onClick={() => setOpenAlert(true)}
                        sx={{
                            backgroundColor: '#8B0000 !important',
                            color: 'white !important',
                            border: '1px solid #B22222',
                            '&:hover': { backgroundColor: '#B22222 !important' },
                            fontFamily: 'Cooper Black, serif !important',
                            padding: '12px 30px'
                        }}>
                        Delete
                    </Button>
                </Box>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOpenAlert(false)} // Reverted to original close logic
                    aria-describedby="delete-alert-dialog-slide-description"
                    PaperProps={{
                        sx: {
                            backgroundColor: '#1e1e1e',
                            color: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                            border: '1px solid #333333',
                        }
                    }}
                >
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center', padding: '30px' }}>
                        <DialogContentText sx={{ textAlign: 'center', fontFamily: 'Cooper Black, serif !important', color: '#ffffff !important' }}>
                            Your all data will be erased
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', paddingBottom: '20px' }}>
                        <Button variant='contained' endIcon={<AiFillDelete />} onClick={deleteAccount}
                            sx={{
                                backgroundColor: '#8B0000 !important',
                                color: 'white !important',
                                border: '1px solid #B22222',
                                '&:hover': { backgroundColor: '#B22222 !important' },
                                fontFamily: 'Cooper Black, serif !important'
                            }}>
                            Delete
                        </Button>
                        <Button variant='contained' endIcon={<AiFillCloseCircle />} onClick={() => setOpenAlert(false)} // Reverted to original close logic
                            sx={{
                                backgroundColor: '#333333 !important',
                                color: 'white !important',
                                border: '1px solid #444444',
                                '&:hover': { backgroundColor: '#444444 !important' },
                                fontFamily: 'Cooper Black, serif !important'
                            }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default UpdateDetails
