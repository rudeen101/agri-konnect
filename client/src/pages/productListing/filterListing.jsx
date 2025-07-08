import React, { useContext, useState, useEffect} from "react";
import "./productListing";
import{ Link, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import ProductCard from "../../components/product/product";
import { Button, CircularProgress } from "@mui/material";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/apiCalls";
import ProductListingCard from "../../components/productListingCard/ProductListingCard";


const FilterListing = () =>{
    const [filterData, setFilterData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const filter = params.get("collecton");
        // alert(filter)

        if (filter === "featured") {
            // setFilterData(context?.recommendedProducts);

        }

        if (filter === "popular") {            
            setFilterData(context?.mostPopular);
            alert()
        }

        if (filter === "topSelling") {
            // setFilterData(context?.recommendedProducts);
        }

        if (filter === "recommended") {
            setFilterData(context?.recommendedProducts);
        }

        if (filter === "newlyAdded") {
            setFilterData(context?.newArrivals);
        }

    }, [])


    const filterByRating = (rating) => {
        setIsLoading(true);
        let apiEndPoint = `/api/product?rating=${rating}&category=${id}`;

        fetchDataFromApi(`${apiEndPoint}`).then((res) =>{
            setProductData(res)
            window.scrollTo({
                top: 0,
                bahavior: 'smooth'
            });
            setIsLoading(false);
        })
    }
    
    const filterByPrice = (price, catId) => {
        let url =  window.location.href;
        let apiEndPoint = "";



    }



    return(
        <>
             <div className="breadcrumbWrapper mb-4">
                <ul className="breadcrumb breadcrumb2 mb-0">
                    <li>
                        <Link to={"/"}>Home</Link>
                    </li>
                    <li>
                        <Link to={"#"}>Category</Link>
                    </li>
                    {/* <li>
                        <Link to={"#"}>{currentCategory?.name}</Link>
                    </li> */}
                </ul>
            </div>

            <section className="listingPage">
            <div className="container-fluid">
                <div className="listingData">
                    <div className="row">
                        <div className="col-md-3 sidebarContainer">
                            <Sidebar filterByRating={filterByRating} filterByPrice={filterByPrice}  />
                        </div>

                        <div className="col-md-9 rightContent homeProducts pt-0">
                            <div className="topHeading d-flex align-items-center justify-content-between">
                                <p className="mb-0">We found <span className="text-success"> {filterData?.length > 0 ? filterData?.length : "0" } </span>items for you!</p>
                            </div>
                            
                            <div className="productContainer pl-4 pr-3">
                                {
                                    isLoading === true ?
                                    <div className="loading d-flex align-items-center justify-content-center">
                                        <CircularProgress className="progressIcon" color="inherit" />
                                    </div>
                                    : 
                                    <div className="productRow">
                                        {
                                            filterData?.map((product, index) => {
                                                return(
                                                    <div className="item" key={index}>
                                                        <ProductListingCard productData={product} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>   
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>

    )
}

export default FilterListing;