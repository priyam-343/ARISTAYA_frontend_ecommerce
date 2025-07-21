import './singlecategory.css'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance';
import { Container } from '@mui/system'
import { Box, Button, MenuItem, FormControl, Select, Typography } from '@mui/material'
import Loading from '../Components/loading/Loading'
import { BiFilterAlt } from 'react-icons/bi';
import ProductCard from '../Components/Card/Product Card/ProductCard'
import CopyRight from '../Components/CopyRight/CopyRight'



const SingleCategory = () => {

    const [productData, setProductData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterOption, setFilterOption] = useState('All')
    const [title, setTitle] = useState('All')
    const { cat } = useParams()

    useEffect(() => {
        getCategoryProduct();
        window.scroll(0, 0);
    }, [cat]);

    const getCategoryProduct = async () => {
        if (!cat) {
            console.warn("Category parameter 'cat' is undefined. Skipping initial product API call.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.post(`/api/product/fetchproduct/type`, { userType: cat });
            const data = response.data;
            
            setProductData(data);
            setIsLoading(false);

        } catch (error) {
            console.error("Error fetching category products:", error);
            setIsLoading(false);
        }
    };

    const productFilter = []

    
    if (cat === 'men-wear') {
        productFilter.push('All', 'T-Shirts', 'Jeans', 'Formal Wear', 'Accessories', 'Price Low To High', 'Price High To Low', 'High Rated', 'Low Rated');
    } else if (cat === 'women-wear') {
        productFilter.push('All', 'Dresses', 'Tops', 'Skirts', 'Accessories', 'Price Low To High', 'Price High To Low', 'High Rated', 'Low Rated');
    } else if (cat === 'children-wear') {
        productFilter.push('All', 'Boys', 'Girls', 'Infants', 'Price Low To High', 'Price High To Low', 'High Rated', 'Low Rated');
    } else if (cat === 'shoe') {
        productFilter.push('All', 'Running', 'Football', 'Formal', 'Casual', 'Price Low To High', 'Price High To Low', 'High Rated', 'Low Rated');
    } else if (cat === 'perfumes') {
        productFilter.push('All', 'Men', 'Women', 'Unisex', 'Price Low To High', 'Price High To Low', 'High Rated', 'Low Rated');
    } else if (cat === 'book') {
        productFilter.push('All', 'Scifi', 'Business', 'Mystery', 'Cookbooks', 'Fiction', 'Self-Help', 'Price Low To High', 'Price High To Low', 'High Rated', 'Low Rated');
    } else if (cat === 'jewelry') {
        productFilter.push('All', 'Necklace', 'Earrings', 'Rings', 'Bracelet', 'Watches', 'Price Low To High', 'Price High To Low', 'High Rated', 'Low Rated');
    } else {
        
        productFilter.push('All', 'Price Low To High', 'Price High To Low', 'High Rated', 'Low Rated');
    }


    const handleChange = (e) => {
        setFilterOption(e.target.value.split(" ").join("").toLowerCase())
        setTitle(e.target.value)
    }

    const getData = async () => {
        if (!cat) {
            console.warn("Category parameter 'cat' is undefined. Skipping filtered product API call.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const filter = filterOption.toLowerCase();
        try {
            const response = await axiosInstance.post(`/api/product/fetchproduct/category`, { userType: cat, userCategory: filter });
            const data = response.data;

            setProductData(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching filtered products:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (cat) {
            getData();
        }
    }, [filterOption, cat]);


    const loadingComponent = isLoading ?
        (
            <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: "center", flexWrap: "wrap", paddingLeft: 10, paddingBottom: 20 }}>
                <Loading /><Loading /><Loading /><Loading />
                <Loading /><Loading /><Loading /><Loading />
            </Container >
        )
        : null;

    return (
        <>
            <Container maxWidth='xl' style={{ marginTop: 90, display: 'flex', justifyContent: "center", flexDirection: "column" }}>
                < Box sx={{ minWidth: 140 }}>
                    <FormControl sx={{ width: 140 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, width: "80vw" }}>
                            <Button endIcon={<BiFilterAlt />}>Filters</Button>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={title}
                                sx={{ width: 200 }}
                                onChange={(e) => handleChange(e)}
                            >
                                {productFilter.map(prod => (
                                    <MenuItem key={prod} value={prod}>{prod}</MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </FormControl>
                </Box>
                
                {loadingComponent}

                {!isLoading && productData.length === 0 && (
                    <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                        No products found for this category.
                    </Typography>
                )}

                <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", justifyContent: 'center', flexWrap: "wrap", paddingBottom: 20, marginBottom: 30, width: '100%' }}>
                    {!isLoading && productData.length > 0 && productData.map(prod => (
                        <Link to={`/Detail/type/${cat}/${prod._id}`} key={prod._id}>
                            <ProductCard prod={prod} />
                        </Link>
                    ))}
                </Container>
            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    )
}


export default SingleCategory;
