import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeProductCard from "../product/homeProductCard";
import ProductSliderSkeleton from "../productSliderSkeleton/ProductSliderSkeleton";
import "./RelatedProducts.css";
import{ Link, useParams } from "react-router-dom";


const RelatedProductSliderContainer = ({ products, title }) => {

    console.log("---", products);

    // Show loading message if products are not yet loaded
    if (!products) {
        return  <div className="">
            <div className="">
            <h4>Related products</h4>            
                <div className="rw">
                    <div className="col-md-12">
                    <ProductSliderSkeleton></ProductSliderSkeleton>
                    </div>
                </div>    
            </div>
        </div>   
        
    }
    
    //    Slider settings
            const sliderSettings = {
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 4,
                slidesToScroll: 1,
                responsive: [
                    {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                    },
                    {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                    },
                    {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                    }
                ]
            };

        //    Slider settings
    //    const sliderSettings = {
    //     dots: true,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: Math.min(4, products.length), // Adjust slides dynamically
    //     slidesToScroll: 1,
    //     variableWidth: true, // Allows slides to take their own width
    //     responsive: [
    //         { breakpoint: 1024, settings: { slidesToShow: Math.min(4, products.length) } },
    //         { breakpoint: 768, settings: { slidesToShow: Math.min(2, products.length) } },
    //         { breakpoint: 480, settings: { slidesToShow: Math.min(1, products.length) } }
    //     ]
    // };

    return (
        // <div className="related-products-section">
        //     <div className="container-fluid">
        //         <h4>Related Products</h4>            
        //         <div className="">
        //             <div className="row">
        //                 <div className="col-md-12 p-2">
        //                     <Slider {...sliderSettings} className="productSlider">
        //                         {
        //                             products?.length !== 0 && products?.map((product, index) => {

        //                                 return (
        //                                     <div className="item"  key={index}>
        //                                         <HomeProductCard productData={product}></HomeProductCard>
        //                                     </div>
        //                                 )
        //                             })
        //                         }
        //                     </Slider>
        //                 </div>
                    
        //             </div>    
        //         </div>
        //     </div>
        // </div>   
        
        <div className="related-products-section">
            <div className="container-fluid">
                <div className="section-header">
                    <h2 className="section-title">You May Also Like</h2>
                    {/* <Link to={`/category/${relatedCategoryId}`} className="view-all-link"> */}
                    <Link to={`/category/`} className="view-all-link">
                        View All <span className="arrow-icon">→</span>
                    </Link>
                </div>

                <div className="products-slider-container">
                    {products?.length > 1 ? (
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
                    ) : (
                        <div className="no-products-message">
                            <img src="/images/no-products.svg" alt="No related products" />
                            <p>No related products available at the moment</p>
                        </div>
                    )}
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






