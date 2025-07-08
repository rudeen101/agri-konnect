import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { MdArrowDropDown } from 'react-icons/md';
import { MyContext } from '../../App';
import "./Nav.css"

const QuickNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const context = useContext(MyContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth > 768) { // Only auto-open on desktop
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // Add a small delay to allow moving to dropdown
    const timer = setTimeout(() => {
      if (window.innerWidth > 768) {
        setIsDropdownOpen(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryClick = (categoryName) => {
    setIsDropdownOpen(false);
  };

  const quickLinks = [
    { path: "/", text: "Today's Deals" },
    { path: "/", text: "Customer Service" },
    { path: "/seller", text: "Become a Seller" },
    { path: "/", text: "Returns & Refund" }
  ];

  return (
    <nav className="quick-nav">
      <div className="quick-nav-container">
        {/* Categories Dropdown - Wrap both trigger and menu in same container */}
        <div
          className="dropdown-wrapper"
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="quick-nav-dropdown"
            onClick={toggleDropdown}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <GridViewOutlinedIcon className="gridIcon" />
            Browse all categories 
            <MdArrowDropDown className={`dropdown-icon ${isDropdownOpen ? 'rotate' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ul 
              className="browser-dropdown"
              onMouseEnter={handleMouseEnter} // Keep open when hovering dropdown
              onMouseLeave={handleMouseLeave}
            >
              {context?.subCategoryData?.map((subCat, index) => (
                <li key={index}>
                  <Link 
                    to={`/product/subCat/${subCat?._id}`}
                    onClick={() => handleCategoryClick(subCat.name)}
                  >
                    {subCat.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Links */}
        <ul className="quick-links">
          {quickLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.path}>{link.text}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default QuickNav;