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
import { deleteDataFromApi, fetchDataFromApi} from "../../utils/apiCalls";
import { FaHome } from "react-icons/fa";
import QuantitySelector from "../../components/quantitySelector/quantitySelector";
import CircularProgress from '@mui/material/CircularProgress';

const Cart = ({user}) => {
    // const [cartData, setCartData] = useState([]);
    const [productQuantity, setProductQuantity] = useState();
    const [changeQuantity, setChangeQuantity] = useState(0);
    const [cartFields, setCartFields] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState();
    const [quantity, setQuantity] = useState(1);


    const [cartData, setCartData] = useState([]);

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi(`/api/cart`).then((res) => {
            localStorage.setItem("cart", JSON.stringify(res.products));
            const cart = JSON.parse( localStorage.getItem("cart"));
            console.log("===", cart);

            setCartData(cart);
        });
    }, []);


    const handleQuantityChange = (newQuantity, productId) => {
        setCartData((prevCart) =>
            prevCart.map((item) =>
                item.product._id === productId
                    ? { ...item, quantity: Math.max(1, newQuantity) } // Prevent quantity below 1
                    : item
            )
        );
    };

    // Calculate grand total
    const calculateTotal = () => {
        return cartData.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
    };

    // const handleQuantityChange = (newQuantity, productId) => {

    //     // setQuantity(newQuantity)
    //     setCartData((prevCart) =>
    //         prevCart.map((item) => {
    //             item?.product?._id === productId
    //                 ? { ...item, quantity: newQuantity}
    //                 : item
    //         })
    //     );

    // };

    const removeItem = (productId) => {
        setIsLoading(true);

        deleteDataFromApi(`/api/cart/remove/${productId}`).then((res) => {

            setCartData(prevCart => prevCart.filter(item => item.product._id !== productId));

            context.setAlertBox({
                open: true,
                error: false,
                msg: "Item deleted successfully!"
            })
        })

        setIsLoading(false);
        // getCartData()

    }


    return (
        <>
            <div className="breadcrumbWrapper mb-4">
                <div className="">
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
                                    <p><span className="text-g"><b>{cartData?.length}</b></span> product(s) in your cart</p>
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
                                                        cartData?.length !== 0 && cartData?.map((item, index) => {
                                                            return(
                                                                <tr key={index}>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="img">
                                                                                <Link to={`/product/${item?.product?._id}`}>
                                                                                    <img src={item?.product?.images[0]} alt="" className="w-100" />
                                                                                </Link>
                                                                            </div>
                    
                                                                            <div className="info pl-4">
                                                                                <Link to={`/product/${item?._id}`}>
                                                                                    <h6>{item?.product?.name?.substr(0,100) + "..."}</h6>
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                    
                                                                    <td>  
                                                                        <span className="">${item?.product?.price}</span>
                                                                    </td>
                                                                    <td>
                                                                        {/* <QuantityBox 
                                                                            value={item?.quantity}
                                                                            item={item} 
                                                                            selectedItem={selectedItem}
                                                                            quantity={quantity}
                                                                        /> */}

                                                                        <QuantitySelector stock={parseInt(item?.product?.countInStock)} productId={item?.product?._id} initialQuantity={quantity} onQuantityChange={handleQuantityChange}></QuantitySelector>

                                                                    </td>
                    
                                                                    <td>
                                                                        <span className="text-g">${(item.product.price * item.quantity).toFixed(2)}</span>
                                                                    </td>
                    
                                                                    <td>
                                                                        {
                                                                            isLoading === true ? 
                                                                            
                                                                            <button className="deleteLoader">
                                                                                <CircularProgress className="loading" />
                                                                            </button>
                                                                            :
                                                                            <span className="cursor" onClick={() => removeItem(item?.product?._id)}><DeleteOutlineOutlinedIcon /></span>

                                                    
                                                                        }
                                                                        
                                                                    </td>
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
                                    <h6 className="ml-auto mb-0 font-weight-bold text-g">${calculateTotal()}</h6>
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
                                    <h6 className="ml-auto mb-0 font-weight-bold text-g">${calculateTotal()}</h6>
                                </div>

                                <br />  
                                <Link to={"/checkout"}>
                                    <Button className="btn-g btn-lg">Preceed To Checkkout</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                </div>

            </section>
        </>
    )
}

export default Cart;