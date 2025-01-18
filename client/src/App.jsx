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
import WishList from './pages/wishList/wishList'
import LoadingBar from 'react-top-loading-bar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SearchPage from './pages/search/search';


import { fetchDataFromApi, postData } from './utils/api';

const MyContext = createContext();

const App = () => {

	const [categoryData, setCategoryData] = useState([]);
	const [subCategoryData, setSubCategoryData] = useState([]);
	const [progress, setProgress] = useState(0);
	const [cartItems, setCartItems] = useState([]);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)
	const [isLogin, setIsLogin] = useState(false);
	const [isOpenFilters, setIsOpenFilters] = useState()
	const [cartTotalAmount, setCartTotalAmount] = useState();
	const [selectedCounty, setSelectedCounty] = useState("");
	const [cartData, setCartData] = useState("");
	const [userData, setUserData] = useState("");
	const [headerFooterDisplay, setHeaderFooterDisplay] = useState(true);
	const [addingToCart, setAddingToCart] = useState(false);
	const [wishListData, setWishListData] = useState([]);
	const [searchedItems, setSearchedItems] = useState([]);
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


	// useEffect(() => {
	// 	const user = JSON.parse(localStorage.getItem("user"));

	// 	if (
	// 		user?.userId !== "" &&
	// 		user?.userId !== undefined &&
	// 		user?.userId !== null

	// 	) {
	// 		fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
	// 			setCartData(res)			
	// 		})
	// 	}
	// }, [isLogin]);


	useEffect(() => {
		window.scrollTo(0,0);

		fetchCategory();
		getCartData()
		getWishListData()
	}, []);

	//fetch and set cateory and sub category
	const fetchCategory = () => {
		fetchDataFromApi('/api/category').then((res) => {
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
		const user = JSON.parse(localStorage.getItem("user"));
	
		fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
			setCartData(res);
		})
	}

	const getWishListData = () => {
		fetchDataFromApi(`/api/wishList?userId=${userData.userId}`).then((res) => {
			if (res?.length !== 0){
				setWishListData(res);
			}
		})
	}

	const addToCart = (data) => {

		if (isLogin !== false) {
			setAddingToCart(true)
			postData(`/api/cart/add`, data).then((res) => {
				if (res.status !== false) {
					setAlertBox({
						open: true,
						error: false,
						msg: "Item added to cart"
					});

					setTimeout(() => {
						setAddingToCart(false)
					}, 1000);

					getCartData()
				}else {
					setAlertBox({
						open: true,
						error: true,
						msg: res.msg
					});
		
					setAddingToCart(false)
		
				}
			})
		}else {
			setAlertBox({
				open: true,
				error: true,
				msg: "Please login to add to cart!"
			});

		}
	
	}
	
	const signIn = () => {
		const userLogin = localStorage.getItem("isLogin");
		setIsLogin(userLogin);
	}

	const signout = () => {
		localStorage.removeItem("isLogin");
		setIsLogin(false);
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
		setUserData,
		headerFooterDisplay,
		setHeaderFooterDisplay,
		addToCart,
		cartData,
		setCartData,
		addingToCart,
		setAddingToCart,
		getCartData,
		wishListData,
		setWishListData,
		getWishListData,
		searchedItems,
		setSearchedItems
		

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

				{
					headerFooterDisplay && <Header />
				}
				<Routes>
					<Route exact={true} path="/" element={<Home />} />
					<Route exact={true} path="/product/category/:id" element={<ProductListing />} />
					<Route exact={true} path="/product/subCat/:id" element={<ProductListing />} />
					<Route exact={true} path="/product/:id" element={<ProductDetails />} />
					<Route exact={true} path="*" element={<NotFound />} />
					{/* <Route exact={true} path="/product-details" element={<ProductDetails />} /> */}
					<Route exact={true} path="/cart" element={<Cart />} />
					<Route exact={true} path="/wishList" element={<WishList />} />
					<Route exact={true} path="/login" element={<Login />} />
					<Route exact={true} path="/signup" element={<Signup />} />

					<Route exact={true} path="/search" element={<SearchPage />} />
				</Routes>

				{
					headerFooterDisplay && <Footer />
				}
				
			</MyContext.Provider>
		</BrowserRouter>
	)
}


export default App;
export {MyContext};

