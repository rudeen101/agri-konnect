import React, { useState, useContext, useEffect } from "react";
import "./order.css";
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
import { FcCancel } from "react-icons/fc";
import { GiConfirmed } from "react-icons/gi";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { deleteDataFromApi, fetchDataFromApi } from "../../utils/apiCalls";



const OrderListing = () =>{
    const [showBy, setShowBy] = useState('');
    const [orderData, setOrderData] = useState([]);
    const [page, setPage] = useState(1);


    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHiddenSidebarAndHeader(false)
    });   


    useEffect(() => {
        window.scrollTo(0,0);
        context.setProgress(40);

        fetchDataFromApi('/api/order').then((res) => {
            console.log("Order--",res.order);
            setOrderData(res.order);
            context.setProgress(100)
        });

        // fetchDataFromApi('/api/product/get/count').then((res) => {
        //     setTotalProducts(res.productsCount);
        // });

        // fetchDataFromApi('/api/category/get/count').then((res) => {
        //     setTotalCategory(res.categoryCount)
        // });

        // fetchDataFromApi('/api/category/subCategory/get/count').then((res) => {
        //     setTotalSubCategory(res.categoryCount);
        // });
      
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

    const dateFormatter = (dateCreated) => {
        const date = new Date(dateCreated);

        const readableDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            // hour: "2-digit",
            // minute: "2-digit",
            // second: "2-digit",
            // timeZoneName: "short",
        })
        return readableDate;
    };


    return(
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                    <h5 className="mb-0">Order Listing</h5>

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
                        label="Orders"
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Order List"
                        />
                    </Breadcrumbs>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Order List</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>VIEW BY</h4>
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
                      
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ORDER NUMBER</th>
                                    <th>TOTAL PRICE</th>
                                    <th>PAYMENT STATUS</th>
                                    <th>DATE ORDERED</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    orderData?.length !== 0 && orderData !== undefined && 
                                    orderData?.map((order, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{order?.orderNumber}</td>
                                                <td>$ {order?.totalPrice}.00</td>
                                                <td>{order?.paymentStatus}</td>
                                                <td>{dateFormatter(order?.createdAt)}</td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Link to={`/admin/order/details/${order?._id}`}>
                                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                                        </Link>         
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

export default OrderListing;