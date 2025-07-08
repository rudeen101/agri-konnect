import React, { useState, useContext, useEffect } from "react";
import "./wishlistBtn.css"; // Import CSS for styling
import {IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { postDataToApi} from '../../utils/apiCalls'
import { MyContext } from "../../App";
import { MdOutlineFavorite } from "react-icons/md";


const WishlistBtn = ({ productData }) => {

    const context = useContext(MyContext);

    const handleWishlistToggle = (product) => {
        context?.addToWishlist(product)        
    };

    return (
        <Tooltip title="Add to Wishlist" arrow>
            <IconButton className="tooltipIcon">
                
                {
                    context?.isInWishlist(productData?._id) ? 
                    <MdOutlineFavorite className='icon' onClick={() => handleWishlistToggle(productData)} />
                    : <FavoriteBorderIcon className='icon' onClick={() => handleWishlistToggle(productData)} />
                }
            </IconButton>
        </Tooltip>
    );
};

export default WishlistBtn;
