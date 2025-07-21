import React, { useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance'; 
import { Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { ContextFunction } from '../../Context/Context';
import CategoryCard from '../../Components/Category_Card/CategoryCard';
import BannerData from '../../Helpers/HomePageBanner'; 
import Carousel from '../../Components/Carousel/Carousel';
import SearchBar from '../../Components/SearchBar/SearchBar';
import CopyRight from '../../Components/CopyRight/CopyRight';

const HomePage = () => {
    const { setCart } = useContext(ContextFunction);
    let authToken = localStorage.getItem('Authorization');

    useEffect(() => {
        getCart();
        window.scroll(0, 0);
    }, [authToken]); 

    const getCart = async () => {
        if (authToken !== null) {
            try {
                
                const { data } = await axiosInstance.get(`${process.env.REACT_APP_GET_CART}`, {
                    headers: {
                        'Authorization': authToken
                    }
                });
                setCart(data);
            } catch (error) {
                console.error("Error fetching cart in HomePage:", error);
                
            }
        }
    };

    return (
        <>
            <Container maxWidth='xl' style={{ display: 'flex', justifyContent: "center", padding: 0, flexDirection: "column", marginBottom: 70 }}>
                <Box padding={1}>
                    <Carousel />
                </Box>
                <Container style={{ marginTop: 90, display: "flex", justifyContent: 'center' }}>
                    <SearchBar />
                </Container>
                <Typography variant='h3' sx={{ textAlign: 'center', marginTop: 10, color: '#1976d2', fontWeight: 'bold' }}>Categories</Typography>
                <Container maxWidth='xl' style={{ marginTop: 90, display: "flex", justifyContent: 'center', flexGrow: 1, flexWrap: 'wrap', gap: 20 }}>
                    {
                        
                        BannerData.map(data => (
                            <CategoryCard data={data} key={data.img} />
                        ))
                    }
                </Container>
            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    );
};

export default HomePage;
