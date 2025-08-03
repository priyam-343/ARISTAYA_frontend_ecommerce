import React from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { AiOutlineMail, AiOutlineLink } from 'react-icons/ai';

const CopyRight = () => { 
    const linkStyles = {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: 'white',
        textDecoration: 'none',
        fontFamily: 'Cooper Black, serif',
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
            color: '#FFD700',
        }
    };

    return (
        <Box
            component="footer"
            sx={{
                py: 4,
                px: 2,
                mt: 'auto',
                backgroundColor: '#000000',
                borderTop: '1px solid #1e1e1e',
                boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.6)',
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Typography variant="body1" sx={{ color: 'white', fontFamily: 'Cooper Black, serif' }}>
                        © {new Date().getFullYear()} ARISTAYA. Developed By Priyam Kumar.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4 } }}>
                        <MuiLink href="mailto:test.authenticator.mailer@gmail.com" sx={linkStyles}>
                            <AiOutlineMail size={20} />
                            Contact Us
                        </MuiLink>
                        <MuiLink href="https://aristaya.vercel.app/" target="_blank" rel="noopener noreferrer" sx={linkStyles}>
                            <AiOutlineLink size={20} />
                            ARISTAYA Website
                        </MuiLink>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CopyRight;
