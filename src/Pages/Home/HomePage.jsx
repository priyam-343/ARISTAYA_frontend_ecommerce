import React, { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import CategoryCard from '../../Components/Category_Card/CategoryCard';
import BannerData from '../../Helpers/HomePageBanner';
import Carousel from '../../Components/Carousel/Carousel';
import SearchBar from '../../Components/SearchBar/SearchBar';

const HomePage = () => {
    useEffect(() => {
        
        window.scroll(0, 0);
    }, []);

    return (
        <>
            <Container maxWidth='xl' sx={{ display: 'flex', justifyContent: "center", p: 0, flexDirection: "column", mb: 10 }}>
                {}
                <Box sx={{ p: 1, width: '100%' }}>
                    <Carousel />
                </Box>
                {}
                <Container sx={{ mt: 10, display: "flex", justifyContent: 'center' }}>
                    <SearchBar />
                </Container>

                {}
                <Typography variant='h3' sx={{ textAlign: 'center', mt: 12, color: 'white', fontWeight: 'bold' }}>
                    Categories
                </Typography>

                {}
                <Container maxWidth='xl' sx={{ mt: 10, display: "flex", justifyContent: 'center', flexGrow: 1, flexWrap: 'wrap', gap: 3 }}>
                    {}
                    {BannerData.map(data => (
                        <CategoryCard data={data} key={data.img} />
                    ))}
                </Container>
            </Container >
        </>
    );
};

export default HomePage;
