// import React, { useState, useContext, useEffect } from "react";
// import "./dashboard.css"
// import DashboardBox from "../../components/dashboardBox/DashboardBox";
// import { FaUserCircle } from "react-icons/fa";
// import { IoMdCart } from "react-icons/io";
// import { MdShoppingBag } from "react-icons/md";
// import { GiStarsStack } from "react-icons/gi";
// import { Button, Pagination } from "@mui/material";
// import { HiDotsVertical } from "react-icons/hi";
// import { Chart } from "react-google-charts";
// import { FaEye } from "react-icons/fa";
// import { FaPencilAlt } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";
// import food from "../../assets/images/food.jpg"
// import { MyContext } from "../../App";

// import { FaChartLine } from "react-icons/fa6";
// import { FaShoppingCart } from "react-icons/fa";
// import { FaUsers } from "react-icons/fa";



// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormHelperText from '@mui/material/FormHelperText';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

// const data = [
//     ["Farm Machinery", "Sales", "Expenses"],
//     ["Fresh Produce", 1000, 400],
//     ["Processed Food	", 1170, 460],
//     ["Farm Inputs	", 660, 1120],
//   ];
  
//   const options = {
//     'backgroundColor': 'transparent',
//     'chartArea': { 'width': "100%", 'height': "100%" },
//     colors: ["#f2a900", "#ff6f61", "#00776e", "#66e2d6", "#f4f4f4"],

//   };


// const Dashboard = () =>{
//     const [showBy, setShowBy] = useState('');
//     const [byCategory, setByCategory] = useState('');

//     const context = useContext(MyContext);

//     useEffect(() => {
//         context.setIsHiddenSidebarAndHeader(false)
//     });      

//     const handleChange = (event) => {
//       setAge(event.target.value);
//     };

//     return(
//         <>
//             <div className="rightContent w-100">
                // <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                //         <h5 className="mb-0">Admin Dashboard</h5>

                //         <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
                //             <StyledBreadcrumb
                //             component="a"
                //             href="#"
                //             label="Home"
                //             icon={<HomeIcon fontSize="small" />}
                //             />

                //             <StyledBreadcrumb
                //             component="a"
                //             href="#"
                //             label="Products"
                //             />

                //             <StyledBreadcrumb
                //             component="a"
                //             href="#"
                //             label="Product View"
                //             />
                //         </Breadcrumbs>
                // </div>

//                 <div className="row dashboardBoxContainerRow">
//                     <div className="col-md-8">
//                         <div className="dashboardBoxContainer d-flex">
//                             <DashboardBox color={["#00776e", "#66e2d6"]} title={"Total Sales"} value={5000}  icon={<FaChartLine></FaChartLine>} grow={true}/>
//                             <DashboardBox color={["#00776e", "#66e2d6"]} title={"Orders"} value={300}    icon={<FaShoppingCart></FaShoppingCart>}/>
//                             <DashboardBox color={["#00776e", "#66e2d6"]} title={"Conversion Rate"} value={3.5}    icon={<GiStarsStack></GiStarsStack>}/>
//                             <DashboardBox color={["#00776e", "#66e2d6"]} title={"Active Customers"} value={800}    icon={<FaUsers></FaUsers>}/>
//                         </div>
//                     </div>

//                     <div className="col-md-4 pl-0">
//                         <div className="box graphBox">
//                             <div className="d-flex align-items-center w-100 bottomEle">
//                                 <h4 className="text-white mb-0 mt-0 ">Revenue by Category</h4>
//                                 <Button className="ml-auto togglecon"><HiDotsVertical></HiDotsVertical></Button>
//                             </div>

//                             <h3 className="text-white font-weight-bold">$3,88,99,44.00</h3>
//                             <p className="text-white font-weight-bold">$3,44,66,43.99 in last month</p>

//                             <div className="chat">
//                                 <Chart 
//                                 chartType="PieChart"
//                                 width="100%"
//                                 height="200px"
//                                 data={data}
//                                 options={options}    
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="card shadow border-0 p-3 mt-4">
//                     <h3 className="hd">Best Selling Products</h3>

//                     <div className="row cardFilters mt-3">
//                         <div className="col-md-3">
//                             <h4>SHOW BY</h4>
//                             <FormControl size="small" className="w-100">
//                                 <Select
//                                     value={showBy}
//                                     onChange={(e) => setShowBy(e.target.value)}
//                                     displayEmpty
//                                     inputProps={{ 'aria-label': 'Without label' }}
//                                     className="w-100"
//                                     >
//                                     <MenuItem value="">
//                                         <em>None</em>
//                                     </MenuItem>
//                                     <MenuItem value={10}>Ten</MenuItem>
//                                     <MenuItem value={20}>Twenty</MenuItem>
//                                     <MenuItem value={30}>Thirty</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </div>
//                         <div className="col-md-3">
//                             <h4>SHOW BY Category</h4>

