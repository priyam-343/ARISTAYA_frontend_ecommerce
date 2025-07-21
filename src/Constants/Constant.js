import { Slide } from "@mui/material";
import axiosInstance from "./../utils/axiosInstance"; // Import your axiosInstance
import { forwardRef } from "react";

const getCart = async (setProceed, setCart, authToken) => {
    if (setProceed) {
        try {
            const { data } = await axiosInstance.get(`${process.env.REACT_APP_GET_CART}`,
                {
                    headers: {
                        'Authorization': authToken
                    }
                });
            // Ensure data is an array before setting cart state
            setCart(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error in getCart (Constants):", error);
            setCart([]); // Set cart to empty array on error
        }
    }
};

const getWishList = async (setProceed, setWishlistData, authToken) => {
    if (setProceed) {
        try {
            const { data } = await axiosInstance.get(`${process.env.REACT_APP_GET_WISHLIST}`,
                {
                    headers: {
                        'Authorization': authToken
                    }
                });
            // Ensure data is an array before setting wishlistData state
            setWishlistData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error in getWishList (Constants):", error);
            setWishlistData([]); // Set wishlistData to empty array on error
        }
    }
};

const handleLogOut = (setProceed, toast, navigate, setOpenAlert) => {
    if (setProceed) {
        localStorage.removeItem('Authorization');
        toast.success("Logout Successfully", { autoClose: 500, theme: 'colored' });
        navigate('/');
        setOpenAlert(false);
    } else {
        toast.error("User is already logged off", { autoClose: 500, theme: 'colored' });
    }
};

const handleClickOpen = (setOpenAlert) => {
    setOpenAlert(true);
};

const handleClose = (setOpenAlert) => {
    setOpenAlert(false);
};

const getAllProducts = async (setData) => {
    try {
        const { data } = await axiosInstance.get(process.env.REACT_APP_FETCH_PRODUCT);
        setData(data);
    } catch (error) {
        console.error("Error in getAllProducts (Constants):", error);
    }
};

const getSingleProduct = async (setProduct, id, setLoading) => {
    try {
        const { data } = await axiosInstance.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`);
        setProduct(data);
        setLoading(false);
    } catch (error) {
        console.error(`Error in getSingleProduct (Constants) for ID ${id}:`, error);
        setLoading(false);
    }
};

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export { getCart, getWishList, handleClickOpen, handleClose, handleLogOut, getAllProducts, getSingleProduct, Transition };
