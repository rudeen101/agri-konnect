import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeProductCard from "../product/homeProductCard";
import ProductSliderSkeleton from "../productSliderSkeleton/ProductSliderSkeleton";

const RelatedProductSliderContainer = ({ products, title }) => {

    // Show loading message if products are not yet loaded
    if (!products) {
        return  <div className="container-fluid">
            <div className="wrapper card productCardContainer">
            <h4>Related products</h4>            
                <div className="row">
                    <div className="col-md-12">
                    <ProductSliderSkeleton></ProductSliderSkeleton>
                    </div>
                
                </div>    
            </div>
        </div>   
        
    }
    
       // Slider settings
       const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(6, products.length), // Adjust slides dynamically
        slidesToScroll: 1,
        variableWidth: true, // Allows slides to take their own width
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: Math.min(4, products.length) } },
            { breakpoint: 768, settings: { slidesToShow: Math.min(2, products.length) } },
            { breakpoint: 480, settings: { slidesToShow: Math.min(1, products.length) } }
        ]
    };

    return (
        <div className="container-fluid">
                        <h4>Related Products</h4>            

            <div className="wrapper card productCardContainer">
                <div className="row">
                    <div className="col-md-12 p-2">
                        <Slider {...sliderSettings} className="productSlider">
                            {
                                products?.length !== 0 && products?.map((product, index) => {

                                    return (
                                        <div className="item"  key={index}>
                                            <HomeProductCard productData={product}></HomeProductCard>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                 
                </div>    
            </div>
        </div>    
    );
};

// Example Usage
// const products = [
//     { name: "Product 1", image: "https://via.placeholder.com/500" },
//     // Add more products here if needed
// ];

// export default function App() {
//     return <ProductSlider products={products} />;
// }

export default RelatedProductSliderContainer;

