import React, {useState, useEffect} from 'react';
import { Card, CardMedia, CardContent, IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import "./product.css";
import img from "../../assets/images/cabbage.jpg"
import { Link } from 'react-router-dom';
import { postData, fetchDataFromApi } from "../../utils/api";

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

const HomeProductCard = ({ productData }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        fetchDataFromApi(`/api/product/homepage`)
        .then((res) => {
            console.log("home data",res.combinedProducts)

          
        });
    }, []);

    return (
        <Card className="product-card">
            <Link to={`/product/${productData?._id}`}>
                <CardMedia className="product-media" image={productData?.images[0]} />
            </Link>
            <div className="product-icons">
                <Tooltip title="Add to Wishlist" arrow>
                    <IconButton className="tooltipIcon">
                        <FavoriteBorderIcon className='icon' />
                    </IconButton>
                </Tooltip>

                <div  
                    className="share-button-container"
                    onMouseEnter={() => setShowShareOptions(true)}
                    onMouseLeave={() => setShowShareOptions(false)}
                >
                    <Tooltip title="" arrow>
                        <IconButton className="share-button tooltipIcon">
                            <ShareIcon className='icon' />
                        </IconButton>
                    </Tooltip> 

                    {showShareOptions && (
                        <div className="share-options">
                            <div>
                                <FacebookShareButton 
                                    url="https://www.example.com/product/12345"
                                    quote="Check out this amazing product!"
                                    hashtag="#AmazingProduct"
                                >
                                    <FacebookIcon size={25} round />
                                </FacebookShareButton>
                            </div>
                            
                            <div className="mt-2">
                                <WhatsappShareButton 
                                    url="https://www.example.com/product/12345"
                                    title="Check out this amazing product!"
                                    separator=" - "
                                >
                                    <WhatsappIcon size={25} round />
                                </WhatsappShareButton>
                            </div>
                           
                        </div>

                    )}

                   
             

                    {/* <Tooltip title="Share on LinkedIn" arrow>
                        <LinkedinShareButton 
                        url={productUrl} 
                        title={productTitle} 
                        summary={productDescription} 
                        source="YourSiteName"
                        >
                        <LinkedinIcon size={40} round />
                        </LinkedinShareButton>
                    </Tooltip> */}

                   
                </div>
            </div>

            <CardContent>
                <div class="product-title">{productData?.name}</div>
                <div class="product-price">${productData?.price}/<span className='pricePckage'>{productData?.packagingType}</span></div>
                {/* <div class="product-discount">Discount: 15% Off</div> */}
                <div class="product-stock">Instock: {productData?.countInStock} {productData?.packagingType}</div>   
                <div class="product-actions">
                    <button>Buy Now</button>
                    <button>Add to Cart</button>
                </div>
            </CardContent>
        </Card>
    );
};

export default HomeProductCard;
