import React, { useContext, useEffect, useState } from 'react';
import { ContextFunction } from '../../Context/Context';
import { Button, Typography, Dialog, DialogActions, DialogContent, Container, CssBaseline, Box, Grid, Card, CardActions } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillCloseCircle, AiOutlineLogin, AiFillHeart } from 'react-icons/ai';
import { MdAddShoppingCart } from 'react-icons/md';
import ProductCard from '../../Components/Card/Product Card/ProductCard';
import { EmptyCart } from '../../Assets/Images/Image'; // Assuming this path is correct
import { Transition } from '../../Constants/Constant'; // Assuming this constant exists

const Wishlist = () => {
    const { wishlistData, setWishlistData, setCart } = useContext(ContextFunction);
    const [openAlert, setOpenAlert] = useState(false); // State for login alert dialog
    const navigate = useNavigate();
    const authToken = localStorage.getItem('Authorization');
    const isLoggedIn = !!authToken; // Check if user is logged in

    useEffect(() => {
        const fetchWishlist = async () => {
            if (isLoggedIn) {
                try {
                    const { data } = await axiosInstance.get(process.env.REACT_APP_GET_WISHLIST, {
                        headers: { 'Authorization': authToken }
                    });
                    // CRITICAL FIX: Access the 'wishlistItems' array from the response data
                    // Backend now returns { success: true, wishlistItems: [...] }
                    if (data.success) {
                        setWishlistData(data.wishlistItems || []); // Set wishlist items from the 'wishlistItems' field
                    } else {
                        toast.error(data.message || "Failed to load wishlist.", { theme: 'colored' });
                    }
                } catch (error) {
                    // Use backend's standardized 'message' field for error toasts
                    toast.error(error.response?.data?.message || "Failed to load wishlist.", { theme: 'colored' });
                }
            } else {
                setOpenAlert(true); // Prompt login if not logged in
            }
        };
        fetchWishlist();
        window.scrollTo(0, 0); // Scroll to top on component mount/update
    }, [isLoggedIn, setWishlistData, authToken]); // Re-fetch wishlist data if login status or auth token changes

    // Function to remove an item from the wishlist
    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await axiosInstance.delete(`${process.env.REACT_APP_DELETE_WISHLIST}/${productId}`, {
                headers: { 'Authorization': authToken }
            });
            // Backend now returns { success: true, message: "..." }
            if (data.success) {
                setWishlistData(prev => prev.filter(item => item._id !== productId)); // Update local wishlist state
                toast.success(data.message || "Removed From Wishlist", { autoClose: 500, theme: 'colored' }); // Use data.message
            } else {
                toast.error(data.message || "Failed to remove from wishlist", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Something went wrong while removing from wishlist.", { autoClose: 500, theme: 'colored' });
        }
    };

    // Function to add a product from wishlist to cart
    const addToCart = async (product) => {
        try {
            const { data } = await axiosInstance.post(process.env.REACT_APP_ADD_CART, { _id: product._id, quantity: 1 }, {
                headers: { 'Authorization': authToken }
            });
            // CRITICAL FIX: Access the 'savedCart' object from the response data
            // Backend now returns { success: true, savedCart: {...} }
            if (data.success) {
                setCart(data.savedCart); // Update global cart state
                toast.success(data.message || "Added To Cart", { autoClose: 500, theme: 'colored' }); // Use data.message
            } else {
                toast.error(data.message || "Failed to add to cart", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            // Use backend's standardized 'message' field for error toasts
            toast.error(error.response?.data?.message || "Failed to add to cart.", { autoClose: 500, theme: 'colored' });
        }
    };

    // Handles closing the login alert dialog and navigates to home
    const handleClose = () => {
        setOpenAlert(false);
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000000' }}>
            <CssBaseline />
            <Container maxWidth='xl' sx={{ flexGrow: 1, py: 5 }}>
                <Typography variant='h3' sx={{ textAlign: 'center', mt: 5, mb: 5, color: 'white', fontWeight: 'bold' }}>
                    My Wishlist
                </Typography>

                {/* Display for empty wishlist when logged in */}
                {isLoggedIn && wishlistData.length === 0 && (
                    <Box sx={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
                        p: 4,
                        bgcolor: 'transparent',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        maxWidth: '500px',
                        mx: 'auto'
                    }}>
                        <img src={EmptyCart} alt="Empty Wishlist" style={{ maxWidth: '250px', height: 'auto' }} />
                        <Typography variant='h6' sx={{ textAlign: 'center', color: 'white', fontWeight: 'bold', my: 3 }}>
                            Your Wishlist is Empty
                        </Typography>
                        <Button component={Link} to="/" variant="contained" sx={{
                            bgcolor: '#FFD700', color: '#000', borderRadius: '8px', p: '12px 30px',
                            '&:hover': { bgcolor: '#e6c200' }
                        }}>
                            Discover Products
                        </Button>
                    </Box>
                )}

                {/* Display wishlist items when logged in and wishlist is not empty */}
                {isLoggedIn && wishlistData.length > 0 && (
                    <Grid container spacing={2} justifyContent="center">
                        {wishlistData.map(item => (
                            item.productId ? ( // Ensure productId exists before rendering
                                <Grid item key={item._id}>
                                    <Card sx={{ bgcolor: 'transparent', boxShadow: 'none', border: 'none' }}>
                                        {/* ProductCard component to display product details */}
                                        <ProductCard prod={item.productId} category={item.productId.mainCategory} />
                                        <CardActions sx={{ display: 'flex', justifyContent: 'space-around', p: 0, mt: -2 }}>
                                            {/* Remove from Wishlist Button */}
                                            <Button
                                                variant="contained"
                                                onClick={() => removeFromWishlist(item._id)}
                                                startIcon={<AiFillHeart />}
                                                sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' }, width: '48%', fontFamily: 'Cooper Black, serif', textTransform: 'none' }}
                                            >
                                                Remove
                                            </Button>
                                            {/* Add to Cart Button */}
                                            <Button
                                                variant="contained"
                                                onClick={() => addToCart(item.productId)}
                                                startIcon={<MdAddShoppingCart />}
                                                sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' }, width: '48%', fontFamily: 'Cooper Black, serif', textTransform: 'none' }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ) : null
                        ))}
                    </Grid>
                )}
            </Container>

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
        </Box>
    );
};

export default Wishlist;
