import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CountUp from 'react-countup';
import PropTypes from 'prop-types';

const Widget = ({ numbers, heading, color, icon }) => {
    
    const prefix = heading === 'Revenue' ? '₹' : '';

    return (
        <Box
            sx={{
                backgroundColor: color,
                borderRadius: '12px',
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: '0px 8px 13px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                },
            }}
        >
            <Box>
                {}
                <Typography variant="h6" sx={{
                    color: "#1a1a1a",
                    mb: 1,
                    fontWeight: 'bold',
                    fontFamily: 'Cooper Black, serif'
                }}>
                    {heading}
                </Typography>
                {}
                <Typography variant="h4" sx={{
                    color: "#1a1a1a",
                    fontFamily: 'Cooper Black, serif'
                }}>
                    <CountUp start={0} prefix={prefix} end={numbers} duration={4} separator="," />
                </Typography>
            </Box>
            <Box>
                {}
                <IconButton sx={{
                    fontSize: 45,
                    color: "#1a1a1a",
                    p: 1.5
                }}>
                    {icon}
                </IconButton>
            </Box>
        </Box>
    );
};

Widget.propTypes = {
    numbers: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    heading: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
};

export default Widget;