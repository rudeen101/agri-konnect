import React, { useState, useContext, useEffect } from "react";
import { useRef } from "react";
import "./productDetails.css";
import{ Link, useParams } from "react-router-dom";
import { Button, Rating } from "@mui/material";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import food from "../../assets/images/cabbage.jpg"
import food2 from "../../assets/images/water-mellon.jpg"
import user from "../../assets/images/rudeen.jpg"
import truck from "../../assets/images/truck-delivery.jpg"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Sidebar from '../../components/sidebar/sidebar'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ProductCard from "../../components/product/product";
import QuantityBox from "../../components/quantityBox/quantityBox";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import VerticallyCenteredModal from "../../components/models/verticallyCenteredModel";
import { MyContext } from "../../App";
import { fetchDataFromApi, postDataToApi, deleteDataFromApi } from "../../utils/apiCalls";
import QuantitySelector from "../../components/quantitySelector/quantitySelector";
import testImage from "../../assets/images/food.jpg"
import ProductImageSlider from "../../components/productImageSlider/ProductImageSlider";
import ProductDetailsSidebar from "../../components/productDetailsSidebar/ProductDetailsSidebar";
import { MdFavorite } from "react-icons/md"; 
import { MdFavoriteBorder } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import ProductsSlider from "../../components/productsSlider/ProductsSlider";
import ShareBtn from "../../components/shareBtn/ShareBtn";
import WishlistBtn from "../../components/wishlistBtn/WishlistBtn";
import ProductReviews from "../../components/productReviews/ProductReviews";
import RelatedProductSliderContainer from "../../components/sliderContainer/RelatedSliderContainer";

const ProductDetails = ({userId}) =>{

    const [zoomImage, setZoomImage] = useState("");
    // const [addToCart, setAddToCart] = useState(0);
    const [minusFromCart, setMinusFromCart] = useState(0);
    // const [activeTabs, setActiveTabs] = useState(0)
    const [activeTab, setActiveTab] = useState(0)
    const [modalShow, setModalShow] = React.useState(false);
    const [productData, setProductData] = React.useState([]);
    const [selectedProductData, setSelectedProductData] = React.useState([]);
    // const [productQuantity, setProductQuantity] = React.useState();
    const [cartFields, setCartFields] = React.useState({});
    const [reviewsData, setReviewsData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    // const [addedToWishList, setAddedToWishList] = React.useState(false);
    const [isWishlisted, setIsWishlisted] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    
        
    const [reviews, setReviews] = useState({
        review: "",
        customerRating: 1,
        customerId: "",
        customerName: "",
        productId: "",
    })
    
    const {id} = useParams();
    const context = useContext(MyContext);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        window.scrollTo(0,0);
        fetchDataFromApi(`/api/product/details/${id}`).then((res) =>{
            setProductData(res);
            setZoomImage(res?.images[0])
        });

        getReviews();
        getRelatedProducts(id)

    }, []);

    const getRelatedProducts = async (productId) => {

        const data = await fetchDataFromApi(`/api/product/related/${productId}`);
        if (data) {
            setRelatedProducts(data);
        }

    }

    const getReviews = async () => {

        const data = await fetchDataFromApi(`/api/productReviews/${id}`);
        if (data) {
            setReviewsData(data);
        }
    }

    const handleQuantityChange = (newQuantity, productId) => {
        setQuantity(newQuantity);
    };


    return (
        <>
             <div className="productDetails">
            <div className="breadcrumbWrapper">
                {/* <div className="container-fluid"> */}
                    <ul className="breadcrum breadcrumb2 mb-0">
                        <li><Link>Home</Link></li>
                        <li><Link>{productData?.catName}</Link></li>
                        <li><Link>{productData?.subCat}</Link></li>
                    </ul>
                {/* </div> */}
            </div>

            <div className="container-fluid detailsContainer pt-3 pb-3">
                <div className="row">
                   <div className="product-detail-container">
                        {/* Product Main Section */}
                        <div className="product-main card">
                            <div className="row g-4">
                            {/* Product Images */}
                            <div className="col-lg-6">
                                <div className="product-gallery">
                                    <ProductImageSlider 
                                        images={productData?.images} 
                                        showThumbnails={true}
                                        zoomEnabled={true}
                                    />
                                    {productData?.discount > 0 && (
                                        <div className="discount-badge">
                                        -{productData.discount}% OFF
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="col-lg-6">
                                <div className="product-info">
                                    <div className="product-header">
                                        <h1 className="product-title">{productData?.name}</h1>
                                        <div className="product-meta">
                                            <div className="rating-container">
                                                <Rating 
                                                value={reviewsData?.length > 0 ? parseFloat(reviewsData[0]?.rating) : 0}
                                                precision={0.5}
                                                readOnly
                                                size="medium"
                                                className="product-rating"
                                                />
                                                <span className="review-count">
                                                ({reviewsData?.length || 0} review{reviewsData?.length !== 1 ? 's' : ''})
                                                </span>
                                            </div>
                                            <div className="brand-info">
                                                <span className="label">Sold by:</span>
                                                <Link to={`/seller/${productData?.sellerId}`} className="brand-link">
                                                {productData?.brand}
                                                </Link>
                                            </div>
                                            <div className={`availability ${productData?.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                {productData?.countInStock > 0 ? 
                                                `${productData.countInStock} ${productData.packagingType} available` : 
                                                'Temporarily out of stock'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="price-section">
                                        <div className="current-price">
                                        ${productData?.price?.toFixed(2)}
                                        {productData?.oldPrice && (
                                            <span className="old-price">${productData.oldPrice.toFixed(2)}</span>
                                        )}
                                        </div>
                                        {productData?.discount > 0 && (
                                        <div className="price-savings">
                                            You save ${(productData.oldPrice - productData.price).toFixed(2)} ({productData.discount}%)
                                        </div>
                                        )}
                                    </div>

                                    <div className="product-description">
                                        <p>{productData?.description}</p>
                                    </div>

                                    <div className="product-specs">
                                        <div className="spec-item">
                                        <span className="spec-label">Size/Weight:</span>
                                        <span className="spec-value">{productData?.productWeight} {productData?.packagingType}</span>
                                        </div>
                                        <div className="spec-item">
                                        <span className="spec-label">Minimum Order:</span>
                                        <span className="spec-value">{productData?.minOrder} {productData?.packagingType}</span>
                                        </div>
                                        <div className="spec-item">
                                        <span className="spec-label">Origin:</span>
                                        <span className="spec-value">{productData?.location}</span>
                                        </div>
                                    </div>

                                    <div className="product-actions">
                                        <div className="quantity-selector-wrapper">
                                        <QuantitySelector 
                                            stock={productData?.countInStock} 
                                            initialQuantity={quantity}
                                            onQuantityChange={handleQuantityChange}
                                            minOrder={productData?.minOrder}
                                        />
                                        </div>

                                        <div className="action-buttons">
                                        <Button 
                                            variant="contained" 
                                            className={`add-to-cart-btn ${context?.isInCart(productData?._id) ? 'in-cart' : ''}`}
                                            onClick={() => context.addToCart(productData, quantity)}
                                            disabled={productData?.countInStock <= 0}
                                            startIcon={<IoCartOutline />}
                                        >
                                            {context?.isInCart(productData?._id) ? 'Added to Cart' : 'Add to Cart'}
                                        </Button>

                                        <div className="secondary-actions">
                                            <WishlistBtn 
                                            productData={productData} 
                                            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                            />
                                            <ShareBtn 
                                            productData={productData} 
                                            className="share-btn"
                                            />
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>

                            {/* Product Tabs */}
                            <div className="product-tabs-section">
                            <div className="tabs-header">
                                <button 
                                className={`tab-btn ${activeTab === 0 ? 'active' : ''}`}
                                onClick={() => setActiveTab(0)}
                                >
                                Product Details
                                </button>
                                <button 
                                className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
                                onClick={() => setActiveTab(1)}
                                >
                                Reviews ({reviewsData?.length || 0})
                                </button>
                                <button 
                                className={`tab-btn ${activeTab === 2 ? 'active' : ''}`}
                                onClick={() => setActiveTab(2)}
                                >
                                Seller Information
                                </button>
                            </div>

                            <div className="tabs-content">
                                {activeTab === 0 && (
                                <div className="tab-panel">
                                    <div className="detailed-description">
                                    <h3>Product Description</h3>
                                    <div className="description-content">
                                        {productData?.detailedDescription || productData?.description}
                                    </div>
                                    </div>

                                    <div className="specifications">
                                    <h3>Product Specifications</h3>
                                    <div className="specs-grid">
                                        <div className="spec-row">
                                        <div className="spec-name">Product Name</div>
                                        <div className="spec-value">{productData?.name}</div>
                                        </div>
                                        <div className="spec-row">
                                        <div className="spec-name">Price</div>
                                        <div className="spec-value">
                                            ${productData?.price} per {productData?.productWeight} {productData?.packagingType}
                                        </div>
                                        </div>
                                        <div className="spec-row">
                                        <div className="spec-name">Category</div>
                                        <div className="spec-value">{productData?.catName}</div>
                                        </div>
                                        <div className="spec-row">
                                        <div className="spec-name">Stock Available</div>
                                        <div className="spec-value">{productData?.countInStock} {productData?.packagingType}</div>
                                        </div>
                                        <div className="spec-row">
                                        <div className="spec-name">Minimum Order</div>
                                        <div className="spec-value">
                                            {productData?.minOrder} {productData?.productWeight} {productData?.packagingType}
                                        </div>
                                        </div>
                                        <div className="spec-row">
                                        <div className="spec-name">Origin</div>
                                        <div className="spec-value">{productData?.location}</div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                )}

                                {activeTab === 1 && (
                                <div className="tab-panel">
                                    <ProductReviews 
                                    productId={productData?._id} 
                                    user={user}
                                    reviews={reviewsData}
                                    />
                                </div>
                                )}

                                {activeTab === 2 && (
                                <div className="tab-panel">
                                    <SellerInfo 
                                    seller={productData?.seller} 
                                    rating={productData?.sellerRating}
                                    />
                                </div>
                                )}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
        <div className="relatedProducts pt-2 pb-4">
                <br />
                {
                    context?.mostPopular?.products?.length !== 0 &&
                    <section className="pt-0"> 
                        <RelatedProductSliderContainer products={relatedProducts} title={"Most Popular Items"}></RelatedProductSliderContainer>
                    </section>
                }
            </div>
        </>
   
    )
}

export default ProductDetails;