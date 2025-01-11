import React from "react";
import "./index.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import image1 from "../../../assets/images/image1.jpg"
import image2 from "../../../assets/images/image2.jpg"
import image3 from "../../../assets/images/images3.jpg"
import fruit1 from "../../../assets/images/fruit1.png"
import fruit2 from "../../../assets/images/fruit2.png"
import fruit3 from "../../../assets/images/fruit3.png"
import { Button } from "@mui/material";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


const HomeSlider = () =>{
    
    const settings ={
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 8000,
        cssEase: "linear"
    }; 

    return(
        <section className="homeSlider">
            <div className="position-relative">
                <Slider {...settings} className="home_slider_main" >
                    <div className="item">
                        <div className="sliderInfo">
                            <h6>FROM FARM TO TABLE</h6>
                            <h2 className="mb-3">
                                Don't miss our amazing <br/>
                                grocery deals
                            </h2>
                            <p>
                                Money back guarantee after 2 days
                            </p>
                            <Button className="mt-3 sliderButton">Shop Now <ArrowRightAltIcon /></Button>
                        </div>
                        <div className="sliderImage">
                            <img src={fruit1}  className=""/>
                        </div>

                    </div>
                    <div className="item">
                        <div className="sliderInfo">
                            <h6>FROM FARM TO TABLE</h6>
                            <h2 className="mb-3">
                                Don't miss our amazing <br/>
                                grocery deals
                            </h2>
                            <p>
                                Money back guarantee after 2 days
                            </p>
                            <Button className="mt-3 sliderButton">Shop Now <ArrowRightAltIcon /></Button>
                        </div>
                        <div className="sliderImage">
                            <img src={fruit2}  className=""/>
                        </div>

                    </div>
                    <div className="item">
                        <div className="sliderInfo">
                            <h6>FROM FARM TO TABLE</h6>
                            <h2 className="mb-3">
                                Don't miss our amazing <br/>
                                grocery deals
                            </h2>
                            <p>
                                Money back guarantee after 2 days
                            </p>
                            <Button className="mt-3 sliderButton">Shop Now <ArrowRightAltIcon /></Button>
                        </div>
                        <div className="sliderImage">
                            <img src={fruit3}  className=""/>
                        </div>

                    </div>
               
                </Slider>
                {/* <div className="newsLetterBanner">
                    <FavoriteBorderOutlinedIcon />
                    <input type="text" placeholder="Enter your email" />
                    <Button className="bg-success">Subscribe</Button>
                </div> */}
            </div>
        </section>
    )
}

export default HomeSlider;