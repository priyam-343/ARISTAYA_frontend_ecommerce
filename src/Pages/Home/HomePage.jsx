import React, { useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import CategoryCard from '../../Components/Category_Card/CategoryCard';
import BannerData from '../../Helpers/HomePageBanner';
import Carousel from '../../Components/Carousel/Carousel';
import SearchBar from '../../Components/SearchBar/SearchBar';

const HomePage = () => {
    useEffect(() => {
        // Ensures the user always starts at the top of the page when navigating here.
        window.scroll(0, 0);
    }, []);

    return (
        <>
            <Container maxWidth='xl' sx={{ display: 'flex', justifyContent: "center", p: 0, flexDirection: "column", mb: 10 }}>
                {/* Carousel component for displaying rotating banners */}
                <Box sx={{ p: 1, width: '100%' }}>
                    <Carousel />
                </Box>
                {/* SearchBar component for product search functionality */}
                <Container sx={{ mt: 10, display: "flex", justifyContent: 'center' }}>
                    <SearchBar />
                </Container>

                {/* Section title for categories */}
                <Typography variant='h3' sx={{ textAlign: 'center', mt: 12, color: 'white', fontWeight: 'bold' }}>
                    Categories
                </Typography>

                {/* Container for displaying category cards */}
                <Container maxWidth='xl' sx={{ mt: 10, display: "flex", justifyContent: 'center', flexGrow: 1, flexWrap: 'wrap', gap: 3 }}>
                    {/* Maps through BannerData to render CategoryCard for each category */}
                    {BannerData.map(data => (
                        <CategoryCard data={data} key={data.img} />
                    ))}
                </Container>
            </Container >
        </>
    );
};

export default HomePage;
