import React, { useState, useContext } from "react";
import "./wishlistBtn.css"; // Import CSS for styling
import {IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { postDataToApi} from '../../utils/apiCalls'
import { MyContext } from "../../App";
import { MdOutlineFavorite } from "react-icons/md";


const WishlistBtn = ({ productData }) => {

    const [addedToWishList, setAddedToWishList] = useState(false);
    const context = useContext(MyContext);

    const handleWishlistToggle = (productId) => {

        const productData = {
            productId: productId,
            userId:  context?.userData?.userId
        }

        postDataToApi(`/api/wishList/toggle`, productData).then((res) => {
            
            if (!res.error){
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: res?.msg
                });

                setAddedToWishList(res?.isWishlisted);

            }
            
        });
    };

    return (
        <Tooltip title="Add to Wishlist" arrow>
            <IconButton className="tooltipIcon">
                
                {
                    addedToWishList === true ? 
                    <MdOutlineFavorite className='icon' onClick={() => handleWishlistToggle(productData?._id)} />
                    : <FavoriteBorderIcon className='icon' onClick={() => handleWishlistToggle(productData?._id)} />
                }
            </IconButton>
        </Tooltip>
    );
};

export default WishlistBtn;
