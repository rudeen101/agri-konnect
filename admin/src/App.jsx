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
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "./utils/apiCalls";
import Category from './pages/Category/category';
import LoadingBar from 'react-top-loading-bar';
import AddCategory from './pages/Category/addCategory';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PrivateRoute from './components/privateRoute/privateRoute';

import EditCategory from './pages/Category/editCategory';
import SubCategory from './pages/Category/SubCategory';
import EditSubCategory from './pages/Category/editSubCategory';
import AddSubCategory from './pages/Category/addSubCategory';
import EditProduct from './pages/Products/editProduct';

import HomeBannerSlideList from './pages/HomeBannerSlider/homeBannerSlideList';
import EditHomeBannerSlide from './pages/HomeBannerSlider/editHomeBannerSlide';
import AddHomeBannerSlide from './pages/HomeBannerSlider/addHomeBannerSlide';

import BannerList from './pages/Banner/bannerList';
import EditBanner from './pages/Banner/editBanner';
import AddBanner from './pages/Banner/addBanner';

import TagList from './pages/Tag/tag';
import EditTag from './pages/Tag/editTag';
import AddTag from './pages/Tag/addTag';

import AdminList from './pages/AdminAccount/adminList';
import DeletedUsers from './pages/AdminAccount/deletedUsers';
import EditAdmin from './pages/AdminAccount/editAdmin';
import AddAdmin from './pages/AdminAccount/addAdmin';

import OrderListing from './pages/Orders/orderListing';
import MyOrders from './pages/Orders/MyOrders';
import OrderDetails from './pages/Orders/orderDetails';

import SalesDetails from './pages/Sales/salesDetails';
import SalesHistory from './pages/Sales/SalesHistory';

const MyContext = createContext();


