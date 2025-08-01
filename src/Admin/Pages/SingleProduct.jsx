import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { Box, Button, Container, Dialog, DialogActions, DialogContent, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, TextField, Typography, Paper, CssBaseline } from '@mui/material';
import { AiFillCloseCircle, AiFillDelete, AiOutlineFileDone } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { Transition } from '../../Constants/Constant';

const CATEGORY_MAP = {
    'men-wear': { displayName: "Men's Wear", subCategories: ['t-shirts', 'jeans', 'formal-wear', 'accessories'] },
    'women-wear': { displayName: "Women's Wear", subCategories: ['dresses', 'tops', 'skirts', 'accessories'] },
    'children-wear': { displayName: "Children's Wear", subCategories: ['boys', 'girls', 'infants'] },
    'luxury-shoes': { displayName: "Luxury Shoes", subCategories: ['running', 'football', 'formal', 'casual'] },
    'premium-perfumes': { displayName: "Premium Perfumes", subCategories: ['men', 'women', 'unisex'] },
    'books': { displayName: "Books", subCategories: ['scifi', 'business', 'mystery', 'cookbooks', 'fiction', 'self-help'] },
    'precious-jewelries': { displayName: "Precious Jewelries", subCategories: ['necklace', 'earrings', 'rings', 'bracelet', 'watches'] },
};

const SingleProduct = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openAlert, setOpenAlert] = useState(false);
    const authToken = localStorage.getItem("Authorization");
    const { id } = useParams();
    const navigate = useNavigate();

    const [productInfo, setProductInfo] = useState({
        name: "", description: "", price: "", images: "", mainCategory: "",
        subCategory: "", stock: "", brand: "", rating: "", author: "",
    });

    const getSingleProduct = useCallback(async () => {
        setLoading(true);
        try {
            // CRITICAL FIX: The backend now returns a standardized response { success: true, product: {...} }
            const { data } = await axios.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`);
            
            if (data.success && data.product) {
                const productData = data.product;
                setProduct(productData);
                setProductInfo({
                    name: productData.name || "",
                    description: productData.description || "",
                    price: productData.price || "",
                    images: productData.images?.[0]?.url || "",
                    mainCategory: productData.mainCategory || "",
                    subCategory: productData.subCategory || "",
                    stock: productData.stock || "",
                    brand: productData.brand || "",
                    rating: productData.rating || "",
                    author: productData.author || "",
                });
            } else {
                toast.error(data.message || "Product not found.", { theme: 'colored' });
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load product details.", { theme: 'colored' });
            console.error("Error loading single product:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getSingleProduct();
        window.scroll(0, 0);
    }, [id, getSingleProduct]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...productInfo,
                price: parseFloat(productInfo.price),
                rating: parseFloat(productInfo.rating),
                stock: parseInt(productInfo.stock),
                images: [{ url: productInfo.images }],
            };

            const { data } = await axios.put(`${process.env.REACT_APP_ADMIN_UPDATE_PRODUCT}/${product._id}`, { productDetails: payload }, {
                headers: { 'Authorization': authToken }
            });
            if (data.success) {
                toast.success(data.message || "Product updated successfully", { theme: 'colored' });
                getSingleProduct();
            } else {
                toast.error(data.message || "Update failed.", { theme: 'colored' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.", { theme: 'colored' });
            console.error("Error updating product:", error);
        }
    };

    const deleteProduct = async () => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_ADMIN_DELETE_PRODUCT}/${product._id}`, {
                headers: { 'Authorization': authToken }
            });
            if (data.success) {
                toast.success(data.message || "Product deleted successfully", { theme: 'colored' });
                navigate('/admin/home');
            } else {
                toast.error(data.message || "Deletion failed.", { theme: 'colored' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete product.", { theme: 'colored' });
            console.error("Error deleting product:", error);
        } finally {
            setOpenAlert(false);
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
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, bgcolor: '#000000' }}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ flexGrow: 1, py: 5 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                        <Skeleton variant='rectangular' height={300} width="300px" sx={{ bgcolor: '#333', borderRadius: '15px' }} />
                    </Box>
                ) : (
                    <Paper sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333' }}>
                        <Typography variant='h4' sx={{ color: '#FFD700', fontFamily: 'Cooper Black, serif', textAlign: 'center', mb: 4 }}>
                            Edit Product
                        </Typography>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ border: '1px solid #444', borderRadius: '15px', overflow: 'hidden', p: 1, bgcolor: '#000' }}>
                                    <img alt={product?.name} src={productInfo.images || "https://placehold.co/400x400?text=No+Image"} style={{ width: "100%", height: "auto", maxWidth: '400px', objectFit: "contain", borderRadius: '10px' }} />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Box component="form" onSubmit={handleSubmit}>
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
                                        <Grid item xs={12} sm={4}>
                                            <TextField label="Price" name='price' type="number" value={productInfo.price} onChange={handleOnChange} fullWidth required sx={textFieldStyles} />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            {/* FIX: Limit Rating input from 0 to 5 */}
                                            <TextField 
                                                label="Rating (0-5)" 
                                                name='rating' 
                                                type="number" 
                                                value={productInfo.rating} 
                                                onChange={handleOnChange} 
                                                fullWidth 
                                                required 
                                                sx={textFieldStyles} 
                                                inputProps={{ min: 0, max: 5 }} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField label="Stock" name='stock' type="number" value={productInfo.stock} onChange={handleOnChange} fullWidth required sx={textFieldStyles} />
                                        </Grid>
                                        <Grid item xs={12}><TextField label="Description" name='description' value={productInfo.description} onChange={handleOnChange} multiline rows={4} fullWidth required sx={textFieldStyles} /></Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Button variant='contained' endIcon={<AiOutlineFileDone />} type='submit' sx={{ bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#e6c200' }, p: '12px 30px' }}>Save Changes</Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 5, p: 2, borderTop: '1px solid #333', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                            <Typography variant='h6' sx={{ color: 'white' }}>Delete this product?</Typography>
                            <Button variant='contained' color='error' endIcon={<AiFillDelete />} onClick={() => setOpenAlert(true)}>Delete</Button>
                        </Box>
                    </Paper>
                )}
                <Dialog open={openAlert} TransitionComponent={Transition} keepMounted onClose={() => setOpenAlert(false)} PaperProps={{ sx: { bgcolor: '#1e1e1e', borderRadius: '15px', color: 'white' } }}>
                    <DialogContent sx={{ p: 4 }}><Typography sx={{ textAlign: 'center' }}>Are you sure you want to delete this product?</Typography></DialogContent>
                    <DialogActions sx={{ justifyContent: 'space-evenly', pb: 2 }}>
                        <Button variant='contained' endIcon={<AiFillDelete />} color='error' onClick={deleteProduct}>Delete</Button>
                        <Button variant='contained' onClick={() => setOpenAlert(false)} endIcon={<AiFillCloseCircle />}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default SingleProduct;
