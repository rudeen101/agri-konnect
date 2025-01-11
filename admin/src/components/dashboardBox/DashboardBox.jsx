import React from "react";
import "./dashboardBox.css";
import { HiDotsVertical } from "react-icons/hi";
import { Button } from "@mui/material";
import { IoMdTrendingUp } from "react-icons/io";
import { IoMdTrendingDown } from "react-icons/io";



const DashboardBox = (props) => {


    
    return(
        <>
            <div className="dashboardBox" style={{
                backgroundImage: `linear-gradient(to right, ${props.color?.[0]}, ${props.color?.[1]})`
            }}>
                {
                    props.grow === true ?
                    <span className="chart"><IoMdTrendingUp></IoMdTrendingUp></span>
                    :
                    <span className="chart"><IoMdTrendingDown></IoMdTrendingDown></span>

                }

                <div className="d-flex  justify-content-between w-100">
                    <div className="col1">
                        <h4 className="text-white mb-0">Total Users</h4>
                        <span className="text-white">330</span>
                    </div>

                    <div className="ml-auto">
                        {
                            props.icon ?
                                <span className="icon">
                                    {props.icon ? props.icon : ""}
                                </span>
                            : ""
                        }
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between w-100">
                    <h6 className="text-white mb-0 mt-0 ">Last Month</h6>
                    <Button className="ml-auto toggleIcon"><HiDotsVertical></HiDotsVertical></Button>
                </div>
            </div>        
        </>
    )
}

export default DashboardBox;