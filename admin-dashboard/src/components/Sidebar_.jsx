import React, {useEffect, useState, useContext} from "react";
import { MyContext } from "../App";
import { Link } from 'react-router-dom';

const Sidebar = () => {
    // State management
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);


    const context = useContext(MyContext)

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
        context?.setIsSidebarOpen(!context?.isSidebarOpen);
        context?.setIsOverlay(!context?.isOVerlay);
        document.body.style.overflow = context?.isSidebarOpen  ? 'auto' : 'hidden';
    }

    const toggleDropdown = (dropdownName) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
      };

    return (
        <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${context?.isSidebarOpen ? "active" : ""}`}>
            <div className="sidebar-header">
                <div className="logo">IX</div>
                <div className="logo-text">InnovateX</div>
            </div>

            <div className="menu">
                <Link className="menu-item active" onClick={handleLinkClick}> 
                    <div className="menu-icon"><i className="fas fa-home"></i></div>
                    <div className="menu-text">Dashboard Home</div>
                </Link>
        
                <div className={`dropdown ${activeDropdown === 'courses' ? 'open' : ''}`}  onClick={() => toggleDropdown('courses')}>
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
                </div>

                <div className={`dropdown ${activeDropdown === 'blog' ? 'open' : ''}`}  onClick={() => toggleDropdown('blog')}>
                    <div className="menu-item " >
                        <div className="menu-icon"><i className="fas fa-tasks"></i></div>
                        <div className="menu-text">Blog</div>
                        <div className="dropdown-arrow">
                            <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
                        </div>
                    </div>

                    <div className="dropdown-menu ">
                        <Link className="dropdown-item" to="/courses/web-development">
                            <div className="dropdown-icon"><i className="fas fa-eye"></i></div>
                            <div className="dropdown-text">View Blogs</div>
                        </Link>
                        <Link className="dropdown-item" to="/courses/web-development">
                            <div className="dropdown-icon"><i className="fas fa-plus"></i></div>
                            <div className="dropdown-text">Add New Blog</div>
                        </Link>
                    </div>
                </div>

                <div className={`dropdown ${activeDropdown === 'team' ? 'open' : ''}`}  onClick={() => toggleDropdown('team')}>
                    <div className="menu-item " >
                        <div className="menu-icon"><i className="fas fa-users"></i></div>
                        <div className="menu-text">Team</div>
                        <div className="dropdown-arrow">
                            <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
                        </div>
                    </div>

                    <div className="dropdown-menu ">
                        <Link className="dropdown-item" to="/courses/web-development">
                            <div className="dropdown-icon"><i className="fas fa-eye"></i></div>
                            <div className="dropdown-text">View Team Members</div>
                        </Link>
                        <Link className="dropdown-item" to="/courses/web-development">
                            <div className="dropdown-icon"><i className="fas fa-plus"></i></div>
                            <div className="dropdown-text">Add New Member</div>
                        </Link>
                    </div>
                </div>

                <div className="menu-item">
                    <div className="menu-icon"><i className="fas fa-envelope"></i></div>
                    <div className="menu-text">Newsletter</div>
                </div>
                <div className="menu-item">
                    <div className="menu-icon"><i className="fas fa-bell"></i></div>
                    <div className="menu-text">Notifications</div>
                </div>
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