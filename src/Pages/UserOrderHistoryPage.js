import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton } from '@mui/material';
import axiosInstance from '../utils/axiosInstance'; // Use axiosInstance for authenticated requests
import { toast } from 'react-toastify';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Link } from 'react-router-dom';

const PLACEHOLDER_IMAGE = "https://placehold.co/80x80/1e1e1e/FFD700?text=No+Image";

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const UserOrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openOrderId, setOpenOrderId] = useState("");
    const authToken = localStorage.getItem("Authorization");

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
                                <TableCell sx={tableHeadCellSx}>Order ID</TableCell>
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
                                sortedOrders.map((order) => (
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
                                            <TableCell sx={tableCellSx}>{order._id}</TableCell>
                                            <TableCell sx={tableCellSx}>₹{order.totalAmount.toLocaleString()}</TableCell>
                                            <TableCell sx={tableCellSx}>{new Date(order.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}</TableCell>
                                            {/* CRITICAL FIX: Capitalize the status here */}
                                            <TableCell sx={tableCellSx}>{capitalizeFirstLetter(order.status || 'pending')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ padding: 0, borderBottom: 'none' }} colSpan={5}>
                                                <Collapse in={openOrderId === order._id} timeout="auto" unmountOnExit>
                                                    <Box sx={{ m: 1, p: 2, bgcolor: '#2a2a2a', borderRadius: '8px', border: '1px solid #444' }}>
                                                        <Typography variant="h6" gutterBottom sx={{ color: '#FFD700', fontFamily: 'inherit', mb: 2 }}>Order Details</Typography>
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default UserOrderHistoryPage;
