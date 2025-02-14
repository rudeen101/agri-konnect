import React, {useEffect, useState, useRef} from "react";
import "./admin.css";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import food from "../../assets/images/food.jpg"
import product2 from "../../assets/images/product2.jpg"
import product3 from "../../assets/images/product3.jpg"
import product4 from "../../assets/images/product4.jpg"
import {MdBrandingWatermark } from "react-icons/md";
import LinearProgress from '@mui/material/LinearProgress';
import UserAvatarImg from "../../components/userAvatarImg/userAvatarImg";
import Avatar from "../../assets/images/rudeen.jpg";
import { Button, Rating } from "@mui/material/";
import { FaReply } from "react-icons/fa";
import { useParams,} from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api2";
import InnerImageZoom from 'react-inner-image-zoom';
import '../../innerImageZoom/style.css';



const AdminDetails = () => {
    const [progress, setProgress] = useState(80);
    const [productData, setProductData] = useState([]);
    const [zoomImage, setZoomImage] = useState([]);
    const [productReviews, setProductReviews] = useState([]);
    const [ratingDistribution, setRatingDistribution] = useState({});
    const [reviewsData, setReviewsData] = useState([]);

    const {id} = useParams();
    const zoomSlider = useRef();
    

    const productSliderOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrow: false
    };

    const productSliderSmOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
    };

    useEffect(() => {
        fetchDataFromApi(`/api/product/${id}/ratings`).then((res) =>{
            setRatingDistribution(res.ratingDistribution);
            setProductReviews(res)
        });
    }, [])


    useEffect(() => {
        window.scrollTo(0,0);
        fetchDataFromApi(`/api/product/${id}`).then((res) =>{
            setZoomImage(res.images[0])
            setProductData(res);
        });



    getAllReviews(id);
    // checkWishList(id)

    }, [id]);

    const getAllReviews = (productId) => {
        fetchDataFromApi(`/api/productReviews?productId=${productId}`).then((res) => {
            setReviewsData(res.data);
        })
    }

    const dateFormatter = (dateCreated) => {
        const date = new Date(dateCreated);

        const readableDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            // hour: "2-digit",
            // minute: "2-digit",
            // second: "2-digit",
            // timeZoneName: "short",
        });

        return readableDate;
    }

    const getInitials = (fullName) => {
        // Split the full name into an array of words
        const nameParts = fullName.split(' ');
        
        // Get the first letter of each part, and join them
        const initials = nameParts.map(name => name.charAt(0).toUpperCase()).join('');
        
        return initials;
    }

    const goto = (image, index) =>{
        setZoomImage(image);
        zoomSlider.current.slickGoTo(index);
    }

    return (
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4 res-coln">
                    <h5 className="mb-0">Product View</h5>

                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Home"
                        icon={<HomeIcon fontSize="small" />}
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Products"
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Product View"
                        />
                    </Breadcrumbs>
                </div>

                <div className="card productDetailsSection p-4 ">
                    <div className="row">
                        <div className="wrapper col-md-4 pt-3 pb-3 pl-4 pr-4">
                            <div className="sliderContainer">
                                <h6 className="mb-5">Product Gallery</h6>
                                {/* <Slider {...productSliderOptions} className="heroSlider">
                                    {
                                        productData?.images?.length !== 0 && productData?.images?.map((img, index) => {
                                            return (
                                                <div className="item" key={index}>
                                                    <img src={img} alt="Farm product" className="w-100"/>
                                                </div>
                                            )
                                        })
                                    }
                                    
                                </Slider> */}
                                <div className="heroSlider">
                                    <InnerImageZoom
                                        src={zoomImage}
                                        zoomType="hover"
                                        zoomScale={1.5}
                                        zoomPosition="original"
                                    />
                                </div>

                                <Slider {...productSliderSmOptions} className="smallSlider d-flex justify-content-between" ref={zoomSlider}>
                                    
                                    {
                                        productData?.images?.length !== 0 && productData?.images?.map((img, index) => {
                                           return (
                                                <div className="item" key={index}>
                                                    <img src={img} alt="Farm product" className="w-100" onClick={()=>goto(img, index)} />
                                                </div>
                                           )
                                        })
                                    }
                              
                                </Slider>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className=" detailsWrapper pt-3 pb-3 pl-4 pr-4">
                                <h6 className="mb-3">Product Details</h6>

                                <h4>{productData?.name}</h4>

                                <div className="productInfo mt-3">
                                    {/* <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Brand</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>Agri-biz</span>
                                        </div>
                                    </div> */}
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Brand</span>
                                        </div>
                                        <div className="col-sm-7 subCat">
                                          <span>{productData?.brand}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Category</span>
                                        </div>
                                        <div className="col-sm-7 subCat">
                                          <span>{productData?.catName}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Sub Category</span>
                                        </div>
                                        <div className="col-sm-7 subCat">
                                          <span >{productData?.subCat}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Tags</span>
                                        </div>
                                        <div className="col-sm-7 d-flex" subCat>
                                        <span>
                                            <ul className="list list-inline tags sml">
                                                {
                                                    productData?.tags?.length !== 0 && productData?.tags?.map((tag, index) => {
                                                        return (
                                                            <li className="list-inline-item subCat" key={index}>
                                                                <span>{tag?.name}</span>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </span>
                                        </div>
                                    </div>
                                    {/* <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Color</span>
                                        </div>
                                        <div className="col-sm-9 d-flex"> 
                                            <span>
                                                <ul className="list list-inline tags sml">
                                                    <li  className="list-inline-item">
                                                        <span>RED</span>
                                                    </li>
                                                    <li  className="list-inline-item">
                                                        <span>WHITE</span>
                                                    </li>
                                                    <li  className="list-inline-item">
                                                        <span>BLUE</span>
                                                    </li>
                                                </ul>
                                            </span>
                                        </div>
                                    </div> */}
                                    {/* <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Size</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>Medium</span>
                                        </div>
                                    </div> */}
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Price</span>
                                        </div>
                                        <div className="col-sm-7 subCat">
                                          <span>{productData?.price}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Stock</span>
                                        </div>
                                        <div className="col-sm-7 subCat">
                                          <span>{productData?.countInStock}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Rating</span>
                                        </div>
                                        <div className="col-sm-7 subCat">
                                          <span>{productData?.rating}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Review</span>
                                        </div>
                                        <div className="col-sm-7 subCat">
                                          <span>Agri-biz</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Published</span>
                                        </div>
                                        <div className="col-sm-7 subCat">
                                          <span>{dateFormatter(productData?.dateCreated)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="productDescription">
                        <h4 className="mt-3">Product Description</h4>

                        <p>
                        {productData?.description}
                        </p>

                        <br></br>

                        <h6 className="hd">Rating Analytics</h6>
                        
                        <div className="ratingSection mt-3">
                            <div className="ratingRow stastitics d-flex align-items-center">
                                <span className="name">Average Rating:</span>
                                <span className="value">{productReviews.averageRating}</span> 
                            </div>
                            <div className="ratingRow stastitics d-flex align-items-center">
                                <span className="name">Total Reviews Count:</span>
                                <span className="value">{productReviews.totalReviews}</span> 
                            </div>
                            <br></br>
                            
                            <h6 className="">Rating distribution</h6>
                            {
                                // ratingDistribution?.length !== 0 && 
                                Object.entries(ratingDistribution)
                                .sort(([a], [b]) => b - a) // Sort ratings from 5 → 1
                                .map(([stars, count]) => {
                                
                                    const percentage = productReviews?.totalReviews > 0 ? (count / productReviews?.totalReviews) * 100 : 0;


                                    return (
                                        <div className="ratingRow stastitics ratingDistribution d-flex align-items-center">
                                            <span className="col1 name">{stars} star </span>
                                            <div className="col2">
                                                <div class="progress"  style={{ height: "10px" }}>
                                                    <div class="progress-bar" role="progressbar" style={{width: `${percentage}`}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>                            
                                            </div>
                                            <span className="col3">{count}</span> 
                                        </div>
                                    )

                                    
                                })
                            }
                            {/* <div className="ratingRow stastitics ratingDistribution d-flex align-items-center">
                                <span className="col1 name">5 star </span>
                                <div className="col2">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "80%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">{productReviews.totalReviews.ratingDistribution["1"]}</span> 
                            </div>
                      
                            <div className="ratingRow stastitics ratingDistribution d-flex align-items-center">
                                <span className="col1 name">4 star </span>
                                <div className="col2 ">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "75%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">(15)</span> 
                            </div>
                            <div className="ratingRow stastitics ratingDistribution d-flex align-items-center">
                                <span className="col1 name">3 star </span>
                                <div className="col2">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "55%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">(10)</span> 
                            </div>
                            <div className="ratingRow stastitics ratingDistribution d-flex align-items-center">
                                <span className="col1 name">2 star </span>
                                <div className="col2">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "35%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">(7)</span> 
                            </div>
                            <div className="ratingRow stastitics  ratingDistribution d-flex align-items-center">
                                <span className="col1 name">1 star </span>
                                <div className="col2">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "75%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">(5)</span> 
                            </div> */}
                        </div>

                        <br />

                        <h5 className="mt-4 mb-4">Customer review</h5>

                        <div className="reviewSection">
                            {
                                reviewsData?.length !== 0 ? 
                                reviewsData?.map((review, index) => {
                                    return(
                                        <div className="reviewRow">
                                            <div className="row d-flex justify-content-between adminReviewsCard">
                                                <div className="col-sm-12 d-flex justify-content-between ">
                                                    <div className="myAccount userInfo">
                                                        <div className="d-flex align-items-center">
                                                            <div className="imageBox">
                                                                <div className="rounded-circle">
                                                                    <span className="initial">{getInitials(review?.customerName)}</span>
                                                                </div> 
                                                            </div>
                                                            <div className="info pl-2"> 
                                                                <h6>{review?.customerName}</h6>
                                                                <p>{dateFormatter(review?.dateCreated)}</p>
                                                            </div>
                                                        </div>
                                                        <Rating className="mt-3" nme="read-only" value={review.customerRating} readOnly></Rating>
                                                    </div>
                                                </div>
            
                                                <p className="pb-0">{review.review}</p>
                                                <div className="">
                                                    <Button className="btn-large btn-blue btn-big "><FaReply />Message Rudeen</Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                : <p>No Reviews found</p>
                            }
                        

                            {/* <div className="reviewRow response">
                                <div className="row d-flex justify-content-between">
                                    <div className="col-sm-12 d-flex justify-content-between">
                                        <div className="myAccount userInfo">
                                            <div className="d-flex align-items-center">
                                                <UserAvatarImg img={Avatar} lg={true} />
                                                <div className="info pl-2"> 
                                                    <h6>Rudeen Zarwolo</h6>
                                                    <span>30 minutes ago!</span>
                                                </div>
                                            </div>
                                            <Rating className="mt-3" nme="read-only" value={3.5} readOnly></Rating>
                                        </div>

                                    
                                        <div className="">
                                            <Button className="btn-large btn-blue btn-big "><FaReply />Reply</Button>
                                        </div>
                                    </div>

                                    <p className="pb-0">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat assumenda provident reiciendis temporibus ducimus aspernatur quis autem rem sint laboriosam unde totam iusto, obcaecati veniam incidunt explicabo illum quod repudiandae.
                                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam repudiandae quasi omnis assumenda vel, aliquam cum animi quia porro. Dolorum at asperiores sunt dicta reiciendis mollitia? Laboriosam eius modi itaque.
                                    </p>
                                </div>
                            </div>

                            <div className="reviewRow response">
                                <div className="row d-flex justify-content-between">
                                    <div className="col-sm-12 d-flex justify-content-between">
                                        <div className="myAccount userInfo">
                                            <div className="d-flex align-items-center">
                                                <UserAvatarImg img={Avatar} lg={true} />
                                                <div className="info pl-2"> 
                                                    <h6>Rudeen Zarwolo</h6>
                                                    <span>30 minutes ago!</span>
                                                </div>
                                            </div>
                                            <Rating className="mt-3" nme="read-only" value={3.5} readOnly></Rating>
                                        </div>

                                    
                                        <div className="">
                                            <Button className="btn-large btn-blue btn-big "><FaReply />Reply</Button>
                                        </div>
                                    </div>

                                    <p className="pb-0">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat assumenda provident reiciendis temporibus ducimus aspernatur quis autem rem sint laboriosam unde totam iusto, obcaecati veniam incidunt explicabo illum quod repudiandae.
                                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam repudiandae quasi omnis assumenda vel, aliquam cum animi quia porro. Dolorum at asperiores sunt dicta reiciendis mollitia? Laboriosam eius modi itaque.
                                    </p>
                                </div>
                            </div>
                            <div className="reviewRow">
                                <div className="row d-flex justify-content-between">
                                    <div className="col-sm-12 d-flex justify-content-between">
                                        <div className="myAccount userInfo">
                                            <div className="d-flex align-items-center">
                                                <UserAvatarImg img={Avatar} lg={true} />
                                                <div className="info pl-2"> 
                                                    <h6>Rudeen Zarwolo</h6>
                                                    <span>30 minutes ago!</span>
                                                </div>
                                            </div>
                                            <Rating className="mt-3" nme="read-only" value={3.5} readOnly></Rating>
                                        </div>

                                    
                                        <div className="">
                                            <Button className="btn-large btn-blue btn-big "><FaReply />Reply</Button>
                                        </div>
                                    </div>

                                    <p className="pb-0">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat assumenda provident reiciendis temporibus ducimus aspernatur quis autem rem sint laboriosam unde totam iusto, obcaecati veniam incidunt explicabo illum quod repudiandae.
                                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam repudiandae quasi omnis assumenda vel, aliquam cum animi quia porro. Dolorum at asperiores sunt dicta reiciendis mollitia? Laboriosam eius modi itaque.
                                    </p>
                                </div>
                            </div>  

                            <br />

                            <h6 className="mt-4 mb-4">Review Reply Form</h6>

                            <form className="reviewForm"> 
                                <textarea name="" id="" placeholder="Write here"></textarea>

                                <Button className="btn-blue btn-big btn-large w-100 mt-4">Drop your replies</Button>
                            </form> */}
                        </div>
                    
                    </div>
                </div>
            </div>

            
        </>   
    )
}

export default AdminDetails;