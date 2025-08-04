import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, Typography, Box, useMediaQuery, Grid, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import ProductChart from './Charts/ProductChart';
import UserTable from './Tables/UserTable';
import axios from 'axios';
import ProductTable from './Tables/ProductTable';
import { VscGraph } from 'react-icons/vsc';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaShippingFast } from 'react-icons/fa';
import { TbReportMoney } from 'react-icons/tb';
import OrderTable from './Tables/OrderTable'; 
import Widget from './Widget';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (<Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>)}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export default function BasicTabs({ user, getUsersInfo }) { 
    const [value, setValue] = useState(0);
    const [dashboardData, setDashboardData] = useState({
        products: [],
        reviews: [],
        carts: [],
        wishlists: [],
        payments: []
    });
    const [loading, setLoading] = useState(true);
    const authToken = localStorage.getItem("Authorization");

    // This function fetches all products for the Products Table
    const getProductInfo = useCallback(async () => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_FETCH_PRODUCT); 
            if (data.success) {
                setDashboardData(prevData => ({ ...prevData, products: data.products || [] }));
            } else {
                toast.error(data.message || "Failed to load products for table.", { theme: "colored" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load products for table.", { theme: "colored" });
            console.error("Error fetching all products for ProductTable:", error);
        }
    }, []); 

    // This function fetches all data needed for the charts and widgets
    const getDashboardStats = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(process.env.REACT_APP_ADMIN_GET_CHART_DATA, {
                headers: { 'Authorization': authToken } 
            });
            if (data.success) {
                setDashboardData(prevData => ({
                    ...prevData,
                    products: data.data.products || [], 
                    reviews: data.data.reviews || [],
                    carts: data.data.cartItems || [], 
                    wishlists: data.data.wishlistItems || [], 
                    payments: data.data.payments || [],
                }));
            } else {
                toast.error(data.message || "Failed to load dashboard statistics.", { theme: "colored" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load dashboard statistics.", { theme: "colored" });
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    
    useEffect(() => {
        if (authToken) {
            getDashboardStats(); 
            // getProductInfo() is already called within getDashboardStats in the AdminHomePage fix.
            // But if you are using this component independently, you might need it here.
            // However, the dashboardStats API seems to return products, so this might be redundant.
        }
    }, [authToken, getDashboardStats]); 

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // FIX: Filter payments to only include completed transactions
    const completedPayments = dashboardData.payments.filter(payment => payment.status === 'completed');

    // FIX: Calculate revenue from the filtered payments array
    const totalRevenue = completedPayments.reduce((acc, curr) => (acc + curr.totalAmount), 0);
    
    // FIX: Calculate the number of orders from the filtered payments array
    const totalOrders = completedPayments.length;
    
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const tabStyles = {
        fontFamily: 'Cooper Black, serif',
        color: '#cccccc',
        minHeight: '60px',
        p: '12px 20px',
        textTransform: 'none',
        fontSize: '1.1rem',
        '&.Mui-selected': { color: '#FFD700' },
    };

    return (
        <Box sx={{ width: '100%' }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress sx={{ color: '#FFD700' }} />
                    <Typography variant="h6" sx={{ ml: 2, color: '#FFD700' }}>Verifying Admin Access...</Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={2} p={1} justifyContent="center" alignItems="center">
                        <Grid item xs={12} sm={6} lg={3}>
                            <Widget numbers={totalRevenue} heading='Revenue' color='#FFD700' icon={<TbReportMoney />} />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <Widget numbers={dashboardData.products.length} heading='Products' color='#2196F3' icon={<AiOutlineShoppingCart />} />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <Widget numbers={Array.isArray(user) ? user.length : 0} heading='Users' color='#4CAF50' icon={<CgProfile />} />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <Widget numbers={totalOrders} heading='Orders' color='#E53935' icon={<FaShippingFast />} />
                        </Grid>
                    </Grid>

                    <Box sx={{
                        borderBottom: 1, borderColor: 'divider', display: 'flex',
                        justifyContent: 'center', mt: 5, bgcolor: '#1a1a1a', borderRadius: '8px'
                    }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            sx={{ '& .MuiTabs-indicator': { backgroundColor: '#FFD700' } }}
                            textColor="inherit"
                        >
                            <Tab label={!isSmallScreen && 'Statistics'} {...a11yProps(0)} iconPosition='start' icon={<VscGraph size={20} />} sx={tabStyles} />
                            <Tab label={!isSmallScreen && 'Users'} {...a11yProps(1)} iconPosition='start' icon={<CgProfile size={20} />} sx={tabStyles} />
                            <Tab label={!isSmallScreen && 'Products'} {...a11yProps(2)} iconPosition='start' icon={<AiOutlineShoppingCart size={20} />} sx={tabStyles} />
                            <Tab label={!isSmallScreen && 'Orders'} {...a11yProps(3)} iconPosition='start' icon={<FaShippingFast size={20} />} sx={tabStyles} />
                        </Tabs>
                    </Box>

                    <TabPanel value={value} index={0}>
                        <ProductChart
                            products={dashboardData.products}
                            review={dashboardData.reviews}
                            cart={dashboardData.carts}
                            wishlist={dashboardData.wishlists}
                            paymentData={dashboardData.payments}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <UserTable user={user} getUsersInfo={getUsersInfo} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <ProductTable data={dashboardData.products} getProductInfo={getProductInfo} />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <OrderTable orders={dashboardData.payments} />
                    </TabPanel>
                </>
            )}
        </Box>
    );
}

BasicTabs.defaultProps = {
    user: []
};

BasicTabs.propTypes = {
    user: PropTypes.array,
    getUsersInfo: PropTypes.func.isRequired, 
};