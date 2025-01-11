import React, { useState } from "react";
import "./cart.css";
import { Link } from "react-router-dom";
import { Button, Rating } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import product from "../../assets/images/food.jpg";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import QuantityBox from "../../components/quantityBox/quantityBox";

const Cart = () => {
    const [inputValue, setInputValue] = useState(1);

    return (
        <>
            <div className="breadcrumbWrapper mb-4">
                <div className="container-fluid">
                    <ul className="breadcrumb breadcrumb2 mb-0">
                        <li>
                            <Link ro={"/"}>Home</Link>
                        </li>
                        <li>
                            <Link ro={"/"}>Shop</Link>
                        </li>
                        <li>
                            <Link ro={"/"}>Cart</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <section className="cartSection mb-5">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="left">
                                    <h4 className="hd mb-0">Your Cart</h4>
                                    <p>There are <span className="text-g">3</span> products in your cart</p>
                                </div>

                                <span className="ml-auto clearCart d-flex align-items-center"><DeleteOutlineOutlinedIcon /> Clear Cart</span>
                            </div>

                            <div className="cartWrapper">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="table-gray">
                                            <tr>
                                                <th>Product</th>
                                                <th>Unit Price</th>
                                                <th>Quantity</th>
                                                <th>Subtotal</th>
                                                <th>Remove</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="img">
                                                            <img src={product} alt="" className="w-100" />
                                                        </div>

                                                        <div className="info pl-4">
                                                            <Link>
                                                                <h6>Field Chao Choose Creamy Original</h6>
                                                            </Link>
                                                            <div className="d-flex justify-items-center">
                                                                <Rating name="half-rating-read" defaultValue={3.5} precission={0.5} readOnly />
                                                                <span>(4.5)</span>
                                                            </div>
                                                          
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>  
                                                    <span className="">$2.5</span>
                                                </td>
                                                <td>
                                                    <QuantityBox value={1} />
                                                </td>

                                                <td>
                                                    <span className="text-g">$2.5</span>
                                                </td>

                                                <td><span className="cursor"><DeleteOutlineOutlinedIcon /></span></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="img">
                                                            <img src={product} alt="" className="w-100" />
                                                        </div>

                                                        <div className="info pl-4">
                                                            <Link>
                                                                <h6>Field Chao Choose Creamy Original</h6>
                                                            </Link>
                                                            <div className="d-flex justify-items-center">
                                                                <Rating name="half-rating-read" defaultValue={3.5} precission={0.5} readOnly />
                                                                <span>(4.5)</span>
                                                            </div>
                                                          
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>  
                                                    <span className="">$2.5</span>
                                                </td>
                                                <td>
                                                    <QuantityBox value={1} />
                                                </td>

                                                <td>
                                                    <span className="text-g">$2.5</span>
                                                </td>

                                                <td><span className="cursor"><DeleteOutlineOutlinedIcon /></span></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="img">
                                                            <img src={product} alt="" className="w-100" />
                                                        </div>

                                                        <div className="info pl-4">
                                                            <Link>
                                                                <h6>Field Chao Choose Creamy Original</h6>
                                                            </Link>
                                                            <div className="d-flex justify-items-center">
                                                                <Rating name="half-rating-read" defaultValue={3.5} precission={0.5} readOnly />
                                                                <span>(4.5)</span>
                                                            </div>
                                                          
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>  
                                                    <span className="">$2.5</span>
                                                </td>
                                                <td>
                                                    <QuantityBox value={1} />
                                                </td>

                                                <td>
                                                    <span className="text-g">$2.5</span>
                                                </td>

                                                <td><span className="cursor"><DeleteOutlineOutlinedIcon /></span></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 pl-9 checkoutBox">
                            <div className="card p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span className="mb-0 ">Subtotal</span>
                                    <h6 className="ml-auto mb-0 font-weight-bold text-g">$12.13</h6>
                                </div>
                                <div className="d-flex align-items-center justify-content-between  mb-3">
                                    <span className="mb-0 ">Shipping</span>
                                    <h6 className="ml-auto mb-0 font-weight-bold">Free</h6>
                                </div>
                                <div className="d-flex align-items-center justify-content-between  mb-3">
                                    <span className="mb-0 ">Estimate for</span>
                                    <h6 className="ml-auto mb-0 font-weight-bold">Monrovia</h6>
                                </div>
                                <div className="d-flex align-items-center justify-content-between  mb-3">
                                    <span className="mb-0 ">Total</span>
                                    <h6 className="ml-auto mb-0 font-weight-bold text-g">$12.13</h6>
                                </div>

                                <br />  
                                <Button className="btn-g btn-lg">Preceed To Checkkout</Button>
                            </div>
                        </div>
                    </div>
                    
                </div>

            </section>
        </>
    )
}

export default Cart;