//                             <FormControl size="small" className="w-100">
//                                 <Select
//                                     value={byCategory}
//                                     onChange={(e) => setByCategory(e.target.value)}
//                                     displayEmpty
//                                     inputProps={{ 'aria-label': 'Without label' }}
//                                     className="w-100"
//                                     >
//                                     <MenuItem value="">
//                                         <em>None</em>
//                                     </MenuItem>
//                                     <MenuItem value={10}>Ten</MenuItem>
//                                     <MenuItem value={20}>Twenty</MenuItem>
//                                     <MenuItem value={30}>Thirty</MenuItem>
//                                 </Select> 
//                             </FormControl>
//                         </div>
//                     </div>

//                     <div className="table-responsive mt-3">
//                         <table className="table table-striped table-bordered">
//                             <thead className="thead-dark">
//                                 <tr>
//                                     <th>UID</th>
//                                     <th>PRODUCT</th>
//                                     <th>CATEGORY</th>
//                                     <th>BRAND</th>
//                                     <th>PRICE</th>
//                                     <th>STOKE</th>
//                                     <th>RATING</th>
//                                     <th>ORDER</th>
//                                     <th>SALES</th>
//                                     <th>ACTION</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 <tr>
//                                     <td>#1</td>
//                                     <td>
//                                         <div className="d-flex align-items-center  productBox">
//                                             <div className="imageContainer card">
//                                                 <img src={food} alt="product image" className="w-100"/>
//                                             </div>
//                                             <div className="info">
//                                                 <h6>Tops and skirt lllllllllllllllllllllllllllllset for Female</h6>
//                                                 <span>Women's exclusive summer tops and skirt setskirt set.</span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td>women</td>
//                                     <td>richmen</td>
//                                     <td>
//                                         <del className="oldPrice">$21.00</del>
//                                         <span className="newPrice text-danger">$21.00</span>
//                                     </td>
//                                     <td>30</td>
//                                     <td>4.9(16)</td>
//                                     <td>380</td>
//                                     <td>438K</td>
//                                     <td>
//                                         <div className="actions d-flex align-items-center">
//                                             <Button className="secondary    " color="secondary"><FaEye /></Button>
//                                             <Button className="success" color="sucess"><FaPencilAlt /></Button>
//                                             <Button className="error" color="error"><MdDelete /></Button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                                 <tr>
//                                     <td>#1</td>
//                                     <td>
//                                         <div className="d-flex align-items-center  productBox">
//                                             <div className="imageContainer">
//                                                 <img src={food} alt="product image" className="w-100"/>
//                                             </div>
//                                             <div className="info">
//                                                 <h6>Tops and skirt set for Female</h6>
//                                                 <p>Women's exclusive summer tops and skirt set for Female Tops and skirt set.</p>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td>women</td>
//                                     <td>richmen</td>
//                                     <td>
//                                         <del className="oldPrice">$21.00</del>
//                                         <span className="newPrice text-danger">$21.00</span>
//                                     </td>
//                                     <td>30</td>
//                                     <td>4.9(16)</td>
//                                     <td>380</td>
//                                     <td>438K</td>
//                                     <td>
//                                         <div className="actions d-flex align-items-center">
//                                             <Button className="secondary    " color="secondary"><FaEye /></Button>
//                                             <Button className="success" color="sucess"><FaPencilAlt /></Button>
//                                             <Button className="error" color="error"><MdDelete /></Button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                                 <tr>
//                                     <td>#1</td>
//                                     <td>
//                                         <div className="d-flex align-items-center  productBox">
//                                             <div className="imageContainer">
//                                                 <img src={food} alt="product image" className="w-100"/>
//                                             </div>
//                                             <div className="info">
//                                                 <h6>Tops and skirt set for Female</h6>
//                                                 <p>Women's exclusive summer tops and skirt set for Female Tops and skirt set.</p>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td>women</td>
//                                     <td>richmen</td>
//                                     <td>
//                                         <del className="oldPrice">$21.00</del>
//                                         <span className="newPrice text-danger">$21.00</span>
//                                     </td>
//                                     <td>30</td>
//                                     <td>4.9(16)</td>
//                                     <td>380</td>
//                                     <td>438K</td>
//                                     <td>
//                                         <div className="actions d-flex align-items-center">
//                                             <Button className="secondary    " color="secondary"><FaEye /></Button>
//                                             <Button className="success" color="sucess"><FaPencilAlt /></Button>
//                                             <Button className="error" color="error"><MdDelete /></Button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                                 <tr>
//                                     <td>#1</td>
//                                     <td>
//                                         <div className="d-flex align-items-center  productBox">
//                                             <div className="imageContainer">
//                                                 <img src={food} alt="product image" className="w-100"/>
//                                             </div>
//                                             <div className="info">
//                                                 <h6>Tops and skirt set for Female</h6>
//                                                 <p>Women's exclusive summer tops and skirt set for Female Tops and skirt set.</p>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td>women</td>
//                                     <td>richmen</td>
//                                     <td>
//                                         <del className="oldPrice">$21.00</del>
//                                         <span className="newPrice text-danger">$21.00</span>
//                                     </td>
//                                     <td>30</td>
//                                     <td>4.9(16)</td>
//                                     <td>380</td>
//                                     <td>438K</td>
//                                     <td>
//                                         <div className="actions d-flex align-items-center">
//                                             <Button className="secondary    " color="secondary"><FaEye /></Button>
//                                             <Button className="success" color="sucess"><FaPencilAlt /></Button>
//                                             <Button className="error" color="error"><MdDelete /></Button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                                 <tr>
//                                     <td>#1</td>
//                                     <td>
//                                         <div className="d-flex align-items-center  productBox">
//                                             <div className="imageContainer">
//                                                 <img src={food} alt="product image" className="w-100"/>
//                                             </div>
//                                             <div className="info">
//                                                 <h6>Tops and skirt set for Female</h6>
//                                                 <p>Women's exclusive summer tops and skirt set for Female Tops and skirt set.</p>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td>women</td>
//                                     <td>richmen</td>
//                                     <td>
//                                         <del className="oldPrice">$21.00</del>
//                                         <span className="newPrice text-danger">$21.00</span>
//                                     </td>
//                                     <td>30</td>
//                                     <td>4.9(16)</td>
//                                     <td>380</td>
//                                     <td>438K</td>
//                                     <td>
//                                         <div className="actions d-flex align-items-center">
//                                             <Button className="secondary    " color="secondary"><FaEye /></Button>
//                                             <Button className="success" color="sucess"><FaPencilAlt /></Button>
//                                             <Button className="error" color="error"><MdDelete /></Button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>

