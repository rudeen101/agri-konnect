import React, {useContext, useState, useEffect} from "react";
import "./product.css";
import food from "../../assets/images/food.jpg";
import { Button, Rating } from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareIcon from '@mui/icons-material/Share';
import { MyContext } from "../../App";
import { Link } from "react-router-dom";

const ProductCard = (props) =>{
    const [productData, setProductData] = useState([]);
    const [isAdded, setIsAdded] = useState(false);

    const context = useContext(MyContext);

    useEffect(() => {
        setProductData(props.data);
    }, [props.data])

    const setProductCat =() => {
        sessionStorage.setItem("parentCat", productData.parentName);
        sessionStorage.setItem("subCatName", productData.subCatName);
    }

    const addToCart = (item) => {
        context.addToCart(item);
        setIsAdded(true);
    }

    return (

        <div className="productCard">
            {/* { 
                props.tag !== null && props.tag !== undefined &&
                <span className={`badge ${props.tag}`}>{props.tag}</span>
            } */}

            {
                productData !== undefined &&
                <>
                    <Link to={`/product/${productData._id}`}>
                        <div className="imageWrapper">
                            <img src={productData?.images?.[0]} className="w-100" />
                            <div className="overlay transition">
                                <ul className="list list-inline mb-0">
                                    <li className="list-inline-item">
                                        <a href="#" className="cursor"> 
                                            <FavoriteBorderOutlinedIcon/>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="#" className="cursor"> 
                                            <ShareIcon></ShareIcon>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Link>

                    <div className="cardInfo">
                        <span className="d-block productName">{productData?.subCat}</span>
                        <h5 className="title">{productData?.name?.substr(0, 50) + "..."}</h5>
                        <div className="ratingContainer d-flex align-items-center">
                            <Rating className="rating" name="half-rating-read" value={parseFloat(productData?.rating)} precesion={0.5} readOnly /> 
                            <span className="ratingNumber">(3.5)</span>
                        </div>
                        <span className="brand d-block">By <a className="bgsuccess">{productData?.brand}</a></span>

                        <div className="d-flex priceContainer align-items-center justify-content-between mt-3">
                            <div className="d-flex align-itemes-center">
                                <span className="price"> {productData?.price} 
                                    <span className="oldPrice">{productData?.oldPrice}</span>  
                                </span>
                            </div>

                            <Button className="ml-auto transition d-flex align-items-center" onClick={() => addToCart(productData)}>
                                <ShoppingCartOutlinedIcon />
                                {
                                    isAdded === true ? 'Added' : "Add"
                                }
                            </Button>
                        </div>
                    </div>
                </>    
            }  
        </div>
    )
}

export default ProductCard;