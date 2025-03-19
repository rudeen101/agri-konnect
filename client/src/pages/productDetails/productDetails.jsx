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
    const [activeTabs, setActiveTabs] = useState(0)
    const [modalShow, setModalShow] = React.useState(false);
    const [productData, setProductData] = React.useState([]);
    const [selectedProductData, setSelectedProductData] = React.useState([]);
    // const [productQuantity, setProductQuantity] = React.useState();
    const [cartFields, setCartFields] = React.useState({});
    const [reviewsData, setReviewsData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [addedToWishList, setAddedToWishList] = React.useState(false);
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
            setZoomImage(res.images[0])
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
                    <div className="col-md-9 part1 card"> 
                        <div className="row">
                            <div className="col-md-6 ">
                                <ProductImageSlider images={productData?.images}></ProductImageSlider>
                            </div>                       

                            <div className="col-md-6 productInfo">
                                <h1>{productData?.name}</h1>
                                <div className="d-flex align-items-center ratingContainer">
                                    <Rating className="rating" name="half-rating-read" value={parseInt(reviewsData[0]?.rating)} precission={0.4} readOnly />
                                    <div className="reviewNumber">({reviewsData?.length !== 0 ? reviewsData?.length : 0} review(s))</div>
                                </div>
                                <div className="brand">Business Name: <span >{productData?.brand}</span></div>
                                <hr></hr>

                                <div className="priceContainer d-flex align-items-center mb-3">
                                    <span className="text-g priceLarge mr-3">USD {productData?.price}</span>

                                    <div className="ml-3 d-flex flex-column">
                                        <span className="text-light oldPrice">USD {productData?.oldPrice}</span>
                                    </div>
                               
                                </div>

                                <p className="description">
                                    {productData?.description}
                                </p>
                                <span className="readMore"><a href="#productDetails">Read more</a></span>


                                <hr></hr>

                                
                                <div className="additionalInfo">
                                  
                                    <div className="col2">
                                        <ul>
                                            <li><span className="name">Size/Weight: </span><span className="size value">{productData?.productWeight}</span></li>
                                            <li>In stock: <span className="value"><span>{productData?.countInStock}</span> <span>{productData?.packagingType}</span></span></li>
                                            <li>Category: <span className="value">{productData?.catName}</span></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="addCartSection pt-4 pb-4 d-flex align-items-center">
                                    <div>
                                        <QuantitySelector stock={productData?.countInStock} productId={productData?._id} initialQuantity={quantity} onQuantityChange={handleQuantityChange}></QuantitySelector>
                                    </div>
                                 
                                  
                                    <div className="detailsIcon ml-3">
                                        <WishlistBtn productData={productData}></WishlistBtn>
                                    </div>

                                    <Button className="detailsIcon ml-3">
                                        <ShareBtn productData={productData}></ShareBtn>
                                    </Button>
                                </div>

                                <div className="addToCart">
                                       <Button onClick={() => context.addToCart(productData, quantity)} className={`w-100 addToCartBtn ml-3  cartBtn ${context?.isInCart(productData?._id) ? "active" : ""}`}>
                                        <IoCartOutline className="cartIcon" /> &nbsp;
                                        {context?.isInCart(productData?._id) ? "In Cart" : "Add to Cart"}
                                    </Button>
                                </div>

                            </div>
                        </div>
                        
                        <hr className="mt-4" />
                        <div className="">
                            <div className="mt-3 mb-5  detailsPageTabs container-fluid">
                                <div className="customTabs">
                                    <ul className="list list-inline">
                                        <li className="list-inline-item">
                                            <Button className={`${activeTabs === 0 && 'active'}`} onClick={()=> setActiveTabs(0)}>Product Details</Button>
                                        </li>
                                        <li className="list-inline-item">
                                            <Button className={`${activeTabs === 2 && 'active'}`} onClick={()=> setActiveTabs(2)}>Review(s) ({reviewsData?.length !== 0 ? reviewsData.length: 0})</Button>
                                        </li>
                                        <li className="list-inline-item">
                                            <Button className={`${activeTabs === 3 && 'active'}`} onClick={()=> setActiveTabs(3)}>Business Details</Button>
                                        </li>
                                    </ul>
                                </div>

                                <br />

                                {
                                    activeTabs === 0 &&
                                    <div className="tabContent" id="productDetails">
                                        <h4>Product Desctiption</h4>
                                        <p>{productData?.description}</p>
                                        
                                        <br />

                                        <h4>Product Specifications</h4>
                                        <table class="spec-table">
                                            <tr>
                                                <th>Product Name</th>
                                                <td>{productData?.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Product Price</th>
                                                <td>USD {productData?.price} per {productData?.productWeight} {productData?.packagingType}</td>
                                            </tr>
                                            <tr>
                                                <th>Category</th>
                                                <td>{productData?.catName}</td>
                                            </tr>
                                            <tr>
                                                <th>In Stock</th>
                                                <td>{productData?.countInStock}</td>
                                            </tr>
                                            <tr>
                                                <th>Minimum Order Quantity</th>
                                                <td>{productData?.minOrder} {productData?.productWeight} {productData?.packagingType}</td>
                                            </tr>
                                            <tr>
                                                <th>Origin</th>
                                                <td>{productData?.location}</td>
                                            </tr>
                                            {/* <tr>
                                                <th>Shelf Life</th>
                                                <td>1 Year</td>
                                            </tr> */}
                                            {/* <tr>
                                                <th>Certification</th>
                                                <td>FDA Approved</td>
                                            </tr> */}
                                        </table>
                                    </div>
                                }

                                {
                                    activeTabs === 2 &&
                                    <div className="tabContent">
                                         <ProductReviews productId={productData._id} user={user} />
                                    </div>
                                }

                                {
                                    activeTabs === 3 &&
                                    <div className="tabContent">
                                        <h4>About Our Business</h4>
                                        <p></p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 p-0 rightPart sidebarContainer">
                        {/* <Sidebar /> */}

                        <div className="sidebar">
                            <div>
                                <div className="item">
                                    <div className="imgDiv">
                                        <LocalShippingOutlinedIcon /> 
                                    </div>
                                    <div className="textDiv">
                                        <h5 className="p-0">Free Delivery</h5>
                                        <p className="m-0">For orders over $150</p>

                                    </div>
                                </div>
                                <Button className="btn-g btn-large w-100 mt-4" onClick={() => setModalShow(true)}>Request Delivery</Button>

                                <VerticallyCenteredModal
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                />

                               
                            </div>
                            <hr />
                            <div className="item">
                                <div className="imgDiv">
                                    <PaymentsOutlinedIcon /> 
                                </div>
                                <div className="textDiv">
                                    <h5 className="p-0">Money Back Gaurantee</h5>
                                    <p className="m-0">15 days refund Gaurantee</p>
                                </div>
                            </div>
                            <hr />
                            <div className="item">
                                <div className="imgDiv">
                                    <CreditScoreOutlinedIcon /> 
                                </div>
                                <div className="textDiv">
                                    <h5 className="p-0">Secure Payment</h5>
                                    <p className="m-0">For orders over $150</p>
                                </div>
                            </div>
                        </div>
                        {/* <ProductDetailsSidebar></ProductDetailsSidebar> */}
                    </div>  
                </div>
            </div>

            <div className="relatedProducts pt-2 pb-4">
                <br />
                {
                    context?.mostPopular?.products?.length !== 0 &&
                    <section className="homeProducts homeProductsSection2 pt-0"> 
                        <RelatedProductSliderContainer products={relatedProducts} title={"Most Popular Items"}></RelatedProductSliderContainer>
                    </section>
                }
            </div>
        </div>
    )
}

export default ProductDetails;