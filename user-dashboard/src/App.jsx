import './App.css';
import './responsive.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/dashboard';
import SearchBox from './components/searchbox/SearchBox';
import Login from './pages/Login/login';
import ProductListing from './pages/Products/products';
import ProductDetails from './pages/Products/productDetails';
import ProductUpload from './pages/Products/addProducts';
import { createContext, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/sidebar';
import { FaSignHanging } from 'react-icons/fa6';
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "./utils/apiCalls";
import LoadingBar from 'react-top-loading-bar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DashboardAuth from './components/dasboardAuth/DashboardAuth';
import EditProduct from './pages/Products/editProduct';



import OrderListing from './pages/Orders/orderListing';
import MyOrders from './pages/Orders/MyOrders';
import OrderDetails from './pages/Orders/orderDetails';

import SalesDetails from './pages/Sales/salesDetails';
import SalesHistory from './pages/Sales/SalesHistory';

import BusinessRegistration from './pages/businessRegistration/BusinessRegistration';


const MyContext = createContext();

const App = () => {

	const [isToggleSidebar, setIsToggleSidebar] = useState(false);
	const [isOpenNav, setIsOpenNav] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const [isHiddenSidebarAndHeader, setIsHiddenSidebarAndHeader] = useState(false);
	const [themeMode, setThemeMode] = useState(true);
	const [windowwidth, setWindowwidth] = useState(window.innerWidth);
	const [categoryData, setCategoryData] = useState([]);
	const [progress, setProgress] = useState(0);
	const [dashboardStats, setDashboardStats] = useState({});
	const [salesTrendsData, setSalesTrendsData] = useState([]);
	const [revenueByCategory, setRevenueByCategory] = useState([]);
	const [recentOrders, setRecentOrders] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Null means loading state
	const [isLoading, setIsLoading] = useState(true); 
	const [userData, setUserData] = useState(null);
	const [alertBox, setAlertBox] = useState({
		open: false,
		error: false,
		msg: ''
	});

		useEffect(() => {
			const checkAuth = async () => {
				const res = await fetchDataFromApi('/api/auth/me');

				if (res.userId) {
					setIsLogin(true);
					setUserData(res);
				} else {
					isLogin(false);
					setUserData(null);
				} 
			};
	
			checkAuth();
		}, []);

	// get dashboard cards stats
	useEffect(() => {
		fetchDataFromApi('/api/dashboard/stats').then((res) => {
			setDashboardStats(res)
		})
	}, []);

	// Get sales data 
	useEffect(() => {
		fetchDataFromApi('/api/sales/salesTrends').then((res) => {
			setSalesTrendsData(res)
		})
	}, []);

	// Set app theme
	useEffect(() => {
		if (themeMode === true) {
			document.body.classList.remove('dark');
			document.body.classList.add('light');
			localStorage.setItem('themeMode', 'light');
		}
		else {
			document.body.classList.remove('light');
			document.body.classList.add('dark');
			localStorage.setItem('themeMode', 'dark');
		}
	}, [themeMode]);

	// Resize
	useEffect(() => {
		// const handleResize = () =>{
		// 	setWindowwidth(window.innerWidth);
		// }

		// window.addEventListener('resize', handleResize);

		// fetchCategory();
		// fetchBanner()

		// return () => {
		// 	window.removeEventListener('resize', handleResize)
		// }
	}, []);

	// Get category
	const fetchCategory = () => {
		fetchDataFromApi('/api/category').then((res) => {
			setProgress(30);
			setCategoryData(res);
			setProgress(100);
		})
	}

	const fetchTag = () => {
		fetchDataFromApi('/api/tag').then((res) => {
			setProgress(30);
			// setCategoryData(res);
			setProgress(100);
		})
	}

	const fetchBanner = () => {
		setProgress(30);
		fetchDataFromApi('/api/banner').then((res) => {
			setBannerData(res);
			setProgress(100);
		})
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setAlertBox({
			open: false
		})
	}

	const logout = async () => {
		try {
			setIsAuthenticated(false);
			setUserData(null);

			await postDataToApi("/api/auth/logout", {});
			// Redirect to client login page
			window.location.href = import.meta.env.VITE_APP_CLIENT_BASE_URL || "http://localhost:5173/login";
		} catch (error) {
			console.error("Logout failed:", error.response?.data || error.message);
		}
    };

	const values = {
		isAuthenticated,
		setIsAuthenticated,
		userData,
		isToggleSidebar,
		setIsToggleSidebar,
		isLogin,
		// login,
		logout,
		isLoading,
		// isLogin,
		setIsLogin,
		isHiddenSidebarAndHeader,
		setIsHiddenSidebarAndHeader,
		themeMode,
		setThemeMode,
		windowwidth,
		isOpenNav,
		setIsOpenNav,
		progress,
		setProgress,
		alertBox,
		setAlertBox,
		fetchCategory,
		fetchTag,
		categoryData,
		setCategoryData,
		fetchBanner,
		dashboardStats,
		setDashboardStats,
		setSalesTrendsData,
		salesTrendsData,
		setRevenueByCategory,
		revenueByCategory,
		setRecentOrders,
		recentOrders
		
	}


	return (
		<BrowserRouter>
			<MyContext.Provider value={values}>
				<LoadingBar
					color='#00a99d'
					progress={progress}
					onLoaderFinished={() => setProgress(0)}
					className="topLoadingBar"
				/>

				<Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
					<Alert
						onClose={handleClose}
						autoHideDuration={6000}
						severity={alertBox.error === false ? 'success' : 'error'}
						variant="filled"
						sx={{ width: '100%' }}
					>
						{alertBox.msg}
					</Alert>
				</Snackbar>

				{
					isAuthenticated && (
						<Header />
					)
				}
				<div className="main d-flex">
					{
						isAuthenticated && (
						<>
							<div className={`sidebarOverlay d-none ${isOpenNav === true && 'show'}`} onClick={() => setIsOpenNav(false)}></div>
							<div className={`sidebarContainer ${isToggleSidebar === true ? 'toggle' : ""}
							${isOpenNav === true ? 'open' : ''}`}>
								<Sidebar />
							</div>
						</>
						)
					
					}
				
					<div className={`container-fluid content login ${isToggleSidebar === true ? 'toggle' : ""}`}>
						<Routes>
							<Route exact={true} path="/dashboard" element={
								<DashboardAuth>
									<Dashboard />
								</DashboardAuth>
							} />

							<Route exact={true} path="/login" element={<Login />} />
							{/* <Route exact={true} path="/signup" element={<Signup />} /> */}

							<Route exact={true} path="/product/details/:id" element={
								<DashboardAuth>
									<ProductDetails />
								</DashboardAuth>
							} />

							<Route exact={true} path="/product/upload" element={
								
								<DashboardAuth>
									<ProductUpload />
								</DashboardAuth>
							} />

							<Route exact={true} path="/product/listing" element={
								<DashboardAuth>
									<ProductListing />
								</DashboardAuth>

							} />

							<Route exact={true} path="/product/edit/:id" element={
								<DashboardAuth>
									<EditProduct />
								</DashboardAuth>
							} />

							<Route exact={true} path="/admin/myOrders/listing/" element={
								<DashboardAuth>
									<MyOrders />
								</DashboardAuth>
							} />

							<Route exact={true} path="/admin/orders/listing/" element={
								<DashboardAuth>
									<OrderListing />
								</DashboardAuth>
							} />

							<Route exact={true} path="/admin/order/details/:id" element={
								<DashboardAuth>
									<OrderDetails />
								</DashboardAuth>
							} />

							<Route exact={true} path="/admin/sales/listing/" element={
								<DashboardAuth>
									<SalesHistory />
								</DashboardAuth>
							} />

							<Route exact={true} path="/admin/sales/details/:id" element={
								<DashboardAuth>
									<SalesDetails />
								</DashboardAuth>
							} />

							<Route exact={true} path="/business/registration" element={
								<DashboardAuth>
									<BusinessRegistration />
								</DashboardAuth>
							} />
						</Routes>
					</div>
				</div>
			</MyContext.Provider>
		</BrowserRouter>
	)
}


export default App
export {MyContext};
