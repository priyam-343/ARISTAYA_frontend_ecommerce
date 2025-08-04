import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Box, Button, Typography, Container, CssBaseline } from '@mui/material';
import { MdErrorOutline } from 'react-icons/md'; // Icon for error/failure
import { toast } from 'react-toastify'; 

const PaymentFailure = () => {
    // Hook to access URL query parameters
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId'); 
    const status = searchParams.get('status');   
    const reason = searchParams.get('reason');   

    useEffect(() => {
        window.scrollTo(0, 0);
        if (reason) {
            toast.error(`Payment Failed: ${decodeURIComponent(reason)}`, { theme: 'colored', autoClose: 8000 });
        } else {
            toast.error("Payment Failed. Please try again.", { theme: 'colored', autoClose: 5000 });
        }
    }, [reason]); 

    return (
        <>
            {/* CssBaseline for consistent styling across browsers */}
            <CssBaseline />
            <Container 
                maxWidth="sm" 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    py: 5, 
                    minHeight: '80vh', 
                    justifyContent: 'center' 
                }}
            >
                <Box 
                    sx={{ 
                        bgcolor: '#1e1e1e', 
                        p: 4, 
                        borderRadius: '15px', 
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)', 
                        border: '1px solid #333', 
                        width: '100%', 
                        maxWidth: '500px', 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    {/* Error Icon */}
                    <MdErrorOutline style={{ fontSize: '80px', color: '#ff4d4d', marginBottom: '20px' }} />
                    
                    {/* Main Failure Message */}
                    <Typography variant='h4' sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                        Payment Failed!
                    </Typography>
                    
                    {/* Display Order Reference if available */}
                    {orderId && (
                        <Typography variant='body1' sx={{ color: '#cccccc', mb: 1, wordBreak: 'break-all' }}>
                            <strong>Order Reference:</strong> {orderId}
                        </Typography>
                    )}
                    
                    {/* Display Specific Reason if available */}
                    {reason && (
                        <Typography variant='body1' sx={{ color: '#ff8080', mb: 2 }}>
                            Reason: {decodeURIComponent(reason)} {/* Decode URL-encoded reason */}
                        </Typography>
                    )}
                    
                    {/* General explanatory message */}
                    <Typography variant='body1' sx={{ color: 'white', mb: 3 }}> {/* FIXED: Changed '#white' to 'white' */}
                        Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 3 }}>
                        {/* Button to go back to home page */}
                        <Button 
                            component={Link} 
                            to='/' 
                            variant='contained' 
                            sx={{ 
                                bgcolor: '#333', 
                                '&:hover': { bgcolor: '#444' }, 
                                p: '12px 30px',
                                borderRadius: '8px' // Apply rounded corners
                            }}
                        >
                            Back To Home
                        </Button>
                        
                        {/* Button to try payment again (redirects to checkout) */}
                        <Button 
                            component={Link} 
                            to='/checkout' 
                            variant='contained' 
                            sx={{ 
                                bgcolor: '#FFD700', 
                                color: '#000', 
                                '&:hover': { bgcolor: '#e6c200' }, 
                                p: '12px 30px',
                                borderRadius: '8px' 
                            }}
                        >
                            Try Again
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default PaymentFailure;