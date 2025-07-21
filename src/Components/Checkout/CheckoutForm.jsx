import React, { useContext, useEffect, useState, useCallback } from 'react'
import { Button, Container, Dialog, DialogActions, DialogContent, Grid, TextField, Typography, Box, CssBaseline } from '@mui/material'
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BsFillCartCheckFill } from 'react-icons/bs'
import { MdUpdate } from 'react-icons/md'
import { AiFillCloseCircle, AiOutlineLogin, AiOutlineSave } from 'react-icons/ai'
import { profile } from '../../Assets/Images/Image'
import { ContextFunction } from '../../Context/Context'
import CopyRight from '../../Components/CopyRight/CopyRight'
import { Transition, handleClose } from '../../Constants/Constant'

const CheckoutForm = () => {
    const { cart } = useContext(ContextFunction)
    const [userData, setUserData] = useState(null)
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(true);

    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    let navigate = useNavigate()
    let totalAmount = sessionStorage.getItem('totalAmount')

    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        userEmail: '',
        address: '',
        zipCode: '',
        city: '',
        userState: '',
    })

    const getUserData = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get(`${process.env.REACT_APP_GET_USER_DETAILS}`, {
                headers: {
                    'Authorization': authToken
                }
            })
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Error fetching user details.", { autoClose: 500, theme: 'colored' });
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        if (setProceed) {
            getUserData()
        } else {
            navigate('/')
            toast.error("Please login to proceed to checkout.", { autoClose: 500, theme: 'colored' });
            setLoading(false);
        }
        window.scroll(0, 0);
    }, [setProceed, navigate, getUserData]);

    useEffect(() => {
        if (userData) {
            setUserDetails({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                phoneNumber: userData.phoneNumber || '',
                userEmail: userData.email || '',
                address: userData.address || '',
                zipCode: userData.zipCode || '',
                city: userData.city || '',
                userState: userData.userState || '',
            });
            if (!userData.address || !userData.city || !userData.zipCode || !userData.userState) {
                setOpenAlert(true);
            }
        }
    }, [userData]);

    const checkOutHandler = async (e) => {
        e.preventDefault()

        if (!userDetails.firstName || !userDetails.lastName || !userDetails.userEmail || !userDetails.phoneNumber || !userDetails.address || !userDetails.zipCode || !userDetails.city || !userDetails.userState) {
            toast.error("Please fill all fields", { autoClose: 500, theme: "colored" })
            return;
        }

        if (cart.length === 0) {
            toast.error("Your cart is empty. Please add items to proceed.", { autoClose: 500, theme: "colored" });
            return;
        }

        try {
            const { data: { key } } = await axiosInstance.get(`${process.env.REACT_APP_GET_KEY}`)
            const { data } = await axiosInstance.post(`${process.env.REACT_APP_GET_CHECKOUT}`, {
                amount: totalAmount,
                productDetails: JSON.stringify(cart),
                userId: userData._id,
                userDetails: JSON.stringify(userDetails),
            })

            const options = {
                key: key,
                amount: totalAmount * 100,
                currency: "INR",
                name: "ARISTAYA",
                description: "Payment for ARISTAYA Order",
                image: profile,
                order_id: data.order.id,
                callback_url: process.env.REACT_APP_GET_PAYMENTVERIFICATION,
                prefill: {
                    name: userDetails.firstName + ' ' + userDetails.lastName,
                    email: userDetails.userEmail,
                    contact: userDetails.phoneNumber
                },
                notes: {
                    "address": `${userDetails.address}, ${userDetails.city}, ${userDetails.zipCode}, ${userDetails.userState}`
                },
                theme: {
                    "color": "#FFD700"
                },
            };
            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error("Error during checkout process:", error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to initiate checkout", { autoClose: 500, theme: 'colored' });
        }
    }

    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }

    // Common TextField styling
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
            color: '#ffffff !important', // Force input text color to white for editable fields
        },
        // NEW: Specific styles for disabled input text
        '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#ffffff !important', // For Chrome/Safari disabled text
            color: '#ffffff !important', // For Firefox/Edge disabled text
            opacity: 1, // Ensure full opacity for disabled text
        },
        // NEW: Also target the root of the disabled input for consistency
        '& .MuiInputBase-root.Mui-disabled': {
            backgroundColor: '#1e1e1e !important', // Ensure disabled background is also dark
            color: '#ffffff !important', // Ensure disabled text color is white
        },
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', backgroundColor: '#000000' }}>
                <Typography variant='h4' sx={{ color: '#ffffff', fontFamily: 'Cooper Black, serif !important' }}>Loading Checkout...</Typography>
            </Box>
        );
    }

    return (
        <>
            <CssBaseline />
            <Container sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginBottom: 10,
                marginTop: 10,
                padding: '20px',
                backgroundColor: '#000000', // Ensure container background is black
                minHeight: 'calc(100vh - 180px)' // Ensure it fills viewport height
            }}>
                <Typography variant='h4' sx={{ margin: '20px 0', color: '#ffffff', fontWeight: 'bold', fontFamily: 'Cooper Black, serif !important' }}>Checkout</Typography>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={checkOutHandler}
                    sx={{
                        backgroundColor: '#1e1e1e', // Dark background for the form container
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
                            <TextField inputProps={{ readOnly: true }} disabled label="First Name" name='firstName' value={userDetails.firstName} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField inputProps={{ readOnly: true }} disabled label="Last Name" name='lastName' value={userDetails.lastName} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField inputProps={{ readOnly: true }} disabled label="Contact Number" type='tel' name='phoneNumber' value={userDetails.phoneNumber} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField inputProps={{ readOnly: true }} disabled label="Email" name='userEmail' value={userDetails.userEmail} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Address" name='address' value={userDetails.address} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="City" name='city' value={userDetails.city} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField type='tel' label="Postal/Zip Code" name='zipCode' value={userDetails.zipCode} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField label="Province/State" name='userState' value={userDetails.userState} onChange={handleOnchange} variant="outlined" fullWidth sx={textFieldSx} />
                        </Grid>
                    </Grid>
                    <Container sx={{ display: 'flex', gap: { xs: 2, md: 5 }, justifyContent: 'center', marginTop: 5, flexWrap: 'wrap' }}>
                        <Link to='/update' style={{ textDecoration: 'none' }}>
                            <Button variant='contained' endIcon={<MdUpdate />}
                                sx={{
                                    backgroundColor: '#333333 !important',
                                    color: 'white !important',
                                    border: '1px solid #444444',
                                    '&:hover': { backgroundColor: '#444444 !important' },
                                    fontFamily: 'Cooper Black, serif !important',
                                    padding: '12px 30px'
                                }}>
                                Update Profile
                            </Button>
                        </Link>
                        <Button variant='contained' endIcon={<BsFillCartCheckFill />} type='submit'
                            sx={{
                                backgroundColor: '#FFD700 !important',
                                color: '#000000 !important',
                                border: '1px solid #FFD700',
                                '&:hover': { backgroundColor: '#e6b800 !important' },
                                fontFamily: 'Cooper Black, serif !important',
                                padding: '12px 30px'
                            }}>
                            Checkout
                        </Button>
                    </Container>
                </Box >

                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => handleClose(setOpenAlert)}
                    aria-describedby="alert-dialog-slide-description"
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
                        <Typography variant='h6' sx={{ textAlign: 'center', fontFamily: 'Cooper Black, serif !important', color: '#ffffff' }}>
                            Add permanent address then you don't have to add again.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly', paddingBottom: '20px' }}>
                        <Link to='/update' style={{ textDecoration: 'none' }}>
                            <Button variant='contained' endIcon={<AiOutlineSave />}
                                sx={{
                                    backgroundColor: '#333333 !important',
                                    color: 'white !important',
                                    border: '1px solid #444444',
                                    '&:hover': { backgroundColor: '#444444 !important' },
                                    fontFamily: 'Cooper Black, serif !important'
                                }}
                            >
                                Add
                            </Button>
                        </Link>
                        <Button variant='contained'
                            sx={{
                                backgroundColor: '#333333 !important',
                                color: 'white !important',
                                border: '1px solid #444444',
                                '&:hover': { backgroundColor: '#444444 !important' },
                                fontFamily: 'Cooper Black, serif !important'
                            }}
                            endIcon={<AiFillCloseCircle />} onClick={() => handleClose(setOpenAlert)}>Close</Button>
                    </DialogActions>
                </Dialog>

            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />

        </>
    )
}

export default CheckoutForm
