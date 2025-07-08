import React from "react";
import "./index.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const HomeSlider = (props) =>{
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
                    {
                        props?.data?.data?.length > 0 &&
                        props?.data?.data?.map((item, index) => {
                            return (
                                <div className="item" key={index}>
                                    <div className="sliderImage">
                                        <img src={item?.images[0]} className="w-100" alt="banner image"></img>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Slider>
            </div>
        </section>
    )
}

export default HomeSlider;