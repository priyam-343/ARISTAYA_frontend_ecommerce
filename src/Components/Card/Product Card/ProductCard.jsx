import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '150%',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundColor: '#1e1e1e',
  borderBottom: '1px solid #333333',
});

const ProductCard = ({ prod, category }) => {

  const imageUrl = prod.images && prod.images.length > 0
    ? prod.images[0].url
    : 'https://placehold.co/400x600/1e1e1e/ffffff?text=No+Image';

  
  const reviewCountDisplay = prod.numOfReviews === 0 
    ? "No reviews" 
    : `${prod.numOfReviews} review${prod.numOfReviews !== 1 ? 's' : ''}`;

  return (
    <Card
      sx={{
        width: { xs: '90%', sm: 280, md: 300 },
        minHeight: { xs: 450, sm: 500, md: 550 },
        m: 2,
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        backgroundColor: '#1e1e1e',
        color: 'white',
        border: '1px solid #333',
        fontFamily: 'Cooper Black, serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
        },
      }}
      elevation={15}
    >
      <Link to={`/product/${category}/${prod?._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <StyledCardMedia
          image={imageUrl}
          title={prod.name}
          sx={{
            borderRadius: '12px 12px 0 0',
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: 2, color: 'white' }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            noWrap
            sx={{
              color: 'white',
              fontFamily: 'Cooper Black, serif',
              textAlign: 'center',
              fontSize: { xs: '1rem', md: '1.1rem' },
              mb: 1
            }}
          >
            {prod.name}
          </Typography>
          <Typography
            variant="body2"
            noWrap
            sx={{
              color: '#cccccc',
              fontFamily: 'Cooper Black, serif',
              textAlign: 'center',
              mb: 1
            }}
          >
            {prod.description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
            <Rating
              name="read-only"
              value={prod.rating || 0}
              readOnly
              precision={0.1}
              sx={{ color: '#FFD700' }}
            />
            <Typography
              variant="body2"
              sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif', mt: 0.5 }}
            >
              {prod.rating || 0} out of 5
            </Typography>
            {}
            <Typography
              variant="caption"
              sx={{ color: '#cccccc', fontFamily: 'Cooper Black, serif' }}
            >
              ({reviewCountDisplay})
            </Typography>
          </Box>
          
          <Typography
            variant="h5"
            sx={{
              mt: 1,
              fontWeight: 'bold',
              color: '#FFD700',
              fontFamily: 'Cooper Black, serif',
              textAlign: 'center',
              fontSize: { xs: '1.2rem', md: '1.3rem' }
            }}
          >
            ₹{prod.price?.toLocaleString()}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
};

ProductCard.propTypes = {
    prod: PropTypes.object.isRequired,
    category: PropTypes.string.isRequired,
};

export default ProductCard;