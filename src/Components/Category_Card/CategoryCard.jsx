import React from 'react';
import styles from './Category.module.css';
import { Link } from 'react-router-dom';

const CategoryCard = ({ data }) => {
    return (
        // CORRECTED: Use data.path for the URL to match backend expectations
        <Link to={`product/type/${data.path}`}>
            <div className={styles.mainCard}>
                <img src={data.img} alt={data.name} className={styles.mainImg} loading='lazy' />
                <span className={styles.imgTitle}>{data.name}</span>
            </div>
        </Link>
    );
};

export default CategoryCard;
