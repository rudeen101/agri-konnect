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
                                <Link to={"/product/listing"}>Product List</Link>
                                <Link to={"/product/details"}>Product view</Link>
                                <Link to={"/product/upload"}>Product Upload</Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <Button className={`w-100 ${activeTab === 6 && isToggleSubmenu ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(6)}>                        
                        <span className="icon"><FaProductHunt /></span>
                        Category
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                    <div className={`submenuContainer ${activeTab === 6 && isToggleSubmenu === true ?
                        'openMenu' : 'closeMenu'
                     }`}>
                        <ul className="submenu">
                            <li>
                                <Link to={"/category"}>Category List</Link>
                                <Link to={"/category/add"}>Add Category</Link>
                                <Link to={"/subCategory"}>Sub Category List</Link>
                                <Link to={"/subCategory/add"}>Add Sub Category</Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <Link to={"/"}>
                    <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(2)}> 
                            <span className="icon"><FaCartArrowDown /></span>
                            Orders
                            <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Link to={"/"}>
                        <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`}
                            onClick={()=> isOpenSubmenu(3)}> 
                                <span className="icon"><MdMessage /></span>
                                Message
                                <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                     <Link to={"/"}>
                        <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`}
                            onClick={()=> isOpenSubmenu(4)}> 
                            <span className="icon"><FaBell /></span>
                            Notification
                            <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Link to={"/"}>
                        <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`}
                            onClick={()=> isOpenSubmenu(5)}> 
                            <span className="icon"><IoIosSettings /></span>
                            Settings
                            <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Button className="w-100">
                        <span className="icon"><FaBell /></span>
                        Notification
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                </li>
                <li>
                    <Button className="w-100">
                        <span className="icon"><IoIosSettings /></span>
                        Settings
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                </li>
                <li>
                    <Button className="w-100">
                        <span className="icon"><FaBell /></span>
                        Notification
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                </li>
                <li>
                    <Button className="w-100">
                        <span className="icon"><IoIosSettings /></span>
                        Settings
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                </li>
                <li>
                    <Button className="w-100">
                        <span className="icon"><FaBell /></span>
                        Notification
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                </li>
                <li>
                    <Button className="w-100">
                        <span className="icon"><IoIosSettings /></span>
                        Settings
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                </li>
                <li>
                    <Button className="w-100">
                        <span className="icon"><FaBell /></span>
                        Notification
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                </li>
                <li>
                    <Button className="w-100">
                        <span className="icon"><IoIosSettings /></span>
                        Settings
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                </li>
                <li>
                    <Button className="w-100">
                        <span className="icon"><FaBell /></span>
                        Notification
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
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

            <div className="logoutContainer">
                <div className="logoutBox">
                    <Button variant="contained"><IoMdLogOut />Logout</Button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;