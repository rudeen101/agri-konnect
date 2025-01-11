import React from "react";
import "./newsletter.css"
import { Button } from "@mui/material";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';


const Newsletter = () =>{
    return(
        <div className="newsLetterBanner">
            <FavoriteBorderOutlinedIcon />
            <input type="text" placeholder="Enter your email" />
            <Button className="bg-success">Subscribe</Button>
        </div>
    )
}

export default Newsletter;