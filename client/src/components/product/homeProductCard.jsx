import React from 'react';
import { Card, CardMedia, CardContent, IconButton, Tooltip } from '@mui/material';

import "./product.css";
import { Link } from 'react-router-dom';
import WishlistBtn from '../wishlistBtn/WishlistBtn';
import ShareBtn from '../shareBtn/ShareBtn';

const HomeProductCard = ({ productData }) => {
    return (
        <Card className="product-card">
            <Link to={`/product/${productData?._id}`}>
                <CardMedia className="product-media" image={productData?.images[0]} />
            </Link>
            <div className="product-icons">
                <WishlistBtn productData={productData}></WishlistBtn>
                <ShareBtn productData={productData}></ShareBtn>
            </div>

            <CardContent>
                <div className="product-title">{productData?.name}</div>
                <div className="product-price">${productData?.price}/<span className='pricePckage'>{productData?.packagingType}</span></div>
                <div className="product-stock">Instock: {productData?.countInStock} {productData?.packagingType}</div>   
                <div className="product-actions">

                </div>
            </CardContent>
        </Card>
    );
};

export default HomeProductCard;
