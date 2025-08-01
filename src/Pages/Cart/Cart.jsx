import React, { useContext, useEffect, useState } from 'react';
import { ContextFunction } from '../../Context/Context';
import { Button, Typography, Dialog, DialogActions, DialogContent, Container, CssBaseline, Box, Grid } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai';
import CartCard from '../../Components/Card/CartCard/CartCard';
import OrderSummary from './OrderSummary';
import { EmptyCart } from '../../Assets/Images/Image'; // Assuming this path is correct
import { Transition } from '../../Constants/Constant'; // Assuming this constant exists

const Cart = () => {
    const { cart, setCart } = useContext(ContextFunction);
    const [total, setTotal] = useState(0); // State for the total amount in the cart
    const [openAlert, setOpenAlert] = useState(false); // State for login alert dialog
    const shippingCost = 100; // Fixed shipping cost

    const navigate = useNavigate();
    const authToken = localStorage.getItem('Authorization');
    const isLoggedIn = !!authToken; // Check if user is logged in

    useEffect(() => {
        const fetchCartData = async () => {
            if (isLoggedIn) {
                try {
                    const cartRes = await axiosInstance.get(process.env.REACT_APP_GET_CART, { headers: { 'Authorization': authToken } });
                    // CRITICAL FIX: Access the 'cart' array from the response data
                    // Backend now returns { success: true, cart: [...] }
                    if (cartRes.data.success) {
                        setCart(cartRes.data.cart || []); // Set cart items from the 'cart' field
                    } else {
                        toast.error(cartRes.data.message || "Failed to load cart data.", { theme: 'colored' });
                    }
                } catch (error) {
                    // Use backend's standardized 'message' field for error toasts
                    toast.error(error.response?.data?.message || "Failed to load cart data.", { theme: 'colored' });
                }
            } else {
                setOpenAlert(true); // Prompt login if not logged in
            }
        };

        fetchCartData();
        window.scrollTo(0, 0); // Scroll to top on component mount/update
    }, [isLoggedIn, setCart, authToken]); // Re-fetch cart data if login status or auth token changes

    // Effect to calculate total amount whenever cart items or shipping cost changes
    useEffect(() => {
        if (Array.isArray(cart)) {
            const subtotal = cart.reduce((acc, curr) => {
                const price = curr.productId?.price || 0;
                const quantity = curr.quantity || 0;
                return acc + (price * quantity);
            }, 0);
            setTotal(subtotal + shippingCost);
        }
    }, [cart, shippingCost]);

    // Handles closing the login alert dialog and navigates to home
    const handleClose = () => {
        setOpenAlert(false);
        navigate('/');
    };

    // Function to remove an item from the cart
    const removeFromCart = async (product) => {
        try {
            const { data } = await axiosInstance.delete(`${process.env.REACT_APP_DELETE_FROM_CART}/${product._id}`, {
                headers: { 'Authorization': authToken }
            });
            // Backend now returns { success: true, message: "..." }
            if (data.success) {
                toast.success(data.message || "Removed From Cart", { autoClose: 500, theme: 'colored' }); // Use data.message
                setCart(prevCart => prevCart.filter(c => c._id !== product._id)); // Update local cart state
            } else {
                toast.error(data.message || "Failed to remove from cart", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Something went wrong while removing from cart.", { autoClose: 500, theme: 'colored' });
        }
    };

    // Handles proceeding to checkout
    const proceedToCheckout = () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty.", { autoClose: 500, theme: 'colored' });
        } else {
            sessionStorage.setItem('totalAmount', total); // Store total amount in session storage
            navigate('/checkout'); // Navigate to checkout page
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000000' }}>
            <CssBaseline />
            <Container maxWidth='xl' sx={{ flexGrow: 1, py: 5 }}>
                <Typography variant='h3' sx={{ textAlign: 'center', mt: 5, mb: 5, color: 'white', fontWeight: 'bold' }}>
                    Shopping Cart
                </Typography>

                {/* Display for empty cart when logged in */}
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

                {/* Display cart items and order summary when logged in and cart is not empty */}
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
                            <OrderSummary proceedToCheckout={proceedToCheckout} total={total} shippingCost={shippingCost} />
                        </Box>
                    </>
                )}

                {/* Login Alert Dialog when not logged in */}
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
