import React, { useState, useContext} from "react";
import "./header.css";
import logo from "../../assets/images/logo.png";
import { Button } from "@mui/material";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SearchBox from "../searchbox/SearchBox";
import userAvatar from "../../assets/images/rudeen.jpg";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { MdMenu } from "react-icons/md";
import MenuDropdown from "../menuDropdown/menuDropdown";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { MyContext } from "../../App";
import { IoShieldHalfSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";


const Header = () => {
    
    const [anchorEl, setAnchorEl] = React.useState(null);

    const context = useContext(MyContext);
    const navigate = useNavigate();
    
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
        context.logout();
    }

    function getUserInitials(fullName) {
        if (!fullName) return ""; // Handle empty input
    
        const nameParts = fullName.trim().split(" "); // Split name by space
        if (nameParts.length > 1) {
            // If there is more than one name, return initials (First letter of first & last name)
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        }
        
        // If only one name exists, return the first letter capitalized
        return nameParts[0][0].toUpperCase();
    }

 
    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100 flex-row">
                        <div className="col-sm-2 part1">
                            <Link to={'/dashboard'} className="logo">
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
                      
                            <MenuDropdown icon={<NotificationsOutlinedIcon />}></MenuDropdown>
                            <Button className="rounded-circle mr-3" onClick={() => context.setIsOpenNav(!context.isOpenNav)}><MdMenu /></Button>

                            {
                                context?.isAuthenticated !== true ? 
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
                                        <div className="userInfo res-hide">
                                            <h4>{context?.userData?.username.trim().split(" ")[0]}</h4>
                                        </div>
                                        {/* <UserAvatarImg img={Avatar} />   */}
                                        <div className="userImage">
                                            <span className="rounded-circle">
                                                { 
                                                    context?.userData?.image ? 
                                                    <img src={userAvatar} className="w-100" alt="user profile picture" />
                                                    : getUserInitials(context?.userData?.username)
                                                }
                                            </span>
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