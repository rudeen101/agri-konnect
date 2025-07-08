import React, { useState, useContext, useEffect, useRef } from "react";
import { FaBars, FaShoppingCart, FaUser, FaSearch, FaQuestionCircle, FaTimes } from "react-icons/fa";
import "./Header.css";
import Logo from '../../assets/images/logo.png';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { Button } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/apiCalls";
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from "js-cookie";
import QuickNav from "../nav/Nav";

const Header = () => {
    const [selectedCategory, setSelectedCategory] = useState("Categories");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);  
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'categories', 'help', 'account', 'browse';
    const [closingDropdown, setClosingDropdown] = useState(null);


    const context = useContext(MyContext);
    const navigate = useNavigate();
    const searchInput = useRef();
    const dropdownRefs = {
        categories: useRef(null),
        help: useRef(null),
        account: useRef(null),
        browse: useRef(null)
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(dropdownRefs).forEach(key => {
                if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
                    setActiveDropdown(null);
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // const toggleDropdown = (dropdownName) => {
    //     setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    // };

    const handleMouseEnter = (dropdownName) => {
        setActiveDropdown(dropdownName);
    };

      // In your dropdown items, add:
  const handleDropdownAction = (action) => {
    setClosingDropdown(null); // Cancel pending close
    action();
  };

        // Only auto-close if not on mobile
       const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setClosingDropdown(activeDropdown);
      setTimeout(() => {
        if (closingDropdown === activeDropdown) {
          setActiveDropdown(null);
        }
      }, 300); // 300ms delay
    }
    };

    const handleLogout = () => {
        alert()
        context.logout();
        navigate("/login");
    };

      // Modified toggleDropdown
  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setClosingDropdown(dropdownName);
      setTimeout(() => {
        setActiveDropdown(null);
        setClosingDropdown(null);
      }, 300);
    } else {
      setActiveDropdown(dropdownName);
      setClosingDropdown(null);
    }
  };

    const handleDashboardRedirect = () => {
        const isLoggedIn = Cookies.get("accessToken");
        const link = document.createElement('a');
        link.href = import.meta.env.VITE_DASHBOARD_URL;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
    };

    const searchProducts = (e) => {
        if (searchInput.current.value !== "") {
            setIsLoading(true);
            fetchDataFromApi(`/api/search?q=${searchInput.current.value}`).then((res) => {
                context.setSearchedItems(res);
                setTimeout(() => {
                    navigate(`/search/${searchInput.current.value}`);
                    setIsLoading(false);
                    searchInput.current.value = "";
                }, 2000);
                setIsLoading(false);
            })
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Provide search query!"
            })
        }
    };

    useEffect(() => {
        fetchDataFromApi('/api/category/').then((res) => {
            setCategories(res);
        });
    }, []);

    const cartCount = context?.cart?.items?.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
            <header className="header">
                {/* Top Section */}
                <div className="header-top">
                    {/* Mobile Menu Button */}
                    <div className="mobile-header-left">
                        <button
                            className="header-mobile-menu-button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>

                        {/* Mobile Search Button */}
                        <button 
                            className="mobile-search-toggle"
                            onClick={() => setShowMobileSearch(!showMobileSearch)}
                        >
                            <FaSearch />
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="header-logo"> 
                        <Link to={"/"}>
                            <img className="logo" src={Logo} alt="Logo" /> 
                        </Link>                               
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="desktop-search">
                        <div
                            className="category-dropdown-container"
                            ref={dropdownRefs.categories}
                            onMouseEnter={() => handleMouseEnter('categories')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <span className="category-selected">
                                {selectedCategory} <span className="dropdown-arrow">▼</span>
                            </span>
                            {activeDropdown === 'categories' && (
                                <ul className="category-dropdown">
                                    {categories?.categoryList?.length !== 0 &&
                                    categories?.categoryList !== undefined &&
                                    categories?.categoryList.map((cat, index) => (
                                        <Link to={`/product/category/${cat?._id}`} key={index}>
                                            <li
                                                onClick={() => {
                                                    setSelectedCategory(cat.name);
                                                    setActiveDropdown(null);
                                                }}
                                            >
                                                {cat.name}
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for product, brand, category" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            ref={searchInput}
                            onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                        />

                        {isLoading ? 
                            <button className="search-button">
                                <CircularProgress className="loading" size={20} />
                            </button>
                            :
                            <button className="search-button" onClick={searchProducts}>
                                <FaSearch />
                            </button>
                        }
                    </div>

                    {/* Icons */}
                    <div className="header-icons">
                        <div className="icon-group">
                            <button className="icon-button shopping-cart">
                                <Link to={"/cart"}>
                                    <FaShoppingCart />
                                    {cartCount > 0 && <span className="badge">{cartCount}</span>}
                                </Link>
                            </button>

                            <div 
                                className="user-dropdown-container"
                                ref={dropdownRefs.help}
                                onMouseEnter={() => handleMouseEnter('help')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button 
                                    className="icon-button help-button"
                                    onClick={() => toggleDropdown('help')}
                                >
                                    <FaQuestionCircle />
                                    <span className="iconText">Help <MdArrowDropDown className={`dropdownArrow ${activeDropdown === 'help' ? 'rotate' : ''}`} /></span>
                                </button>
                                {activeDropdown === 'help' && (
                                    <div className="user-dropdown">
                                        <button className="dropdown-item">Customer Service</button>
                                        <button className="dropdown-item">How to Buy?</button>
                                        <button className="dropdown-item">How to Sell?</button>
                                        <button className="dropdown-item">Returns & Refunds</button>
                                    </div>
                                )}
                            </div>
                        
                            <div 
                                className="user-dropdown-container"
                                ref={dropdownRefs.account}
                                onMouseEnter={() => handleMouseEnter('account')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button 
                                    className="icon-button account-button"
                                    onClick={() => toggleDropdown('account')}
                                >
                                    <FaUser /> 
                                    <span className="iconText">Account <MdArrowDropDown className={`dropdownArrow ${activeDropdown === 'account' ? 'rotate' : ''}`} /></span>
                                </button>
                                {activeDropdown === 'account' && (
                                    <div className="user-dropdown">
                                        <button className="dropdown-item" onClick={handleDashboardRedirect}>My Account</button>
                                        <Link to="/wishList">
                                            <button className="dropdown-item">WishList</button>
                                        </Link>
                                        <button className="dropdown-item">Profile</button>
                                        {context.isLogin ? 
                                            <Button 
                                                type="button"
                                                className="btn-g signup w-100"   
                                                onClick={(e) => {
                                                            e.stopPropagation();

                                                e.preventDefault();

                                                alert()
                                                    handleLogout();
                                                }}
                                            >
                                                Logout--
                                            </Button>
                                            : 
                                            <Button className="btn-g signup w-100">
                                                <Link to="/login">Login</Link>
                                            </Button>
                                        }
                                    </div>
                                )}
                            </div>

                            {!context.isLogin && (
                                <Button className="btn-g signup mobile-hide">
                                    <Link to="/signup">Signup</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar - Only shown when toggled */}
                {showMobileSearch && (
                    <div className="mobile-search active">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            ref={searchInput}
                            onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                        />
                        <button className="search-button" onClick={searchProducts}>
                            {isLoading ? <CircularProgress size={20} /> : <FaSearch />}
                        </button>
                    </div>
                )}

                {/* Mobile Dropdown Menu */}
                <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <ul>
                        {categories?.categoryList?.map((cat, index) => (
                            <li key={index}>
                                <Link 
                                    to={`/product/category/${cat?._id}`}
                                    onClick={() => {
                                        setSelectedCategory(cat?.name);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    {cat?.name}
                                </Link>
                            </li>
                        ))}
                        <li className="mobile-auth-links">
                            {!context.isLogin && (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Signup</Link>
                                </>
                            )}
                            {context.isLogin && (
                                <button onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}>
                                    Logout
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </header>

            {/* Quick Link Navigation Bar */}
            <QuickNav />

        </>
    );
};

export default Header;