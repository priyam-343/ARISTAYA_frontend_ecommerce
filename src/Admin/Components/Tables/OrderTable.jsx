import React, { useState } from 'react'; 
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Collapse,
    Typography,
    Box
} from '@mui/material';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const OrderTable = ({ orders }) => {
    
    const [openOrderId, setOpenOrderId] = useState("");

    // Filter orders to show only 'completed' ones
    const completedOrders = orders.filter(order => order.status === 'completed');

    // Sort the completed orders by creation date in descending order (newest first)
    const sortedOrders = [...completedOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Placeholder image for products that might not have an image URL
    const PLACEHOLDER_IMAGE = "https://placehold.co/100x100";

    
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

    
    if (!Array.isArray(orders) || orders.length === 0) {
        return (
            <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '200px', bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', p: 3,
                mt: 4 
            }}>
                <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, fontFamily: 'Cooper Black, serif' }}>
                    No Orders Found
                </Typography>
                <Typography variant="body1" sx={{ color: '#cccccc' }}>
                    There are no orders to display in the dashboard.
                </Typography>
            </Box>
        );
    }

    
    return (
        <Paper
            elevation={6}
            sx={{
                bgcolor: '#1e1e1e',
                borderRadius: '15px',
                border: '1px solid #333',
                overflow: "hidden", 
                width: '100%',
                maxWidth: '1200px', 
                mx: 'auto', 
                mt: 4 
            }}
        >
            <TableContainer sx={{ maxHeight: '600px' }}> {}
                <Table stickyHeader aria-label="orders table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableHeadCellSx} /> {}
                            <TableCell sx={tableHeadCellSx}>User Name</TableCell>
                            <TableCell sx={tableHeadCellSx}>Email</TableCell>
                            <TableCell sx={tableHeadCellSx}>Phone Number</TableCell>
                            <TableCell sx={tableHeadCellSx}>Total Amount</TableCell>
                            <TableCell sx={tableHeadCellSx}>Order Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedOrders.map((order) => {
                            // NEW: Dynamically calculate subtotal and shipping for consistency
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
                                        <TableCell component="th" scope="row" sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${order.user}`} style={linkSx}>
                                                {`${order.userData?.firstName || 'Deleted'} ${order.userData?.lastName || 'User'}`}
                                            </Link>
                                        </TableCell>
                                        <TableCell sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${order.user}`} style={linkSx}>{order.userData?.userEmail || 'N/A'}</Link>
                                        </TableCell>
                                        <TableCell sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${order.user}`} style={linkSx}>{order.userData?.phoneNumber || 'N/A'}</Link>
                                        </TableCell>
                                        <TableCell sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${order.user}`} style={linkSx}>₹{order.totalAmount?.toLocaleString() || '0'}</Link>
                                        </TableCell>
                                        <TableCell sx={tableCellSx}>
                                            <Link to={`/admin/home/user/${order.user}`} style={linkSx}>
                                                {new Date(order.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}
                                            </Link>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell style={{ padding: 0, borderBottom: 'none' }} colSpan={6}>
                                            <Collapse in={openOrderId === order._id} timeout="auto" unmountOnExit>
                                                <Box sx={{ m: 1, p: 2, bgcolor: '#2a2a2a', borderRadius: '8px', border: '1px solid #444' }}>
                                                    <Typography variant="h6" gutterBottom sx={{ color: '#FFD700', fontFamily: 'inherit', mb: 2 }}>
                                                        Order Details
                                                    </Typography>
                                                    
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                                        <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'inherit', mb: 1 }}>
                                                            <strong>Razorpay Order ID:</strong> {order.razorpay_order_id || 'N/A'}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'inherit', mb: 1 }}>
                                                            <strong>Status:</strong> <span style={{ color: '#32CD32' }}>{order.status?.toUpperCase() || 'N/A'}</span>
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'inherit', mb: 1 }}>
                                                        <strong>Razorpay Payment ID:</strong> {order.razorpay_payment_id || 'N/A'}
                                                    </Typography>

                                                    {/* UPDATED: Display dynamic shipping charge */}
                                                    <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'inherit', mb: 2 }}>
                                                        <strong>Shipping Charge:</strong> ₹{displayedShippingCost.toLocaleString() || '0'}
                                                    </Typography>
                                                    
                                                    <Typography variant="body2" sx={{ color: '#cccccc', fontFamily: 'inherit', mb: 2 }}>
                                                        {`Address: ${order.userData?.address || 'N/A'}, ${order.userData?.city || ''}, ${order.userData?.userState || ''} - ${order.userData?.zipCode || ''}`}
                                                    </Typography>

                                                    
                                                    {!Array.isArray(order.productData) || order.productData.length === 0 ? (
                                                        <Typography variant="body2" sx={{ color: '#cccccc', mt: 2, fontStyle: 'italic' }}>
                                                            No product details available for this order.
                                                        </Typography>
                                                    ) : (
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
                                                                {order.productData.map(product => {
                                                                    
                                                                    const p = product.productId; 
                                                                    const imageUrl = p?.images?.[0]?.url || PLACEHOLDER_IMAGE;
                                                                    return (
                                                                        <TableRow key={product._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                            <TableCell sx={{ color: 'white', fontFamily: 'inherit' }}>
                                                                                <Link to={`/admin/home/product/${p?.mainCategory || 'unknown'}/${p?._id || ''}`} style={linkSx}>
                                                                                    {p?.name || 'Unknown Product'}
                                                                                </Link>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Link to={`/admin/home/product/${p?.mainCategory || 'unknown'}/${p?._id || ''}`}>
                                                                                    <img
                                                                                        src={imageUrl}
                                                                                        alt={p?.name || 'Product Image'}
                                                                                        style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: '8px' }}
                                                                                        
                                                                                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                                                                                    />
                                                                                </Link>
                                                                            </TableCell>
                                                                            <TableCell sx={{ color: 'white', fontFamily: 'inherit' }}>₹{p?.price?.toLocaleString() || '0'}</TableCell>
                                                                            <TableCell sx={{ color: 'white', fontFamily: 'inherit' }}>{product.quantity || '0'}</TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    )}
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};


OrderTable.propTypes = {
    orders: PropTypes.array.isRequired,
};

export default OrderTable;