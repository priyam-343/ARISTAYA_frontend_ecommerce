import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom'; // Ensure Link is imported

// Styled component for better image handling and vertical aspect ratio
const StyledCardMedia = styled(CardMedia)({
  // This creates a vertical rectangle aspect ratio for the image area (e.g., 2:3 height:width)
  paddingTop: '150%', // Height will be 150% of its width (which is 100% of CardMedia's width)
  backgroundSize: 'contain', // Ensures the entire image fits within the bounds
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundColor: '#1e1e1e', // Dark background for the image area itself
  borderBottom: '1px solid #333333', // Subtle border below image
});

const ProductCard = ({ prod }) => {
  // Ensure prod.images exists and has at least one image.
  // If not, use a placeholder image with dark theme colors.
  const imageUrl = prod.images && prod.images.length > 0 
    ? prod.images[0].url 
    : 'https://placehold.co/400x600/1e1e1e/ffffff?text=No+Image'; // Placeholder for vertical image

  return (
    <Card 
      sx={{ 
        // Overall Card dimensions for vertical rectangle shape
        width: { xs: '90%', sm: 280, md: 300 }, // Responsive width
        minHeight: { xs: 450, sm: 500, md: 550 }, // Increased minHeight for vertical rectangle
        margin: 2, 
        borderRadius: '12px !important', // Force consistent rounded corners
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4) !important', // Stronger, darker shadow
        backgroundColor: '#1e1e1e !important', // Force dark background for the card
        color: '#ffffff !important', // Force white text for general card content
        border: '1px solid #333333 !important', // Subtle border
        fontFamily: 'Cooper Black, serif !important', // Apply font to the entire card
        display: 'flex', // Ensure flex properties for internal layout
        flexDirection: 'column',
        justifyContent: 'space-between', // Distribute content vertically
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Smooth transitions
        '&:hover': {
          transform: 'translateY(-5px)', // Lift on hover
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6) !important', // Even stronger shadow on hover
        },
      }}
      elevation={15} // Keep elevation for depth
    >
      <Link to={`/Detail/type/${prod?.type}/${prod?._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <StyledCardMedia
          image={imageUrl}
          title={prod.name}
          sx={{ // Additional sx for StyledCardMedia if needed, but primary styling is in styled()
            borderRadius: '12px 12px 0 0 !important', // Rounded top corners for image
          }}
        />
        <CardContent sx={{ flexGrow: 1, padding: '15px !important' }}> {/* Allow content to grow */}
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            noWrap 
            sx={{ 
              color: '#ffffff !important', // Force white text for product name
              fontFamily: 'Cooper Black, serif !important', // Apply font
              textAlign: 'center', // Center product name
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
              color: '#cccccc !important', // Subtle grey for description
              fontFamily: 'Cooper Black, serif !important', // Apply font
              textAlign: 'center', // Center description
              mb: 1
            }}
          >
            {prod.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
            <Rating 
              name="read-only" 
              value={prod.rating || 0} // Ensure default value if undefined
              readOnly 
              precision={0.1} 
              sx={{ color: '#FFD700 !important' }} // Force Gold stars
            />
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 1, 
                color: '#cccccc !important', // Subtle grey for review count
                fontFamily: 'Cooper Black, serif !important', // Apply font
              }}
            >
              ({prod.numOfReviews || 0} reviews)
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              mt: 1, 
              fontWeight: 'bold', 
              color: '#FFD700 !important', // Force Gold for price
              fontFamily: 'Cooper Black, serif !important', // Apply font
              textAlign: 'center', // Center price
              fontSize: { xs: '1.2rem', md: '1.3rem' } // Responsive font size
            }}
          >
            ₹{prod.price?.toLocaleString()} {/* Use optional chaining for price */}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
