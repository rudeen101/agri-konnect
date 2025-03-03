import React, {useState, useEffect, useContext} from 'react';
import { Card, CardMedia, CardContent, IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { MdOutlineFavorite } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";


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

    // fetch cartitems
    // useEffect(() => {
    //     fetchDataFromApi(`/api/cart`).then((res) => {
    //         console.log("cartData",res)
    //         setInCart(res?.products?.some(item => item.product?._id === productData?._id));
    //     })
    // });

    useEffect(() => {
        // console.log("cartData**", context?.cartData);
        // setCartData(context?.cartData);
    })

    const handleCartToggle = async () => {
        console.log(inCart);

        if (inCart) {
            deleteDataFromApi(`/api/cart/remove/${productData?._id}`)
            .then((res) => {
                setInCart(false);
            });

        } else {
      
            const cartData= {
                productId: productData._id,
                quantity: 1
            }

            postDataToApi(`/api/cart/add`, cartData)
            .then((res) => {
                setInCart(true);
            });
        }
    };


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
        <Card className="productListingCard product-card">
            <Link to={`/product/${productData?._id}`}>
                <CardMedia className="product-media" image={productData?.images[0]} />
            </Link>
            <div className="product-icons">
                <WishlistBtn productData={productData}></WishlistBtn>
                <ShareBtn productData={productData}></ShareBtn>
            </div>

            <CardContent>
            <div class="product-title">Organic Farm Fresh Apples</div>
            <div class="product-description">Delicious, fresh apples grown sustainably and delivered directly to you.</div>
            {/* <div class="product-specs">Specifications: 1 lb per bag, Non-GMO, Freshly packed</div> */}
            <div class="product-supplier">Supplier: Green Orchards Ltd. (<span>Verified</span>)</div>
            {/* <div class="product-category">Category: Fresh Fruits</div> */}
            {/* <div class="product-min-order">Minimum Order: 100 lbs</div> */}
            <div class="product-price"><span>$5.00</span> $3.99 / lb</div>
            {/* <div class="product-discount">Discount: 10% Off</div> */}
            <div class="product-rating">Rating: ★★★★☆ (4.5/5)</div>
            <div class="product-delivery">Delivery: Get it by <strong>Monday, Jan 29</strong></div>
            <div class="product-delivery">Deliver to: <strong>Monrovia, Liberia</strong></div>
            <div class="cardAtions">
                <div className="btnWrapper">
                    <button className='actionBtn'>Buy Now</button>
                    <button className='actionBtn'  onClick={() => context?.addToCart(productData)}>
                        {context?.isInCart(productData._id) ? "In Cart" : "Add to Cart"}
                    </button>
                </div>
            </div>
            </CardContent>
        </Card>
    );
};

export default ProductListingCard;
