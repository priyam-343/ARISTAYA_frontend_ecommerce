import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

const CategoryCard = ({ data }) => {
    return (
        <Card
            sx={{
                position: 'relative',
                width: { xs: 'calc(50% - 16px)', sm: 300, md: 350 },
                height: { xs: 200, sm: 380, md: 450 },
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
                border: '1px solid #1e1e1e',
                '&:hover .card-media': {
                    transform: 'scale(1.05)',
                },
                '&:hover .card-overlay-text': {
                    color: '#FFD700', 
                },
            }}
        >
            <Link to={`/product/${data.path}`} style={{ textDecoration: 'none' }}>
                <CardMedia
                    className="card-media"
                    image={data.img}
                    title={data.name}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                        p: 2,
                        boxSizing: 'border-box',
                    }}
                >
                    <Typography
                        className="card-overlay-text"
                        variant="h5"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontFamily: 'Cooper Black, serif',
                            transition: 'color 0.3s ease-in-out',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                        }}
                    >
                        {data.name}
                    </Typography>
                </Box>
            </Link>
        </Card>
    );
};

CategoryCard.propTypes = {
    data: PropTypes.shape({
        img: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
    }).isRequired,
};

export default CategoryCard;
