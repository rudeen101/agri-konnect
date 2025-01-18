import React, { useState, useContext, useEffect } from "react";
import "./wishList.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Rating } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import wishListImg from "../../assets/images/wishlist2.png";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import QuantityBox from "../../components/quantityBox/quantityBox";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi, editData } from "../../utils/api";
import { FaHome } from "react-icons/fa";

const WishList = () => {
    const [cartData, setCartData] = useState([]);
    const [productQuantity, setProductQuantity] = useState();
    const [changeQuantity, setChangeQuantity] = useState(0);
    const [cartFields, setCartFields] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState();
    const [user, setUser] = useState();
    const [wishListData, setWishListData] = useState([]);

    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0,0);
        const token = localStorage.getItem("token");

		if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
            setWishListData(context.wishListData);
        } else{
            history("/login");
        }

    },[]);

    useEffect(() => {

    })

    const removeItem = (id) => {
        setIsLoading(true);

        deleteData(`/api/wishList/${id}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Item deleted successfully!"
            })

            setIsLoading(false);
            fetchDataFromApi(`/api/wishList?userId=${context?.userData.userId}`).then((res) => {
                    context?.setWishListData(res);
            });
        })

     

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
                        <div className="listWrapper">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="left">
                                <p>You have<span className="text-g"><b>{context.wishListData?.data?.length}</b></span> item(s) in your wishlist</p>
                                    <h4 className="hd mb-0">Your Wishlist</h4>
                                </div>

                                {/* <span className="ml-auto clearCart d-flex align-items-center"><DeleteOutlineOutlinedIcon /> Clear Cart</span> */}
                            </div>
                            {
                                context.wishListData?.data?.length !== 0 ? (
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
                                                        wishListData?.data?.length !== 0 && wishListData?.data?.map((item, index) => {
                                                            return(
                                                                <tr key={index}>
                                                                    <td width="70%">
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="img">
                                                                                <Link to={`/product/${item.productId}`}>
                                                                                    <img src={item?.image} alt="" className="w-100" />
                                                                                </Link>
                                                                            </div>
                    
                                                                            <div className="info pl-4">
                                                                                <Link to={`/product/${item.productId}`}>
                                                                                    <h6>{item?.productName?.substr(0,100) + "..."}</h6>
                                                                                </Link>
                                                                                <div className="d-flex justify-items-center">
                                                                                    <Rating name="half-rating-read" value={parseFloat(item?.rating)} precission={0.5} readOnly />
                                                                                    <span>({parseFloat(item?.rating)})</span>
                                                                                </div>
                                                                            
                                                                            </div>
                                                                        </div>
                                                                    </td>
                    
                                                                    <td width="20%">  
                                                                        <span className="">{item.price}</span>
                                                                    </td>
                                                                                      
                                                                    <td width="10%"><span className="cursor" onClick={() => removeItem(item?._id)}><DeleteOutlineOutlinedIcon /></span></td>
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

                            }
                         
                        </div>
                    </div>
                    
                </div>

            </section>
        </>
    )
}

export default WishList;