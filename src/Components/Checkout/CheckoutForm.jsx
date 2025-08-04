import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, Grid, TextField, Typography, Box, CssBaseline } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { MdUpdate } from 'react-icons/md';
import { AiFillCloseCircle, AiOutlineSave } from 'react-icons/ai';
import { profile } from '../../Assets/Images/Image';
import { ContextFunction } from '../../Context/Context';
import { Transition } from '../../Constants/Constant';
import PropTypes from 'prop-types';

const CheckoutForm = () => {

    const { cart, loginUser } = useContext(ContextFunction);
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const authToken = localStorage.getItem('Authorization');
    const totalAmount = sessionStorage.getItem('totalAmount');

    const [userDetails, setUserDetails] = useState({
        firstName: '', lastName: '', phoneNumber: '', userEmail: '',
        address: '', zipCode: '', city: '', userState: '',
    });

    // Effect to fetch user data on component mount or auth token change
    useEffect(() => {
        const getUserData = async () => {
            if (!authToken) {
                toast.error("Please login to proceed.", { theme: 'colored' });
                navigate('/login');
                setLoading(false);
                return;
            }
            try {
                const { data } = await axiosInstance.get(process.env.REACT_APP_GET_USER_DETAILS, {
                    headers: { 'Authorization': authToken }
                });

                const userDataFromApi = data.user || {};
                setUserDetails({
                    firstName: userDataFromApi.firstName || '', lastName: userDataFromApi.lastName || '',
                    phoneNumber: userDataFromApi.phoneNumber || '', userEmail: userDataFromApi.email || '',
                    address: userDataFromApi.address || '', zipCode: userDataFromApi.zipCode || '',
                    city: userDataFromApi.city || '', userState: userDataFromApi.userState || '',
                });
                if (!userDataFromApi.address || !userDataFromApi.city || !userDataFromApi.zipCode || !userDataFromApi.userState) {
                    setOpenAlert(true);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Could not fetch user details.", { theme: 'colored' });
            } finally {
                setLoading(false);
            }
        };
        getUserData();
        window.scroll(0, 0);
    }, [authToken, navigate]);

    // This is the checkout function that handles payment initiation
    const checkOutHandler = async (e) => {
        e.preventDefault();

        // --- Frontend Validation Checks ---
        const requiredFields = ['firstName', 'lastName', 'userEmail', 'phoneNumber', 'address', 'zipCode', 'city', 'userState'];
        if (requiredFields.some(field => !userDetails[field])) {
            return toast.error("Please fill all address fields.", { theme: "colored" });
        }

        if (!cart || cart.length === 0) {
            return toast.error("Your cart is empty.", { theme: "colored" });
        }
        if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
            return toast.error("Invalid total amount. Please ensure your cart has items.", { theme: "colored" });
        }

        try {
            const userId = loginUser?._id;
            if (!userId) {
                toast.error("User ID not found. Please log in again.", { theme: 'colored' });
                navigate('/login');
                return;
            }

            // Fetch Razorpay key and create the order on the backend
            const { data: { key } } = await axiosInstance.get(process.env.REACT_APP_GET_KEY);
            const { data: checkoutData } = await axiosInstance.post(process.env.REACT_APP_GET_CHECKOUT, {
                amount: Number(totalAmount),
                userId: userId,
                productDetails: JSON.stringify(cart),
                userDetails: JSON.stringify(userDetails),
            });

            // --- Updated Razorpay Options ---
            const options = {
                key,
                amount: checkoutData.order.amount,
                currency: "INR",
                name: "ARISTAYA",
                description: "Payment for your ARISTAYA Order",
                image: profile,
                order_id: checkoutData.order.id,

                // REMOVED the unreliable callback_url. 
                // The backend webhook will now handle all status updates.

                prefill: {
                    name: `${userDetails.firstName} ${userDetails.lastName}`,
                    email: userDetails.userEmail,
                    contact: userDetails.phoneNumber
                },
                theme: { "color": "#FFD700" },

                // NEW: Use the handler function for successful payments
                handler: function(response) {
                    console.log("Payment successful from handler:", response);
                    navigate(`/paymentsuccess?paymentId=${response.razorpay_payment_id}`);
                }
            };
            
            const razor = new window.Razorpay(options);

            // NEW: Add a listener for payment failures for better user experience
            // This is triggered if the payment fails while the modal is open.
            // The backend webhook will handle the database update regardless.
            razor.on('payment.failed', function(response){
                console.error("Payment failed from front-end event:", response.error);
                toast.error(`Payment failed: ${response.error.description || 'Please try again.'}`, { theme: 'colored' });
                
                const orderId = response.error?.metadata?.order_id || checkoutData.order.id;
                const reason = response.error?.description || "Payment was cancelled or failed.";
                
                // Redirect to a failure page with relevant info
                navigate(`/paymentfailure?orderId=${orderId}&reason=${encodeURIComponent(reason)}`);
            });

            razor.open();
        } catch (error) {
            toast.error(error.response?.data?.message || "Checkout failed. Please try again.", { theme: 'colored' });
            console.error("Checkout error:", error);
        }
    };

    const handleOnChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

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
        '& .Mui-disabled': {
            WebkitTextFillColor: '#cccccc !important',
            color: '#cccccc !important',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333 !important' }
        },
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography variant='h4' sx={{ color: 'white' }}>Loading Checkout...</Typography>
            </Box>
        );
    }

    return (
        <>
            <CssBaseline />
            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 10, mt: 10 }}>
                <Typography variant='h4' sx={{ mb: 4, color: 'white', fontWeight: 'bold' }}>Checkout</Typography>
                <Box component="form" onSubmit={checkOutHandler} sx={{ bgcolor: '#1e1e1e', p: 4, borderRadius: '15px', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)', border: '1px solid #333', width: '100%', maxWidth: '800px' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}><TextField disabled label="First Name" name='firstName' value={userDetails.firstName} variant="outlined" fullWidth sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField disabled label="Last Name" name='lastName' value={userDetails.lastName} variant="outlined" fullWidth sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField disabled label="Contact Number" name='phoneNumber' value={userDetails.phoneNumber} variant="outlined" fullWidth sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField disabled label="Email" name='userEmail' value={userDetails.userEmail} variant="outlined" fullWidth sx={textFieldSx} /></Grid>
                        <Grid item xs={12}><TextField label="Address" name='address' value={userDetails.address} onChange={handleOnChange} variant="outlined" fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="City" name='city' value={userDetails.city} onChange={handleOnChange} variant="outlined" fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12} sm={6}><TextField label="Postal/Zip Code" name='zipCode' value={userDetails.zipCode} onChange={handleOnChange} variant="outlined" fullWidth required sx={textFieldSx} /></Grid>
                        <Grid item xs={12}><TextField label="Province/State" name='userState' value={userDetails.userState} onChange={handleOnChange} variant="outlined" fullWidth required sx={textFieldSx} /></Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
                        <Button component={Link} to='/update' variant='contained' endIcon={<MdUpdate />} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' }, p: '12px 30px' }}>Update Profile</Button>
                        <Button variant='contained' endIcon={<BsFillCartCheckFill />} type='submit' sx={{ bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#e6c200' }, p: '12px 30px' }}>Proceed to Pay</Button>
                    </Box>
                </Box>

                <Dialog open={openAlert} TransitionComponent={Transition} keepMounted onClose={() => setOpenAlert(false)} PaperProps={{ sx: { bgcolor: '#1e1e1e', color: 'white', borderRadius: '12px', border: '1px solid #333' } }}>
                    <DialogContent sx={{ width: { xs: 280, md: 350 }, p: 4 }}>
                        <Typography variant='h6' sx={{ textAlign: 'center', fontFamily: 'Cooper Black, serif' }}>
                            Please add your address to continue.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'space-evenly', pb: 3 }}>
                        <Button component={Link} to='/update' variant='contained' endIcon={<AiOutlineSave />} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Add Address</Button>
                        <Button variant='contained' endIcon={<AiFillCloseCircle />} onClick={() => setOpenAlert(false)} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

CheckoutForm.propTypes = {

};

export default CheckoutForm;