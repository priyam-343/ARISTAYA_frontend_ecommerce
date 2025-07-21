import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { IoBagCheckOutline } from 'react-icons/io5'

const OrderSummary = ({ proceedToCheckout, total, shippingCoast }) => {
    return (
        <Card
            sx={{
                width: { xs: '90%', sm: 550, md: 550, lg: 700 }, // Adjusted xs width to be responsive
                bgcolor: '#1e1e1e !important', // Force dark background
                color: '#ffffff !important', // Force white text for general card content
                borderRadius: '12px !important', // Force rounded corners
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4) !important', // Stronger, darker shadow
                border: '1px solid #333333 !important', // Subtle border
                fontFamily: 'Cooper Black, serif !important', // Ensure font family is applied to card
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6) !important', // Even stronger shadow on hover
                },
            }}
            elevation={15}
        >
            <CardContent>
                <Typography 
                    variant="h5" 
                    component="h1" 
                    sx={{ 
                        color: '#ffffff !important', // Force white text
                        fontFamily: 'Cooper Black, serif !important', // Apply font
                        mb: 1,
                        textAlign: 'center' // Center the heading
                    }}
                >
                    Order Summary
                </Typography>
                <hr style={{ borderColor: '#444444', margin: '20px 0' }} /> {/* Adjusted margin for hr */}
                <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Typography variant="body1" component="div" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}> {/* Force white text, apply font */}
                            SubTotal
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', fontWeight: 'bold' }}> {/* Force gold, apply font, bold */}
                            ₹{(total - shippingCoast).toLocaleString()} {/* Format number */}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Typography variant="body1" component="div" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}> {/* Force white text, apply font */}
                            Shipping
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', fontWeight: 'bold' }}> {/* Force gold, apply font, bold */}
                            ₹{shippingCoast.toLocaleString()} {/* Format number */}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Typography variant="body1" component="div" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}> {/* Force white text, apply font */}
                            Total
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', fontWeight: 'bold' }}> {/* Force gold, apply font, bold */}
                            ₹{total.toLocaleString()} {/* Format number */}
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
                        fontFamily: 'Cooper Black, serif !important', // Apply font
                        backgroundColor: '#FFD700 !important', // Gold button background
                        color: '#000000 !important', // Black text on gold
                        border: '1px solid #FFD700 !important', // Gold border
                        borderRadius: '8px !important', // Force rounded corners
                        textTransform: 'capitalize !important', // Consistent capitalization
                        transition: 'all 0.3s ease-in-out',
                        padding: '12px 30px', // Consistent padding
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
                            backgroundColor: '#e6b800 !important', // Darker gold on hover
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
