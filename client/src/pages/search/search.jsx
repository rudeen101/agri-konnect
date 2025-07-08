import React, { useContext, useState} from "react";
import "./search.css";
import{ Link, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { MyContext } from "../../App";
import ProductListingCard from "../../components/productListingCard/ProductListingCard";

const SearchPage = () =>{
    const [isLoading, setIsLoading] = useState(false);

    // const {id} = useParams();
    const context = useContext(MyContext);
    const {query} = useParams();


    return(
        <>
            <div className="breadcrumbWrapper mb-4">
                <ul className="breadcrumb breadcrumb2 mb-0">
                    <li>
                        <Link to={"/"}>Home</Link>
                    </li>
                    <li>
                        <Link to={"#"}>Search Result</Link>
                    </li>
                    <li>
                        <Link to={"#"} style={{textTransform: "capitalize"}}>{query}</Link> 
                    </li>
                </ul>
            </div>

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
                                                                <ProductListingCard productData={item} />
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

export default SearchPage;