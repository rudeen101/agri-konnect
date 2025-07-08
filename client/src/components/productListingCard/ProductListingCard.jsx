import React, {useState, useEffect, useContext} from 'react';
import { Card, CardMedia, CardContent, IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { MdOutlineFavorite } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { Rating } from "@mui/material";

import "./productListingCard.css";
import img from "../../assets/images/cabbage.jpg"
import { Link } from 'react-router-dom';
// import { postDataToApi, fetchDataFromApi } from "../../utils/api2";
import { postDataToApi, fetchDataFromApi, deleteDataFromApi } from '../../utils/apiCalls'
import { MyContext } from "../../App";
import WishlistBtn from '../wishlistBtn/WishlistBtn';
import ShareBtn from '../shareBtn/ShareBtn';

const ProductListingCard = ({ productData }) => {
    const [isAddedToList, setIsAddedToList] = useState(false);
    const [addedToWishList, setAddedToWishList] = useState(false);
    const [inCart, setInCart] = useState(false);


    const context = useContext(MyContext);

    const getEstimatedDeliveryDate = (days) => {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + days); // Add delivery days
    
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        const formattedDate = deliveryDate.toLocaleDateString('en-US', options);
    
        const currentWeekday = today.toLocaleDateString('en-US', { weekday: 'long' });
    
        // If delivery day is the same week, use "This Monday"
        if (deliveryDate.getDate() - today.getDate() <= 6) {
            return `This ${formattedDate}`;
        }
    
        return formattedDate; // Example: "Monday, Jan 29"
    }
    // const handleWishlistToggle = (productId) => {

    //     const productData = {
    //         productId: productId,
    //         userId:  context?.userData?.userId
    //     }

    //     postDataToApi(`/api/wishList/toggle`, productData).then((res) => {
            
    //         if (!res.error){
    //             context.setAlertBox({
    //                 open: true,
    //                 error: false,
    //                 msg: res?.msg
    //             });

    //             setAddedToWishList(res?.isWishlisted);

    //         }
            
    //     });
    // };

    return (
        // <Card className="productListingCard product-card">
        //     <Link to={`/product/${productData?._id}`}>
        //         <CardMedia className="product-media" image={productData?.images[0]} />
        //     </Link>
        //     <div className="product-icons">
        //         <WishlistBtn productData={productData}></WishlistBtn>
        //         <ShareBtn productData={productData}></ShareBtn>
        //     </div>

        //     <CardContent>
        //     <div class="product-title">{productData?.name}</div>
        //     <div class="product-description">{productData?.description}</div>
        //     <div class="product-min-order">Minimum Order: {productData?.minOrder} {productData?.packagingType}(s)</div>
        //     <div class="product-price"><span>${productData?.oldPrice}</span> {productData?.price} / {productData?.packagingType}</div>
        //     <div class="product-rating">
        //         <Rating className="rating" name="half-rating-read" value={parseFloat(productData?.rating)} precesion={0.5} readOnly /> 
        //         <span className='review'>({productData?.rating ? productData?.rating : 0}/5)</span>
        //     </div>
        //     <div class="product-delivery">Delivery: Get it <strong>{getEstimatedDeliveryDate(productData?.estimatedDeliveryDate)}</strong></div>
        //     <div class="cardAtions">
        //         <div className="btnWrapper">
        //             <button className='actionBtn w-100'  onClick={() => context?.addToCart(productData)}>
                        // {context?.isInCart(productData._id) ? "In Cart" : "Add to Cart"}
        //             </button>
        //         </div>
        //     </div>
        //     </CardContent>
        // </Card>

        <div className="product-card" key={productData._id}>
            <Link to={`/product/${productData._id}`} className="product-link">
            <div className="product-image-container">
                <img 
                src={productData?.images[0]} 
                alt={productData?.name} 
                className="product-image"
                loading="lazy"
                />
                {productData?.rating >= 4 && (
                <span className="product-badge">Popular</span>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-title">{productData.name}</h3>
                <div className="product-rating">
                {[...Array(5)].map((_, i) => (
                    <span 
                    key={i} 
                    className={`star ${i < productData?.rating ? 'filled' : ''}`}
                    >
                    {i < productData?.rating ? '★' : '☆'}
                    </span>
                ))}
                <span className="rating-count">({Math.floor(Math.random() * 100)})</span>
                </div>
                <p className="product-price">${productData?.price.toFixed(2)}</p>
            </div>
            </Link>
            <button className="add-to-cart-btn" onClick={() => context?.addToCart(productData)}>
                {context?.isInCart(productData._id) ? "In Cart" : "Add to Cart"}
            </button>
        </div>
    );
};

export default ProductListingCard;
