import React, { useState, useContext, useEffect } from "react";
import "./checkout.css";
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
import { Modal } from "react-bootstrap";
import StyledSelect from "../../components/styledSelect/StyledSelect";
import { postDataToApi } from "../../utils/apiCalls";
import CircularProgress from '@mui/material/CircularProgress';
import CustomModal from "../../components/modal/Modal";


const Checkout = ({user}) => {
    // const [cartData, setCartData] = useState([]);
    const [productQuantity, setProductQuantity] = useState();
    const [changeQuantity, setChangeQuantity] = useState(0);
    const [cartFields, setCartFields] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [isLogin, setIsLogin] = useState();
    const [quantity, setQuantity] = useState(1);
    const [paymentNumber, setPaymentNumber] = useState({
        MoMo: "0888642680",
        OrangeMoney: "0777967844"
    })

    const pickupStations = [
        "Downtown Hub",
        "City Center Mall",
        "Westside Pickup Point",
        "Airport Express Station",
        "Suburban Warehouse",
    ];

    // User Addresses & Payment States
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
    const [pickupStation, setPickupStation] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [formFields, setFormFields] = useState({
        fullName:"",
        phone: "",
        address: "",
        city: "",
        accountName:"",
        accountPhone: "",
        paymentMethod: paymentMethod,
        pickupStation: pickupStation
    })

    const context = useContext(MyContext);
    const navigate = useNavigate();
    
    //Fetch cart data and store in localStorage
    useEffect(() => {
        window.scrollTo(0, 0);

        //fetch user address
        fetchDataFromApi(`/api/user/address`).then((res) => {
            const userAddreses = res.userAddress.addresses;
            setAddresses(userAddreses);
            setSelectedAddress(userAddreses[0])
        });
    }, []);

    // Add New Address
    const addNewAddress = () => {
        if (formFields.fullName ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter recipient name",
                error: true
            });
            return false
        }
        if (formFields.phone ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter recipient phone number",
                error: true
            });
            return false
        }
        if (formFields.address ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter delivery address",
                error: true
            });
            return false
        }
        if (formFields.city ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter delivery city",
                error: true
            });
            return false
        }

        const newAddress = {
            fullName: formFields.fullName,
            phone: formFields.phone,
            address: formFields.address,
            city: formFields.city,
        }

        setAddresses(prevAddresses => [...prevAddresses, newAddress]);
        setSelectedAddress(newAddress);
        setShowAddressModal(false);
    };
  
    const handleQuantityChange = (newQuantity, productId) => {
        context?.updateQuantity(productId, newQuantity)
    };

    //get input data
    const inputChange = (e) => {
        setFormFields(prevFields => ({
            ...prevFields,  // Preserve previous values
            [e.target.name]: e.target.value
        }));
    };

    // get pickup station from select component
    const handlePickupStationChange  = (selectedStation) => {
        setPickupStation(selectedStation);
    }

    // Calculate grand total
    const calculateTotal = () => {
        return  context?.cart?.items?.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
    };

    //Calculate 30% of total amount
    const calculateThirtyPercent = (totalAmount) => {
        if (typeof parseInt(totalAmount) !== "number" || parseInt(totalAmount) < 0) {
            throw new Error("Invalid total amount. It must be a positive number.");
        }
    
        return ((30 / 100) * totalAmount).toFixed(2); // 30% of totalAmount
    };


    const handlePlaceOrder = () => {
        if (selectedAddress.fullName ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter recipient name",
                error: true
            });
            return false
        }
        if (selectedAddress.phone ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter recipient phone number",
                error: true
            });
            return false
        }
        if (selectedAddress.address ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter delivery address",
                error: true
            });
            return false
        }
        if (selectedAddress.city ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter delivery city",
                error: true
            });
            return false
        }
        if (paymentMethod ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Choose a payment method",
                error: true
            });
            return false
        }
        if (formFields.accountName ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter account name",
                error: true
            });
            return false
        }
        if (formFields.accountPhone ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter account number",
                error: true
            });
            return false
        }
        if (formFields.accountName ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Enter account name",
                error: true
            });
            return false
        }

        const deliveryDetails = {
            fullName: selectedAddress.fullName,
            phone: selectedAddress.phone,
            address: selectedAddress.address,
            city: selectedAddress.city,
            pickupStation: pickupStation
        }

        const paymentDetails = {
            method: paymentMethod,
            accountName: formFields.accountName,
            accountPhone: formFields.accountPhone
        }

        //Restructure order data
        let orderItems = [];
        cartData?.map((item, index) =>{
            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                images: item.product.images,
                seller: item.product.seller
            })
        })

        const orderData = {
            orderItems: orderItems,
            deliveryAddress: deliveryDetails,
            paymentDetails: paymentDetails,
            totalPrice: calculateTotal(),
        };

        postDataToApi(`/api/order/create`, orderData).then((res) => {
            setIsCheckoutLoading(true);

           if (res) {
                context.setAlertBox({
                    open: true,
                    msg: "Order placed successfully!",
                    error: false
                });
                
                setIsCheckoutLoading(false);
                alert()
                setShowPaymentModal(true);
           }else {
                context.setAlertBox({
                    open: true,
                    msg: "Order placement Failed!",
                    error: true
                });
                setIsCheckoutLoading(false);
           }
            setIsLoading(false)

        }).catch((error)=>{
            console.log(error)
        });

        // const response = await placeOrder(orderData);
        // if (response.error) {
        //     alert("Order Failed!");
        // } else {
        //     alert("Order Placed Successfully!");
        // }
    };
 
    const handleConfirmPayment = () => {
        navigate("/fulfillment");
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
                            <Link ro={"/"}>Checkout</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <section className="checkout cartSection  mb-5">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="checkout-container">
                                {/* Left Section */}
                                <div className="checkout-left">
                                    {/* Address Section */}
                                    <div className="checkout-card">
                                        <h4>Shipping Address</h4>
                                        <div className="address-selection">
                                            {addresses?.length !== 0 && addresses?.map((addr, index) => (
                                                <label key={index} className="address-option">
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        value={addr}
                                                        checked={selectedAddress === addr}
                                                        onChange={() => setSelectedAddress(addr)}
                                                    />
                                                    {/* {addr} */}
                                                    <ul className="deliveryDetails">
                                                        <li>Recipient Name: <span>{addr.fullName}</span></li>
                                                        <li>Phone Number: <span>{addr.phone}</span></li>
                                                        <li>Address: <span>{addr.address}</span></li>
                                                        <li>City: <span>{addr.city}</span></li>
                                                    </ul>
                                                </label>
                                            ))}
                                            <Button onClick={() => setShowAddressModal(true)} className="btn-border mt-2 add-address-btn">
                                                + Add New Address
                                            </Button>
                                        </div>

                                        {/* Pickup Station */}
                                        <h5 className="mt-3">Pickup Station</h5>
                                        <StyledSelect onSelectChange={handlePickupStationChange} selectData={pickupStations}></StyledSelect>
                                    </div>

                                    {/* Payment Section */}
                                    <div className="checkout-card">
                                        <h4>Payment Method</h4>
                                        <div className="payment-options">
                                            {["MoMo", "OrangeMoney", "Cash"].map((method) => (
                                                <label key={method} className="payment-option">
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value={method}
                                                        checked={paymentMethod === method}
                                                        onChange={() => setPaymentMethod(method)}
                                                    />
                                                    {method}
                                                </label>
                                            ))}
                                        </div>

                                        {/* Dynamic Payment Form */}
                                        {paymentMethod && paymentMethod !== "Cash" && (
                                            <div className="payment-form">
                                                <h5>Enter {paymentMethod} Details</h5>
                                                <input
                                                    type="text"
                                                    name="accountName"
                                                    placeholder="Enter account name"
                                                    value={formFields.accountName}
                                                    onChange={inputChange}
                                                /> 
                                                <input
                                                    type="text"
                                                    name="accountPhone"
                                                    placeholder="Enter account phone number"
                                                    value={formFields.accountPhone}
                                                    onChange={inputChange}
                                                /> 
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Review & Checkout */}
                                    <div className="checkout-card" id="orderReview">
                                        <h4>Review & Place Order</h4>
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
                                                            context?.cart?.items?.length !== 0 && context?.cart?.items?.map((item, index) => {
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

                                                                            <QuantitySelector stock={parseInt(item?.product?.countInStock)} productId={item?._id} initialQuantity={item?.quantity} onQuantityChange={handleQuantityChange}></QuantitySelector>

                                                                        </td>
                        
                                                                        <td>
                                                                            <span className="text-g">${(item?.product?.price * item?.quantity).toFixed(2)}</span>
                                                                        </td>
                        
                                                                        <td>
                                                                            {
                                                                                isLoading === true ? 
                                                                                
                                                                                <button className="deleteLoader">
                                                                                    <CircularProgress className="loading" />
                                                                                </button>
                                                                                :
                                                                                <span className="cursor" onClick={() =>  context?.removeFromCart(item?._id)}><DeleteOutlineOutlinedIcon /></span>

                                                        
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

                                        <div className="d-flex align-items-center justify-content-between  mb-3">
                                            <span className="mb-0 ">Total</span>
                                            <h6 className="ml-auto mb-0 font-weight-bold text-g">${calculateTotal()}</h6>
                                        </div>

                                        <button className="checkout-btn" onClick={handlePlaceOrder}>
                                           
                                            {
                                                isCheckoutLoading === true ? 
                                                
                                                    <span>Place Order <CircularProgress className="checkoutLoader" /></span> 
                                                :
                                                " Place Order"
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div> 
                        </div>

                   
                        <div className="col-md-4 pl-9 checkoutBox">
                            <div className="checkoutCard p-4">
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
                                <a href="#orderReview">
                                    <Button className="btn-g btn-lg">Review & Place Order</Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <CustomModal
                    show={showAddressModal}
                    handleClose={() => setShowAddressModal(false)}
                    title="Add New Address"
                    btnText="Save Address"
                    onClick={() => addNewAddress}
                >
                    <input 
                        type="text" 
                        className="form-control mb-2" 
                        name="fullName"
                        placeholder="Enter new address recipient fullname"
                        value={formFields.fullName}
                        onChange={inputChange}
                    />
                    <input 
                        type="text" 
                        className="form-control mb-2" 
                        name="phone"
                        placeholder="Enter recipient phone number"
                        value={formFields.phone}
                        onChange={inputChange}
                    />
                    <input 
                        type="text" 
                        className="form-control mb-2" 
                        name="address"
                        placeholder="Enter delivery address"
                        value={formFields.address}
                        onChange={inputChange}
                    />
                    <input 
                        type="text" 
                        className="form-control mb-2" 
                        name="city"
                        placeholder="Enter city"
                        value={formFields.city}
                        onChange={inputChange}
                    />
                </CustomModal>
                <CustomModal
                    show={showPaymentModal}
                    handleClose={() => setShowPaymentModal(false)}
                    title="Confirm Payment"
                    btnText="Confirm Payment"
                    onClick={() => handleConfirmPayment}
                >
                <div className="paymentContainer">
                    <p>Your order has been placed in!</p>
                    <p>For us to begin processing your order you need to pay the full amount, <span className="amount">{calculateTotal()}</span> or $<span className="amount">{calculateThirtyPercent(calculateTotal())}</span>, which is 
                        30% of your total pruchase.
                    </p>
                    <p>
                        Payment Number: <h5 className="paymentNumber">{paymentMethod ==="MoMo" ? paymentNumber.MoMo: paymentNumber.OrangeMoney}</h5>
                    </p>
                </div>              
                </CustomModal>
            </section>
        </>
    )
}

export default Checkout;