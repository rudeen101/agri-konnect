import React, { useState, useContext, useEffect } from "react";
import "./dashboard.css"
import DashboardBox from "../../components/dashboardBox/DashboardBox";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { Button, Pagination } from "@mui/material";
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


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
  ];
  
  const options = {
    'backgroundColor': 'transparent',
    'chartArea': { 'width': "100%", 'height': "100%" },
  };





const Dashboard = () =>{
    const [showBy, setShowBy] = useState('');
    const [byCategory, setByCategory] = useState('');

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHiddenSidebarAndHeader(false)
    });      

    const handleChange = (event) => {
      setAge(event.target.value);
    };

    return(
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                        <h5 className="mb-0">Dashboard</h5>

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
                            label="Product View"
                            />
                        </Breadcrumbs>
                </div>

                <div className="row dashboardBoxContainerRow">
                    <div className="col-md-8">
                        <div className="dashboardBoxContainer d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]}  icon={<FaUserCircle></FaUserCircle>} grow={true}/>
                            <DashboardBox color={["#c012e2", "#eb64fe"]}  icon={<IoMdCart></IoMdCart>}/>
                            <DashboardBox color={["#2c78e5", "#60aff5"]}  icon={<MdShoppingBag></MdShoppingBag>}/>
                            <DashboardBox color={["#e1950e", "#f3cd29"]}  icon={<GiStarsStack></GiStarsStack>}/>
                        </div>
                    </div>

                    <div className="col-md-4 pl-0">
                        <div className="box graphBox">
                            <div className="d-flex align-items-center w-100 bottomEle">
                                <h4 className="text-white mb-0 mt-0 ">Total Users</h4>
                                <Button className="ml-auto togglecon"><HiDotsVertical></HiDotsVertical></Button>
                            </div>

                            <h3 className="text-white font-weight-bold">$3,88,99,44.00</h3>
                            <p>$3,44,66,43.99 in last month</p>

                            <div className="chat">
                                <Chart 
                                chartType="PieChart"
                                width="100%"
                                height="200px"
                                data={data}
                                options={options}    
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>SHOW BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBy}
                                    onChange={(e) => setShowBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
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
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
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
                                <tr>
                                    <td>#1</td>
                                    <td>
                                        <div className="d-flex align-items-center  productBox">
                                            <div className="imageContainer">
                                                <img src={food} alt="product image" className="w-100"/>
                                            </div>
                                            <div className="info">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>Women's exclusive summer tops and skirt set for Female Tops and skirt set.</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>women</td>
                                    <td>richmen</td>
                                    <td>
                                        <del className="oldPrice">$21.00</del>
                                        <span className="newPrice text-danger">$21.00</span>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(16)</td>
                                    <td>380</td>
                                    <td>438K</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary    " color="secondary"><FaEye /></Button>
                                            <Button className="success" color="sucess"><FaPencilAlt /></Button>
                                            <Button className="error" color="error"><MdDelete /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#1</td>
                                    <td>
                                        <div className="d-flex align-items-center  productBox">
                                            <div className="imageContainer">
                                                <img src={food} alt="product image" className="w-100"/>
                                            </div>
                                            <div className="info">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>Women's exclusive summer tops and skirt set for Female Tops and skirt set.</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>women</td>
                                    <td>richmen</td>
                                    <td>
                                        <del className="oldPrice">$21.00</del>
                                        <span className="newPrice text-danger">$21.00</span>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(16)</td>
                                    <td>380</td>
                                    <td>438K</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary    " color="secondary"><FaEye /></Button>
                                            <Button className="success" color="sucess"><FaPencilAlt /></Button>
                                            <Button className="error" color="error"><MdDelete /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#1</td>
                                    <td>
                                        <div className="d-flex align-items-center  productBox">
                                            <div className="imageContainer">
                                                <img src={food} alt="product image" className="w-100"/>
                                            </div>
                                            <div className="info">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>Women's exclusive summer tops and skirt set for Female Tops and skirt set.</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>women</td>
                                    <td>richmen</td>
                                    <td>
                                        <del className="oldPrice">$21.00</del>
                                        <span className="newPrice text-danger">$21.00</span>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(16)</td>
                                    <td>380</td>
                                    <td>438K</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary    " color="secondary"><FaEye /></Button>
                                            <Button className="success" color="sucess"><FaPencilAlt /></Button>
                                            <Button className="error" color="error"><MdDelete /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#1</td>
                                    <td>
                                        <div className="d-flex align-items-center  productBox">
                                            <div className="imageContainer">
                                                <img src={food} alt="product image" className="w-100"/>
                                            </div>
                                            <div className="info">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>Women's exclusive summer tops and skirt set for Female Tops and skirt set.</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>women</td>
                                    <td>richmen</td>
                                    <td>
                                        <del className="oldPrice">$21.00</del>
                                        <span className="newPrice text-danger">$21.00</span>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(16)</td>
                                    <td>380</td>
                                    <td>438K</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary    " color="secondary"><FaEye /></Button>
                                            <Button className="success" color="sucess"><FaPencilAlt /></Button>
                                            <Button className="error" color="error"><MdDelete /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#1</td>
                                    <td>
                                        <div className="d-flex align-items-center  productBox">
                                            <div className="imageContainer">
                                                <img src={food} alt="product image" className="w-100"/>
                                            </div>
                                            <div className="info">
                                                <h6>Tops and skirt set for Female</h6>
                                                <p>Women's exclusive summer tops and skirt set for Female Tops and skirt set.</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>women</td>
                                    <td>richmen</td>
                                    <td>
                                        <del className="oldPrice">$21.00</del>
                                        <span className="newPrice text-danger">$21.00</span>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(16)</td>
                                    <td>380</td>
                                    <td>438K</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary    " color="secondary"><FaEye /></Button>
                                            <Button className="success" color="sucess"><FaPencilAlt /></Button>
                                            <Button className="error" color="error"><MdDelete /></Button>
                                        </div>
                                    </td>
                                </tr>
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

export default Dashboard;