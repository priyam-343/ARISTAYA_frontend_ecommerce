import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import BannerData from '../../Helpers/HomePageBanner';
import PropTypes from 'prop-types';

const Carousel = () => {
    // This responsive setting restores the three-item layout on larger screens.
    const responsive = {
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 3, itemsFit: 'contain' },
    };

    const items = BannerData.map((item) => (
        <Link to={`/product/${item.path}`} key={item.path} style={{ textDecoration: 'none' }}>
            <Box
                className="carousel-item"
                sx={{
                    position: 'relative',
                    // THEME FIX: Adjusted height to create a more vertical, less square shape.
                    height: { xs: 350, sm: 450, md: 500 },
                    m: 1,
                    overflow: 'hidden',
                    borderRadius: '12px',
                    border: '1px solid #1e1e1e',
                    '&:hover .carousel-image': {
                        transform: 'scale(1.05)',
                    },
                    '&:hover .carousel-overlay-text': {
                        color: '#FFD700',
                    },
                }}
            >
                <Box
                    className="carousel-image"
                    sx={{
                        height: '100%',
                        width: '100%',
                        backgroundImage: `url(${item.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: item.position || 'center',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                />
                <Box
                    className="carousel-overlay"
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                        p: 2,
                    }}
                >
                    <Typography
                        className="carousel-overlay-text"
                        variant="h5"
                        sx={{
                            color: 'white',
                            fontFamily: 'Cooper Black, serif',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                            textAlign: 'center',
                            transition: 'color 0.3s ease-in-out',
                        }}
                    >
                        {item.name}
                    </Typography>
                </Box>
            </Box>
        </Link>
    ));

    return (
        <AliceCarousel
            animationType="fadeout"
            animationDuration={800}
            disableButtonsControls
            infinite
            items={items}
            touchTracking
            mouseTracking
            disableDotsControls
            autoPlay
            autoPlayInterval={2500}
            responsive={responsive}
        />
    );
};

Carousel.propTypes = {
    // No props are passed to this component.
};

export default Carousel;
