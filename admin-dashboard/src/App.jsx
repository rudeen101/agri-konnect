
// src/App.js
import React, {useEffect, useState, useContext} from "react";
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import { AppProvider, useAppContext } from '../src/contexts/AppContext';
import Loader from '../src/components/ui/Loader/Loader';

import './App.css';

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from "./pages/Auth/RegisterPage";
import UnauthorizedPage from './pages/Auth/UnauthorizedPage';
import BuyerDashboard from './pages/Dashboard/BuyerDashboard';
import SellerDashboard from './pages/Dashboard/SellerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AdminUsers from './pages/Admin/Users/Users';
// import AdminProducts from './pages/Admin/AdminProducts';
import RoleManagement from './pages/Admin/RoleManagement';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProfileUpdate from "./pages/Auth/ProfileUpdate";
import UpdateUser from "./pages/Admin/Users/UpdateUser";
import Category from "./pages/Admin/Category/Category";
import UpdateCategory from "./pages/Admin/Category/UpdateCategory";
import CreateCategory from "./pages/Admin/Category/createCategory";
import Product from "./pages/Admin/Product/Product";
import UpdateProduct from "./pages/Admin/Product/UpdateProduct";
import CreateProduct from "./pages/Admin/Product/CreateProduct";
import CreateOrder from "./pages/Orders/CreateOrder";
import Orders from "./pages/Orders/Orders";

const App = () => {
	const { handleOverlayClick, isSidebarOpen } = useAppContext();

	return (
		<Suspense fallback={<Loader />}>
			<>
				<div onClick ={handleOverlayClick} className={`sidebar-overlay  ${isSidebarOpen ? "active" : ""}`}></div>
				{/* <div className="container"> */}
					{/* <div className="main-content"> */}
						<Routes>
							{/* {routes.map((route) => {
								const Layout = route.noLayout ? AuthLayout : MainLayout;
								const Element = route.component;
								
								return (
									<Route
										key={route.path}
										path={route.path}
										element={
											<Layout>
												<Element />
											</Layout>
										}
									/>
								);
							})} */}

							{/* Public routes */}
							<Route path="/login" element={<LoginPage />} />
							<Route path="/register" element={<RegisterPage />} />
							<Route path="/unauthorized" element={<UnauthorizedPage />} />
							
							{/* Buyer routes */}
							<Route element={<ProtectedRoute roles={['buyer']} />}>
								{/* <Route path="/products" element={<ProductList />} /> */}
								{/* <Route path="/orders" element={<Order />} /> */}
								<Route path="/orders" element={<Orders />} />
								<Route path="/orders/create-order" element={<CreateOrder />} />
								<Route path="/dashboard" element={<BuyerDashboard />} />
							</Route>

							{/* Seller routes */}
							<Route element={
								<ProtectedRoute 
								roles={['seller']} 
								permissions={[
									'seller:create_product',
									'seller:edit_product',
									'seller:view_sales'
								]} 
								anyPermission
								/>
							}>
								<Route path="/seller/dashboard" element={<SellerDashboard />} />
								{/* <Route path="/seller/products" element={<SellerProductList />} /> */}
							</Route>

							{/* Admin routes */}
							<Route element={
								<ProtectedRoute 
								roles={['admin', 'super_admin']} 
								permissions={['admin:view_reports']}
								/>
							}>
								<Route path="/admin/dashboard" element={<AdminDashboard />} />
								<Route path="/admin/users" element={<AdminUsers />} />
								<Route path="/admin/user/profile-update/:id" element={<UpdateUser />} />
								<Route path="/admin/categories" element={<Category />} />
								<Route path="/admin/create-category" element={<CreateCategory />} />
								<Route path="/admin/products" element={<Product />} />
								<Route path="/admin/create-product" element={<CreateProduct />} />
								<Route path="/admin/update-product/:id" element={<UpdateProduct />} />
							</Route>

							{/* Super admin only routes */}
							<Route element={
								<ProtectedRoute 
								roles={['super_admin']} 
								permissions={['system:manage_roles']}
								/>
							}>
								<Route path="/admin/roles" element={<RoleManagement />} />
							</Route>
						</Routes>
					{/* </div> */}
				{/* </div> */}
			</>
		</Suspense>
	);
}

