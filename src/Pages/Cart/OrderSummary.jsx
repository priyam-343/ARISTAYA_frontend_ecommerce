import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { IoBagCheckOutline } from 'react-icons/io5'

const OrderSummary = ({ proceedToCheckout, total, shippingCoast }) => {
    return (
        <Card
            sx={{
                width: { xs: '90%', sm: 550, md: 550, lg: 700 }, 
                bgcolor: '#1e1e1e !important', 
                color: '#ffffff !important', 
                borderRadius: '12px !important', 
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4) !important', 
                border: '1px solid #333333 !important', 
                fontFamily: 'Cooper Black, serif !important', 
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6) !important', 
                },
            }}
            elevation={15}
        >
            <CardContent>
                <Typography 
                    variant="h5" 
                    component="h1" 
                    sx={{ 
                        color: '#ffffff !important', 
                        fontFamily: 'Cooper Black, serif !important', 
                        mb: 1,
                        textAlign: 'center' 
                    }}
                >
                    Order Summary
                </Typography>
                <hr style={{ borderColor: '#444444', margin: '20px 0' }} /> {}
                <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Typography variant="body1" component="div" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}> {}
                            SubTotal
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', fontWeight: 'bold' }}> {}
                            ₹{(total - shippingCoast).toLocaleString()} {}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Typography variant="body1" component="div" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}> {}
                            Shipping
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', fontWeight: 'bold' }}> {}
                            ₹{shippingCoast.toLocaleString()} {}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Typography variant="body1" component="div" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}> {}
                            Total
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', fontWeight: 'bold' }}> {}
                            ₹{total.toLocaleString()} {}
                        </Typography>
                    </Box>
                </Grid>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Button
                    variant="contained"
                    size="large"
                    endIcon={<IoBagCheckOutline />}
                    onClick={proceedToCheckout}
                    sx={{
                        fontFamily: 'Cooper Black, serif !important', 
                        backgroundColor: '#FFD700 !important', 
                        color: '#000000 !important', 
                        border: '1px solid #FFD700 !important', 
                        borderRadius: '8px !important', 
                        textTransform: 'capitalize !important', 
                        transition: 'all 0.3s ease-in-out',
                        padding: '12px 30px', 
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
                            backgroundColor: '#e6b800 !important', 
                        },
                    }}
                >
                    Checkout
                </Button>
            </CardActions>
        </Card>
    )
}

export default OrderSummary
