import React from 'react';
import { Card, CardMedia, CardContent, IconButton, Tooltip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import "./product.css";
import img from "../../assets/images/cabbage.jpg"
import { Link } from 'react-router-dom';


    // const useStyles = makeStyles({
    //     card: {
    //         position: 'relative',
    //         '&:hover $icons': {
    //             opacity: 1,
    //         },
    //     },
    //     media: {
    //         height: 200,
    //         transition: 'transform 0.3s ease-in-out',
    //         '&:hover': {
    //             transform: 'scale(1.05)',
    //         },
    //     },
    //     icons: {
    //         position: 'absolute',
    //         top: 10,
    //         right: 10,
    //         display: 'flex',
    //         flexDirection: 'column',
    //         gap: 5,
    //         opacity: 0,
    //         transition: 'opacity 0.3s',
    //     },
    // });

const HomeProductCard = ({ productData }) => {

    return (
        <Card className="product-card">
            <Link to={`/product/${productData?._id}`}>
                <CardMedia className="product-media" image={productData?.images[0]} />
            </Link>
            <div className="product-icons">
                <Tooltip title="Add to Wishlist" arrow>
                    <IconButton color="primary">
                        <FavoriteBorderIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Share" arrow>
                    <IconButton color="primary">
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
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
