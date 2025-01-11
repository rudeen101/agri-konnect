import React from "react";
import "./topProduct.css";
import food from "../../../assets/images/food.jpg";



const TopProduct = (props) =>{
    return(
        <>
            <div className="topSellingContainer container-fluid ">
                <h3>{props.title}</h3>

                <div className="items d-flex align-items-center">
                        <div className="img">
                            <a href="#"> <img src={food} className="w-100"/></a>
                        </div>
                 
                    <div className="info px-3">
                        <a href="#"><h4>Nistle Original Coffe-mate Coffee Creamer</h4></a>
                        {/* <Rating></Rating> */}
                        <div className="d-flex align-items-center">
                            <span className="price text-success font-weight-bold">$28.95</span><span className="oldPrice">$32.8</span>
                        </div>
                    </div>
                </div>
                <div className="items d-flex align-items-center">
                        <div className="img">
                            <a href="#"> <img src={food} className="w-100"/></a>
                        </div>
                 
                    <div className="info px-3">
                        <a href="#"><h4>Nistle Original Coffe-mate Coffee Creamer</h4></a>
                        {/* <Rating></Rating> */}
                        <div className="d-flex align-items-center">
                            <span className="price text-success font-weight-bold">$28.95</span><span className="oldPrice">$32.8</span>
                        </div>
                    </div>
                </div>
                <div className="items d-flex align-items-center">
                        <div className="img">
                            <a href="#"> <img src={food} className="w-100"/></a>
                        </div>
                 
                    <div className="info px-3">
                        <a href="#"><h4>Nistle Original Coffe-mate Coffee Creamer</h4></a>
                        {/* <Rating></Rating> */}
                        <div className="d-flex align-items-center">
                            <span className="price text-success font-weight-bold">$28.95</span><span className="oldPrice">$32.8</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopProduct;