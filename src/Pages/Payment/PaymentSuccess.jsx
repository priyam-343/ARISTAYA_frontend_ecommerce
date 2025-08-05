import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Container, CssBaseline } from '@mui/material';
import { AiOutlineFileDone } from 'react-icons/ai';
import { ContextFunction } from '../../Context/Context';
import html2pdf from 'html2pdf.js';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('paymentId');
    const { setCart } = useContext(ContextFunction);

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleDownloadReceipt = useCallback(() => {
        const element = document.getElementById('pdf-receipt-content');
        if (element) {
            const opt = {
                margin: 0.5,
                filename: `ARISTAYA_Receipt_${paymentId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        } else {
            toast.error("Receipt content not found for PDF generation.", { theme: 'colored' });
        }
    }, [paymentId]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!paymentId) {
                setError("No payment ID found in URL.");
                setLoading(false);
                return;
            }
            try {
                const { data } = await axiosInstance.get(`/api/payment/getpaymentdetails/${paymentId}`);
                
                if (data.success && data.paymentDetails) {
                    setOrderData(data.paymentDetails);
                    setCart([]);
                } else {
                    setError(data.message || "Failed to load order details.");
                    toast.error(data.message || "Failed to load order details.", { theme: 'colored' });
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load order details due to a network error.");
                toast.error(err.response?.data?.message || "Failed to load order details.", { theme: 'colored' });
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [setCart, paymentId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>Loading Order Details...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
                <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 2, bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Back To Home</Button>
            </Box>
        );
    }

    const calculatedSubtotal = orderData?.productData?.reduce((acc, curr) => acc + (curr.productId?.price * curr.quantity), 0) || 0;
    const shippingCost = orderData?.shippingCoast || 0;
    // UPDATED: Simply display "₹0" if shipping is free, otherwise format the cost
    const shippingDisplay = `₹${shippingCost.toLocaleString()}`;

    const productItems = orderData?.productData?.map((item, index) => (
        <tr key={index}>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.productId?.name} (x{item.quantity})</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>₹{(item.productId?.price * item.quantity)?.toLocaleString()}</td>
        </tr>
    )) || [];
    
    return (
        <>
            <CssBaseline />
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
                <Typography variant='h4' sx={{ mt: 5, color: 'white', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                    Payment Successful <AiOutlineFileDone style={{ color: '#FFD700', verticalAlign: 'middle' }} />
                </Typography>

                <Box id="receipt-content-display" sx={{ width: '100%', p: 3, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', color: 'white', textAlign: 'left', mb: 3 }}>
                    <Typography variant='h6' sx={{ color: '#FFD700', mb: 2, borderBottom: '1px solid #444', pb: 1 }}>Order Receipt</Typography>
                    
                    <Typography variant='body1' sx={{ color: '#cccccc', mb: 1, wordBreak: 'break-all' }}>
                        <strong>Razorpay Order ID:</strong> {orderData?.razorpay_order_id}
                    </Typography>
                    <Typography variant='body1' sx={{ color: '#cccccc', mb: 1, wordBreak: 'break-all' }}>
                        <strong>Razorpay Payment ID:</strong> {orderData?.razorpay_payment_id}
                    </Typography>
                    
                    <Typography variant='body1' sx={{ color: 'white', mb: 2 }}>Thank you for your purchase! An email with your order details has been sent.</Typography>
                    
                    {orderData && (
                        <>
                            <Box sx={{ mt: 2, borderTop: '1px solid #444', pt: 2 }}>
                                {orderData.productData?.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2">{item.productId?.name} (x{item.quantity})</Typography>
                                        <Typography variant="body2">₹{(item.productId?.price * item.quantity)?.toLocaleString()}</Typography>
                                    </Box>
                                ))}
                            </Box>
                            
                            <Box sx={{ borderTop: '1px solid #444', pt: 1, mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Subtotal:</Typography>
                                    <Typography variant="body1">₹{calculatedSubtotal.toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">Shipping:</Typography>
                                    {/* UPDATED: Displaying "₹0" directly for free shipping */}
                                    <Typography variant="body1" sx={{ color: shippingCost === 0 ? '#00FF00' : 'white' }}>
                                        {shippingDisplay}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, borderTop: '1px solid #444', pt: 1 }}>
                                <Typography variant="body1">Total:</Typography>
                                <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                    ₹{orderData.totalAmount?.toLocaleString()}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button component={Link} to='/' variant='contained' sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' }, p: '12px 30px' }}>Back To Home</Button>
                    <Button variant='contained' onClick={handleDownloadReceipt} sx={{ bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#e6c200' }, p: '12px 30px' }}>Download Receipt</Button>
                </Box>
            </Container>

            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', fontSize: '12px' }}>
                <div id="pdf-receipt-content" style={{ padding: '40px', backgroundColor: 'white', color: 'black', fontFamily: 'Arial, sans-serif', width: '7.5in', boxSizing: 'border-box' }}>
                    <h1 style={{ color: 'black', borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>ARISTAYA Order Receipt</h1>
                    <p><strong>Razorpay Order ID:</strong> {orderData?.razorpay_order_id}</p>
                    <p><strong>Razorpay Payment ID:</strong> {orderData?.razorpay_payment_id}</p>
                    <p>Thank you for your purchase! An email with your order details has been sent.</p>
                    <hr style={{ margin: '20px 0' }}/>
                    {orderData && (
                        <>
                            <h3>Order Details:</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>Item</th>
                                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productItems}
                                    <tr style={{ fontWeight: 'bold' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Subtotal:</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>₹{calculatedSubtotal.toLocaleString()}</td>
                                    </tr>
                                    <tr style={{ fontWeight: 'bold' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Shipping:</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>
                                            {/* UPDATED: Displaying "₹0" directly for free shipping in PDF */}
                                            {shippingDisplay}
                                        </td>
                                    </tr>
                                    <tr style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>Total:</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>₹{orderData?.totalAmount?.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {orderData.userData && (
                                <div style={{ marginTop: '30px', borderTop: '2px solid black', paddingTop: '10px' }}>
                                    <h3>Shipping To:</h3>
                                    <p>{orderData.userData.firstName} {orderData.userData.lastName}<br />
                                       {orderData.userData.address}<br />
                                       {orderData.userData.city} - {orderData.userData.zipCode}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;