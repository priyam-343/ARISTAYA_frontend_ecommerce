// src/Helpers/HomePageBanner.js
import { Shoes, Perfumes, FemaleWear, MaleWear, Books, Jewelry, ChildrenWear } from '../Assets/Images/Image';

const data = [
    {
        img: MaleWear,
        name: "Men's Wear",
        path: "men-wear" // Added path for backend
    },
    {
        img: FemaleWear,
        name: "Women's Wear",
        path: "women-wear" // Added path for backend
    },
    {
        img: ChildrenWear,
        name: "Children's Wear",
        path: "children-wear" // Added path for backend
    },
    {
        img: Shoes,
        name: "Luxury Shoes",
        path: "shoe" // Added path for backend (assuming 'shoe' is the type in DB)
    },
    {
        img: Jewelry,
        name: "Precious Jewelries",
        path: "jewelry" // Added path for backend (assuming 'jewelry' is the type in DB)
    },
    {
        img: Books,
        name: "Books",
        path: "book" // Added path for backend (assuming 'book' is the type in DB)
    },
    {
        img: Perfumes,
        name: "Premium Perfumes",
        path: "perfumes" // Added path for backend (assuming 'perfumes' is the type in DB)
    },  
]
export default data;
