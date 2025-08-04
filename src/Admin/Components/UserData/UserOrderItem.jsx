import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import ProductCard from '../../../Components/Card/Product Card/ProductCard'; 

const UserOrderItem = ({ id }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const authToken = localStorage.getItem("Authorization");

    useEffect(() => {
        let isMounted = true; 

        const fetchUserOrders = async () => {
            setIsLoading(true); 
            try {
                const apiUrl = `${process.env.REACT_APP_ADMIN_GET_USER_ORDER}/${id}`;
                
                const { data } = await axios.get(apiUrl, {
                    headers: { 'Authorization': authToken }
                });

                
                if (isMounted) {
                    const allPayments = Array.isArray(data.payments) ? data.payments : [];
                    // FIX: Filter to show only completed orders
                    const completedOrders = allPayments.filter(order => order.status === 'completed');
                    setOrders(completedOrders); 
                }
            } catch (error) {
                console.error("Error fetching user orders:", error);
                toast.error(error.response?.data?.message || "Failed to fetch user orders. Please try again.", { theme: "colored" });
                if (isMounted) {
                    setOrders([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (id && authToken) {
            fetchUserOrders();
        } else {
            setIsLoading(false);
            if (!authToken) {
                toast.warn("Authentication token missing. Please log in.", { theme: "colored" });
            }
        }

        return () => {
            isMounted = false;
        };
    }, [id, authToken]);

    const totalSpent = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
                <Typography variant="h6" sx={{ ml: 2, color: '#FFD700' }}>Loading orders...</Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant='h6' fontWeight="bold" sx={{ mb: 3, textAlign: 'center', color: '#FFD700' }}>
                User Orders
            </Typography>
            {orders.length === 0 ? (
                <Typography variant='body1' sx={{ textAlign: 'center', color: '#cccccc' }}>
                    This user has not placed any orders yet.
                </Typography>
            ) : (
                <>
                    <Typography variant='h6' textAlign='center' sx={{ color: 'white', mb: 3 }}>
                        Total Amount Spent: <span style={{ color: "#FFD700" }}>₹{totalSpent.toLocaleString()}</span>
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {orders.flatMap(order =>
                            order.productData.map((prod, index) => (
                                prod.productId && prod.productId.mainCategory ? (
                                    <Grid item key={prod._id || prod.productId._id || `order-prod-${index}`}>
                                        <ProductCard 
                                            prod={prod.productId} 
                                            category={prod.productId.mainCategory} 
                                        />
                                    </Grid>
                                ) : (
                                    <Grid item key={prod._id || prod.productId?._id || `order-prod-missing-${index}`}>
                                        <Box sx={{
                                            p: 2, bgcolor: '#2a2a2a', borderRadius: '15px', border: '1px solid #333',
                                            color: '#cccccc', fontFamily: 'Cooper Black, serif', textAlign: 'center',
                                            width: '250px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            Order Product Data Missing (ID or Category)
                                        </Box>
                                    </Grid>
                                )
                            ))
                        )}
                    </Grid>
                </>
            )}
        </Box>
    );
};

UserOrderItem.propTypes = {
    id: PropTypes.string.isRequired,
};

export default UserOrderItem;