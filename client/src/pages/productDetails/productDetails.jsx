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


const ProductDetails = ({userId}) =>{

    const [zoomImage, setZoomImage] = useState("");
    const [bigImageSize, setBigImageSize] = useState([1500, 1500]);
    const [smallImageSize, setSmallImageSize] = useState([150, 150]);
    const [activeStatus, setActiveStatus] = useState(0);
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
    const [inCart, setInCart] = useState(false);
    
        
    const [reviews, setReviews] = useState({
        review: "",
        customerRating: 1,
        customerId: "",
        customerName: "",
        productId: "",
    })
    
    const {id} = useParams();
    const context = useContext(MyContext);
    const zoomSlider = useRef();
    const user = JSON.parse(localStorage.getItem("user"));


    const settings ={
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        fade: false,
        arrows: true
    }; 

    const relatedProductSlider ={
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        fade: false,
        arrows: true
    }; 

    const goto = (image, index) =>{
        setZoomImage(image);
        zoomSlider.current.slickGoTo(index);
    }

    const isActive = (status) => {
        setActiveStatus(status)
    }

    // const quantity = (value) => {
    //     setProductQuantity(value)
    // }

    const selectedItem = () => {}

    const addToCart = () => {
        const user = JSON.parse(localStorage.getItem("user"));

        cartFields.userId = user?.userId;
        cartFields.productId = productData?._id;
        cartFields.price = productData?.price;
        cartFields.productName = productData?.name;
        cartFields.rating = productData?.rating;
        cartFields.price = productData?.price; 
        cartFields.subTotal = parseInt(productData?.price * productQuantity); 
        cartFields.countInStock = productData?.countInStock; 
        cartFields.image = productData?.images[0];
        cartFields.quantity = productQuantity;

        context.addToCart(cartFields);
    }

    useEffect(() => {
        window.scrollTo(0,0);
        fetchDataFromApi(`/api/product/${id}`).then((res) =>{
            setProductData(res);
            console.log("product", res)
            setZoomImage(res.images[0])
        });

        getAllReviews(id);
        // checkWishList(id)

    }, [id]);

    useEffect(() => {
        fetchDataFromApi(`/api/cart`).then((res) => {
            console.log("cartData",res.products)
            setInCart(res.products.some(item => item.productId._id === productData._id));
        })
    }, [context?.isLogin]);

    const getAllReviews = (productId) => {
        fetchDataFromApi(`/api/productReviews/${productId}`).then((res) => {
            setReviewsData(res);
        })
    }

    const addReview = (e) => {
        e.preventDefault();

        setIsLoading(true)
        if (context.isLogin === true) {
            if (reviews?.review === "") {
                context?.setAlertBox({
                    open: true,
                    error: true,
                    msg: "You must enter review!"
                });
                return false;
            } else{

                reviews.customerId = user?.userId;
                reviews.customerName = user?.username;
                reviews.productId = id;

                postDataToApi(`/api/productReviews/add?id=${id}`, reviews).then((res) => {
                    if (res) {
                        setIsLoading(false)
                        getAllReviews(id);
                    }
                })
            }
        } else{
            context?.setAlertBox({
                open: true,
                error: true,
                msg: "You must login first!"
            });
        }
    }

    const handleQuantityChange = (newQuantity, productId) => {
        setQuantity(newQuantity);
    };

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
                    quantity: quantity
                }
    
                postDataToApi(`/api/cart/add`, cartData)
                .then((res) => {
                    setInCart(true);
                });
            }
        };



    // const plus = () => {
    //     setAddToCart(addToCart++);
    // }

    // const minus = () => {
    //     setMinusFromCart(minusFromCart--);
    // }

    return (
        <div className="productDetails">
            <div className="breadcrumbWrapper">
                <div className="container-fluid">
                    <ul className="breadcrum breadcrumb2 mb-0">
                        <li><Link>Home</Link></li>
                        <li><Link>Vegetabels & Tubers</Link></li>
                        <li><Link>Seeds of Change Organic</Link></li>
                    </ul>
                </div>
            </div>

            <div className="container-fluid detailsContainer pt-4 pb-3">
                <div className="row">
                    <div className="col-md-9 part1 card"> 
                        <div className="row">
                            <div className="col-md-6 ">
                                <ProductImageSlider images={productData?.images}></ProductImageSlider>
                            </div>                       

                            <div className="col-md-6 productInfo">
                                <h1>{productData?.name}</h1>
                                <div className="d-flex align-items-center ratingContainer">
                                    <Rating className="rating" name="half-rating-read" value={parseInt(productData?.rating)} precission={0.4} readOnly />
                                    <div className="reviewNumber">({reviewsData?.reviews?.length !== 0 && reviewsData?.reviews?.length} reviews)</div>
                                </div>
                                <div className="brand">Business Name: <span >{productData?.brand}</span></div>
                                <hr></hr>


                                <div className="priceContainer d-flex align-items-center mb-3">
                                    <span className="text-g priceLarge mr-3">USD {productData?.price}</span>

                                    <div className="ml-3 d-flex flex-column">
                                        <span className="discount">{productData?.discount}% off</span>
                                        <span className="text-light oldPrice">USD {productData?.oldPrice}</span>
                                    </div>
                               
                                </div>

                                <p>
                                    {productData?.description}
                                    <span className="readMore"><a href="#">Read more</a></span>
                                </p>

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
                                       <Button onClick={handleCartToggle} className={`w-100 addToCartBtn ml-3  cartBtn ${inCart ? "active" : ""}`}>
                                        <IoCartOutline className="cartIcon" /> &nbsp;
                                        {inCart ? "Added to Cart" : "Add to Cart"}
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
                                            <Button className={`${activeTabs === 2 && 'active'}`} onClick={()=> setActiveTabs(2)}>Reviews ({reviewsData?.length !== 0 && reviewsData.length})</Button>
                                        </li>
                                        <li className="list-inline-item">
                                            <Button className={`${activeTabs === 3 && 'active'}`} onClick={()=> setActiveTabs(3)}>Business Details</Button>
                                        </li>
                                    </ul>
                                </div>

                                <br />

                                {
                                    activeTabs === 0 &&
                                    <div className="tabContent">
                                        <p>
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempore officiis, possimus alias non incidunt ullam sunt ab voluptatum? Modi, amet magnam! Consectetur eveniet incidunt aspernatur alias? Voluptas cum enim magnam.
                                        </p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, numquam nam fuga quia cum corporis inventore dolore corrupti accusamus soluta velit. Obcaecati quia harum assumenda dolorem placeat earum voluptatem atque.</p>
                                    
                                        <br />

                                        <h4>Packaging & Delivery</h4>
                                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam quos doloremque minus nostrum quod accusamus fugit consequuntur iste quia soluta tenetur asperiores, laboriosam animi iusto sunt neque dolore. Error, iste?</p>
                                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium, error. Tenetur, iste quisquam! Error, dicta? Officiis rerum fugiat necessitatibus, placeat minima quae officia vel, atque eius sed exercitationem minus modi?</p>
                                        
                                        <br />

                                        <h4>Packaging & Delivery</h4>
                                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam quos doloremque minus nostrum quod accusamus fugit consequuntur iste quia soluta tenetur asperiores, laboriosam animi iusto sunt neque dolore. Error, iste?</p>
                                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium, error. Tenetur, iste quisquam! Error, dicta? Officiis rerum fugiat necessitatibus, placeat minima quae officia vel, atque eius sed exercitationem minus modi?</p>
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
                                        <p>
                                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempore officiis, possimus alias non incidunt ullam sunt ab voluptatum? Modi, amet magnam! Consectetur eveniet incidunt aspernatur alias? Voluptas cum enim magnam.
                                        </p>
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, numquam nam fuga quia cum corporis inventore dolore corrupti accusamus soluta velit. Obcaecati quia harum assumenda dolorem placeat earum voluptatem atque.</p>
                                    
                                        <br />          

                                        <h4>Packaging & Delivery</h4>
                                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam quos doloremque minus nostrum quod accusamus fugit consequuntur iste quia soluta tenetur asperiores, laboriosam animi iusto sunt neque dolore. Error, iste?</p>
                                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium, error. Tenetur, iste quisquam! Error, dicta? Officiis rerum fugiat necessitatibus, placeat minima quae officia vel, atque eius sed exercitationem minus modi?</p>
                                        
                                        <br />

                                        <h4>Packaging & Delivery</h4>
                                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam quos doloremque minus nostrum quod accusamus fugit consequuntur iste quia soluta tenetur asperiores, laboriosam animi iusto sunt neque dolore. Error, iste?</p>
                                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium, error. Tenetur, iste quisquam! Error, dicta? Officiis rerum fugiat necessitatibus, placeat minima quae officia vel, atque eius sed exercitationem minus modi?</p>
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

            <div className="container-fluid relatedProducts pt-5 pb-4">
                <h4>Related products</h4>
                <br />
                {/* <Slider {...relatedProductSlider} className="productSlider" >
                    {
                        selectedProductData?.length > 0 &&
                        selectedProductData?.map((product, index) => {
                            return (
                                <div className="item" key={index}>
                                    <div className="item">
                                        <ProductCard data={product} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </Slider> */}

                <ProductsSlider subCatId={productData?.subCatId}></ProductsSlider>
            </div>
        </div>
    )
}

export default ProductDetails;