import React, { useState, useContext } from "react";
import "./sidebar.css";
import { Button } from "@mui/material";
import { MdDashboard } from "react-icons/md";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { FaProductHunt } from "react-icons/fa6";
import { FaCartArrowDown } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from "../../App";


const Sidebar = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    
    const context = useContext(MyContext)

    const isOpenSubmenu = (index) =>{
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    }

    return(
        <div className="sidebar">
            <ul>
                <li>
                    <Link to={"/"}>
                        <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(0)}>
                            <span className="icon"><MdDashboard /></span>
                            Dashboard
                            <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(1)}>                        
                        <span className="icon"><FaProductHunt /></span>
                        Products
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                    <div className={`submenuContainer ${activeTab === 1 && isToggleSubmenu === true ?
                        'openMenu' : 'closeMenu'
                     }`}>
                        <ul className="submenu">
                            <li>
                                <Link to={"/product/listing"}>Product Listing</Link>
                                <Link to={"/product/upload"}>Add Product</Link>
                            </li>
                        </ul>
                    </div>
                </li>

                <li>
                    <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(2)}>                        
                            <span className="icon"><FaCartArrowDown /></span>
                            Order
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                    <div className={`submenuContainer ${activeTab === 2 && isToggleSubmenu === true ?
                        'openMenu' : 'closeMenu'
                     }`}>
                        <ul className="submenu">
                            <li>
                                <Link to={"/admin/myOrders/listing"}>My Orders</Link>
                            </li>
                            <li>
                                <Link to={"/admin/orders/listing"}>Orders</Link>
                            </li>
                        </ul>
                    </div>
                </li>

                <li>
                    <Button className={`w-100 ${activeTab === 12 && isToggleSubmenu ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(12)}>                        
                            <span className="icon"><FaCartArrowDown /></span>
                            Sales
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                    <div className={`submenuContainer ${activeTab === 12 && isToggleSubmenu === true ?
                        'openMenu' : 'closeMenu'
                     }`}>
                        <ul className="submenu">
                            <li>
                                <Link to={"/admin/sales/listing"}>Sales Listing</Link>
                            </li>
                        </ul>
                    </div>
                </li>
            
                <li>
                    <Button className="w-100">
                        <span className="icon"><IoIosSettings /></span>
                        Settings
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                </li>
                
            </ul>

            <br />

            {/* <div className="logoutContainer">
                <div className="logoutBox">
                    <Button variant="contained"><IoMdLogOut />Logout</Button>
                </div>
            </div> */}
        </div>
    )
}

export default Sidebar;