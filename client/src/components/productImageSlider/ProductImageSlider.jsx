import React, { useEffect, useRef, useState} from "react";
import Slider from "react-slick";
import InnerImageZoom from "react-inner-image-zoom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import "./slider.css"; // Ensure you have a CSS file for styling


const ProductImageSlider = ({ images = [] }) => {
    const zoomSlider = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomImage, setZoomImage] = useState(images[0] || null);

    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 5000,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentIndex(newIndex);
            setZoomImage(images[newIndex]); // Auto-update zoomed image
        },
    };

    useEffect(() => {
        setZoomImage(images[0]);
    })

    return (
        <div className="product-slider-container">
            {/* Zoomed Image Section */}
            {zoomImage && (
                <div className="product-zoom">
                    <InnerImageZoom 
                        zoomType="hover" 
                        zoomScale={2} 
                        src={zoomImage} 
                        alt={`Zoomed product image ${currentIndex + 1}`}
                        className={zoomImage}
                    />
                </div>
            )}

            {/* Image Slider */}
            {images.length > 1 && (
                <Slider {...settings} className="zoom-slider" ref={zoomSlider}>
                    {images.map((image, index) => (
                        <div 
                            className={`slider-item ${index === currentIndex ? "active-slide" : ""}`} 
                            key={index}
                            onClick={() => {
                                setCurrentIndex(index);
                                setZoomImage(images[index]);
                                zoomSlider.current.slickGoTo(index);
                            }}
                        >
                            <img 
                                src={image} 
                                alt={`Product image ${index + 1}`} 
                                className="slider-image" 
                                loading="lazy" 
                            />
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default ProductImageSlider;