export default App;







// import React, { createContext, useEffect, useState } from 'react';
// import './App.css';
// // import './utils/app.js'
// // import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter, Routes, Route} from "react-router-dom";
// import LoadingBar from 'react-top-loading-bar';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
// import { deleteDataFromApi, fetchDataFromApi, postDataToApi, updateDataToApi } from './utils/apiCalls';
// import Sidebar from './components/Sidebar_.jsx';
// import TopHeader from './components/header/Header.jsx';
// import SidebarLayout from './components/Sidebar2.jsx';
// import Dashboard from './pages/dashboard/Dashboard.jsx';



// const MyContext = createContext();

// const App = () => {
// 	const [progress, setProgress] = useState(0);
// 	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// 	const [isOverlay, setIsOverlay] = useState(false);

// 	const [alertBox, setAlertBox] = useState({
// 		open: false,
// 		error: false,
// 		msg: ''
// 	});

// 	const toggleSidebar = () => {
// 		setIsSidebarOpen(!isSidebarOpen);
// 	};

// 	const handleOverlayClick = () => {
// 		setIsSidebarOpen(!isSidebarOpen);
// 		document.body.style.overflow = "";
// 	};

// 	// Close alert box
// 	const handleClose = (event, reason) => {
// 		if (reason === 'clickaway') {
// 			return;
// 		}

// 		setAlertBox({
// 			open: false
// 		})
// 	}

// 	const values = {
// 		progress,
// 		isSidebarOpen,
// 		setIsSidebarOpen,
// 		isOverlay,
// 		setIsOverlay
// 	}

// 	return (
// 		<BrowserRouter>
// 			<MyContext.Provider value={values}>

			// <>
			// 	<div onClick ={handleOverlayClick} className={`sidebar-overlay  ${isSidebarOpen ? "active" : ""}`}></div>
			// 	<div className="container">
			// 		{/* Sidebar Navigation */}
			// 		<Sidebar></Sidebar>

			// 		{/* Main Content */}
			// 		<div className="main-content">
			// 			{/* Top Bar */}
			// 			<TopHeader toggleSidebar={toggleSidebar}></TopHeader>
					
			// 			{/* Dashboard Section */}
			// 			<Routes>
			// 				<Route exact={true} path="/" element={<Dashboard />} />
			// 			</Routes>
			// 		</div>
			// 	</div>
			// </>









// 				{/* {<Navbar></Navbar>}

// 				<Routes>
// 					<Route exact={true} path="/" element={<Home />} />
// 				</Routes>

// 				<Routes>
// 					<Route exact={true} path="/about" element={<About />} />
// 				</Routes>

// 				<Routes>
// 					<Route exact={true} path="/academy" element={<Academy />} />
// 				</Routes>

// 				<Routes>
// 					<Route exact={true} path="/services" element={<Service />} />
// 				</Routes>

// 				<Routes>
// 					<Route exact={true} path="/contact" element={<Contact />} />
// 				</Routes>

// 				<Routes>
// 					<Route exact={true} path="/team/details" element={<TeamDetails />} />
// 				</Routes>

// 				<Routes>
// 					<Route exact={true} path="/application" element={<ApplyNow />} />
// 				</Routes>

// 				<Routes>
// 					<Route exact={true} path="/blog/listing" element={<BlogListing />} />
// 				</Routes>

// 				<Routes>
// 					<Route exact={true} path="/blog/details" element={<BlogDetails />} />
// 				</Routes>
// 				<Routes>
// 					<Route exact={true} path="/course/details" element={<CourseDetails />} />
// 				</Routes>
// 			{<Footer></Footer>} */}
// 			</MyContext.Provider>
// 		</BrowserRouter>
// 	)
// }


// export default App;
// export {MyContext};

