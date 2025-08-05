import React, { useContext, useEffect, useState, useRef } from 'react';
import { ContextFunction } from '../../Context/Context';
import { Button, Typography, Dialog, DialogActions, DialogContent, Container, CssBaseline, Box, Grid } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai';
import CartCard from '../../Components/Card/CartCard/CartCard';
import OrderSummary from './OrderSummary';
import { EmptyCart } from '../../Assets/Images/Image'; 
import { Transition } from '../../Constants/Constant'; 

const Cart = () => {
    const { cart, setCart } = useContext(ContextFunction);
    const [total, setTotal] = useState(0); 
    const [subtotal, setSubtotal] = useState(0); 
    const [openAlert, setOpenAlert] = useState(false); 
    const [isFreeShippingEligible, setIsFreeShippingEligible] = useState(false); 
    const hasShownToast = useRef(false);

    const navigate = useNavigate();
    const authToken = localStorage.getItem('Authorization');
    const isLoggedIn = !!authToken; 
    const shippingCharge = 100;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRes = await axiosInstance.get(process.env.REACT_APP_GET_USER_DETAILS, {
                    headers: { 'Authorization': authToken }
                });
                if (userRes.data.success) {
                    const isEligible = userRes.data.user.isFreeShippingEligible;
                    setIsFreeShippingEligible(isEligible);
                    // UPDATED: Now also checking if the cart has items before showing the toast
                    if (isEligible && !hasShownToast.current && cart.length > 0) {
                        toast.success("Congratulations! You have been granted a free shipping offer!", {
                            theme: 'colored',
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        hasShownToast.current = true;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };

        const fetchCartData = async () => {
            if (isLoggedIn) {
                try {
                    const cartRes = await axiosInstance.get(process.env.REACT_APP_GET_CART, { headers: { 'Authorization': authToken } });
                    
                    if (cartRes.data.success) {
                        setCart(cartRes.data.cart || []); 
                    } else {
                        toast.error(cartRes.data.message || "Failed to load cart data.", { theme: 'colored' });
                    }
                } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to load cart data.", { theme: 'colored' });
                }
            } else {
                setOpenAlert(true); 
            }
        };

        if (isLoggedIn) {
            fetchUserData();
            fetchCartData();
        } else {
            setOpenAlert(true);
        }

        window.scrollTo(0, 0); 
    }, [isLoggedIn, setCart, authToken, cart.length]); // UPDATED: Added cart.length to dependency array

    
    useEffect(() => {
        if (Array.isArray(cart)) {
            const calculatedSubtotal = cart.reduce((acc, curr) => {
                const price = curr.productId?.price || 0;
                const quantity = curr.quantity || 0;
                return acc + (price * quantity);
            }, 0);

            const calculatedShippingCost = isFreeShippingEligible ? 0 : shippingCharge;
            
            setSubtotal(calculatedSubtotal);
            setTotal(calculatedSubtotal + calculatedShippingCost);
        }
    }, [cart, isFreeShippingEligible]);

    
    const handleClose = () => {
        setOpenAlert(false);
        navigate('/');
    };

    
    const removeFromCart = async (product) => {
        try {
            const { data } = await axiosInstance.delete(`${process.env.REACT_APP_DELETE_FROM_CART}/${product._id}`, {
                headers: { 'Authorization': authToken }
            });
            
            if (data.success) {
                toast.success(data.message || "Removed From Cart", { autoClose: 500, theme: 'colored' }); 
                setCart(prevCart => prevCart.filter(c => c._id !== product._id)); 
            } else {
                toast.error(data.message || "Failed to remove from cart", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            
            toast.error(error.response?.data?.message || "Something went wrong while removing from cart.", { autoClose: 500, theme: 'colored' });
        }
    };

    
    const proceedToCheckout = () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty.", { autoClose: 500, theme: 'colored' });
        } else {
            navigate('/checkout'); 
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000000' }}>
            <CssBaseline />
            <Container maxWidth='xl' sx={{ flexGrow: 1, py: 5 }}>
                <Typography variant='h3' sx={{ textAlign: 'center', mt: 5, mb: 5, color: 'white', fontWeight: 'bold' }}>
                    Shopping Cart
                </Typography>

                {}
                {isLoggedIn && cart.length === 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: 4, bgcolor: 'transparent', borderRadius: '12px', border: '1px solid #333', maxWidth: '500px', mx: 'auto' }}>
                        <img src={EmptyCart} alt="Empty Cart" style={{ maxWidth: '250px', height: 'auto' }} />
                        <Typography variant='h6' sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold', my: 3 }}>
                            Your Cart is Empty
                        </Typography>
                        <Button component={Link} to="/" variant="contained" sx={{ bgcolor: '#FFD700', color: '#000', borderRadius: '8px', p: '12px 30px', '&:hover': { bgcolor: '#e6c200' } }}>
                            Continue Shopping
                        </Button>
                    </Box>
                )}

                {}
                {isLoggedIn && cart.length > 0 && (
                    <>
                        <Grid container spacing={2} justifyContent="center">
                            {cart.map(product => (
                                <Grid item key={product._id}>
                                    <CartCard product={product} removeFromCart={removeFromCart} />
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                            <OrderSummary
                                proceedToCheckout={proceedToCheckout}
                                subtotal={subtotal} 
                                total={total}
                                shippingCost={isFreeShippingEligible ? 0 : shippingCharge} 
                            />
                        </Box>
                    </>
                )}

                {}
                {!isLoggedIn && (
                    <Dialog open={openAlert} keepMounted onClose={handleClose} TransitionComponent={Transition} PaperProps={{ sx: { bgcolor: '#1e1e1e', color: 'white', borderRadius: '12px', border: '1px solid #333' } }}>
                        <DialogContent sx={{ width: { xs: 280, md: 350 }, p: 4 }}>
                            <Typography variant='h5' sx={{ fontFamily: 'Cooper Black, serif', textAlign: 'center' }}>Please Login To Proceed</Typography>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'space-evenly', pb: 3 }}>
                            <Button component={Link} to="/login" variant='contained' endIcon={<AiOutlineLogin />} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Login</Button>
                            <Button variant='contained' endIcon={<AiFillCloseCircle />} onClick={handleClose} sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Close</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Container>
        </Box>
    );
};

export default Cart;