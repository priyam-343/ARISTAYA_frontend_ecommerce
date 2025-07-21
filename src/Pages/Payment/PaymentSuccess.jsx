import { Link, useSearchParams } from 'react-router-dom'
import { AiOutlineFileDone } from 'react-icons/ai'
import { Box, Button, Typography, CircularProgress } from '@mui/material'
import { payment } from '../../Assets/Images/Image'
import './Payment.css'
import CopyRight from '../../Components/CopyRight/CopyRight'
import { useContext, useEffect, useState, useCallback } from 'react';
import { ContextFunction } from '../../Context/Context';
import html2pdf from 'html2pdf.js';
import axios from 'axios';

const PaymentSuccess = () => {
    const searchParams = useSearchParams()[0]
    const paymentId = searchParams.get('paymentId') 
    const { setCart } = useContext(ContextFunction);

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [pdfDownloaded, setPdfDownloaded] = useState(false); 

    
    const handleDownloadReceipt = useCallback(() => {
        if (pdfDownloaded) return; 

        const element = document.getElementById('receipt-content');
        if (element) {
            const opt = {
                margin:       1,
                filename:     `ARISTAYA_Receipt_${paymentId}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
            setPdfDownloaded(true); 
        } else {
            console.error("Receipt content element not found for PDF generation!");
            
        }
    }, [paymentId, pdfDownloaded]); 

    
    useEffect(() => {
        setCart([]); 
        localStorage.removeItem('cart'); 

        const fetchOrderDetails = async () => {
            if (!paymentId) { 
                setError("No payment ID found in URL. Cannot fetch order details.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true); 
                setError(null); 
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/payment/getpaymentdetails/${paymentId}`);
                setOrderData(response.data.paymentDetails); 
            } catch (err) {
                console.error("Failed to fetch order details:", err);
                setError("Failed to load order details. Please try refreshing.");
                setOrderData(null); 
            } finally {
                setLoading(false); 
            }
        };

        fetchOrderDetails(); 

    }, [setCart, paymentId]); 

    
    useEffect(() => {
        if (orderData && !loading && !error && !pdfDownloaded) {
            
            const timer = setTimeout(() => {
                handleDownloadReceipt();
            }, 500); 

            return () => clearTimeout(timer); 
        }
    }, [orderData, loading, error, pdfDownloaded, handleDownloadReceipt]); 

    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', color: '#ffffff' }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, fontFamily: 'Cooper Black, serif !important' }}>Loading order details...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', color: '#ffffff' }}>
                <Typography variant="h6" color="error" sx={{ fontFamily: 'Cooper Black, serif !important' }}>{error}</Typography>
                <Link to="/" style={{ textDecoration: 'none', marginTop: '20px' }}>
                    <Button variant="contained" sx={{ 
                        borderRadius: '8px', backgroundColor: '#333333 !important', color: 'white !important', 
                        border: '1px solid #444444', fontFamily: 'Cooper Black, serif !important', padding: '12px 30px'
                    }}>
                        Back To Home
                    </Button>
                </Link>
            </Box>
        );
    }

    
    return (
        <>
            <div className='main-payment-box'>
                <Typography 
                    variant='h4'
                    sx={{ 
                        marginTop: 5,
                        color: '#ffffff !important',
                        fontWeight: 'bold', 
                        fontFamily: 'Cooper Black, serif !important',
                        textAlign: 'center',
                        mb: 2
                    }}
                >
                    Payment Successful <AiOutlineFileDone style={{ color: '#FFD700', fontSize: '1.2em', verticalAlign: 'middle' }} />
                </Typography>
                
                {}
                <div id="receipt-content" style={{ 
                    width: '100%', 
                    maxWidth: '500px', 
                    padding: '20px', 
                    backgroundColor: '#1e1e1e',
                    borderRadius: '15px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                    border: '1px solid #333333',
                    color: '#ffffff',
                    fontFamily: 'Cooper Black, serif',
                    textAlign: 'left',
                    marginBottom: '20px'
                }}>
                    <Typography 
                        variant='body1' 
                        sx={{ 
                            color: '#cccccc !important',
                            fontFamily: 'Cooper Black, serif !important',
                            mb: 1
                        }}
                    >
                        <strong>Reference Number:</strong> {paymentId}
                    </Typography>
                    <Typography 
                        variant='body1' 
                        sx={{ 
                            color: '#ffffff !important',
                            fontFamily: 'Cooper Black, serif !important',
                            mb: 3
                        }}
                    >
                        Your payment has been successfully submitted.
                        <br />
                        We've sent you an email with all of the details of your order.
                    </Typography>

                    {}
                    {orderData && (
                        <Box sx={{ mt: 2, borderTop: '1px solid #444444', pt: 2 }}>
                            <Typography variant="h6" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', mb: 1 }}>
                                Order Details:
                            </Typography>
                            {orderData.productData && orderData.productData.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                        {item.productId?.name || 'N/A'} (Qty: {item.quantity})
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important' }}>
                                        ₹{(item.productId?.price * item.quantity)?.toLocaleString()}
                                    </Typography>
                                </Box>
                            ))}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, borderTop: '1px solid #444444', pt: 1 }}>
                                <Typography variant="body1" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                    Subtotal:
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', fontWeight: 'bold' }}>
                                    ₹{(orderData.totalAmount - orderData.shippingCoast)?.toLocaleString()}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="body1" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                    Shipping:
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', fontWeight: 'bold' }}>
                                    ₹{orderData.shippingCoast?.toLocaleString()}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="h6" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                    Total:
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', fontWeight: 'bold' }}>
                                    ₹{orderData.totalAmount?.toLocaleString()}
                                </Typography>
                            </Box>

                            {}
                            {orderData.userData && (
                                <Box sx={{ mt: 3, borderTop: '1px solid #444444', pt: 2 }}>
                                    <Typography variant="h6" sx={{ color: '#FFD700 !important', fontFamily: 'Cooper Black, serif !important', mb: 1 }}>
                                        Shipping Address:
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                        {orderData.userData.firstName} {orderData.userData.lastName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                        {orderData.userData.address}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                        {orderData.userData.city} - {orderData.userData.zipCode}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                        {orderData.userData.userState}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                        Phone: {orderData.userData.phoneNumber || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ffffff !important', fontFamily: 'Cooper Black, serif !important' }}>
                                        Email: {orderData.userData.userEmail || 'N/A'}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </div>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Link style={{ textDecoration: 'none' }} to='/'>
                        <Button 
                            variant='contained' 
                            sx={{ 
                                borderRadius: '8px',
                                backgroundColor: '#333333 !important',
                                color: 'white !important',
                                border: '1px solid #444444',
                                fontFamily: 'Cooper Black, serif !important',
                                padding: '12px 30px',
                                '&:hover': {
                                    backgroundColor: '#444444 !important',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
                                },
                            }} 
                        >
                            Back To Home
                        </Button>
                    </Link>
                    <Button 
                        variant='contained' 
                        onClick={handleDownloadReceipt}
                        sx={{ 
                            borderRadius: '8px',
                            backgroundColor: '#FFD700 !important',
                            color: '#000000 !important',
                            border: '1px solid #FFD700 !important',
                            fontFamily: 'Cooper Black, serif !important',
                            padding: '12px 30px',
                            '&:hover': {
                                backgroundColor: '#e6b800 !important',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
                            },
                        }} 
                    >
                        Download Receipt
                    </Button>
                </Box>
            </div >
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}

export default PaymentSuccess
