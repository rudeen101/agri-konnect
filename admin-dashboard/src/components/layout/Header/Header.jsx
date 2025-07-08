import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAppContext } from '../../../contexts/AppContext';
import profileImg from '../../../assets/images/rudeen.jpg';
import { Link } from 'react-router-dom';


const Header = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { 
        isSidebarOpen, 
        setIsSidebarOpen, 
        setIsOverlay 
    } = useAppContext();

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth > 992) {
                // Close mobile menu when desktop size is reached
                setIsSidebarOpen(false);
                setIsOverlay(false);
                document.body.style.overflow = 'auto';
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsSidebarOpen, setIsOverlay]);

    // Unified toggle function
    const toggleMobileMenu = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        setIsOverlay(newState);
        document.body.style.overflow = newState ? 'hidden' : 'auto';
    };

    return (
        <div className="top-bar">
            {/* Mobile menu button - now uses context state */}
            <button 
                className="mobile-menu-btn" 
                onClick={toggleMobileMenu}
                aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
     
            {/* Rest of your header content */}
            <div className="search-bar">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search courses, blogs..." />
            </div>
            <div className="user-profile">
                <div className="notification-icon">
                    <i className="fas fa-bell"></i>
                    <div className="notification-badge">3</div>
                </div>
                <Link to={"user/profile/update"}>
                     <img src={profileImg} alt="User Profile" />
                <span>Rudeen Zarwolo</span>
                </Link>
               
            </div>
        </div>
    );
};

export default Header;