import React, {useEffect, useState, useContext} from "react";
import { AppProvider } from '../../../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import Logo from "../../../assets/images/logo.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt, faTachometerAlt, faUsers, faBox, faTags,
  faShoppingCart, faMoneyBillWave, faChartLine, faCog,
  faSearch, faDownload, faEllipsisH, faEye, faExchangeAlt,
  faReceipt, faChevronLeft, faChevronRight, faTimes,
  faFilter, faCheckCircle, faExclamationCircle, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../../../contexts/AuthContext";


const Sidebar = () => {
    // State management
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { 
        isSidebarOpen, 
        setIsSidebarOpen, 
        setIsOverlay ,
        isOverlay 
    } = useAppContext();

    const navigate = useNavigate();
    const { logout } = useAuth();

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Toggle handlers
    const toggleCollapse = () => {setIsCollapsed(!isCollapsed); }

    // close sidebar when menu link is clicked
    const handleLinkClick = () => {
        setIsSidebarOpen(isSidebarOpen);
        setIsOverlay(isOverlay);
        document.body.style.overflow = isSidebarOpen  ? 'auto' : 'hidden';
    }

    const toggleDropdown = (dropdownName) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };


    return (
        <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${isSidebarOpen ? "active" : ""}`}>
            <div className="sidebar-header">
                <div className="logo"><img src={Logo} alt="" /></div>
                <div className="logo-text">AGRI-KONNECT</div>
            </div>

            <div className="menu">
                <Link to={"/"} className="menu-item active" onClick={handleLinkClick}> 
                    <div className="menu-icon"><FontAwesomeIcon icon={faTachometerAlt} /></div>
                    <div className="menu-text">Dashboard</div>
                </Link>

                <Link to={"/customers"} className="menu-item" onClick={handleLinkClick}> 
                    <div className="menu-icon"><FontAwesomeIcon icon={faUsers} /></div>
                    <div className="menu-text">Customers</div>
                </Link>

                <Link to={"/products"} className="menu-item " onClick={handleLinkClick}> 
                    <div className="menu-icon"><FontAwesomeIcon icon={faBox} /></div>
                    <div className="menu-text">Products</div>
                </Link>

                <Link to={"/categories"} className="menu-item " onClick={handleLinkClick}> 
                    <div className="menu-icon"><FontAwesomeIcon icon={faTags}/></div>
                    <div className="menu-text">Categories</div>
                </Link>

                <Link to={"/orders"} className="menu-item" onClick={handleLinkClick}> 
                    <div className="menu-icon"><FontAwesomeIcon icon={faShoppingCart} /></div>
                    <div className="menu-text">Orders</div>
                </Link>

                <Link to={"transctions"} className="menu-item" onClick={handleLinkClick}> 
                    <div className="menu-icon"><FontAwesomeIcon icon={faMoneyBillWave} /></div>
                    <div className="menu-text">Transactions</div>
                </Link>

                <Link className="menu-item" onClick={handleLinkClick}> 
                    <div className="menu-icon"><FontAwesomeIcon icon={faUsers} /></div>
                    <div className="menu-text">Administrations</div>
                </Link>

                <button className="logout-btn" onClick={logout}>
                    <span className="logout-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                    </span>
                    Logout
                </button>
        
                {/* <div className={`dropdown ${activeDropdown === 'courses' ? 'open' : ''}`}  onClick={() => toggleDropdown('courses')}>
                    <div className="menu-item " >
                        <div className="menu-icon"><i className="fas fa-book-open"></i></div>
                        <div className="menu-text">Courses</div>
                        <div className="dropdown-arrow">
                            <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
                        </div>
                    </div>

                    <div className="dropdown-menu ">
                        <Link className="dropdown-item" to="/courses/web-development">
                            <div className="dropdown-icon"><i className="fas fa-eye"></i></div>
                            <div className="dropdown-text">View Courses</div>
                        </Link>
                        <Link className="dropdown-item" to="/courses/web-development">
                            <div className="dropdown-icon"><i className="fas fa-plus"></i></div>
                            <div className="dropdown-text">Add New Course</div>
                        </Link>
                    </div>
                </div> */}


            </div>
        
            <div 
                onClick={toggleCollapse}
                className="toggle-btn"
                >
                {isCollapsed ? <i className="fas fa-chevron-right"></i>: <i className="fas fa-chevron-left"></i>}
            </div>
        </div>
    )
}

export default Sidebar;