import React from 'react';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    PieChart, Pie, Cell, Area, AreaChart, Legend
} from 'recharts';
import PropTypes from 'prop-types';


const CATEGORY_DEFINITIONS = [
    { name: "Men's Wear", slug: 'men-wear' },
    { name: "Women's Wear", slug: 'women-wear' },
    { name: "Children's Wear", slug: 'children-wear' },
    { name: "Luxury Shoes", slug: 'luxury-shoes' },
    { name: "Precious Jewelries", slug: 'precious-jewelries' },
    { name: "Books", slug: 'books' },
    { name: "Premium Perfumes", slug: 'premium-perfumes' },
];
const CHART_COLORS = ['#FFD700', '#2196F3', '#4CAF50', '#E53935', '#9C27B0', '#FF5733', '#33FF57'];


const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
    const radius = outerRadius * 1.05; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill="#ffffff" 
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            style={{ fontFamily: 'Cooper Black, serif', fontWeight: 'bold', fontSize: '0.8rem' }} 
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CustomChartTooltip = ({ active, payload, label, isCurrency = false }) => {
    if (active && payload && payload.length) {
        
        
        const itemLabel = isCurrency
            ? new Date(label).toLocaleDateString("en-US", { day: "numeric", month: "short" })
            : payload[0].payload.name;

        return (
            <Box sx={{ bgcolor: '#2a2a2a', border: '1px solid #FFD700', borderRadius: '8px', p: 1.5, fontFamily: 'Cooper Black, serif' }}>
                <Typography variant="body2" sx={{ color: '#FFD700', fontFamily: 'inherit', mb: 0.5, fontWeight: 'bold' }}>
                    {itemLabel}
                </Typography>
                {payload.map((entry, index) => (
                    <Typography key={`item-${index}`} variant="body2" sx={{ color: 'white', fontFamily: 'inherit' }}>
                        {}
                        {`${entry.name || entry.dataKey}: ${isCurrency ? '₹' : ''}${entry.value.toLocaleString()}`}
                    </Typography>
                ))}
            </Box>
        );
    }
    return null;
};

