import React, {useEffect, useState, useContext} from "react";
import "./order.css";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams} from "react-router-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi, postDataToApi, updateDataToApi } from "../../utils/apiCalls";
import StyledSelect from "../../components/styledSelect/StyledSelect";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress
  } from '@mui/material';

const OrderDetails = () => {
    const [progress, setProgress] = useState(80);
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState([]);
    const [subOrder, setSubOrder] = useState([]);
    const [statusList, setStatusList] = useState(["Pending Confirmation","Accept", "Reject", "completed"]);
    const [trackingList, setTrackingList] = useState(["pending Tracking","Processing", "In-route", "Delivered", "Received"]);
    const context = useContext(MyContext);
    const {id} = useParams();
    const orderId = id;

    useEffect(() => {
        fetchOrder()
        context.setProgress(100)

    }, [orderId])

    const fetchOrder = () => {
        fetchDataFromApi(`/api/order/details/${orderId}`).then((res) =>{
            setOrder(res.order);
            console.log("order",res)
        });
    }
    
    const handleStatusChange = (orderStatus) => {
        let status = orderStatus.toLowerCase();
        let products = order.orderItems
        let orderedBy = order.orderedBy._id
        updateDataToApi(`/api/order/status`, {status, orderId, products, orderedBy}).then((res) => {
            fetchOrder()

        });
    }
    const handleTrackingChange = (orderStatus) => {
        let status = orderStatus.toLowerCase()
        updateDataToApi(`/api/order/tracking`, {status, orderId}).then((res) => {
            fetchOrder()
        });
    }

    const confirmDelivery = () => {
        let status = true;
        updateDataToApi(`/api/order/deliveryConfirmation`, {status, orderId}).then((res) => {
            fetchOrder()
        });
    }

    const updatePayment = () => {
        setIsLoading(true)
        updateDataToApi(`/api/order/paymentConfirmation`, {orderId}).then((res) => {
           console.log("Payment", res);
           fetchOrder()
           setIsLoading(false)
        });
    }

    const getEstimatedDeliveryDate = (days) => {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + days); // Add delivery days
    
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        const formattedDate = deliveryDate.toLocaleDateString('en-US', options);
    
        const currentWeekday = today.toLocaleDateString('en-US', { weekday: 'long' });
    
        // If delivery day is the same week, use "This Monday"
        if (deliveryDate.getDate() - today.getDate() <= 6) {
            return `${formattedDate}`;
        }
        return formattedDate; // Example: "Monday, Jan 29"
    }


    return (
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4 res-coln">
                    <h5 className="mb-0">Order Details</h5>

                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Home"
                        icon={<HomeIcon fontSize="small" />}
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Orders"
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Order Details"
                        />
                    </Breadcrumbs>
                </div>

                <div className="orderInfoContainer d-flex mt-5">
                    <div className="card shadow border-0 p-3 orderInfo">
                        <h3 className="hd">Order Details</h3>

                        <div className="orderDetailsList orderInfo">
                            <li>Order Number: <span>{order?.orderNumber}</span></li>
                            <li>Total Price: $<span>{order?.totalPrice}.00</span></li>
                            <li style={{textTransform: "capitalize"}}>Ordered By: <span>{order?.orderedBy?.name}</span></li>
                            <li style={{textTransform: "capitalize"}}>Received By: <span>{order?.receivedBy?.name}</span></li>
                        </div>
                    </div>

                    <div className="card shadow border-0 p-3 orderInfo">
                        <h3 className="hd">Payment Details</h3>

                        <div className="orderDetailsList orderInfo">
                            <li>Account Name: <span>{order?.paymentDetails?.accountName}</span></li>
                            <li>Account Phone: <span>{order?.paymentDetails?.accountPhone}</span></li>
                            <li style={{textTransform: "capitalize"}}>Payment Method: <span>{order?.paymentDetails?.method}</span></li>
                            <li style={{textTransform: "capitalize"}}>Payment Status: <span>{order?.paymentStatus}</span></li>
                        </div>
                        { context?.userData?.userId === order?.receivedBy?._id &&
                            <>
                                {
                                    order?.paymentStatus === "pending" ?
                                    <Button className="btn-large btn-g w-100 mt-2" onClick={() => updatePayment()}>
                                        { isLoading === true ? <span>"Confirm Payment"<CircularProgress className="circularProgress"/></span> : <span>Confirm Payment</span>}
                                    </Button>
                                    :                                    
                                    <Button style={{backgroundColor: "#ccc"}} className="btn-large btn-cancel w-100 mt-2" onClick={() => updatePayment()}>
                                        { isLoading === true ? <span>"Cancel Payment"<CircularProgress className="circularProgress" /></span> : <span>Cancel Payment</span>}
                                    </Button>
        
                                }
                            </>
                                           
                        }
   

                    </div>

                    <div className="card shadow border-0 p-3 orderInfo">
                        <h3 className="hd">Delivery Address</h3>
                        <div className="orderDetailsList">
                            <li>Recipient Name: <span>{order?.deliveryAddress?.fullName}</span></li>
                            <li>Pnone Number: <span>{order?.deliveryAddress?.phone}</span></li>
                            <li>Address: <span>{order?.deliveryAddress?.address}</span></li>
                            <li>City: <span>{order?.deliveryAddress?.city}</span></li>

                            {
                                order?.deliveryAddress?.pickupStation &&
                                <li>Pickup Station: <span>{order?.deliveryAddress?.pickupStation}</span></li>

                            }
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
             
                    <h2 className="hd">Orders Listing</h2>

                        <div className="card shadow border-0 p-3">
                            <div className="orderBtnContainer">
                                
                            { 
                                context?.userData?.userId === order?.receivedBy?._id ?
                                <>
                                    <StyledSelect  onSelectChange={handleStatusChange} currentStatus={order?.status} selectData={statusList}></StyledSelect>
                                    <StyledSelect  onSelectChange={handleTrackingChange} currentStatus={order?.tracking}  selectData={trackingList}></StyledSelect>
                                </>

                                : 
                                <>
                                    <Button disabled className="btn-border">{order?.status}</Button>
                                    <Button disabled className="btn-border">{order?.tracking}</Button>
                                    {
                                        order?.isReceived ?
                                        <Button className="btn-border btn-g" disabled onClick={()=> confirmDelivery()}>Delivery Confirmed</Button>
                                        :
                                        <Button className="btn-border btn-g" onClick={()=> confirmDelivery()}>Confirm Delivery</Button>

                                    }
                                </>
                            }   

                                
                            </div>
                            
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Order ID
                                                </TableCell>
                                                <TableCell>
                                                    Order
                                                </TableCell>
                                                <TableCell>
                                                    Amount
                                                </TableCell>
                                                <TableCell>
                                                    Quantity
                                                </TableCell>

                                                <TableCell>
                                                    E-Delivery Date
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {
                                            order?.orderItems?.length !== 0 && 
                                            order?.orderItems?.map((order, index) => (
                                                <TableRow key={index}>
                                                <TableCell>{order?._id}</TableCell>
                                                <TableCell>
                                                    <div className='d-flex '>
                                                        <div className='card' style={{overflow: "hidden", width: "50px", height: "50px", marginRight: "5px"}}>
                                                            <img style={{width: "100%", height: "100%", objectFit:"cover"}} src={order?.images[0]} alt={order?.name} /> 
                                                        </div>
                                                        <div>{order?.name}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{order?.price}</TableCell>
                                                <TableCell>{order?.quantity}</TableCell>
                                                <TableCell>
                                                {getEstimatedDeliveryDate(order?.estimatedDeliveryDate)}
                                                    {/* <div className="actions d-flex align-items-center">
                                                        <StyledSelect onSelectChange={handleStatusChange} orderId={order?._id} selectData={statusList} productId={order?.product}></StyledSelect>
                                                    </div> */}
                                                </TableCell>
                                                </TableRow>
                                            ))
                                    
                                        }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>

                            {/* <DetailsOrderListingTable orders={subOrder}></DetailsOrderListingTable> */}
                </div>
            </div>

            
        </>   
    )
}

export default OrderDetails;