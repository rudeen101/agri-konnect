import React, { useState, useContext, useEffect } from "react";
import "./sales.css";
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
import SalesListingTable from "../../components/sales/salesListingTable";
import TextExpand from "../../components/text/TextExpand";
import { fetchDataFromApi } from "../../utils/apiCalls";


const SalesHistory = () =>{
    const [salesHistory, setSalesHistory] = useState([])
    const context = useContext(MyContext);

    useEffect(() => {
        getSalesHistory()
        context.setProgress(100)

    },[])

    const getSalesHistory = () => {
        fetchDataFromApi(`/api/sales/history/`).then((res) =>{
            setSalesHistory(res);
            console.log("History",res)
        });
    }


    useEffect(() => {
        window.scrollTo(0,0);
        context.setProgress(40);
        context.setProgress(100) 
    }, []);

    const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

    return(
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                    <h5 className="mb-0">Sales History</h5>

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
                        label="Sales List"
                        />
                    </Breadcrumbs>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    {
                        salesHistory?.length !== 0 && salesHistory?.map((data) => (
                            <TextExpand title="Product Description" salesData={data} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default SalesHistory;