import React, {useContext, useState, useEffect} from "react";
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
import{ Link, useParams } from "react-router-dom";


const label = {inputProps: {'aria-label':'Checkbox demo'}}


const Sidebar = (props) => {
    const [value, setValue] = React.useState([1, 10000]);
    const [ratingValue, setRatingValue] = useState([]);
    const [catId, setCatId] = useState("");

    const context = useContext(MyContext);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const filterByRating = (rating) => {
        props.filterByRating(rating);
    }

    const {id} = useParams();


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
                    <h5>Filter by price</h5>
                    <Slider 
                        min={1}
                        step={1}
                        max={10000}
                        getAriaLabel={() => "Temperature Range"}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        // getAriaValueText={valuetext}
                        color="success"
                    />

                    <div className="d-flex pt-2 pb-2 priceRange">
                        <span>From: <strong className="text-success">${value[0]}</strong></span> &nbsp; &nbsp;
                        <span>To: <strong className="text-success">${value[1]}</strong></span>
                    </div>

                    {/* <div className="filters">
                        <h6>Color</h6>
                        <ul className="mb-0">
                            <li><Checkbox  {...label} color="success"/>Red (56)</li>
                            <li><Checkbox  {...label} color="success"/>Blue (56)</li>
                            <li><Checkbox  {...label} color="success"/>Green (56)</li>
                            <li><Checkbox  {...label} color="success"/>Red (56)</li>
                            <li><Checkbox  {...label} color="success"/>Red (56)</li>
                            <li><Checkbox  {...label}/>Red (56)</li>
                            <li><Checkbox  {...label} color="success"/>Red (56)</li>
                            <li><Checkbox  {...label}/>Red (56)</li>
                            <li><Checkbox  {...label} color="success"/>Red (56)</li>
                            <li><Checkbox  {...label}/>Red (56)</li>
                            <li><Checkbox  {...label} color="success"/>Red (56)</li>
                            <li><Checkbox  {...label}/>Red (56)</li>
                            <li><Checkbox  {...label} color="success"/>Red (56)</li>
                            <li><Checkbox  {...label}/>Red (56)</li>
                            <li><Checkbox  {...label} color="success"/>Red (56)</li>
                            <li><Checkbox  {...label}/>Red (56)</li>
                        </ul>
                    </div> */}

                    <div className="filters">
                        <h6>Filter By Colllection</h6>
                        <ul className="pl-0">
                            <li><Checkbox  {...label} color="success"/>Fetaured</li>
                            <li><Checkbox  {...label} color="success"/>Popular(56)</li>
                            <li><Checkbox  {...label} color="success"/>Top Selling(56)</li>
                            <li><Checkbox  {...label} color="success"/>Recommended</li>
                            <li><Checkbox  {...label} color="success"/>Newly Added (56)</li>
                        </ul>
                    </div>

                    <div className="filters">
                        <h6>Filter Items By Rating</h6>
                        <ul className="pl-0">
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <li> 
                                    <FormControlLabel value={5} onChange={() => {filterByRating(5)}} control={<Radio />} label={5} />
                                </li>
                                <li> 
                                    <FormControlLabel value={4} onChange={() => {filterByRating(4)}} control={<Radio />} label={4} />
                                </li>
                                <li> 
                                    <FormControlLabel value={3} onChange={() => {filterByRating(3)}} control={<Radio />} label={3} />
                                </li>
                                <li> 
                                    <FormControlLabel value={2} onChange={() => {filterByRating(2)}} control={<Radio />} label={2} />
                                </li>
                                <li> 
                                    <FormControlLabel value={1} onChange={() => {filterByRating(1)}} control={<Radio />} label={1} />
                                </li>
                            </RadioGroup>
                        </ul>
                    </div>

                    <div className="d-flex">
                        <Button className="btn btn-success"><FilterAltOutlinedIcon /> Filter</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar; 