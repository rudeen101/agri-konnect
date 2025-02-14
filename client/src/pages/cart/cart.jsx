import React, { useState, useContext, useEffect } from "react";
import "./cart.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Rating } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import emptyCart from "../../assets/images/cart-icon.png";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import QuantityBox from "../../components/quantityBox/quantityBox";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi, editData } from "../../utils/api";
import { FaHome } from "react-icons/fa";

const Cart = ({userId}) => {
    const [cartData, setCartData] = useState([]);
    const [productQuantity, setProductQuantity] = useState();
    const [changeQuantity, setChangeQuantity] = useState(0);
    const [cartFields, setCartFields] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState();
    const [user, setUser] = useState();

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0,0);
        const token = localStorage.getItem("token");

		if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        } else{
            history("/login");
        }

        getCartData();

    },[]);

    useEffect(() => {

    })

    const getCartData = () => {
        const user = JSON.parse(localStorage.getItem("user"));
    
        fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((res) => {
            setCartData(res);
            setUser(user)
        });
    }

    const quantity = (value) => {
        setProductQuantity(value)
        setChangeQuantity(value)
    }

    const selectedItem = (item, productQuantity) => {
     
        if(changeQuantity !== 0){
            setIsLoading(true);

            let user_id = user?.userId;

            console.log("item", );

            cartFields.userId = user_id;
            cartFields.productId = item?._id;
            cartFields.price = item?.price;
            cartFields.productName = item?.name;
            cartFields.rating = item?.rating;
            cartFields.price = item?.price; 
            cartFields.subTotal = parseInt(item?.price * productQuantity); 
            cartFields.countInStock = item?.countInStock; 
            cartFields.image = item?.image;
            cartFields.quantity = productQuantity;

            // return;

            editData(`/api/cart/${item._id}`, cartFields).then((res) => {
                setTimeout(() => {
                    setIsLoading(false);
    
                    const user = JSON.parse(localStorage.getItem("user"));

                    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
                        setCartData(res);
                    })
                }, 1000);
            });
        }
    }

    const removeItem = (id) => {
        setIsLoading(true);

        deleteData(`/api/cart/${id}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Item deleted successfully!"
            })
        })

        setIsLoading(false);
        getCartData()

    }


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
                                    <p><span className="text-g"><b>{cartData?.data?.length}</b></span> product(s) in your cart</p>
                                </div>

                                {/* <span className="ml-auto clearCart d-flex align-items-center"><DeleteOutlineOutlinedIcon /> Clear Cart</span> */}
                            </div>
                            {
                                cartData?.data?.length !== 0 ? (
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
                                                    {
                                                        cartData?.data?.length !== 0 && cartData?.data?.map((item, index) => {
                                                            return(
                                                                <tr key={index}>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="img">
                                                                                <Link to={`/product/${item.productId}`}>
                                                                                    <img src={item?.image} alt="" className="w-100" />
                                                                                </Link>
                                                                            </div>
                    
                                                                            <div className="info pl-4">
                                                                                <Link to={`/product/${item.productId}`}>
                                                                                    <h6>{item?.productName?.substr(0,50) + "..."}</h6>
                                                                                </Link>
                                                                                <div className="d-flex justify-items-center">
                                                                                    <Rating name="half-rating-read" value={parseFloat(item?.rating)} precission={0.5} readOnly />
                                                                                    <span>({parseFloat(item?.rating)})</span>
                                                                                </div>
                                                                            
                                                                            </div>
                                                                        </div>
                                                                    </td>
                    
                                                                    <td>  
                                                                        <span className="">{item.price}</span>
                                                                    </td>
                                                                    <td>
                                                                        <QuantityBox 
                                                                            value={item?.quantity}
                                                                            item={item} 
                                                                            selectedItem={selectedItem}
                                                                            quantity={quantity}
                                                                        />
                                                                    </td>
                    
                                                                    <td>
                                                                        <span className="text-g">{item?.subTotal}</span>
                                                                    </td>
                    
                                                                    <td><span className="cursor" onClick={() => removeItem(item?._id)}><DeleteOutlineOutlinedIcon /></span></td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                                :(
                                    <div className="emptyCart mt-5 d-flex align-items-center justify-content-center flex-column">
                                        <img
                                            src={emptyCart}
                                            alt="cart image"
                                            width="150"
                                            hight="150px"
                                        />

                                        <h3>Your Cart is currently empty</h3>
                                        <br />

                                        <Link to={"/"}>
                                            <Button className="btn-g bg-g btn-lg btn-round">
                                                <FaHome /> &nbsp; Continue Shopping
                                            </Button>
                                        </Link>
                                    </div>
                                )

                            }
                         
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