const ChartPaper = ({ title, children }) => (
    <Paper elevation={6} sx={{ p: 3, bgcolor: '#1e1e1e', borderRadius: '15px', border: '1px solid #333' }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 3, color: "#FFD700", fontFamily: 'Cooper Black, serif' }}>
            {title}
        </Typography>
        <Box sx={{ width: '100%', height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {}
            {children}
        </Box>
    </Paper>
);

const ProductChart = ({ products, review, cart, wishlist, paymentData }) => {
    
    
    const productMap = new Map(products.map(p => [p._id, p]));

    

    
    
    const productData = CATEGORY_DEFINITIONS.map(category => ({
        name: category.name,
        Quantity: products.filter(prod => prod.mainCategory === category.slug).length
    }));

    
    
    const reviewData = [
        { name: "1 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 1).length },
        { name: "2 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 2).length },
        { name: "3 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 3).length },
        { name: "4 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 4).length },
        { name: "5 ⭐", Reviews: review.filter(r => Math.round(r.rating) === 5).length },
    ];

    
    
    const cartData = CATEGORY_DEFINITIONS.map(category => {
        const count = cart.reduce((acc, cartItem) => {
            
            const productId = cartItem.productId?._id || cartItem.productId;
            const product = productId ? productMap.get(productId) : null;
            return (product && product.mainCategory === category.slug) ? acc + 1 : acc;
        }, 0);

        
        const categoryIndex = CATEGORY_DEFINITIONS.findIndex(cat => cat.name === category.name);
        const color = categoryIndex !== -1
            ? CHART_COLORS[categoryIndex % CHART_COLORS.length]
            : '#888888'; 

        return { name: category.name, value: count, color: color }; 
    }).filter(item => item.value > 0); 

    
    
    const wishlistData = CATEGORY_DEFINITIONS.map(category => {
        const count = wishlist.reduce((acc, wishlistItem) => {
            
            const productId = wishlistItem.productId?._id || wishlistItem.productId;
            const product = productId ? productMap.get(productId) : null;
            return (product && product.mainCategory === category.slug) ? acc + 1 : acc;
        }, 0);
        return { name: category.name, "Quantity in wishlist": count };
    });

    
    
    const groupedPaymentData = paymentData
        .filter(item => item.status === 'completed') // <-- THIS IS THE FIX
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .reduce((acc, item) => {
            // CRITICAL FIX: We now get the year, month, and day from the local Date object,
            // avoiding the use of .toISOString() which converts to UTC.
            const dateObj = new Date(item.createdAt);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(dateObj.getDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;

            const existing = acc.find(el => el.date === date);
            if (existing) {
                existing.totalAmount += item.totalAmount; 
            } else {
                acc.push({ date, totalAmount: item.totalAmount }); 
            }
            return acc;
        }, []);

    // --- MODIFICATION STARTS HERE ---
    // Create a new array with only the last 7 days of data
    const dailyRevenueDataLast7Days = groupedPaymentData.slice(-7);
    // --- MODIFICATION ENDS HERE ---

    return (
        <Container sx={{ mt: 5, p: 0 }}>
            <Grid container spacing={4}>
                {}
                <Grid item xs={12}>
                    <ChartPaper title="Daily Revenue Trend (Last 7 Days)">
                        <ResponsiveContainer>
                            <AreaChart data={dailyRevenueDataLast7Days}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis
                                    dataKey="date"
                                    
                                    tickFormatter={(tick) => new Date(tick).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }}
                                />
                                <YAxis
                                    tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }}
                                    
                                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                                />
                                {}
                                <Tooltip content={<CustomChartTooltip isCurrency={true} />} />
                                <Area type="monotone" dataKey="totalAmount" name="Revenue" stroke="#FFD700" fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>

                {}
                <Grid item xs={12} md={6}>
                    <ChartPaper title="Product Quantity Distribution">
                        <ResponsiveContainer>
                            <BarChart data={productData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'white', fontSize: 11, fontFamily: 'Cooper Black, serif' }}
                                    angle={-35} 
                                    textAnchor="end"
                                    interval={0} 
                                    height={80} 
                                />
                                <YAxis tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }} allowDecimals={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="Quantity">
                                    {productData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>

                {}
                <Grid item xs={12} md={6}>
                    <ChartPaper title="Items in User Carts">
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                {}
                                <Tooltip content={<CustomChartTooltip />} />
                                <Pie
                                    data={cartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false} 
                                    label={renderCustomizedLabel} 
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {cartData.map((entry, index) => {
                                        
                                        return <Cell key={`cell-${index}`} fill={entry.color} />;
                                    })}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {}
                        {cartData.length > 0 && (
                            <Box sx={{
                                mt: 2, 
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 2, 
                                maxWidth: '100%',
                                p:1
                            }}>
                                {cartData.map((entry, index) => {
                                    
                                    return (
                                        <Box key={`legend-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: '50%',
                                                bgcolor: entry.color, 
                                                mr: 1, 
                                            }} />
                                            <Typography variant="body2" sx={{ color: 'white', fontFamily: 'Cooper Black, serif' }}>
                                                {entry.name}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                        {cartData.length === 0 && (
                            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#cccccc', fontFamily: 'Cooper Black, serif' }}>
                                No cart items to display.
                            </Typography>
                        )}
                    </ChartPaper>
                </Grid>

                {}
                <Grid item xs={12} md={6}>
                    <ChartPaper title="Items in User Wishlists">
                        <ResponsiveContainer>
                            <BarChart data={wishlistData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'white', fontSize: 11, fontFamily: 'Cooper Black, serif' }}
                                    angle={-35}
                                    textAnchor="end"
                                    interval={0}
                                    height={80}
                                />
                                <YAxis tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }} allowDecimals={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="Quantity in wishlist">
                                    {wishlistData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>

                {}
                <Grid item xs={12} md={6}>
                    <ChartPaper title="Review Rating Distribution">
                        <ResponsiveContainer>
                            <BarChart data={reviewData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }} />
                                <YAxis tick={{ fill: 'white', fontFamily: 'Cooper Black, serif' }} allowDecimals={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="Reviews" fill="#FFD700" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>
            </Grid>
        </Container>
    );
};

ProductChart.propTypes = {
    products: PropTypes.array.isRequired,
    review: PropTypes.array.isRequired,
    cart: PropTypes.array.isRequired,
    wishlist: PropTypes.array.isRequired,
    paymentData: PropTypes.array.isRequired,
};

export default ProductChart;