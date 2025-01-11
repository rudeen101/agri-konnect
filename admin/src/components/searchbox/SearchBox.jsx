import React, { useState } from "react";
import "./searchBox.css";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';


const SearchBox = () =>{
    return (
        <div className="searchBox position-relative d-flex align-items-center">
            <SearchOutlinedIcon />
            <input type="text" placeholder="Search here.." />
        </div>
    );
}

export default SearchBox;