//                         <div className="d-flex tableFooter">
//                             <p>showing <b>12 </b> of  <b>60 </b>results</p>
//                             <Pagination count={10} color="primary" className="pagination" showFirstButton showLastButton />
//                         </div>

//                     </div>

                    
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Dashboard;


import React from 'react';
import { Paper, Typography } from '@mui/material';
import DashboardCard from '../../components/dashboardBox/DashboardCard';
import SalesTrendChart from '../../components/charts/SalesTrandChart';
import RevenueBreakdownChart from '../../components/charts/RevenueBreakdownChart';
import RecentOrders from '../../components/orders/RecentOrders';
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
// import '../styles/dashboard.css';

const StrategicDashboard = () => {
  return (
    <div style={{ padding: '20px'  }}>
    <div style={{ paddingTop: '75px'  }}></div>

    {/* <div className="card adminDashboardHeader shadow border-0 w-100 d-flex justify-content-between flex-row">
        <h5 className="mb-0">Admin Dashboard</h5>

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
    </div> */}


      {/* Key Metrics */}
      <div className="metrics-container">
        <DashboardCard
          metric="$50,000"
          label="Total Revenue"
          trend="up"
          trendValue="10% from last month"
        />
        <DashboardCard
          metric="1,200"
          label="New Customers"
          trend="up"
          trendValue="5% from last month"
        />
        <DashboardCard
          metric="85%"
          label="Customer Retention"
          trend="down"
          trendValue="2% from last month"
        />
        <DashboardCard
          metric="$15,000"
          label="Profit"
          trend="up"
          trendValue="8% from last month"
        />
      </div>

      {/* Charts */}
      <div className="charts-container">
        <Paper className="chart-container">
          <SalesTrendChart />
        </Paper>
        <Paper className="chart-container">
          <RevenueBreakdownChart />
        </Paper>
      </div>

      {/* Recent Orders */}
      <div className="orders-container">
        <RecentOrders />
      </div>
    </div>
  );
};

export default StrategicDashboard;