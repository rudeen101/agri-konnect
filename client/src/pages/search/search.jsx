import React, { useContext, useState, useEffect} from "react";
import "./search.css";
import{ Link, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import ProductCard from "../../components/product/product";
import { Button, CircularProgress } from "@mui/material";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";


const SearchPage = () =>{
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const [isOpenDropdown2, setIsOpenDropdown2] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filterId, setFilterId] = useState("");
    const [productData, setProductData] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("");

    // const {id} = useParams();
    const context = useContext(MyContext);


    return(
        <section className="listingPage">
            <div className="container-fluid">
                <div className="listingData">
                    <div className="row">
                        <div className="col-md-3 sidebarContainer">
                            <div className="sidebar">
                                <div className="wrapper mb-3">
                                    <h5>Category</h5>
                
                                    <div className="catList">
                                        {
                                            context?.categoryData?.categoryList?.length !== 0 && context?.categoryData?.categoryList?.length !== undefined &&
                                            context?.categoryData?.categoryList?.map((category, index) => {
                                                return (
                                                    <Link to={`/product/category/${category?._id}`} key={index}>
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
                            </div>   
                        </div>

                        <div className="col-md-9 rightContent homeProducts pt-0">
                            <div className="topHeading d-flex align-items-center justify-content-between">
                                <p className="mb-0">We found <span className="text-success"> {context?.searchedItems.length > 0 ? context?.searchedItems.length : "0" } </span>items for you!</p>
                                {/* <div className="ml-auto d-flex align-items-center">
                                    <div className="tab position-relative">
                                        <Button className="btn" onClick={() => setIsOpenDropdown(!isOpenDropdown)}><GridViewOutlinedIcon />Show: 50</Button>
                                        {
                                            isOpenDropdown !== false &&
                                            <ul className="dropdownMenu">
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown(false)}>100</Button></li>
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown(false)}>100</Button></li>
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown(false)}>150</Button></li>
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown(false)}>200</Button></li>
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown(false)}>300</Button></li>
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown(false)}>All</Button></li>
                                            </ul>
                                        }
                                    </ div>

                                    <div className="tab position-relative">
                                        <Button className="btn" onClick={() => setIsOpenDropdown2(!isOpenDropdown2)}><FilterListOutlinedIcon />Sort by Featured</Button>
                                        {
                                            isOpenDropdown2 !== false &&
                                            <ul className="dropdownMenu">
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown2(false)}>Price: Low to High</Button></li>
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown2(false)}>Price High to Low</Button></li>
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown2(false)}>Release Date</Button></li>
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown2(false)}>Avg. Rating</Button></li>
                                                <li><Button className="align-items-center" onClick={()=> setIsOpenDropdown2(false)}>300</Button></li>
                                            </ul>
                                        }
                                    </ div>

                                </div> */}
                            </div>
                            
                            <div className="productContainer pl-4 pr-3">
                                {
                                    isLoading === true?
                                        <div className="loading d-flex align-items-center justify-content-center">
                                            <CircularProgress className="progressIcon" color="inherit" />
                                        </div>
                                        : 
                                        <div className="productRow">
                                            {
                                                context?.searchedItems?.map((item, index) => {
                                                    return(
                                                        <div className="item" key={index}>
                                                            <ProductCard data={item} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>   
                                   
                                }
                            
                                {/* <div className="item">
                                    <ProductCard tag="hot" />
                                </div>
                                <div className="item">
                                    <ProductCard tag="new"  />
                                </div>
                                <div className="item">
                                    <ProductCard tag="new"  />
                                </div>
                                <div className="item">
                                    <ProductCard tag="best"  />
                                </div>
                                <div className="item">
                                    <ProductCard tag="hot"  />
                                </div>
                                <div className="item">
                                    <ProductCard tag="best"  />
                                </div>
                                <div className="item">
                                    <ProductCard tag="best"  />
                                </div>
                                <div className="item">
                                    <ProductCard tag="new"  />
                                </div>
                                <div className="item">
                                    <ProductCard tag="best"  />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SearchPage;