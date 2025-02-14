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
import { fetchDataFromApi, postData } from "../../utils/api";

import { MdFavorite } from "react-icons/md"; 
import { MdFavoriteBorder } from "react-icons/md";

const ProductDetails = () =>{

    const [zoomImage, setZoomImage] = useState(food);
    const [bigImageSize, setBigImageSize] = useState([1500, 1500]);
    const [smallImageSize, setSmallImageSize] = useState([150, 150]);
    const [activeStatus, setActiveStatus] = useState(0);
    // const [addToCart, setAddToCart] = useState(0);
    const [minusFromCart, setMinusFromCart] = useState(0);
    const [activeTabs, setActiveTabs] = useState(2)
    const [modalShow, setModalShow] = React.useState(false);
    const [currentProduct, setCurrentProduct] = React.useState([]);
    const [selectedProductData, setSelectedProductData] = React.useState([]);
    const [productQuantity, setProductQuantity] = React.useState();
    const [cartFields, setCartFields] = React.useState({});
    const [reviewsData, setReviewsData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [addedToWishList, setAddedToWishList] = React.useState(false);
    
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

    const quantity = (value) => {
        setProductQuantity(value)
    }

    const selectedItem = () => {}

    const addToCart = () => {
        const user = JSON.parse(localStorage.getItem("user"));

        cartFields.userId = user?.userId;
        cartFields.productId = currentProduct?._id;
        cartFields.price = currentProduct?.price;
        cartFields.productName = currentProduct?.name;
        cartFields.rating = currentProduct?.rating;
        cartFields.price = currentProduct?.price; 
        cartFields.subTotal = parseInt(currentProduct?.price * productQuantity); 
        cartFields.countInStock = currentProduct?.countInStock; 
        cartFields.image = currentProduct?.images[0];
        cartFields.quantity = productQuantity;

        context.addToCart(cartFields);
    }

    useEffect(() => {
        window.scrollTo(0,0);
            fetchDataFromApi(`/api/product/${id}`).then((res) =>{
            setCurrentProduct(res)

            fetchDataFromApi(`/api/product?subCatId=${res?.subCatId}`).then((res) =>{
                const filteredData = res?.products.filter(item => item.id !==  id);
                setSelectedProductData(filteredData);
            });   
        });

        getAllReviews(id);
        // checkWishList(id)

    }, [id]);

    const getAllReviews = (productId) => {
        fetchDataFromApi(`/api/productReviews?productId=${productId}`).then((res) => {
            setReviewsData(res.data);
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

                postData(`/api/productReviews/add?id=${id}`, reviews).then((res) => {
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
                    <div className="col-md-9 part1"> 
                        <div className="row">
                            <div className="col-md-6 sliderContainer">
                                <div className="productZoom">
                                    <InnerImageZoom zoomType="hover" zoomScale={2} src={zoomImage} />
                                </div>

                                <Slider {...settings} className="zoomSlider" ref={zoomSlider}>
                                    {
                                        currentProduct?.images?.length > 0 &&
                                        currentProduct?.images?.map((image, index) => {
                                            <div className="item" key={index}>
                                                <img src={image} alt="" className="w-100" onClick={()=>goto(index)} />
                                            </div>
                                        })
                                    }
                                </Slider>
                            </div>

                            <div className="col-md-6 productInfo">
                                <h1>{currentProduct?.name}</h1>
                                <div className="d-flex align-items-center ratingContainer">
                                    <Rating className="rating" name="half-rating-read" value={parseInt(currentProduct?.rating)} precission={0.4} readOnly />
                                    <div className="reviewNumber">({reviewsData?.length !== 0 && reviewsData.length} reviews)</div>
                                </div>

                                <div className="priceContainer d-flex align-items-center mb-3">
                                    <span className="text-g priceLarge mr-3">USD {currentProduct?.price}</span>

                                    <div className="ml-3 d-flex flex-column">
                                        <span className="discount">{currentProduct?.discount}% off</span>
                                        <span className="text-light oldPrice">USD {currentProduct?.oldPrice}</span>
                                    </div>
                               
                                </div>

                                <p>
                                    {currentProduct?.description}
                                    <span className="readMore"><a href="#">Read more</a></span>
                                </p>

                                <div className="productSize d-flex align-items-center">
                                    <span className="name">Size / Weight: </span><span className="size">{currentProduct?.productWeight}</span>
                                </div>

                                
                                <div className="additionalInfo">
                                    <div className="col1">
                                        <ul>
                                            <li>Type: <span className="value">Organic</span></li>
                                            <li>Published: <span className="value">Nov 7, 2024</span></li>
                                            <li>Days left: <span className="value">10</span></li>
                                        </ul>
                                    </div>
                                    <div className="col2">
                                        <ul>
                                            <li>Category: <span className="value">{currentProduct?.catName}</span></li>
                                            <li>Tags: <span className="value">cabbage, white, food</span></li>
                                            <li>In stock: <span className="value"><span>{currentProduct?.countInStock}</span> <span>{currentProduct?.packagingType}</span></span></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="addCartSection pt-4 pb-4 d-flex align-items-center">
                                    <div>
                                          <QuantityBox 
                                                value={1}
                                                item={currentProduct} 
                                                selectedItem={selectedItem}
                                                quantity={quantity}
                                            />
                                    </div>
                                 
                                    <Button className=" btn-lg addToCartBtn ml-3 btn-border move" onClick={() => (addToCart())}>
                                        <FavoriteBorderOutlinedIcon />
                                        {
                                            context.addingToCart === true ? "adding..." : "Add to Cart"
                                        }
                                    </Button>
                                    <Button className="btn-lg addToCart ml-3 btn-border move"><ShareOutlinedIcon /></Button>
                                    <Button className="btn-lg addToCart ml-3 btn-border move">
                                        <a href="#" className="cursor" onClick={() => addToWishList(productData)}> 
                                            {
                                                addedToWishList === true ? <MdFavorite/> : <MdFavoriteBorder />
                                            }
                                        </a>
                                    </Button>
                                </div>

                            </div>
                        </div>

                        <div className="">
                            <div className="card mt-5 mb-5 p-5 detailsPageTabs container-fluid">
                                <div className="customTabs">
                                    <ul className="list list-inline">
                                        <li className="list-inline-item">
                                            <Button className={`${activeTabs === 0 && 'active'}`} onClick={()=> setActiveTabs(0)}>Description</Button>
                                        </li>
                                        <li className="list-inline-item">
                                            <Button className={`${activeTabs === 1 && 'active'}`} onClick={()=> setActiveTabs(1)}>Additional info</Button>
                                        </li>
                                        <li className="list-inline-item">
                                            <Button className={`${activeTabs === 2 && 'active'}`} onClick={()=> setActiveTabs(2)}>Reviews ({reviewsData?.length !== 0 && reviewsData.length})</Button>
                                        </li>
                                        <li className="list-inline-item">
                                            <Button className={`${activeTabs === 3 && 'active'}`} onClick={()=> setActiveTabs(3)}>Business</Button>
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
                                    activeTabs === 1 &&
                                    <div className="tabCotent">
                                        <div className="table-responsive">
                                            <table class="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <th>Folded (w/o wheels)</th>
                                                        <td>
                                                            <p>3'5 *24"m (front to back wheel) </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Folded (w/o wheels)</th>
                                                        <td>
                                                            <p>3'5 *24"m (front to back wheel) </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Folded (w/o wheels)</th>
                                                        <td>
                                                            <p>3'5 *24"m (front to back wheel) </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Folded (w/o wheels)</th>
                                                        <td>
                                                            <p>3'5 *24"m (front to back wheel) </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Folded (w/o wheels)</th>
                                                        <td>
                                                            <p>3'5 *24"m (front to back wheel) </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Folded (w/o wheels)</th>
                                                        <td>
                                                            <p>3'5 *24"m (front to back wheel) </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                } 

                                {
                                    activeTabs === 2 &&
                                    <div className="tabContent">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <h3>Customers questions & answers</h3>
                                                <br />

                                                <div className="reviewsScroll">
                                                    {
                                                        reviewsData?.length !== 0 && reviewsData?.map((review, index) => {
                                                            return(
                                                                <div className="card p-3 reviewsCard flex-row w-100">
                                                                    <div className=" left-container text-center">
                                                                        <div className="imageBox">
                                                                            <div className="rounded-circle">
                                                                                <span className="initial">RZ</span>
                                                                            </div> 
                                                                        </div>
                                                                    
                                                                        <span className="text-g d-block font-weight-bold">
                                                                            {review?.customerName}
                                                                        </span>
                                                                    </div>
                
                                                                    <div className="info rightContainer">
                                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                                            <h5 className="">{review.dateCreated?.split("T")[0]}</h5>
                
                                                                            <div className="ml-auto">
                                                                                <Rating name="half-rating-read" value={review.customerRating} precission={0.5} readOnly />
                                                                            </div>
                                                                        </div>
                                                                        <p>{review?.review}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <br /> <br />

                                                <form className="reviewForm" onSubmit={addReview}>
                                                    <h4>Add a review</h4>

                                                    <div className="form-group">
                                                        <textarea 
                                                            name="review" 
                                                            className="form-control" 
                                                            placeholder="write a review"
                                                            onChange={(e) => {
                                                                setReviews(() => ({
                                                                    ...reviews,
                                                                    [e.target.name]: e.target.value
                                                    
                                                                }));
                                                            }}
                                                        />
                                                    </div>

                                                    {/* <br />

                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" placeholder="Name" />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <input type="email" className="form-control" placeholder="Email" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <br />

                                                    <div className="form-group">
                                                        <input type="text" className="form-control" placeholder="website"/>
                                                    </div> */}

                                                    <Rating 
                                                        name="customerRating" 
                                                        className="mt-3 mb-2" 
                                                        value={reviews?.customerRating} 
                                                        precission={0.5}
                                                        onChange={(e) => {
                                                            setReviews(() => ({
                                                                ...reviews,
                                                                [e.target.name]: e.target.value
                                                            }));
                                                        }}
                                                    />
                                                    <br />
                                                    <br/>

                                                    <div className="form-group">
                                                       
                                                        <Button type="submit" className="btn-g bgn-lg p-1">{isLoading === true ? "Adding Review" : "Submit Review"}</Button>
                                                    </div>
                                                </form>
                                            </div>

                                            <div className="customerReviewContainer col-md-4">
                                                <h4>Customer review</h4>
                                                <div className=" reviewRating d-flex align-items-center">
                                                    <Rating name="half-rating-read" defaultValue={3.5} precission={0.5} readOnly />
                                                    <strong className="ml-3">4.8 out of 5</strong>
                                                </div>

                                                <br />

                                                <div className="progressBarBox d-flex align-items-center">
                                                    <span className="mr-3">5 star</span>
                                                    <div className="progress ml-3" style={{width: "70%", height: "13px"}}>
                                                        <div className="progress-bar bg-success" style={{width: "75%"}}>75%</div>
                                                    </div>
                                                </div>
                                                <div className="progressBarBox d-flex align-items-center">
                                                    <span className="mr-3">5 star</span>
                                                    <div className="progress ml-3" style={{width: "70%", height: "13px"}}>
                                                        <div className="progress-bar bg-success" style={{width: "60%"}}>60%</div>
                                                    </div>
                                                </div>
                                                <div className="progressBarBox d-flex align-items-center">
                                                    <span className="mr-3">3 star</span>
                                                    <div className="progress ml-3" style={{width: "70%", height: "13px"}}>
                                                        <div className="progress-bar bg-success" style={{width: "55%"}}>55%</div>
                                                    </div>
                                                </div>
                                                <div className="progressBarBox d-flex align-items-center">
                                                    <span className="mr-3">2 star</span>
                                                    <div className="progress ml-3" style={{width: "70%", height: "13px"}}>
                                                        <div className="progress-bar bg-success" style={{width: "35%"}}>35%</div>
                                                    </div>
                                                </div>
                                                <div className="progressBarBox d-flex align-items-center">
                                                    <span className="mr-3">1 star</span>
                                                    <div className="progress ml-3" style={{width: "70%", height: "13px"}}>
                                                        <div className="progress-bar bg-success" style={{width: "25%"}}>25%</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                    </div>  
                </div>
            </div>

            <div className="container-fluid relatedProducts pt-5 pb-4">
                <h4>Related products</h4>
                <br />
                <Slider {...relatedProductSlider} className="productSlider" >
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
                </Slider>
            </div>
        </div>
    )
}

export default ProductDetails;