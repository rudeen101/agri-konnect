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
                    <Button className={`w-100 ${activeTab === 9 && isToggleSubmenu ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(9)}>                        
                        <span className="icon"><FaProductHunt /></span>
                        Tag
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                    <div className={`submenuContainer ${activeTab === 9 && isToggleSubmenu === true ?
                        'openMenu' : 'closeMenu'
                     }`}>
                        <ul className="submenu">
                            <li>
                                <Link to={"/tag/list"}>Tag List</Link>
                                <Link to={"/tag/add"}>Add Tag</Link>
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
                                <Link to={"/admin/order/listing"}>Order Listing</Link>
                            </li>
                        </ul>
                    </div>
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
                    <Button className={`w-100 ${activeTab === 7 && isToggleSubmenu ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(7)}>                        
                        <span className="icon"><FaProductHunt /></span>
                        Home Banner Slide
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                    <div className={`submenuContainer ${activeTab === 7 && isToggleSubmenu === true ?
                        'openMenu' : 'closeMenu'
                     }`}>
                        <ul className="submenu">
                            <li>
                                <Link to={"/homeBannerSlide/list"}>Slide listing</Link>
                                <Link to={"/homeBannerSlide/add"}>Add Slide</Link>
                                <Link to={"/homeBannerSlide/edit/:id"}>Edit Slide</Link>
                            </li>
                        </ul>
                    </div>
                </li>

                <li>
                    <Button className={`w-100 ${activeTab === 8 && isToggleSubmenu ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(8)}>                        
                        <span className="icon"><FaProductHunt /></span>
                        Banner
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                    <div className={`submenuContainer ${activeTab === 8 && isToggleSubmenu === true ?
                        'openMenu' : 'closeMenu'
                     }`}>
                        <ul className="submenu">
                            <li>
                                <Link to={"/banner/list"}>Banner listing</Link>
                                <Link to={"/banner/add"}>Add Banner</Link>
                                <Link to={"/banner/edit/:id"}>Edit Banner</Link>
                            </li>
                        </ul>
                    </div>
                </li>

                <li>
                    <Button className={`w-100 ${activeTab === 10 && isToggleSubmenu ? 'active' : ''}`}
                        onClick={()=> isOpenSubmenu(10)}>                        
                        <span className="icon"><FaProductHunt /></span>
                        Admin Account
                        <span className="arrow"><KeyboardArrowRightOutlinedIcon /></span>
                    </Button>
                    <div className={`submenuContainer ${activeTab === 10 && isToggleSubmenu === true ?
                        'openMenu' : 'closeMenu'
                     }`}>
                        <ul className="submenu">
                            <li>
                                <Link to={"/admin/list"}>All Users</Link>
                                <Link to={"/admin/add"}>Update Admin Role</Link>
                                <Link to={"/admin/deletedUsers"}>Deleted Users</Link>
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

            <div className="logoutContainer">
                <div className="logoutBox">
                    <Button variant="contained"><IoMdLogOut />Logout</Button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;