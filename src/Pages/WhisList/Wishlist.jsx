import React, { useContext, useEffect, useState } from 'react';
import { ContextFunction } from '../../Context/Context';
import { Button, Typography, Dialog, DialogActions, DialogContent, Container, CssBaseline, Box, Grid, Card, CardActions } from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillCloseCircle, AiOutlineLogin, AiFillHeart } from 'react-icons/ai';
import { MdAddShoppingCart } from 'react-icons/md';
import ProductCard from '../../Components/Card/Product Card/ProductCard';
import { EmptyCart } from '../../Assets/Images/Image'; 
import { Transition } from '../../Constants/Constant'; 

const Wishlist = () => {
    const { wishlistData, setWishlistData, setCart } = useContext(ContextFunction);
    const [openAlert, setOpenAlert] = useState(false); 
    const navigate = useNavigate();
    const authToken = localStorage.getItem('Authorization');
    const isLoggedIn = !!authToken; 

    useEffect(() => {
        const fetchWishlist = async () => {
            if (isLoggedIn) {
                try {
                    const { data } = await axiosInstance.get(process.env.REACT_APP_GET_WISHLIST, {
                        headers: { 'Authorization': authToken }
                    });
                    
                    
                    if (data.success) {
                        setWishlistData(data.wishlistItems || []); 
                    } else {
                        toast.error(data.message || "Failed to load wishlist.", { theme: 'colored' });
                    }
                } catch (error) {
                    
                    toast.error(error.response?.data?.message || "Failed to load wishlist.", { theme: 'colored' });
                }
            } else {
                setOpenAlert(true); 
            }
        };
        fetchWishlist();
        window.scrollTo(0, 0); 
    }, [isLoggedIn, setWishlistData, authToken]); 

    
    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await axiosInstance.delete(`${process.env.REACT_APP_DELETE_WISHLIST}/${productId}`, {
                headers: { 'Authorization': authToken }
            });
            
            if (data.success) {
                setWishlistData(prev => prev.filter(item => item._id !== productId)); 
                toast.success(data.message || "Removed From Wishlist", { autoClose: 500, theme: 'colored' }); 
            } else {
                toast.error(data.message || "Failed to remove from wishlist", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            
            toast.error(error.response?.data?.message || "Something went wrong while removing from wishlist.", { autoClose: 500, theme: 'colored' });
        }
    };

    
    const addToCart = async (product) => {
        try {
            const { data } = await axiosInstance.post(process.env.REACT_APP_ADD_CART, { _id: product._id, quantity: 1 }, {
                headers: { 'Authorization': authToken }
            });
            
            
            if (data.success) {
                setCart(data.savedCart); 
                toast.success(data.message || "Added To Cart", { autoClose: 500, theme: 'colored' }); 
            } else {
                toast.error(data.message || "Failed to add to cart", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            
            toast.error(error.response?.data?.message || "Failed to add to cart.", { autoClose: 500, theme: 'colored' });
        }
    };

    
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

                {}
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

                {}
                {isLoggedIn && wishlistData.length > 0 && (
                    <Grid container spacing={2} justifyContent="center">
                        {wishlistData.map(item => (
                            item.productId ? ( 
                                <Grid item key={item._id}>
                                    <Card sx={{ bgcolor: 'transparent', boxShadow: 'none', border: 'none' }}>
                                        {}
                                        <ProductCard prod={item.productId} category={item.productId.mainCategory} />
                                        <CardActions sx={{ display: 'flex', justifyContent: 'space-around', p: 0, mt: -2 }}>
                                            {}
                                            <Button
                                                variant="contained"
                                                onClick={() => removeFromWishlist(item._id)}
                                                startIcon={<AiFillHeart />}
                                                sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' }, width: '48%', fontFamily: 'Cooper Black, serif', textTransform: 'none' }}
                                            >
                                                Remove
                                            </Button>
                                            {}
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
        </Box>
    );
};

export default Wishlist;
