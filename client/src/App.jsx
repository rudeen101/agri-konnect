import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Header from './components/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import ProductListing from './pages/productListing/productListing';
import NotFound from './pages/notFound/notFound';
import Footer from './components/footer/footer';
import ProductDetails from './pages/productDetails/productDetails';
import Cart from './pages/cart/cart';
import LoadingBar from 'react-top-loading-bar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';



import { fetchDataFromApi } from './utils/api';

const MyContext = createContext();

const App = () => {

	const [categoryData, setCategoryData] = useState([]);
	const [subCategoryData, setSubCategoryData] = useState([]);
	const [progress, setProgress] = useState(0);
	const [cartItems, setCartItems] = useState([]);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)
	const [isLogin, setIsLogin] = useState();
	const [isOpenFilters, setIsOpenFilters] = useState(false)
	const [cartTotalAmount, setCartTotalAmount] = useState();
	const [selectedCounty, setSelectedCounty] = useState("");
	const [cartData, setCartData] = useState("");
	const [userData, setUserData] = useState("");

	// const [userData, setUserData] = useState({
	// 	name: "",
	// 	email: "",
	// 	userId: ""
	// });

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token !== "" && token !== undefined && token !== null) {
			setIsLogin(true);

			const userData = JSON.parse(localStorage.getItem("user"));

			setUserData(userData);
		}else {
			setIsLogin(false);
		}
	}, [isLogin]);


	const [alertBox, setAlertBox] = useState({
		open: false,
		error: false,
		msg: ''
	});

	const [county, setCounty] = useState(
		[
		"Bomi",
		"Bong",
		"Gbarpolu",
		"Grand Bassa",
		"Grand Cape Mount",
		"Grand Gedeh",
		"Grand Kru",
		"Lofa",
		"Margibi",
		"Maryland",
		"Montserrado",
		"Nimba",
		"River Gee",
		"Rivercess",
		"Sinoe"
	])

	useEffect(() => {
		const handleResize = () =>{
			setWindowWidth(window.innerWidth);
		}

		const location = localStorage.getItem("location");
		if (location !== null && location !== "" && location !== undefined) {
			setSelectedCounty(location);
		}
		else{
			setSelectedCounty("All");
			localStorage.setItem("location", "All")
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, []);


	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));

		if (
			user?.userId !== "" &&
			user?.userId !== undefined &&
			user?.userId !== null

		) {
			fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
				setCartData(res)			
			})
		}
	}, [isLogin]);


	useEffect(() => {
		window.scrollTo(0,0);

		fetchCategory();
	}, []);

	//fetch and set cateory and sub category
	const fetchCategory = () => {
		fetchDataFromApi('/api/category').then((res) => {
			console.log("cat", res);
			setProgress(30);
			setCategoryData(res);

			const subCatArray = [];

			res.categoryList?.length !== 0 && res.categoryList?.map((category) => {
				if(category?.children.length !== 0){
					category?.childredn?.map((subCat) => {
						subCatArray.push(subCat);
					});
				}
			});
			setSubCategoryData(subCatArray);
			setProgress(100);
		})
	}

	//fetch and set cart data
	const getCartData = () => {
		const user = JSON.parse(localstorae.getItem(user));
		fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
			setCartData(res);
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
		categoryData,
		setCategoryData,
		subCategoryData,
		setSubCategoryData,
		progress,
		setProgress,
		selectedCounty,
		setSelectedCounty,
		isLogin,
		setIsLogin,
		alertBox,
		setAlertBox,
		userData,
		setUserData
	}

	return (
		<BrowserRouter>
			<MyContext.Provider value={values}>
				<LoadingBar
					color='#f11946'
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

				<Header />
				<Routes>
					<Route exact={true} path="/" element={<Home />} />
					<Route exact={true} path="/product/category/:id" element={<ProductListing />} />
					<Route exact={true} path="/product/subCat/:id" element={<ProductListing />} />
					<Route exact={true} path="*" element={<NotFound />} />
					<Route exact={true} path="/product-details" element={<ProductDetails />} />
					<Route exact={true} path="/cart" element={<Cart />} />
					<Route exact={true} path="/login" element={<Login />} />
					<Route exact={true} path="/signup" element={<Signup />} />
				</Routes>
				<Footer />
			</MyContext.Provider>
		</BrowserRouter>
	)
}


export default App;
export {MyContext};

