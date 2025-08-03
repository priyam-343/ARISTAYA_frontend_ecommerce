import React, { useState, useMemo } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography, InputLabel, MenuItem, FormControl, Select, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Transition } from '../../Constants/Constant';
import { MdOutlineCancel, MdAddShoppingCart } from 'react-icons/md';
import PropTypes from 'prop-types';

const CATEGORY_MAP = {
    'men-wear': { displayName: "Men's Wear", subCategories: ['t-shirts', 'jeans', 'formal-wear', 'accessories'] },
    'women-wear': { displayName: "Women's Wear", subCategories: ['dresses', 'tops', 'skirts', 'accessories'] },
    'children-wear': { displayName: "Children's Wear", subCategories: ['boys', 'girls', 'infants'] },
    'luxury-shoes': { displayName: "Luxury Shoes", subCategories: ['running', 'football', 'formal', 'casual'] },
    'premium-perfumes': { displayName: "Premium Perfumes", subCategories: ['men', 'women', 'unisex'] },
    'books': { displayName: "Books", subCategories: ['scifi', 'business', 'mystery', 'cookbooks', 'fiction', 'self-help'] },
    'precious-jewelries': { displayName: "Precious Jewelries", subCategories: ['necklace', 'earrings', 'rings', 'bracelet', 'watches'] },
};

