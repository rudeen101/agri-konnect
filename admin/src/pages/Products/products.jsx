import React, { useState, useContext, useEffect } from "react";
import "./products.css";
import DashboardBox from "../../components/dashboardBox/DashboardBox";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { Button, Pagination, Rating } from "@mui/material";
import { HiDotsVertical } from "react-icons/hi";
import { Chart } from "react-google-charts";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import food from "../../assets/images/food.jpg"
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { deleteData, fetchDataFromApi } from "../../utils/api";



const ProductListing = () =>{
    const [showBy, setShowBy] = useState('');
    const [byCategory, setByCategory] = useState('');
    const [categoryVal, setCategoryVal] = useState('all');
    const [productList, setProductList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState();
    const [totalCategory, setTotalCategory] = useState();
    const [totalSubCategory, setTotalSubCategory] = useState();

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHiddenSidebarAndHeader(false)
    });   


    useEffect(() => {
        window.scrollTo(0,0);

        context.setProgress(40);

        fetchDataFromApi('/api/product?page=1&perPage=10').then((res) => {
            res?.products?.length !== 0 && res?.products !== undefined && setProductList(res);
            console.log(res)
            context.setProgress(100)
        });

        fetchDataFromApi('/api/product/get/count').then((res) => {
            setTotalProducts(res.productsCount);
        });

        fetchDataFromApi('/api/category/get/count').then((res) => {
            setTotalCategory(res.categoryCount)
        });

        fetchDataFromApi('/api/category/subCategory/get/count').then((res) => {
            setTotalSubCategory(res.categoryCount);
        });
      
    }, []);

    const deleteProduct = (productId) => {
        context.setProgress(40);

        deleteData(`/api/product/${productId}`).then((res) => {
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Product deleted!"
            });

            fetchDataFromApi(`/api/product?page=${page}&perPage=2`).then((res) => {
                setProductList(res);
            });

            context.fetchCategory();
        })
    }

    const handleChange = () => {
        context.setProgress(40)
        setPage(value);

        fetchDataFromApi(`/api/product?page=${value}&perPage=2`).then((res) => {
            setProductList(res);
            context.setProgress(100);
            window.scrollTo({
                top: 200,
                behavior: "smooth"
            })
        });
    }

    const showPerPage = (e) => {
        alert(e.target.value);
        setShowBy(e.target.value);

        fetchDataFromApi(`/api/product?page=${1}&perPage=${e.target.value}`).then((res) => {
            setProductList(res);
            context.setProgress(100)
        });

    }

    const handleChangeCategory = (catName, catId) => {

        fetchDataFromApi(`/api/product?category=${catId}`).then((res) => {
            setProductList(res);
            context.setProgress(100);
        });


        // if (event.target.value !== "all") {
        //     setCategoryVal(event.target.value)

        //     fetchDataFromApi(`/api/product?category=${catId}`).then((res) => {
        //         setProductList(res);
        //         context.setProgress(100);
        //     });
        // }

        // if (event.target.value === "all") {
        //     setCategoryVal(event.target.value)

        //     fetchDataFromApi(`/api/product?page=${1}&perPage=2`).then((res) => {
        //         setProductList(res);
        //         context.setProgress(100);
        //     });
        // }
    }



    return(
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                        <h5 className="mb-0">Product Listing</h5>

                        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
                            <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Home"
                            icon={<HomeIcon fontSize="small" />}
                            />

                            <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Products"
                            />

                            <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Product List"
                            />
                        </Breadcrumbs>
                </div>

                <div className="row dashboardBoxContainerRow">
                    <div className="">
                        <div className="productListing dashboardBoxContainer d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]}  icon={<FaUserCircle></FaUserCircle>} grow={true}/>
                            <DashboardBox color={["#c012e2", "#eb64fe"]}  icon={<IoMdCart></IoMdCart>}/>
                            <DashboardBox color={["#2c78e5", "#60aff5"]}  icon={<MdShoppingBag></MdShoppingBag>}/>
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Product List</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>SHOW BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBy}
                                    onChange={(e) => showPerPage(e)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={35}>35</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4>SHOW BY Category</h4>

                            <FormControl size="small" className="w-100">
                                <Select
                                    value={byCategory}
                                    onChange={(e) => setByCategory(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                    >
                                     <MenuItem value="">
                                        <em>All</em>
                                    </MenuItem>
                                    {
                                        context.categoryData?.categoryList?.length !== 0 &&
                                        context.categoryData?.categoryList?.map((cat, index) => {
                                            return (
                                                <MenuItem 
                                                    value={cat.name} 
                                                    className="text-capitalize"
                                                    key={index}
                                                    onClick={() => {handleChangeCategory(cat.name, cat._id)}}
                                                    >
                                                    {cat.name}
                                                </MenuItem>

                                            )
                                        })
                                    }
                                </Select> 
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>UID</th>
                                    <th style={{width: "300px"}}>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>SUB CATEGORY</th>
                                    <th>BRAND</th>
                                    <th style={{width: "70px"}}>PRICE</th>
                                    <th>STOKE</th>
                                    <th>RATING</th>
                                    <th>ORDER</th>
                                    <th>SALES</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    productList?.products?.length !== 0 && productList?.products !== undefined && 
                                    productList?.products?.map((product, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{product._id}</td>
                                                <td >
                                                    <div className="d-flex align-items-center  productBox">
                                                        <div className="imageContainer">
                                                            <div className="img card shadow m-0">
                                                                <lazyLoadImage
                                                                    alt={"product image"}
                                                                    effect={"blur"}
                                                                    className="w-100"
                                                                    src={product?.images[0]}>
                                                                </lazyLoadImage>
                                                            </div>
                                                          
                                                            <img src={product.images[0]} alt="product image" className="w-100"/>
                                                        </div>
                                                        <div className="info">
                                                            <h6>{product?.name}</h6>
                                                            <p>{product?.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{product?.category?.name}</td>
                                                <td>{product?.subCat}</td>
                                                <td>{product?.brand}</td>
                                                <td>
                                                    <del className="oldPrice">{product?.oldPrice}</del>
                                                    <span className="newPrice text-danger">{product?.price}</span>
                                                </td>
                                                <td>{product?.countInStock}</td>
                                                <td>
                                                    <Rating name="read-only" defaultValue={product?.rating} precission={0.5} size="small" readOnly></Rating>
                                                </td>
                                                <td>380</td>
                                                <td>438K</td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Button className="secondary" color="secondary"><FaEye /></Button>
                                                        <Link to={`/product/edit/${product._id}`}>
                                                            <Button className="success" color="sucess"><FaPencilAlt /></Button>
                                                        </Link>
                                                        
                                                        <Button className="error" color="error" onClick={() => deleteProduct(product?._id)}><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )

                                    })
                                }
                           
                            
                            </tbody>
                        </table>

                        <div className="d-flex tableFooter">
                            <p>showing <b>12 </b> of  <b>60 </b>results</p>
                            <Pagination count={10} color="primary" className="pagination" showFirstButton showLastButton />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductListing;