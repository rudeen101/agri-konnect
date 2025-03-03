import React, {useEffect, useState, useContext} from "react";
import "./order.css";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useParams,} from "react-router-dom";
import { MyContext } from "../../App";
import { fetchDataFromApi, postDataToApi, updateDataToApi } from "../../utils/apiCalls";
import StyledSelect from "../../components/styledSelect/StyledSelect";


const OrderDetails = () => {
    const [progress, setProgress] = useState(80);
    const [orderData, setOrderData] = useState([]);
    const [subOrderData, setSubOrderData] = useState([]);
    const [statusList, setStatusList] = useState(["pending", "confirmed", "processing", "delivered", "received", "completed", "cancelled"])
    const context = useContext(MyContext);
    const {id} = useParams();

    useEffect(() => {
        fetchData()
        context.setProgress(100)

    }, [id])

    const fetchData = () => {
        fetchDataFromApi(`/api/order/details/${id}`).then((res) =>{
            setOrderData(res.order);

            fetchDataFromApi(`/api/order/sub/${id}`).then((res) => {
                setSubOrderData(res.order[0]);
                console.log(res.order[0])
            });
        });
    }
    
    const handleStatusChange = (status, id, productId) => {
        let orderId = subOrderData?._id
        updateDataToApi(`/api/order/status/${id}`, {status, orderId, productId}).then((res) => {
            fetchData()

        });
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

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Order Info</h3>

                    <ul className="orderDetailsList">
                        <li>Order Number: <span>{orderData?.orderNumber}</span></li>
                        <li>Total Price: $<span>{orderData?.totalPrice}.00</span></li>
                        <li>Payment Status: <span>{orderData?.paymentStatus}</span></li>
                        {/* <li>Estimated Deivery Date: <span></span></li> */}
                    </ul>

                    <h3 className="hd">Delivery Address</h3>
                    <ul className="orderDetailsList">
                        <li>Recipient Name: <span>{subOrderData?.deliveryAddress?.fullName}</span></li>
                        <li>Pnone Number: <span>{subOrderData?.deliveryAddress?.phone}</span></li>
                        <li>Address: <span>{subOrderData?.deliveryAddress?.address}</span></li>
                        <li>City: <span>{subOrderData?.deliveryAddress?.city}</span></li>
                    </ul>

                    <h3 className="hd">Products Listing</h3>
                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>IMAGE</th>
                                    <th>NAME</th>
                                    <th>PRICE</th>
                                    <th>STATUS</th>
                                    <th>QUANTITY</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                subOrderData?.orderItems?.length !== 0 && 
                                subOrderData?.orderItems?.map((product, index) => {
                                    return (
                                        <tr key={index}>
                                            <td >
                                                <div className="imageContainer card">
                                                    <Link to={`/product/details/${product?.product}`}>
                                                        <img src={product.images[0]} alt="product image" className="w-100"/>
                                                    </Link>
                                                </div>
                                      
                                            </td>
                                            <td>{product?.name}</td>
                                            <td>{product?.price}</td>
                                            <td>{product?.status}</td>
                                            <td>{product?.quantity}</td>
                                           
                                            <td>
                                                <div className="actions d-flex align-items-center">
                                                    <StyledSelect onSelectChange={handleStatusChange} orderId={product?._id} selectData={statusList} productId={product?.product}></StyledSelect>
                                                </div>
                                            </td>
                                        </tr>
                                    )

                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            
        </>   
    )
}

export default OrderDetails;