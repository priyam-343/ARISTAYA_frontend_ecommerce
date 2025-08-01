import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, CssBaseline, Divider } from '@mui/material';
import UserInfoItem from '../Components/UserData/UserInfoItem';
import UserCartItem from '../Components/UserData/UserCartItem';
import UserWishlistItem from '../Components/UserData/UserWishlistItem';
import UserReviewItem from '../Components/UserData/UserReviewItem';
import UserOrderItem from '../Components/UserData/UserOrderItem';

const SingleUserPage = () => {
    const { id } = useParams();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000000' }}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ flexGrow: 1, py: 5 }}>
                <UserInfoItem id={id} />
                <Divider sx={{ my: 4, borderColor: '#333' }} />
                <UserOrderItem id={id} />
                <Divider sx={{ my: 4, borderColor: '#333' }} />
                <UserCartItem id={id} />
                <Divider sx={{ my: 4, borderColor: '#333' }} />
                <UserWishlistItem id={id} />
                <Divider sx={{ my: 4, borderColor: '#333' }} />
                <UserReviewItem id={id} />
            </Container>
        </Box>
    );
};

export default SingleUserPage;