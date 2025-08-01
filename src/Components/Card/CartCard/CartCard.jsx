import React from 'react';
import { Card, CardContent, Typography, Box, Button, Rating } from '@mui/material';
import { AiFillDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CartCard = ({ product, removeFromCart }) => {

    const getImageUrl = () => {
        const p = product?.productId;
        if (!p) {
            return 'https://placehold.co/400x600/1e1e1e/ffffff?text=No+Product';
        }
        if (p.images && Array.isArray(p.images) && p.images.length > 0 && p.images[0]?.url) {
            return p.images[0].url;
        }
        return 'https://placehold.co/400x600/1e1e1e/ffffff?text=No+Image+From+API';
    };

    const imageUrl = getImageUrl();

    return (
        <Card
            sx={{
                width: 300,
                minHeight: 480,
                m: 2,
                bgcolor: '#1e1e1e',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                border: '1px solid #333',
                fontFamily: 'Cooper Black, serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                },
            }}
        >
            <Link to={`/product/${product?.productId?.mainCategory}/${product?.productId?._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box sx={{ width: '100%', height: 300, p: 2, boxSizing: 'border-box' }}>
                    <img alt={product?.productId?.name} loading='lazy' src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        sx={{
                            textAlign: "center",
                            color: 'white',
                            fontFamily: 'Cooper Black, serif',
                            fontSize: '1.1rem',
                            mb: 1
                        }}
                    >
                        {product?.productId?.name ? (product.productId.name.length > 25 ? product.productId.name.slice(0, 25) + '...' : product.productId.name) : 'No Name'}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ textAlign: "center", color: '#cccccc', fontFamily: 'Cooper Black, serif', mb: 1 }}
                    >
                        Qty: {product?.quantity}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{ color: '#FFD700', fontFamily: 'Cooper Black, serif', fontWeight: 'bold' }}
                        >
                            ₹{product?.productId?.price ? product.productId.price.toLocaleString() : '0'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Rating
                            name="read-only"
                            value={product?.productId?.rating || 0}
                            readOnly
                            precision={0.1}
                            sx={{ color: '#FFD700' }}
                        />
                        <Typography
                            variant="body2"
                            sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif', mt: 0.5 }}
                        >
                            ({product?.productId?.numOfReviews || 0} reviews)
                        </Typography>
                    </Box>
                </CardContent>
            </Link>

            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Button
                    variant='contained'
                    endIcon={<AiFillDelete />}
                    onClick={() => removeFromCart(product)}
                    sx={{
                        borderRadius: '8px',
                        bgcolor: '#8B0000',
                        color: 'white',
                        fontFamily: 'Cooper Black, serif',
                        '&:hover': {
                            bgcolor: '#B22222',
                        },
                    }}
                >
                    Remove
                </Button>
            </Box>
        </Card>
    );
};

CartCard.propTypes = {
    product: PropTypes.object.isRequired,
    removeFromCart: PropTypes.func.isRequired,
};

export default CartCard;
