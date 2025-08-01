import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import CartCard from '../../../Components/Card/CartCard/CartCard';

const UserCartItem = ({ id }) => {
    const [userCart, setUserCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const authToken = localStorage.getItem("Authorization");

    useEffect(() => {
        const fetchUserCart = async () => {
            setIsLoading(true);
            try {
                const apiUrl = `${process.env.REACT_APP_ADMIN_GET_USER_CART}/${id}`;
                const { data } = await axios.get(apiUrl, {
                    headers: { 'Authorization': authToken }
                });
                // --- CRITICAL FIX: Access data.cartItems array ---
                setUserCart(Array.isArray(data.cartItems) ? data.cartItems : []);
            } catch (error) {
                console.error("Error fetching user cart:", error); // Added detailed logging
                toast.error(error.response?.data?.message || "Failed to load user cart.", { theme: 'colored' }); // Improved error message
                setUserCart([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (id && authToken) {
            fetchUserCart();
        } else {
            setIsLoading(false);
            if (!authToken) { // Added warning for missing token
                toast.warn("Authentication token missing. Please log in.", { theme: "colored" });
            }
        }
    }, [id, authToken]);

    const removeCartItemByAdmin = async (product) => {
        try {
            const deleteApiUrl = `${process.env.REACT_APP_ADMIN_DELETE_USER_CART_ITEM}/${product._id}`;
            const { data } = await axios.delete(deleteApiUrl, {
                headers: { 'Authorization': authToken }
            });

            if (data.success) {
                setUserCart(prevCart => prevCart.filter(c => c._id !== product._id));
                toast.success("Removed From Cart", { autoClose: 500, theme: 'colored' });
            } else {
                // FIX: Backend returns 'message', not 'msg' for success/error
                toast.error(data.message || "Something went wrong", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item.", { theme: "colored" }); // Use 'message'
        }
    };

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
            </Container>
        );
    }

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant='h6' fontWeight="bold" sx={{ mb: 3, textAlign: 'center', color: '#FFD700' }}>
                User Cart
            </Typography>
            {userCart.length < 1 ? (
                <Typography variant='body1' sx={{ textAlign: 'center', color: '#cccccc' }}>
                    No items in this user's cart.
                </Typography>
            ) : (
                <Grid container spacing={2} justifyContent="center">
                    {userCart.map(prod => (
                        // Ensure prod.productId exists (i.e., it was populated) before rendering CartCard
                        prod.productId ? (
                            <Grid item key={prod._id}>
                                <CartCard product={prod} removeFromCart={removeCartItemByAdmin} />
                            </Grid>
                        ) : (
                            // Fallback for unpopulated or missing product data
                            <Grid item key={`missing-cart-prod-${prod._id || Math.random()}`}>
                                <Box sx={{
                                    p: 2, bgcolor: '#2a2a2a', borderRadius: '15px', border: '1px solid #333',
                                    color: '#cccccc', fontFamily: 'Cooper Black, serif', textAlign: 'center',
                                    width: '250px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    Cart Product Data Missing
                                </Box>
                            </Grid>
                        )
                    ))}
                </Grid>
            )}
        </Box>
    );
};

UserCartItem.propTypes = {
    id: PropTypes.string.isRequired,
};

export default UserCartItem;