import React, { useState, useContext} from "react";
import "./header.css";
import logo from "../../assets/images/logo.png";
import { Button } from "@mui/material";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SearchBox from "../searchbox/SearchBox";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import userAvatar from "../../assets/images/rudeen.jpg";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { MdMenu } from "react-icons/md";
import MenuDropdown from "../menuDropdown/menuDropdown";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { MyContext } from "../../App";
import UserAvatarImg from "../userAvatarImg/userAvatarImg";

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { IoShieldHalfSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";



// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Tooltip from '@mui/material/Tooltip';
// import PersonAdd from '@mui/icons-material/PersonAdd';
// import Settings from '@mui/icons-material/Settings';
// import Logout from '@mui/icons-material/Logout';

// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Fade from '@mui/material/Fade';


const Header = () => {
    
    const [isOpenNotificationDrop, setIsOpenNotificationDrop] = useState(false)
    const openNotifications = Boolean(isOpenNotificationDrop);
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const resetPassword = () => {
        setAnchorEl(null);

    }

    const logout = () => {
        setAnchorEl(null);
        context.setIsLogin(false);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        history("/");
    }
    const context = useContext(MyContext);
    const history = useNavigate();
    

 
    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100 flex-row">
                        <div className="col-sm-2 part1">
                            <Link to={'/'} className="logo">
                                <img className="logo" src={logo} alt="Site logo" />
                            </Link>
                        </div>
                        {
                            context.windowwidth > 992 &&
                            <div className="col-sm-3 d-flex align-items-center part2 pl-4 res-hide">
                                <Button className="rounded-circle mr-3" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                                    {
                                        context.isToggleSidebar === false ?  <MenuOpenIcon /> : <MdMenu />
                                    }
                                
                                </Button>
                                <SearchBox />
                            </div>
                        }
                       
                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                            <Button className="rounded-circle mr-3" onClick={() => context.setThemeMode(!context.themeMode)}><LightModeOutlinedIcon /></Button>
                            {/* <Button className="rounded-circle mr-3 res-hide" ><ShoppingCartOutlinedIcon /></Button> */}
                            {/* <MenuDropdown icon={<ShoppingCartOutlinedIcon />}></MenuDropdown> */}
                            {/* <MenuDropdown icon={<MailOutlinedIcon />}></MenuDropdown> */}
                            <MenuDropdown icon={<NotificationsOutlinedIcon />}></MenuDropdown>
                            <Button className="rounded-circle mr-3" onClick={() => context.setIsOpenNav(!context.isOpenNav)}><MdMenu /></Button>

                            {
                                context.isLogin !== true ? 
                                <Link to="/login">
                                    <Button className="btn-blue btn-large btn-round">Sign In</Button> 
                                </Link> 
                                :
                                <div className="myAccountContainer">
                                    <Button 
                                        className="myAccount d-flex align-items-center res-hide"
                                        aria-controls="simple-menu"
                                        aria-haspopup="true"
                                        onClick={handleClick}
                                    >
                                        
                                        {/* <UserAvatarImg img={Avatar} />   */}
                                        <div className="userImage">
                                            <span className="rounded-circle">
                                                { 
                                                    context?.userData?.image !== "" ? 
                                                    <img src={userAvatar} className="w-100" alt="user profile picture" />
                                                    : context?.userData?.username.charAt(0)
                                                }
                                            </span>
                                        </div>   

                                        <div className="userInfo res-hide">
                                            <h4>{context?.userData?.username}</h4>
                                            <p className="mb-0">{context?.userData?.email}</p>
                                        </div>
                                    </Button>
                                    <Menu
                                        keepMounted
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        open={Boolean(anchorEl)}>
                                        <MenuItem onClick={handleClose}>
                                            My Account
                                        </MenuItem>
                                        <MenuItem onClick={resetPassword}>
                                            <ListItemIcon>
                                                <IoShieldHalfSharp />
                                            </ListItemIcon>
                                            Reset Password
                                        </MenuItem>
                                        <MenuItem onClick={logout}>
                                            <ListItemIcon>
                                                <MdOutlineLogout />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </div>
                            }        
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;