import React from "react";
import { useState, useContext, useRef, useEffect } from "react";
import "../header/header.css";
import Logo from '../../assets/images/logo.png';
// import Button from 'react-bootstrap/Button';
import SearchIcon from '@mui/icons-material/Search';
import Search from "@mui/icons-material/Search";
import Select from "../selectDropdown/select";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Button } from "@mui/material";
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Navbar from "../header/nav/nav.jsx";
import food from "../../assets/images/food.jpg"
import { fetchDataFromApi } from "../../utils/api2.js";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { FaRegCircleUser } from "react-icons/fa6";
import MenuDropdown from "../menuDropdown/menuDropdown.jsx";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgress from '@mui/material/CircularProgress';
import SearchBar from "../searchBar/SerarchBar.jsx";



import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";





// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import SendIcon from '@mui/icons-material/Send';

const Header =  ()=>{

    const [categories, setCategories] = useState([
        "All Categories",
        "Milds and Dairy",
        "Wines and Drinks",
        "Clothing and Beauty",
        "Fresh Sea Food",
        "Bread and Juice",
        "Pet Food",
        "Fresh Fruits",
        "Baking Materials",
        "Vegetables"
    ])
    const [counties, setCounties] = useState([
        "Nimba",
        "Bong",
        "Lofa",
        "Grand Bassa",
        "Sinoe",
        "Grand Gedeh",
        "Grand Cape Mount",
        "Maryland",
        "Bomi",
        "River Gee",
        "River Cess"  
    ]);
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const [isOpenCartDropdown, setIsOpenCartDropdown] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElHelp, setAnchorElHelp] = React.useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchFields, setSearchFields] = useState("");

    const context = useContext(MyContext);
    const history = useNavigate();
    const searchInput = useRef();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseHelp = () => {
        setAnchorElHelp(null);
    };

    const handleClickHelp = (event) => {
        setAnchorElHelp(event.currentTarget);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        alert()
        context.setIsLogin(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        history("/");
    }

    const handleLogin = () => {
        setAnchorEl(null);
        // context.setIsLogin(true);
    }

    const searchProducts = (e) => {
        alert(searchInput.current.value)
        setSearchFields(searchInput.current.value)

        if (searchInput.current.value !== "") {
            setIsLoading(true);
            fetchDataFromApi(`/api/search?q=${searchInput.current.value}`).then((res) => {
                context.setSearchedItems(res);
                setTimeout(() => {
                    history("/search");
                    setIsLoading(false);
                    searchInput.current.value = "";
                }, 2000);
                setIsLoading(false);
            })
        }
    }

    useEffect(()=>{
        fetchDataFromApi('/api/category/').then((res)=> {
            setCategories(res);
        })

    }, [])

    return(
        <>
            <div className="headerContainer">
                <header>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-2">
                                <img className="logo" src={Logo} /> 
                            </div>

                            <div className="col-sm-6 headerSearchContainer">
                                {/* <div className="headerSearch d-flex align-items-center">
                                    <Select data={categories} placeholder={"All Categories"} icon={false}/>
                                    <div className="search" >
                                        <input type="text"  placeholder="Search for product,  brand,  category" ref={searchInput} />
                                        
                                    </div>
                                    {
                                        isLoading === true ? 
                                        <div className="searchIconContainer">
                                            <CircularProgress className="loading"/> 
                                        </div> 
                                        :
                                        <div className="searchIconContainer">
                                            <SearchIcon className="searchIcon cursor" onClick={searchProducts} />
                                        </div>

                                    }
                                   
                                </div> */}
                                <div className="headerSearch d-flex align-items-center">
                                <SearchBar></SearchBar>

                                </div>

                            </div>

                            <div className="col-sm-4 d-flex align-items-center">
                                <div className="m-0 d-flex align-items-center w-100">
                                    {/* <div className="countyWrapper">
                                        <Select data={counties} placeholder={"County"} icon={<LocationOnOutlinedIcon className="icon" style={{opacity: "0.5"}} />} />
                                    </div> */}

                                    <ul className="list list-inline w-100 d-flex align-items-center justify-content-end mb-0 headerTabs">
                                   
                                        <li className="list-inline-item">
           
                                            <Button 
                                                className=" mr-3 res-hide"
                                                aria-controls="simple-menu2"
                                                aria-haspopup="true"
                                                onClick={handleClickHelp}> 
                                                <IoMdHelpCircleOutline className="actionsIcon" /> 
                                                <span className="iconText" >Help</span>
                                            </Button>

                                            <Menu
                                                keepMounted
                                                anchorEl={anchorElHelp}
                                                onClose={handleCloseHelp}
                                                open={Boolean(anchorElHelp)}>
                                                <MenuItem onClick={handleCloseHelp}>
                                                    Customer Service
                                                </MenuItem>
                                                <MenuItem onClick={handleCloseHelp}>
                                                    How to Buy?
                                                </MenuItem>
                                                <MenuItem onClick={handleCloseHelp}>
                                                    How to Sell?
                                                </MenuItem>
                                                <MenuItem onClick={handleCloseHelp}>
                                                    Returns & Refunds
                                                </MenuItem>
                                            </Menu>
                                        </li>

                                        <li className="list-inline-item">
                                            <Button 
                                                className=" mr-3 res-hide"
                                                aria-controls="simple-menu"
                                                aria-haspopup="true"
                                                >   
                                                {/* <Link to={'/cart'}> */}
                                                    <ShoppingCartOutlinedIcon className="actionsIcon" /> 
                                                    <span className="badge rounded-circle">{context.cartData?.data?.length}</span>
                                                    
                                                    {/* <div className="d-flex align-items-end"> */}
                                                        <span className="iconText" onClick={() => setIsOpenCartDropdown(!isOpenCartDropdown)}>Cart</span>
                                                    {/* </div> */}
                                                {/* </Link> */}
                                            </Button> 
                                        </li>

                                        <li className="list-inline-item">
                                            <Button 
                                                className="mr-3 res-hide"
                                                aria-controls="simple-menu"
                                                aria-haspopup="true"
                                                onClick={handleClick}> 
                                                    <FaRegCircleUser className="actionsIcon" /> 
                                                    {
                                                        context.isLogin &&
                                                        <span className="iconText">Account <KeyboardArrowDownIcon/></span>

                                                    }

                                            </Button>
                                            <Menu
                                                keepMounted
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                                open={Boolean(anchorEl)}>
                                                <MenuItem onClick={handleClose}>
                                                    My Account
                                                </MenuItem>
                                                <MenuItem onClick={handleClose}>
                                                    <Link to={"/wishList"}>WishList</Link>
                                                </MenuItem>
                                                <MenuItem onClick={handleClose}>
                                                    Settings
                                                </MenuItem>
                                                <MenuItem onClick={handleClose}>
                                                    Profile
                                                </MenuItem>
                                                <MenuItem >
                                                    {
                                                        context.isLogin ? <Button className="btn-g signup btn-l" onClick={handleLogout}>Logout</Button>
                                                        :<Button className="btn-g signup" onClick={handleLogin}><Link to={'/login'}>Login</Link></Button>
                                                    }
                                                </MenuItem>
                                            </Menu>
                                        </li>  


                                        <li className="list-inline-item">
                                            {
                                                !context.isLogin &&
                                                <Button className="btn-g signup"><Link to={'/signup'}>signup</Link></Button>
                                            }
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </header>

                {
                    categories?.categoryList?.length !== 0 &&
                    categories?.categoryList !== undefined &&
                    <Navbar data={categories?.categoryList} />

                }
            </div>
        </>    
    )
}

export default Header;