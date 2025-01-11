import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import "./menuDropdown.css";


const MenuDropdown = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
   
            {/* <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}>
                Open Menu List
            </Button> */}
            <Button 
                className="rounded-circle res-hide mr-3 res-hide"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}>
                {props.icon}
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
                    Settings
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default MenuDropdown;