import React, {useEffect, useState, useContext} from "react";
import {Link} from "react-router-dom";
import "../../header/nav/nav.css"
import { Button } from "@mui/material";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import { MyContext } from "../../../App";

const Navbar = (props)=> {
    const [navData, setNavData] = useState([]);

    const context = useContext(MyContext);
    console.log("testing....",context.categoryData)

    useEffect(()=>{
        setNavData(props.data)
    }, []);

    const getCategory = () => {
        alert()
    }

    return(
        <div className="nav d-flex align-items-center">
            <div className="container-fluid">
                <div className="row postion-relative">
                    <div className="col-sm-3 part1 ">
                        <nav>
                            <li className="list-inline-item">
                                <div className="d-flex align-items-center">
                                    <Button className="bg-success text-white categoryTab">
                                        <GridViewOutlinedIcon /> &nbsp;
                                        Browser All Categories
                                        <KeyboardArrowDownIcon />
                                    </Button>
                                </div>
                                
                                <div className="menuDropdown">
                                    <div className="selectDrop"> 
                                        <div className="searchField">
                                            <input type="text" placeholder="Search here.." />
                                        </div>
                                        <ul className="searchResults"> 
                                            { 

                                                context.categoryData?.categoryList?.map((category, index) => {

                                                    return (
                                                        <li
                                                            key={index} 
                                                            onClick={() => getCategory(category?._id)} 
                                                            className="cursor"
                                                        >
                                                            {category?.name} 
                                                        </li>

                                                       
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </nav>
                        
                    </div>

                    <div className="col-sm-7 part2 position-static">
                        <nav>
                            <ul className="list list-inline mb-0">
                                <li className="list-inline-item">
                                    <Button><Link to={'/'}>Home</Link></Button>
                                </li>

                                {/* {
                                    navData.length !== 0 && 
                                    navData.map((category, index) => {
                                        return(
                                            <li className="list-inline-item" key={index}>
                                                <Button>
                                                    <a href={` `}>
                                                        {category?.name}
                                                    </a>
                                                    <KeyboardArrowDownIcon />
                                                </Button>
                                                {
                                                    category?.children?.length !== 0 &&
                                                    <ul className="menuDropdown">
                                                        {
                                                            category?.children?.map((catItem, index) =>{
                                                                return (
                                                                    <li key={index}><Button><Link to={` `}>{catItem.name}</Link></Button></li>
                                                                )
                                                            })
                                                        }
                                                     
                                                    </ul>
                                                }
                                             
                                            </li>
                                        )
                                    })
                                } */}

                                <li className="list-inline-item"><Button>Returns & Refund</Button></li>

                                {/* <li className="list-inline-item"><Button>Become a Seller<KeyboardArrowDownIcon /></Button></li> */}

                                <li className="list-inline-item position-static">
                                    <Button>Become a Seller <KeyboardArrowDownIcon /></Button>
                                    <div className="menuDropdown megaMenu w-100">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="text-success">Friut and Vegetbles</h5>
                                                <ul className="mt-3 mb-0 pl-0" > 
                                                    <li>Meat and Poetry</li>
                                                    <li>Fresh Vegetable</li>
                                                    <li>Herbs & Seasoings</li>
                                                    <li>Cuts and Sprouts</li>
                                                    <li>Exotic Fruits and Vegies</li>
                                                    <li>Packaged Prouct</li>
                                                </ul>
                                            </div>

                                            <div className="col">
                                                <h5 className="text-success">Breakfast and Diary</h5>
                                                <ul className="mt-3 mb-0 pl-0"> 
                                                    <li>Meat and Poetry</li>
                                                    <li>Fresh Vegetable</li>
                                                    <li>Herbs & Seasoings</li>
                                                    <li>Cuts and Sprouts</li>
                                                    <li>Exotic Fruits and Vegies</li>
                                                    <li>Packaged Prouct</li>
                                                </ul>
                                            </div>
                                            <div className="col">
                                                <h5 className="text-success">Meat and Seafood</h5>
                                                <ul className="mt-3 mb-0"> 
                                                    <li>Meat and Poetry</li>
                                                    <li>Fresh Vegetable</li>
                                                    <li>Herbs & Seasoings</li>
                                                    <li>Cuts and Sprouts</li>
                                                    <li>Exotic Fruits and Vegies</li>
                                                    <li>Packaged Prouct</li>
                                                </ul>
                                            </div>
                                            <div className="col">
                                                <h5 className="text-success">Meat and Seafood</h5>
                                                <ul className="mt-3 mb-0 text-left"> 
                                                    <li>Meat and Poetry</li>
                                                    <li>Fresh Vegetable</li>
                                                    <li>Herbs & Seasoings</li>
                                                    <li>Cuts and Sprouts</li>
                                                    <li>Exotic Fruits and Vegies</li>
                                                    <li>Packaged Prouct</li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </li>

                                <li className="list-inline-item position-static">
                                    <Button>Our Services <KeyboardArrowDownIcon /></Button>
                                    <div className="menuDropdown megaMenu w-100">
                                        <div className="row">
                                            <div className="col">
                                                <h5 className="text-success">Friut and Vegetbles</h5>
                                                <ul className="mt-3 mb-0 pl-0" > 
                                                    <li>Meat and Poetry</li>
                                                    <li>Fresh Vegetable</li>
                                                    <li>Herbs & Seasoings</li>
                                                    <li>Cuts and Sprouts</li>
                                                    <li>Exotic Fruits and Vegies</li>
                                                    <li>Packaged Prouct</li>
                                                </ul>
                                            </div>

                                            <div className="col">
                                                <h5 className="text-success">Breakfast and Diary</h5>
                                                <ul className="mt-3 mb-0 pl-0"> 
                                                    <li>Meat and Poetry</li>
                                                    <li>Fresh Vegetable</li>
                                                    <li>Herbs & Seasoings</li>
                                                    <li>Cuts and Sprouts</li>
                                                    <li>Exotic Fruits and Vegies</li>
                                                    <li>Packaged Prouct</li>
                                                </ul>
                                            </div>
                                            <div className="col">
                                                <h5 className="text-success">Meat and Seafood</h5>
                                                <ul className="mt-3 mb-0"> 
                                                    <li>Meat and Poetry</li>
                                                    <li>Fresh Vegetable</li>
                                                    <li>Herbs & Seasoings</li>
                                                    <li>Cuts and Sprouts</li>
                                                    <li>Exotic Fruits and Vegies</li>
                                                    <li>Packaged Prouct</li>
                                                </ul>
                                            </div>
                                            <div className="col">
                                                <h5 className="text-success">Meat and Seafood</h5>
                                                <ul className="mt-3 mb-0 text-left"> 
                                                    <li>Meat and Poetry</li>
                                                    <li>Fresh Vegetable</li>
                                                    <li>Herbs & Seasoings</li>
                                                    <li>Cuts and Sprouts</li>
                                                    <li>Exotic Fruits and Vegies</li>
                                                    <li>Packaged Prouct</li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </li>

                                {/* <li className="list-inline-item"><Button>Blog</Button></li> */}

                                {/* <li className="list-inline-item">
                                    <Button>Pages <KeyboardArrowDownIcon /></Button>
                                    <div className="menuDropdown">
                                        <li><Button>About us</Button></li>
                                        <li><Button>contact</Button></li>
                                        <li><Button>Login</Button></li>
                                        <li><Button>Reggister</Button></li>
                                        <li><Button>Reset password</Button></li>
                                        <li><Button>Home</Button></li>
                                    </div>
                                </li>

                                <li className="list-inline-item"><Button>Contact</Button></li> */}

                            </ul>
                        </nav>
                    </div>

                    <div className="col-sm-2 part3 d-flex align-items-center">
                        <div className="phone d-flex align-items-center ml-auto"> 
                            <span><HeadphonesOutlinedIcon className="phoneIcon"/></span>
                            <div className="info ml-3">
                                <h3 className="text-success mb-0">+231 888 999</h3>
                                <p className="mt-0 mb-0">24/7 Support Center</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;