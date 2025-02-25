import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./productSlider.css"; // Ensure you have a CSS file for styling
import { fetchDataFromApi, postDataToApi } from "../../utils/apiCalls";



const ProductsSlider = ({ subCatId }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        fetchDataFromApi(`/api/product?subCatId=${subCatId}`).then((res) =>{
            console.log("related", res);
            setRelatedProducts(res.products);
        }); 
    }, [subCatId]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <div className="product-slider">
            <h3>Related Products</h3>
            <Slider {...settings}>
                {relatedProducts.map(product => (
                    <div key={product._id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <h4>{product.name}</h4>
                        <p>${product.price}</p>
                        <button>Add to Cart</button>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductsSlider;
