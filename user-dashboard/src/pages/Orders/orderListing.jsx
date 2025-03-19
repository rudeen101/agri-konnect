import React, { useState, useContext, useEffect } from "react";
import "./order.css";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { Button, Pagination, Rating } from "@mui/material";
import { HiDotsVertical } from "react-icons/hi";
import { Chart } from "react-google-charts";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import food from "../../assets/images/food.jpg"
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import Orders from "../../components/orders/Orders";
import { fetchDataFromApi } from "../../utils/apiCalls";


const OrderListing = () =>{
    const [orders, setOrders] = useState([])
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0,0);
        context.setProgress(40);
        context.setProgress(100) 
    }, []);

    //Get all order
    useEffect(() => {
        fetchDataFromApi('/api/order').then((res) => {
            setOrders(res?.orders)
        });
    }, []);

    return(
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                    <h5 className="mb-0">Order Listing</h5>

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
                        label="Order List"
                        />
                    </Breadcrumbs>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <Orders orders={orders} vendor="Vendor"></Orders>
                </div>
            </div>
        </>
    )
}

export default OrderListing;