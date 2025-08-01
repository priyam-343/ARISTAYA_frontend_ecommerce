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
    const paymentId = searchParams.get('paymentId'); // Get paymentId from URL query parameters
    const { setCart } = useContext(ContextFunction); // Get setCart from context to clear cart

    const [orderData, setOrderData] = useState(null); // State to store fetched order details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state for display

    // Callback function to handle downloading the receipt as a PDF
    const handleDownloadReceipt = useCallback(() => {
        const element = document.getElementById('pdf-receipt-content');
        if (element) {
            const opt = {
                margin: 0.5,
                filename: `ARISTAYA_Receipt_${paymentId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true }, // useCORS is important if images are from different origins
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        } else {
            toast.error("Receipt content not found for PDF generation.", { theme: 'colored' });
        }
    }, [paymentId]); // Dependency on paymentId

    // Effect to fetch order details when component mounts or paymentId changes
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!paymentId) {
                setError("No payment ID found in URL.");
                setLoading(false);
                return;
            }
            try {
                // Fetch payment details from the backend using the paymentId
                const { data } = await axiosInstance.get(`/api/payment/getpaymentdetails/${paymentId}`);
                // CRITICAL FIX: Backend now returns { success: true, paymentDetails: {...} }
                if (data.success && data.paymentDetails) {
                    setOrderData(data.paymentDetails); // Set order data from the 'paymentDetails' field
                    setCart([]); // Clear cart after successful payment
                } else {
                    // Handle cases where success is false or paymentDetails is missing
                    setError(data.message || "Failed to load order details.");
                    toast.error(data.message || "Failed to load order details.", { theme: 'colored' });
                }
            } catch (err) {
                // Use err.response?.data?.message for standardized backend error messages
                setError(err.response?.data?.message || "Failed to load order details due to a network error.");
                toast.error(err.response?.data?.message || "Failed to load order details.", { theme: 'colored' });
                console.error("Error fetching payment details:", err);
            } finally {
                setLoading(false); // Always set loading to false
            }
        };
        fetchOrderDetails();
    }, [setCart, paymentId]); // Dependencies: setCart to clear cart, paymentId to refetch

    // Display loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
                <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>Loading Order Details...</Typography>
            </Box>
        );
    }

    // Display error state
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
                <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 2, bgcolor: '#333', '&:hover': { bgcolor: '#444' } }}>Back To Home</Button>
            </Box>
        );
    }

    // Prepare product items for display and PDF
    const productItems = orderData?.productData?.map((item, index) => (
        <tr key={index}>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.productId?.name} (x{item.quantity})</td>
            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>₹{(item.productId?.price * item.quantity)?.toLocaleString()}</td>
        </tr>
    )) || [];

    const subtotal = orderData?.totalAmount - (orderData?.shippingCoast || 0);

    return (
        <>
            <CssBaseline />
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
                <Typography variant='h4' sx={{ mt: 5, color: 'white', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                    Payment Successful <AiOutlineFileDone style={{ color: '#FFD700', verticalAlign: 'middle' }} />
                </Typography>

                {/* Main receipt content displayed on the page */}
                <Box id="receipt-content-display" sx={{ width: '100%', p: 3, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', color: 'white', textAlign: 'left', mb: 3 }}>
                    <Typography variant='h6' sx={{ color: '#FFD700', mb: 2, borderBottom: '1px solid #444', pb: 1 }}>Order Receipt</Typography>
                    <Typography variant='body1' sx={{ color: '#cccccc', mb: 1, wordBreak: 'break-all' }}><strong>Reference No:</strong> {paymentId}</Typography>
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, borderTop: '1px solid #444', pt: 1 }}>
                                <Typography variant="body1">Total:</Typography>
                                <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                    ₹{orderData.totalAmount?.toLocaleString()}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button component={Link} to='/' variant='contained' sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#444' }, p: '12px 30px' }}>Back To Home</Button>
                    <Button variant='contained' onClick={handleDownloadReceipt} sx={{ bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#e6c200' }, p: '12px 30px' }}>Download Receipt</Button>
                </Box>
            </Container>

            {/* Hidden content for PDF generation (html2pdf.js uses this to render the PDF) */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', fontSize: '12px' }}>
                <div id="pdf-receipt-content" style={{ padding: '40px', backgroundColor: 'white', color: 'black', fontFamily: 'Arial, sans-serif', width: '7.5in', boxSizing: 'border-box' }}>
                    <h1 style={{ color: 'black', borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>ARISTAYA Order Receipt</h1>
                    <p><strong>Reference No:</strong> {paymentId}</p>
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
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>₹{subtotal.toLocaleString()}</td>
                                    </tr>
                                    <tr style={{ fontWeight: 'bold' }}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Shipping:</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>₹{orderData.shippingCoast || 0}</td>
                                    </tr>
                                    <tr style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>Total:</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>₹{orderData.totalAmount.toLocaleString()}</td>
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
