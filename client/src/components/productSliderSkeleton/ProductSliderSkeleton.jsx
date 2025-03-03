import React from "react";
import Slider from "react-slick";
import { Card, CardContent } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Slider settings
const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

// Skeleton Loader Component
const ProductCardSkeleton = () => {
    return (
        <Card className="product-card skeleton-card">
            <Skeleton variant="rectangular" width="100%" height={120} />
            <CardContent>
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="50%" height={20} />
            </CardContent>
        </Card>
    );
};

// Slider Wrapper for Skeleton Loaders
const ProductSliderSkeleton = () => {
    return (
        <Slider {...sliderSettings}>
            {[...Array(6)].map((_, index) => (
                <div key={index}>
                    <ProductCardSkeleton />
                </div>
            ))}
        </Slider>
    );
};

export default ProductSliderSkeleton;
