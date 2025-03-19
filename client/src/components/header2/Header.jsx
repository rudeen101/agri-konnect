import React, { useState, useContext, useEffect, useRef } from "react";
import { FaBars, FaShoppingCart, FaUser, FaSearch, FaQuestionCircle } from "react-icons/fa";
import "./Header.css"; // Import the updated CSS
import Logo from '../../assets/images/logo.png';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { Button } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/apiCalls";
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from "js-cookie";



const Header = () => {
    const [selectedCategory, setSelectedCategory] = useState("Categories");
    const [showCategories, setShowCategories] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showHelpDropdown, setShowHelpDropdown] = useState(false);
    const [showBrowserDropdown, setShowBrowserDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);  

    const context = useContext(MyContext);
    const navigate = useNavigate();
    const searchInput = useRef();

    const handleLogout = () => {
        context.logout();
        navigate("/login");
    }

    const handleLogin = () => {
        setAnchorEl(null);
        // context.setIsLogin(true);
    }

    const handleDashboardRedirect = () => {
        const isLoggedIn = Cookies.get("accessToken");
    
        if (isLoggedIn) {
            window.location.href = import.meta.env.VITE_DASHBOARD_URL;
        } else {
            window.location.href = "/login?redirect=dashboard"; // Redirect to login with a return URL
        }
    };

   
    const searchProducts = (e) => {
        // setSearchFields(searchInput.current.value)

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
        }else{
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Provide search query!"
            })
        }
    }

    useEffect(()=>{
        fetchDataFromApi('/api/category/').then((res)=> {
            setCategories(res);
        })
    }, [])

    const getCategory = () => {

    }

    const cartCount = context?.cart?.items?.reduce((total, item) => total + item.quantity, 0);


    return (
        <>
            <header className="header">
                {/* Top Section */}
                <div className="header-top">
                {/* Mobile Menu Button */}

                <button
                    className="header-mobile-menu-button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <FaBars />
                </button>

                {/* Logo */}
                <div className="header-logo"> 
                    <Link to={"/"}>
                        <img className="logo" src={Logo} /> 
                    </Link>                               
                </div>

                {/* Desktop Search Bar */}
                <div className="desktop-search">
                    <div
                        className="category-dropdown-container"
                        onMouseEnter={() => setShowCategories(true)}
                        onMouseLeave={() => setShowCategories(false)}
                    >
                    <span className="category-selected">
                        {selectedCategory} <span className="dropdown-arrow">▼</span>
                    </span>
                    {showCategories && (
                        <ul className="category-dropdown">
                            {
                                categories?.categoryList?.length !== 0 &&
                                categories?.categoryList !== undefined &&
                                categories?.categoryList.map((cat, index) => (
                                    <Link to={`/product/category/${cat?._id}`} key={index}>
                                        <li
                                            key={index}
                                            onClick={() => {
                                                setSelectedCategory(cat.name);
                                                // getCategory(cat);
                                                setShowCategories(false);
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
                        placeholder="Search for product,  brand,  category" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        // onKeyDown={(e) => e.key === "Enter"}
                        ref={searchInput}
                    />

                    {
                        isLoading === true ? 
                     
                        <button className="search-button" onClick={searchProducts}>
                            <CircularProgress className="loading" />
                        </button>
                        :
                        <button className="search-button" onClick={searchProducts}>
                            <FaSearch />
                        </button>

                    }
                </div>

                {/* Icons */}
                <div className="header-icons">
                    <button className="icon-button shoppingCart pr-4">
                        <Link to={"/cart"}>
                            <FaShoppingCart  />
                        </Link>
                        <span className="badge rounded-circle">{cartCount}</span>
                    </button>

                    <div
                        className="user-dropdown-container"
                        onMouseEnter={() => setShowHelpDropdown(true)}
                        onMouseLeave={() => {
                            setShowUserDropdown(false);
                            setShowHelpDropdown(false);
                        }}
                    >
                        <button className="icon-button">
                            <FaQuestionCircle /><span className="iconText">Help <MdArrowDropDown className="dropdonArrow" /></span>
                        </button>
                        {showHelpDropdown && (
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
                        onMouseEnter={() => setShowUserDropdown(true)}
                        onMouseLeave={() => {
                            setShowUserDropdown(false);
                            setShowHelpDropdown(false);
                        }}
                    >
                        <button className="icon-button">
                            <FaUser /> <span className="iconText">Account <MdArrowDropDown className="dropdonArrow" /></span>
                        </button>
                        {showUserDropdown && (
                            <div className="user-dropdown">
                                <button className="dropdown-item" onClick={() => handleDashboardRedirect()}> My Account</button>
                                <Link to={`/wishList`}>

                                <button className="dropdown-item">
                                        WishList
                                </button>
                                </Link>

                                <button className="dropdown-item">Profile</button>
                                {
                                    context.isLogin ? <Button className="btn-g signup w-100" onClick={handleLogout}>Logout</Button>
                                    :<Button className="btn-g signup w-100" onClick={handleLogin}><Link to={'/login'}>Login</Link></Button>
                                }
                            </div>
                        )}
                    </div>

                    {/* <Button className="btn-g signup"><Link to={'/signup'}>signup</Link></Button> */}
                    {
                        !context.isLogin &&
                        <Button className="btn-g signup"><Link to={'/signup'}>signup</Link></Button>
                    }

                </div>
                
                </div>

                {/* Mobile Search Bar */}
                <div className="mobile-search">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && console.log("Search:", query)}
                    />
                    <button className="search-button" onClick={() => console.log("Search:", query)}>
                        <FaSearch />
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-menu">
                    <ul>
                        {categories.map((cat, index) => (
                        <li
                            key={index}
                            onClick={() => {
                            setSelectedCategory(cat);
                            setMobileMenuOpen(false);
                            }}
                        >
                            {cat}
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
            </header>

            {/* Quick Link Navigation Bar */}
            <nav className="quick-nav">
                <button
                className="quick-nav-dropdown"
                onMouseEnter={() => setShowBrowserDropdown(true)}
                onMouseLeave={() => setShowBrowserDropdown(false)}
                >
                    <GridViewOutlinedIcon className="gridIcon"/>
                    Browse all categories ▼
                    {showBrowserDropdown && (
                    <ul className="browser-dropdown">
                        {context?.subCategoryData.map((subCat, index) => (
                        <Link to={`/product/subCat/${subCat?._id}`} key={index}>
                            <li key={index} onClick={() => {
                                setSelectedCategory(subCat.name); 
                            }}>
                                {subCat.name} 
                            </li>
                        </Link>

                        ))}
                    </ul>
                    )}
                </button>
                <ul className="quick-links">
                    <li><Link to={"/"}>Today's Deals</Link></li>
                    <li><Link to={"/"}>Customer Service</Link></li>
                    <li><Link to={"/"}>Become a Seller</Link></li>
                    <li><Link to={"/"}>Returns & Refund</Link></li>
                </ul>

            </nav>
        </>
    );
};

export default Header;
