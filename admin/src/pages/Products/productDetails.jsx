import React from "react";
import "./products.css";
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

const ProductDetails = () => {
    const [progress, setProgress] = React.useState(80);

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
                                <Slider {...productSliderOptions} className="heroSlider">
                                    <div className="item">
                                        <img src={product2} alt="Farm product" className="w-100"/>
                                    </div>
                                </Slider>

                                <Slider {...productSliderSmOptions} className="smallSlider d-flex justify-content-between">
                                    <div className="item">
                                        <img src={product2} alt="Farm product" className="w-100"/>
                                    </div>
                                    <div className="item">
                                        <img src={product2} alt="Farm product" className="w-100"/>
                                    </div>
                                    <div className="item">
                                        <img src={product2} alt="Farm product" className="w-100"/>
                                    </div>
                                    <div className="item">
                                        <img src={product2} alt="Farm product" className="w-100"/>
                                    </div>
                                    <div className="item">
                                        <img src={product2} alt="Farm product" className="w-100"/>
                                    </div>
                                </Slider>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className=" detailsWrapper pt-3 pb-3 pl-4 pr-4">
                                <h6 className="mb-3">Product Details</h6>

                                <h4>Organic friuts your body needs for helathy leaving.</h4>

                                <div className="productInfo mt-3">
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Brand</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>Agri-biz</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Brand</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>Agri-biz</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Category</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>Fruits</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Tags</span>
                                        </div>
                                        <div className="col-sm-9 d-flex"> :
                                        <span>
                                                <ul className="list list-inline tags sml">
                                                    <li className="list-inline-item">
                                                        <span>SUIT</span>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <span>SMART</span>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <span>MAN</span>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <span>CLOTHES</span>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <span>PARTY</span>
                                                    </li>
                                                </ul>
                                        </span>
                                        </div>
                                    </div>
                                    <div className="row">
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
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Size</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>Medium</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Price</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>100.00</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Stock</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>Agri-biz</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Review</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>Agri-biz</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark /></span>
                                            <span className="name">Published</span>
                                        </div>
                                        <div className="col-sm-9">
                                          <span>07 Jul 2024</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="productDescription">
                        <h4 className="mt-3">Product Description</h4>

                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente ipsa ratione fuga deleniti, neque cupiditate unde! Iure facilis itaque tempora non quasi, quis amet alias est, nulla eveniet, aperiam dolorum.
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint numquam nulla quaerat quam voluptatum, commodi aliquid nihil eligendi ea ad quae tempore, dolorum itaque consectetur! Laudantium porro mollitia neque ut.
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Provident nulla at voluptas nisi sequi minima consectetur expedita facilis? Earum totam pariatur vel, incidunt modi tempore corrupti laboriosam fugiat dolor accusamus.
                        </p>

                        <h6>Rating Analytics</h6>
                        
                        <div className="ratingSection">
                            <div className="ratingRow d-flex align-items-center">
                                <span className="col1">5 star </span>
                                <div className="col2">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "80%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">(22)</span> 
                            </div>
                            <div className="ratingRow d-flex align-items-center">
                                <span className="col1">4 star </span>
                                <div className="col2">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "75%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">(15)</span> 
                            </div>
                            <div className="ratingRow d-flex align-items-center">
                                <span className="col1">3 star </span>
                                <div className="col2">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "55%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">(10)</span> 
                            </div>
                            <div className="ratingRow d-flex align-items-center">
                                <span className="col1">2 star </span>
                                <div className="col2">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "35%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">(7)</span> 
                            </div>
                            <div className="ratingRow d-flex align-items-center">
                                <span className="col1">1 star </span>
                                <div className="col2">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style={{width: "75%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="80"></div>
                                    </div>                            
                                </div>
                                <span className="col3">(5)</span> 
                            </div>
                        </div>

                        <br />

                        <h5 className="mt-4 mb-4">Customer review</h5>

                        <div className="reviewSection">
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
                            </form>
                        </div>
                    
                    </div>
                </div>
            </div>

            
        </>   
    )
}

export default ProductDetails;