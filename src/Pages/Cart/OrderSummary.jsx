import React from 'react';
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { IoBagCheckOutline } from 'react-icons/io5';
import PropTypes from 'prop-types';

const OrderSummary = ({ proceedToCheckout, total, shippingCost }) => {
    return (
        <Card
            sx={{
                width: '100%',
                // THEME FIX: Constrains the width on larger screens for a better "boxed" look.
                maxWidth: { xs: '100%', md: 400 },
                bgcolor: '#1e1e1e',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                border: '1px solid #333',
                fontFamily: 'Cooper Black, serif',
            }}
            elevation={15}
        >
            <CardContent sx={{ p: 3 }}>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontFamily: 'Cooper Black, serif',
                        mb: 2,
                        textAlign: 'center'
                    }}
                >
                    Order Summary
                </Typography>
                <hr style={{ borderColor: '#444', margin: '16px 0' }} />
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Cooper Black, serif' }}>
                            SubTotal
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ color: '#FFD700', fontFamily: 'Cooper Black, serif', fontWeight: 'bold' }}>
                            ₹{(total - shippingCost).toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Cooper Black, serif' }}>
                            Shipping
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ color: '#FFD700', fontFamily: 'Cooper Black, serif', fontWeight: 'bold' }}>
                            ₹{shippingCost.toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontFamily: 'Cooper Black, serif', mt: 1 }}>
                            Total
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ color: '#FFD700', fontFamily: 'Cooper Black, serif', fontWeight: 'bold', mt: 1 }}>
                            ₹{total.toLocaleString()}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center', p: '0 24px 24px' }}>
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<IoBagCheckOutline />}
                    onClick={proceedToCheckout}
                    sx={{
                        fontFamily: 'Cooper Black, serif',
                        backgroundColor: '#FFD700',
                        color: '#000000',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        transition: 'all 0.2s ease-in-out',
                        padding: '12px 30px',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 15px rgba(255, 215, 0, 0.3)',
                            backgroundColor: '#e6c200',
                        },
                    }}
                >
                    Checkout
                </Button>
            </CardActions>
        </Card>
    );
};

OrderSummary.propTypes = {
    proceedToCheckout: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    shippingCost: PropTypes.number.isRequired,
};

export default OrderSummary;
