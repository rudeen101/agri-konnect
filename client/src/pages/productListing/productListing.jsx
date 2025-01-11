import React, { useContext, useState, useEffect} from "react";
import "./productListing";
import{ Link, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import ProductCard from "../../components/product/product";
import { Button, CircularProgress } from "@mui/material";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";


const ProductListing = () =>{
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const [isOpenDropdown2, setIsOpenDropdown2] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filterId, setFilterId] = useState("");
    const [productData, setProductData] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("");

    const {id} = useParams();
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0,0);
        setFilterId("");

        let url =  window.location.href;
        let apiEndPoint = "";


        if (url.includes('subCat')) {
            apiEndPoint = `/api/product?subCatId=${id}`;
        }

        if (url.includes('category')) { 
            apiEndPoint = `/api/product?category=${id}`;
        }

        setIsLoading(true); 
        fetchDataFromApi(`${apiEndPoint}`).then((res) =>{
            setProductData(res)
            setIsLoading(false);
        })

        fetchDataFromApi(`/api/category/${id}`).then((res) =>{
            setCurrentCategory(res)
            console.log("data**",res)
        })
    }, [id])


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
        console.log(catId)
        let url =  window.location.href;
        let apiEndPoint = "";


        if (url.includes('subCat')) {
            // apiEndPoint = `/api/product?subCatId=${id}`;
            apiEndPoint = `/api/product?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${catId}`;

        }

        if (url.includes('category')) { 
            // apiEndPoint = `/api/product?category=${id}`;
            apiEndPoint = `/api/product?minPrice=${price[0]}&maxPrice=${price[1]}&catId=${catId}`;

        }

        setIsLoading(true);
        // let apiEndPoint = `/api/product?minPrice=${price[0]}&maxPrice=${price[1]}&catId=${catId}`;
        // apiEndPoint = `/api/product?minPrice=${price[0]}&maxPrice=${price[1]}&catId=${catId}`;


        fetchDataFromApi(`${apiEndPoint}`).then((res) =>{
            setProductData(res)
            // window.scrollTo({
            //     top: 0,
            //     bahavior: 'smooth'
            // });
            setIsLoading(false);
        })
    }

    return(
        <section className="listingPage">
            <div className="container-fluid">
                <div className="breadcrumb flex-column">
                    <h3 className="">{currentCategory.length !== 0 && currentCategory?.name}</h3>
                    <ul className="list list-inline mb-0">
                        <li className="list-inline-item">
                            <Link to={""}>Home</Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to={`/category/${id}`}>{currentCategory.length !== 0 && currentCategory?.name}</Link>
                        </li>
                    </ul>
                </div>

                <div className="listingData">
                    <div className="row">
                        <div className="col-md-3 sidebarContainer">
                            <Sidebar filterByRating={filterByRating} filterByPrice={filterByPrice} catId={id} />
                        </div>

                        <div className="col-md-9 rightContent homeProducts pt-0">
                            <div className="topHeading d-flex align-items-center justify-content-between">
                                <p className="mb-0">We found <span className="text-success"> {productData?.products?.length > 0 ? productData?.products?.length : "0" } </span>items for you!</p>
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
                                                productData?.products?.map((product, index) => {
                                                    return(
                                                        <div className="item" key={index}>
                                                            <ProductCard data={product} />
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

export default ProductListing;