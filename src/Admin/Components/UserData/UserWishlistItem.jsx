import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Card, CardActions, Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import ProductCard from '../../../Components/Card/Product Card/ProductCard';
import { AiFillDelete } from 'react-icons/ai';

const UserWishlistItem = ({ id }) => {
    const [userWishlist, setUserWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const authToken = localStorage.getItem("Authorization");

    useEffect(() => {
        const fetchUserWishlist = async () => {
            setIsLoading(true);
            try {
                const apiUrl = `${process.env.REACT_APP_ADMIN_GET_USER_WISHLIST}/${id}`;
                const { data } = await axios.get(apiUrl, {
                    headers: { 'Authorization': authToken }
                });
                // --- CRITICAL FIX: Access data.wishlistItems array ---
                setUserWishlist(Array.isArray(data.wishlistItems) ? data.wishlistItems : []);
            } catch (error) {
                console.error("Error fetching user wishlist:", error); // Added detailed logging
                toast.error(error.response?.data?.message || "Failed to load user wishlist.", { theme: 'colored' }); // Improved error message
                setUserWishlist([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (id && authToken) {
            fetchUserWishlist();
        } else {
            setIsLoading(false);
            if (!authToken) { // Added warning for missing token
                toast.warn("Authentication token missing. Please log in.", { theme: "colored" });
            }
        }
    }, [id, authToken]);

    const removeWishlistItemByAdmin = async (wishlistItemId) => {
        try {
            const deleteApiUrl = `${process.env.REACT_APP_ADMIN_DELETE_USER_WISHLIST_ITEM}/${wishlistItemId}`;
            const { data } = await axios.delete(deleteApiUrl, {
                headers: { 'Authorization': authToken }
            });

            if (data.success) {
                setUserWishlist(prev => prev.filter(w => w._id !== wishlistItemId));
                toast.success("Removed From Wishlist", { autoClose: 500, theme: 'colored' });
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
                User Wishlist
            </Typography>
            {userWishlist.length < 1 ? (
                <Typography variant='body1' sx={{ textAlign: 'center', color: '#cccccc' }}>
                    No items in this user's wishlist.
                </Typography>
            ) : (
                <Grid container spacing={2} justifyContent="center">
                    {userWishlist.map(item => (
                        // Ensure item.productId exists (i.e., it was populated) before rendering ProductCard
                        item.productId ? (
                            <Grid item key={item._id}>
                                <Card sx={{ bgcolor: 'transparent', boxShadow: 'none', border: 'none', position: 'relative' }}>
                                    <ProductCard prod={item.productId} category={item.productId.mainCategory} />
                                    <CardActions sx={{ display: 'flex', justifyContent: 'center', p: 0, mt: -2 }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => removeWishlistItemByAdmin(item._id)}
                                            startIcon={<AiFillDelete />}
                                            sx={{ bgcolor: '#8B0000', '&:hover': { bgcolor: '#B22222' }, fontFamily: 'Cooper Black, serif', textTransform: 'none' }}
                                        >
                                            Remove
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ) : (
                            // Fallback for unpopulated or missing product data
                            <Grid item key={`missing-wishlist-prod-${item._id || Math.random()}`}>
                                <Box sx={{
                                    p: 2, bgcolor: '#2a2a2a', borderRadius: '15px', border: '1px solid #333',
                                    color: '#cccccc', fontFamily: 'Cooper Black, serif', textAlign: 'center',
                                    width: '250px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    Wishlist Product Data Missing
                                </Box>
                            </Grid>
                        )
                    ))}
                </Grid>
            )}
        </Box>
    );
};

UserWishlistItem.propTypes = {
    id: PropTypes.string.isRequired,
};

export default UserWishlistItem;