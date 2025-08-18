import React, { useEffect, useState, useContext } from 'react';
import { Container, Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Button } from '@mui/material';
import axiosInstance from '../utils/axiosInstance'; 
import { toast } from 'react-toastify';
import { MdKeyboardArrowDown, MdRestartAlt } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ContextFunction } from '../Context/Context';

const PLACEHOLDER_IMAGE = "https://placehold.co/80x80/1e1e1e/FFD700?text=No+Image";

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const UserOrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openOrderId, setOpenOrderId] = useState("");
    const { setCart } = useContext(ContextFunction);
    const authToken = localStorage.getItem("Authorization");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserOrders = async () => {
            setIsLoading(true);
            if (!authToken) {
                toast.warn("Please log in to view your orders.", { theme: "colored" });
                setIsLoading(false);
                return;
            }
            try {
                const apiUrl = process.env.REACT_APP_GET_PREVIOUS_ORDERS;
                const { data } = await axiosInstance.get(apiUrl, {
                    headers: { 'Authorization': authToken }
                });
                if (data.success) {
                    setOrders(data.orders || []);
                } else {
                    toast.error(data.message || "Failed to load your order history.", { theme: "colored" });
                    setOrders([]);
                }
            } catch (error) {
                console.error("Error fetching user order history:", error);
                toast.error(error.response?.data?.message || "Failed to load your order history.", { theme: "colored" });
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserOrders();
        window.scroll(0, 0);
    }, [authToken]);

    const handleReorder = async (orderId) => {
        if (!authToken) {
            toast.warn("Please log in to reorder.", { theme: "colored" });
            return;
        }

        try {
            const apiUrl = process.env.REACT_APP_REORDER_API || '/api/payment/reorder';
            const response = await axiosInstance.post(apiUrl, { orderId }, {
                headers: { 'Authorization': authToken }
            });

            if (response.data.success) {
                toast.success(response.data.message || "Ordered items have been added to your cart.", { theme: "colored" });
                navigate("/cart");
            } else {
                toast.error(response.data.message || "Failed to reorder.", { theme: "colored" });
            }
        } catch (error) {
            console.error("Reorder failed:", error);
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage, { theme: "colored" });
        }
    };

    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const linkSx = {
        textDecoration: 'none',
        color: 'white',
        fontFamily: 'Cooper Black, serif',
        '&:hover': {
            color: '#FFD700',
            textDecoration: 'underline'
        }
    };

    const tableCellSx = {
        bgcolor: '#1e1e1e',
        color: 'white',
        fontFamily: 'Cooper Black, serif',
        borderBottom: '1px solid #333'
    };

    const tableHeadCellSx = {
        ...tableCellSx,
        bgcolor: '#2a2a2a',
        fontWeight: 'bold',
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#32CD32';
            case 'pending':
                return '#FFD700';
            case 'failed':
                return '#FF4500';
            default:
                return '#cccccc';
        }
    };

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', mt: '80px' }}>
                <CircularProgress sx={{ color: '#FFD700' }} />
                <Typography variant="h6" sx={{ ml: 2, color: '#FFD700' }}>Loading your orders...</Typography>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xl" sx={{ mt: '90px', py: 5 }}>
            <Typography component="h1" variant="h4" sx={{ mb: 4, color: '#FFD700', fontFamily: 'Cooper Black, serif', textAlign: 'center' }}>
                Your Order History
            </Typography>

            <Paper elevation={6} sx={{ bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', overflow: "hidden", width: '100%' }}>
                <TableContainer sx={{ maxHeight: '600px' }}>
                    <Table stickyHeader aria-label="user orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={tableHeadCellSx} />
                                <TableCell sx={tableHeadCellSx}>Razorpay Order ID</TableCell>
                                <TableCell sx={tableHeadCellSx}>Total Amount</TableCell>
                                <TableCell sx={tableHeadCellSx}>Order Date</TableCell>
                                <TableCell sx={tableHeadCellSx}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} sx={tableCellSx}>
                                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif' }}>
                                                You have not placed any orders yet.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedOrders.map((order) => {
                                    const subtotal = order.productData.reduce((acc, curr) => 
                                        acc + ((curr.productId?.price || 0) * (curr.quantity || 0)), 0
                                    );
                                    const displayedShippingCost = (order.totalAmount || 0) - subtotal;
                                    
                                    return (
                                        <React.Fragment key={order._id}>
                                            <TableRow sx={{ '& > *': { borderBottom: 'unset !important' } }}>
                                                <TableCell sx={tableCellSx}>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        onClick={() => setOpenOrderId(openOrderId === order._id ? "" : order._id)}
                                                        sx={{ color: 'white' }}
                                                    >
                                                        <MdKeyboardArrowDown
                                                            style={{
                                                                transform: openOrderId === order._id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                transition: 'transform 0.3s'
                                                            }}
                                                        />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell sx={tableCellSx}>{order.razorpay_order_id || 'N/A'}</TableCell>
                                                <TableCell sx={tableCellSx}>₹{order.totalAmount?.toLocaleString() || '0'}</TableCell>
                                                <TableCell sx={tableCellSx}>{new Date(order.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}</TableCell>
                                                <TableCell sx={{ ...tableCellSx, color: getStatusColor(order.status) }}>
                                                    {capitalizeFirstLetter(order.status || 'pending')}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ padding: 0, borderBottom: 'none' }} colSpan={5}>
                                                    <Collapse in={openOrderId === order._id} timeout="auto" unmountOnExit>
                                                        <Box sx={{ m: 1, p: 2, bgcolor: '#2a2a2a', borderRadius: '8px', border: '1px solid #444' }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                                <Typography variant="h6" gutterBottom sx={{ color: '#FFD700', fontFamily: 'inherit', mb: 0 }}>Order Details</Typography>
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: '#FFD700',
                                                                        color: '#1e1e1e',
                                                                        fontFamily: 'Cooper Black, serif',
                                                                        '&:hover': { bgcolor: '#e6c200' },
                                                                        textTransform: 'uppercase'
                                                                    }}
                                                                    onClick={() => handleReorder(order._id)}
                                                                    startIcon={<MdRestartAlt />}
                                                                >
                                                                    REORDER
                                                                </Button>
                                                            </Box>
                                                            
                                                            <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'inherit', mb: 1 }}>
                                                                <strong>Razorpay Payment ID:</strong> {order.razorpay_payment_id || 'N/A'}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'inherit', mb: 1 }}>
                                                                <strong>Shipping Charge:</strong> ₹{displayedShippingCost.toLocaleString() || '0'}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'inherit', mb: 2 }}>
                                                                {`Shipping Address: ${order.userData?.address || 'N/A'}, ${order.userData?.city || 'N/A'}, ${order.userData?.userState || 'N/A'} - ${order.userData?.zipCode || 'N/A'}`}
                                                            </Typography>
                                                            <Table size="small" aria-label="purchases">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell sx={{ color: "white", fontWeight: 'bold', fontFamily: 'inherit', borderBottom: '1px solid #555' }}>Product</TableCell>
                                                                        <TableCell sx={{ color: "white", fontWeight: 'bold', fontFamily: 'inherit', borderBottom: '1px solid #555' }}>Image</TableCell>
                                                                        <TableCell sx={{ color: "white", fontWeight: 'bold', fontFamily: 'inherit', borderBottom: '1px solid #555' }}>Price</TableCell>
                                                                        <TableCell sx={{ color: "white", fontWeight: 'bold', fontFamily: 'inherit', borderBottom: '1px solid #555' }}>Quantity</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {order.productData.map((product, pIndex) => {
                                                                        const p = product.productId;
                                                                        const imageUrl = p?.images?.[0]?.url || PLACEHOLDER_IMAGE;
                                                                        return (
                                                                            <TableRow key={product._id || pIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                                <TableCell sx={{ color: 'white', fontFamily: 'inherit' }}>
                                                                                    <Link to={`/products/${p?._id}`} style={linkSx}>
                                                                                        {p?.name || 'Unknown Product'}
                                                                                    </Link>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <img
                                                                                        src={imageUrl}
                                                                                        alt={p?.name || 'Product Image'}
                                                                                        style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: '8px' }}
                                                                                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell sx={{ color: 'white', fontFamily: 'inherit' }}>₹{p?.price?.toLocaleString() || '0'}</TableCell>
                                                                                <TableCell sx={{ color: 'white', fontFamily: 'inherit' }}>{product.quantity || '0'}</TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

UserOrderHistoryPage.propTypes = {
    orders: PropTypes.array.isRequired,
};

export default UserOrderHistoryPage;