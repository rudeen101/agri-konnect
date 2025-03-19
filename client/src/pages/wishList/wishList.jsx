import React, { useContext } from "react";
import "./wishList.css";
import { Link} from "react-router-dom";
import { Button, Rating } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import wishListImg from "../../assets/images/wishlist2.png";
import { MyContext } from "../../App";
import { FaHome } from "react-icons/fa";

const WishList = ({userId}) => {

    const context = useContext(MyContext);

    return (
        <>
            <div className="breadcrumbWrapper mb-4">
                <ul className="breadcrumb breadcrumb2 mb-0">
                    <li>
                        <Link to={"/"}>Home</Link>
                    </li>
                    <li>
                        <Link to={"#"}>Acccount</Link>
                    </li>
                    <li>
                        <Link to={"#"}>Wishlist</Link>
                    </li>
                </ul>
            </div>

            <section className="cartSection mb-5">
                <div className="container-fluid">
                    <div className="row">
                        <div className="listWrapper">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="left">
                                <p>You have <span className="text-g"><b>{context.wishlist?.items?.length ? context.wishlist?.items?.length : "0" }</b></span> item(s) in your wishlist</p>
                                    <h4 className="hd mb-0">Your Wishlist</h4>
                                </div>

                                {/* <span className="ml-auto clearCart d-flex align-items-center"><DeleteOutlineOutlinedIcon /> Clear Cart</span> */}
                            </div>
                            {
                                !context?.wishlist?.items ? (
                                    
                                    <div className="emptyCart mt-5 d-flex align-items-center justify-content-center flex-column">
                                        <img
                                            src={wishListImg}
                                            alt="cart image"
                                            width="150"
                                            hight="150px"
                                        />
                                        <h3>Your List is currently empty</h3>
                                        <br />

                                        <Link to={"/"}>
                                            <Button className="btn-g bg-g btn-lg btn-round">
                                                <FaHome /> &nbsp; Continue Shopping
                                            </Button>
                                        </Link>
                                    </div>
                                )
                                
                                : (
                                    <div className="cartWrapper">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead className="table-gray">
                                                    
                                                    <tr>
                                                        <th>Product</th>
                                                        <th>Price</th>
                                                        <th>Remove</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {
                                                        context?.wishlist?.items?.length !== 0 && context?.wishlist?.items?.map((item, index) => {
                                                            return(
                                                                <tr key={index}>
                                                                    <td width="70%">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="img">
                                                                                <Link to={`/product/${item.productId}`}>
                                                                                    <img src={item?.product?.images[0]} alt="" className="w-100" />
                                                                                </Link>
                                                                            </div>
                    
                                                                            <div className="info pl-4">
                                                                                <Link to={`/product/${item.productId}`}>
                                                                                    <h6>{item?.product?.name?.substr(0,100) + "..."}</h6>
                                                                                </Link>
                                                                                <div className="d-flex justify-items-center">
                                                                                    <Rating name="half-rating-read" value={parseFloat(item?.product?.rating)} precission={0.5} readOnly />
                                                                                    <span>({parseFloat(item?.product?.rating ? item?.product?.rating : 0)}/5)</span>
                                                                                </div>
                                                                            
                                                                            </div>
                                                                        </div>
                                                                    </td>
                    
                                                                    <td width="20%">  
                                                                        <span className="">${item?.product?.price}</span>
                                                                    </td>
                                                                                      
                                                                    <td width="10%"><span className="cursor" onClick={() => context?.removeFromWishlist(item?.product?._id)}><DeleteOutlineOutlinedIcon /></span></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                              

                            }
                         
                        </div>
                    </div>
                    
                </div>

            </section>
        </>
    )
}

export default WishList;