const AddProduct = ({ getProductInfo }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const authToken = localStorage.getItem("Authorization");

    const [productInfo, setProductInfo] = useState({
        name: "", description: "", price: "", originalPrice: "",
        images: "", mainCategory: "", subCategory: "", stock: "", brand: "", rating: "",
    });

    const availableSubCategories = useMemo(() => {
        return productInfo.mainCategory ? CATEGORY_MAP[productInfo.mainCategory].subCategories : [];
    }, [productInfo.mainCategory]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setProductInfo(prevInfo => {
            const newInfo = { ...prevInfo, [name]: value };
            if (name === 'mainCategory') {
                newInfo.subCategory = '';
            }
            return newInfo;
        });
    };

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setProductInfo({
            name: "", description: "", price: "", originalPrice: "",
            images: "", mainCategory: "", subCategory: "", stock: "", brand: "", rating: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!productInfo.name || !productInfo.brand || !productInfo.mainCategory ||
            !productInfo.subCategory || !productInfo.images || productInfo.images.trim() === '' ||
            !productInfo.price || !productInfo.rating || !productInfo.stock || !productInfo.description
        ) {
            toast.error("Please fill in all required fields.", { theme: "colored" });
            setLoading(false);
            return;
        }

        
        if (productInfo.originalPrice && parseFloat(productInfo.originalPrice) < parseFloat(productInfo.price)) {
            toast.error("The original price cannot be less than the discounted price.", { theme: "colored" });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                name: productInfo.name,
                description: productInfo.description,
                price: parseFloat(productInfo.price),
                images: [{ url: productInfo.images }],
                mainCategory: productInfo.mainCategory,
                subCategory: productInfo.subCategory,
                stock: parseInt(productInfo.stock),
                brand: productInfo.brand,
                rating: parseFloat(productInfo.rating),
            };

            
            if (productInfo.originalPrice) {
                payload.originalPrice = parseFloat(productInfo.originalPrice);
            }

            const { data } = await axios.post(`${process.env.REACT_APP_ADMIN_ADD_PRODUCT}`, payload, {
                headers: { 'Authorization': authToken }
            });

            if (data.success) {
                getProductInfo();
                toast.success(data.message || "Product added successfully", { autoClose: 500, theme: 'colored' });
                handleClose();
            } else {
                toast.error(data.message || "Something went wrong.", { autoClose: 500, theme: 'colored' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add product.", { autoClose: 500, theme: 'colored' });
            console.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };

    const textFieldStyles = {
        '& .MuiInputBase-input': { color: 'white' },
        '& .MuiInputLabel-root': { color: '#cccccc', fontFamily: 'Cooper Black, serif' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': { borderColor: '#444' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
        },
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', my: "20px" }} >
                <Typography variant='h6' textAlign='center' color="#FFD700" fontWeight="bold" fontFamily='Cooper Black, serif'>Add New Product</Typography>
                <Button variant='contained' endIcon={<MdAddShoppingCart />} onClick={handleClickOpen}
                    sx={{ bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#e6c200' }, fontFamily: 'Cooper Black, serif' }}
                >
                    Add
                </Button>
            </Box>
            <Divider sx={{ mb: 5, borderColor: '#444' }} />
            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} PaperProps={{ sx: { bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333', color: 'white' } }}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 'bold', color: "#FFD700", fontFamily: 'Cooper Black, serif' }}>Add New Product</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}><TextField label="Name" name='name' value={productInfo.name} onChange={handleOnChange} fullWidth required sx={textFieldStyles} /></Grid>
                            <Grid item xs={12}><TextField label="Brand" name='brand' value={productInfo.brand} onChange={handleOnChange} fullWidth required sx={textFieldStyles} /></Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required sx={textFieldStyles}>
                                    <InputLabel id="main-category-label">Main Category</InputLabel>
                                    <Select labelId="main-category-label" value={productInfo.mainCategory} label="Main Category" name='mainCategory' onChange={handleOnChange} sx={{ '.MuiSvgIcon-root': { color: '#FFD700' } }}>
                                        {Object.entries(CATEGORY_MAP).map(([slug, { displayName }]) =>
                                            <MenuItem value={slug} key={slug}>{displayName}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required sx={textFieldStyles} disabled={!productInfo.mainCategory}>
                                    <InputLabel id="sub-category-label">Sub Category</InputLabel>
                                    <Select labelId="sub-category-label" value={productInfo.subCategory} label="Sub Category" name='subCategory' onChange={handleOnChange} sx={{ '.MuiSvgIcon-root': { color: '#FFD700' } }}>
                                        {availableSubCategories.map(item => {
                                            let displayName = item.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                                            if (item === 't-shirts') {
                                                displayName = 'T-Shirts';
                                            } else if (item === 'self-help') {
                                                displayName = 'Self-Help';
                                            }

                                            return (
                                                <MenuItem value={item} key={item}>{displayName}</MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}><TextField label="Image URL" name='images' value={productInfo.images} onChange={handleOnChange} fullWidth required sx={textFieldStyles} /></Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <TextField label="Original Price" name='originalPrice' type="number" value={productInfo.originalPrice} onChange={handleOnChange} fullWidth sx={textFieldStyles} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Discounted Price" name='price' type="number" value={productInfo.price} onChange={handleOnChange} fullWidth required sx={textFieldStyles} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Rating (0-5)"
                                    name='rating'
                                    type="number"
                                    value={productInfo.rating}
                                    onChange={handleOnChange}
                                    fullWidth
                                    required
                                    sx={textFieldStyles}
                                    inputProps={{ min: 0, max: 5, step: "0.1" }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Stock" name='stock' type="number" value={productInfo.stock} onChange={handleOnChange} fullWidth required sx={textFieldStyles} />
                            </Grid>
                            <Grid item xs={12}><TextField label="Description" name='description' value={productInfo.description} onChange={handleOnChange} multiline rows={4} fullWidth required sx={textFieldStyles} /></Grid>
                        </Grid>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                            <Button fullWidth variant='contained' color='error' onClick={handleClose} endIcon={<MdOutlineCancel />} sx={{ fontFamily: 'Cooper Black, serif', borderRadius: '8px', py: 1 }}>Cancel</Button>
                            <Button type="submit" fullWidth variant="contained" disabled={loading} endIcon={<MdAddShoppingCart />} sx={{ bgcolor: '#FFD700', color: '#000', fontFamily: 'Cooper Black, serif', borderRadius: '8px', py: 1, '&:hover': { bgcolor: '#e6c200' } }}>
                                {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Add Product'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

AddProduct.propTypes = {
    getProductInfo: PropTypes.func.isRequired,
};

export default AddProduct;
