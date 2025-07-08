import React, {useContext, useState, useEffect, } from "react";
import "./sidebar.css";
import product from "../../assets/images/food.jpg";
import Box from "@mui/material/Box"
import Slider from "@mui/material/Slider"
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { MyContext } from "../../App";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import{ Link, useParams, useNavigate } from "react-router-dom";


const label = {inputProps: {'aria-label':'Checkbox demo'}}


const Sidebar = (props) => {
    const [value, setValue] = React.useState([1, 10000]);
    const [catId, setCatId] = useState("");


    const context = useContext(MyContext);
    const {id} = useParams();

    const handleFilterChange = (collection) => {
        props.onChangeFilter(collection);       
    };

    useEffect(() => {
        setCatId(id);
        props.filterByPrice(value, id)

    }, [id]);

    useEffect(() => {
        setCatId(id);
        props.filterByPrice(value, catId)
    }, [value]);

    return(
        <>
            <div className="sidebar">
                <div className="wrapper mb-3">
                    <h5>Category</h5>

                    <div className="catList">
                        {
                            context?.categoryData?.categoryList?.length !== 0 && context?.categoryData?.categoryList?.length !== undefined &&
                            context?.categoryData?.categoryList?.map((category, index) => {
                                return (
                                    <Link to={`/product/category/${category?._id}`}>
                                        <div className="catItem  d-flex align-items-center">
                                            <span className="img"><img src={category?.images[0]} alt="produdct image" width={50}/></span>
                                            <h6 className="mb-0 ml-3">{category?.name}</h6>
                                        </div>
                                    </Link>
                                )
                            })
                        }
     
                    </div>
                </div>

                <div className="wrapper">

                    <div className="filters">
                        <h6>Filter By Collection</h6>

                        <ul className="pl-0">
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <li> 
                                    <FormControlLabel value={"featured"} onChange={() => {handleFilterChange("featured")}} control={<Radio />} label={"Featured"} />
                                </li>
                                <li> 
                                    <FormControlLabel value={"popular"} onChange={() => {handleFilterChange("popular")}} control={<Radio />} label={"Popular"} />
                                </li>
                                <li> 
                                    <FormControlLabel value={"topSelling"} onChange={() => {handleFilterChange("topSelling")}} control={<Radio />} label={"Top Selling"} />
                                </li>
                                <li> 
                                    <FormControlLabel value={"recommended"} onChange={() => {handleFilterChange("recommended")}} control={<Radio />} label={"Recommended"} />
                                </li>
                                <li> 
                                    <FormControlLabel value={"newlyAdded"} onChange={() => {handleFilterChange("newlyAdded")}} control={<Radio />} label={"Newly Added"} />
                                </li>
                            </RadioGroup>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar; 