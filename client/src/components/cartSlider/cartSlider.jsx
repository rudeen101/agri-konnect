import React, { useState } from "react";
import "./cartSlider.css";
import food from "../../assets/images/food.jpg";
import image from "../../assets/images/image1.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CartSlider = () => {
    const [itemImage, setItemImage] = useState([
        '#ffceb',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#fff3ff',
        '#f2fce4',
        '#feefea',
        '#ecffec',
        '#feefea',
        '#fff3ff',
        '#f2fce4',
        '#feefea',
        '#fffceb',
        '#feefea',
        '#ecffce'
    ]);

    const settings ={
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 2,
        arrows: true

    }; 

    return( 
            <>
                <div className="cartSliderSection">
                    <div className="container-fluid">
                        <h4 className="hd m-0">Top Categories</h4>
                        <br></br>
                        <Slider {...settings} className="cart_slider_main">
                            {
                                itemImage.length !== 0 && itemImage.map((item, index) => {
                                    return (
                                        <div className="item">
                                            <div className="cartInfo" style={{background: item}}>
                                                <img src={food}/>
                                                <h5>Cake and Milk</h5>
                                                <p>27 items</p>
                                            </div>                         
                                        </div>
                                    )
                                })
                            }
                            {/* <div className="item">
                                <div className="cartInfo">
                                    <img src={food}/>
                                    <h5>Cake and Milk</h5>
                                    <p>27 items</p>
                                </div>                         
                            </div>
                            <div className="item">
                                <div className="cartInfo">
                                    <img src={food}/>
                                    <h5>Cake and Milk</h5>
                                    <p>26 items</p>
                                </div>                         
                            </div>
                            <div className="item">
                                <div className="cartInfo">
                                    <img src={image}/>
                                    <h5>Cake and Milk</h5>
                                    <p>26 items</p>
                                </div>                         
                            </div>
                            <div className="item">
                                <div className="cartInfo">
                                    <img src={food}/>
                                    <h5>Cake and Milk</h5>
                                    <p>26 items</p>
                                </div>                         
                            </div>
                            <div className="item">
                                <div className="cartInfo">
                                    <img src={food}/>
                                    <h5>Cake and Milk</h5>
                                    <p>26 items</p>
                                </div>                         
                            </div>
                            <div className="item">
                                <div className="cartInfo">
                                    <img src={food}/>
                                    <h5>Cake and Milk</h5>
                                    <p>26 items</p>
                                </div>                         
                            </div>
                            <div className="item">
                                <div className="cartInfo">
                                    <img src={food}/>
                                    <h5>Cake and Milk</h5>
                                    <p>26 items</p>
                                </div>                         
                            </div>
                            <div className="item">
                                <div className="cartInfo">
                                    <img src={food}/>
                                    <h5>Cake and Milk</h5>
                                    <p>26 items</p>
                                </div>                         
                            </div>
                            <div className="item">
                                <div className="cartInfo">
                                    <img src={food}/>
                                    <h5>Cake and Milk</h5>
                                    <p>26 items</p>
                                </div>                         
                            </div>
                            <div className="item">
                                <div className="cartInfo">
                                    <img src={food}/>
                                    <h5>Cake and Milk</h5>
                                    <p>26 items</p>
                                </div>                         
                            </div> */}
                        </Slider>
                    </div>
                </div>
          
        </>    
    )
}

export default CartSlider;