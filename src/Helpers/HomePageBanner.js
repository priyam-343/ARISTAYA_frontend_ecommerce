import { Shoes, Perfumes, FemaleWear, MaleWear, Books, Jewelry, ChildrenWear } from '../Assets/Images/Image';

const data = [
    {
        img: MaleWear,
        name: "Men's Wear",
        path: "men-wear",
        position: 'top' // ADDED: Ensures the model's face is visible.
    },
    {
        img: FemaleWear,
        name: "Women's Wear",
        path: "women-wear",
        position: 'top' // ADDED: Ensures the model's face is visible.
    },
    {
        img: ChildrenWear,
        name: "Children's Wear",
        path: "children-wear",
        position: 'top' // ADDED: Ensures the model's face is visible.
    },
    {
        img: Shoes,
        name: "Luxury Shoes",
        path: "luxury-shoes"
    },
    {
        img: Jewelry,
        name: "Precious Jewelries",
        path: "precious-jewelries"
    },
    {
        img: Books,
        name: "Books",
        path: "books"
    },
    {
        img: Perfumes,
        name: "Premium Perfumes",
        path: "premium-perfumes"
    },
];

export default data;
