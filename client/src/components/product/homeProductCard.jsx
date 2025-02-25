import React, {useState, useEffect, useContext} from 'react';
import { Card, CardMedia, CardContent, IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { MdOutlineFavorite } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";


import "./product.css";
import img from "../../assets/images/cabbage.jpg"
import { Link } from 'react-router-dom';
// import { postDataToApi, fetchDataFromApi } from "../../utils/api2";
import { postDataToApi, fetchDataFromApi, deleteDataFromApi } from '../../utils/apiCalls'
import { MyContext } from "../../App";
import WishlistBtn from '../wishlistBtn/WishlistBtn';
import ShareBtn from '../shareBtn/ShareBtn';

const HomeProductCard = ({ productData }) => {
    const [isAddedToList, setIsAddedToList] = useState(false);
    const [addedToWishList, setAddedToWishList] = useState(false);
    const [inCart, setInCart] = useState(false);


    const context = useContext(MyContext);

    // fetch cartitems
    useEffect(() => {
        fetchDataFromApi(`/api/cart`).then((res) => {
            console.log("cartData",res.products)
            setInCart(res.products.product.some(item => item.productId._id === productData._id));
        })
    }, []);

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
        <Card className="product-card">
            <Link to={`/product/${productData?._id}`}>
                <CardMedia className="product-media" image={productData?.images[0]} />
            </Link>
            <div className="product-icons">
                <WishlistBtn productData={productData}></WishlistBtn>
                <ShareBtn productData={productData}></ShareBtn>
            </div>

            <CardContent>
                <div class="product-title">{productData?.name}</div>
                <div class="product-price">${productData?.price}/<span className='pricePckage'>{productData?.packagingType}</span></div>
                {/* <div class="product-discount">Discount: 15% Off</div> */}
                <div class="product-stock">Instock: {productData?.countInStock} {productData?.packagingType}</div>   
                <div class="product-actions">
                    <button>Buy Now</button>

                    
                    {/* Cart Toggle Button */}
                    <button onClick={handleCartToggle} className={`cartBtn ${inCart ? "active" : ""}`}>
                        <IoCartOutline />{inCart ? "Added to Cart" : "Add to Cart"}
                    </button>
                    {/* <button>Add to Cart</button> */}
                </div>
            </CardContent>
        </Card>
    );
};

export default HomeProductCard;