const App = () => {

	const [isToggleSidebar, setIsToggleSidebar] = useState(false);
	const [isOpenNav, setIsOpenNav] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const [isHiddenSidebarAndHeader, setIsHiddenSidebarAndHeader] = useState(false);
	const [themeMode, setThemeMode] = useState(true);
	const [windowwidth, setWindowwidth] = useState(window.innerWidth);
	const [categoryData, setCategoryData] = useState([]);
	const [bannerData, setBannerData] = useState([]);
	const [progress, setProgress] = useState(0);
	const [dashboardStats, setDashboardStats] = useState({});
	const [salesTrendsData, setSalesTrendsData] = useState([]);
	const [revenueByCategory, setRevenueByCategory] = useState([]);
	const [recentOrders, setRecentOrders] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Null means loading state
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
				const storedUser = localStorage.getItem("user");
				
				if (storedUser) {
					setIsAuthenticated(true);
					setUserData(JSON.parse(storedUser));
				}
			
			} else {
				setIsAuthenticated(false);
				setUserData(null);
			} 
		};

		checkAuth();
	}, []);

	const login = (userData) => {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("user", JSON.stringify(userData));

        setIsAuthenticated(true);
        setUserData(userData);
    };

	const logout = async () => {
		try {
			await postDataToApi('/api/auth/logout', {});
			localStorage.removeItem("isLogin");
			localStorage.removeItem("user");
			setIsAuthenticated(false);

		} catch (error) {
			setIsAuthenticated(false);
			setUserData(null);
		}
    };


	// get dashboard cards stats
	useEffect(() => {
		fetchDataFromApi('/api/dashboard/stats').then((res) => {
			setDashboardStats(res)
		})
	}, []);

	//Get sales data 
	useEffect(() => {
		fetchDataFromApi('/api/sales/salesTrends').then((res) => {
			setSalesTrendsData(res)
		})
	}, []);

	//Set app theme
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
		fetchCategory();
		fetchBanner()
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

	const values = {
		setIsAuthenticated,
		isAuthenticated,
		setUserData,
		userData,
		isToggleSidebar,
		setIsToggleSidebar,
		isLogin,
		login,
		logout,
		isLoading,
		isLogin,
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

	useEffect(() => {
		// alert(isToggleSidebar)
	}, [isToggleSidebar]);

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
							<Route exact={true} path="/" element={
								<PrivateRoute>
									<Dashboard />
								</PrivateRoute>
							} />
							<Route exact={true} path="/login" element={<Login />} />
							{/* <Route exact={true} path="/signup" element={<Signup />} /> */}

							<Route exact={true} path="/product/details/:id" element={
								<PrivateRoute>
									<ProductDetails />
								</PrivateRoute>
							} />
							<Route exact={true} path="/product/upload" element={
								
								<PrivateRoute>
									<ProductUpload />
								</PrivateRoute>
							} />
							<Route exact={true} path="/product/listing" element={
								<PrivateRoute>
									<ProductListing />
								</PrivateRoute>

							} />

							<Route exact={true} path="/product/edit/:id" element={<EditProduct />} /> 

							<Route exact={true} path="/category" element={
								<PrivateRoute>
									<Category />
								</PrivateRoute>
							} />
							<Route exact={true} path="/category/add" element={
								<PrivateRoute>
									<AddCategory />
								</PrivateRoute>
							} />
							<Route exact={true} path="/category/edit/:id" element={
								<PrivateRoute>
									<EditCategory />
								</PrivateRoute>
							} />

							<Route exact={true} path="/subCategory" element={
								<PrivateRoute>
									<SubCategory />
								</PrivateRoute>
							} />

							<Route exact={true} path="/subCategory/add" element={
								<PrivateRoute>
									<AddSubCategory />
								</PrivateRoute>
							} />

							<Route exact={true} path="/subCategory/edit/:id" element={
								<PrivateRoute>
									<EditSubCategory />
								</PrivateRoute>
								
								} />

							<Route exact={true} path="/homeBannerSlide/add" element={
								<PrivateRoute>
									<AddHomeBannerSlide />
								</PrivateRoute>
							} />
							<Route exact={true} path="/homeBannerSlide/list" element={
								<PrivateRoute>
									<HomeBannerSlideList />
								</PrivateRoute>
							} />
							<Route exact={true} path="/homeBannerSlide/edit/:id" element={
								<PrivateRoute>
									<EditHomeBannerSlide />
								</PrivateRoute>
								} />
							
							<Route exact={true} path="/banner/add" element={
								<PrivateRoute>
									<AddBanner />
								</PrivateRoute>
								
							} />
							<Route exact={true} path="/banner/list" element={
								<PrivateRoute>
									<BannerList />
								</PrivateRoute>
								} />
							<Route exact={true} path="/banner/edit/:id" element={
								<PrivateRoute>
									<EditBanner />
								</PrivateRoute>
							} />

							<Route exact={true} path="/tag/add" element={
								<PrivateRoute>
									<AddTag />
								</PrivateRoute>
							} />
							<Route exact={true} path="/tag/list" element={
								<PrivateRoute>
									<TagList />
								</PrivateRoute>
							} />
							<Route exact={true} path="/tag/edit/:id" element={
								<PrivateRoute>
									<EditTag />
								</PrivateRoute>
							} />

							<Route exact={true} path="/admin/add" element={
								<PrivateRoute>
									<AddAdmin />
								</PrivateRoute>
							} />
							<Route exact={true} path="/admin/list" element={
								<PrivateRoute>
									<AdminList />
								</PrivateRoute>
							} />
							<Route exact={true} path="/admin/deletedUsers" element={
								<PrivateRoute>
									<DeletedUsers />
								</PrivateRoute>
							} />
							<Route exact={true} path="/admin/edit/:id" element={
								<PrivateRoute>
									<EditAdmin />
								</PrivateRoute>
							} />

							<Route exact={true} path="/admin/myOrders/listing/" element={
								<PrivateRoute>
									<MyOrders />
								</PrivateRoute>
							} />
							<Route exact={true} path="/admin/orders/listing/" element={
								<PrivateRoute>
									<OrderListing />
								</PrivateRoute>
							} />
							<Route exact={true} path="/admin/order/details/:id" element={
								<PrivateRoute>
									<OrderDetails />
								</PrivateRoute>
							} />

							<Route exact={true} path="/admin/sales/listing/" element={
								<PrivateRoute>
									<SalesHistory />
								</PrivateRoute>
							} />

							<Route exact={true} path="/admin/sales/details/:id" element={
								<PrivateRoute>
									<SalesDetails />
								</PrivateRoute>
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
