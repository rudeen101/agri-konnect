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
import SearchPage from './pages/search/search';
import Header2 from './components/header2/Header';
import PrivateRoute from './components/privateRoute/privateRoute';
import WishList from './pages/wishList/wishList';
import Profile from './pages/profile/profile';
import Orders from './pages/orders/orders';
import Transactions from './pages/transsactions/transactions';
import Checkout from './pages/checkout/Chackout';
import ThankYouPage from './pages/thankYou/ThankYouPage';


import { deleteDataFromApi, fetchDataFromApi, postDataToApi, updateDataToApi } from './utils/apiCalls';

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
	const [cart, setCart] = useState([]);
	const [userData, setUserData] = useState("");
	const [headerFooterDisplay, setHeaderFooterDisplay] = useState(true);
	const [addingToCart, setAddingToCart] = useState(false);
	const [searchedItems, setSearchedItems] = useState([]);
	const [alertBox, setAlertBox] = useState({
		open: false,
		error: false,
		msg: ''
	});
	const [recentlyViewed, setRecentlyViewed] = useState([]);
	const [recommendedProducts, setRecommendedProducts] = useState([]);
	const [recommendedCollaborative, setRecommendedCollaborative] = useState([]);
	const [mostPopular, setMostPopular] = useState([]);
	const [newArrivals, setNewArrival] = useState([]);
	const [catProducts, setCatProducts] = useState([]);
	const [wishlist, setWishlist] = useState([]);


	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user"));

		fetchDataFromApi(`/api/product/homepage`)
		.then((res) => {
			setMostPopular(res.combinedProducts.find(p => p.category === "mostPopular"));
			setNewArrival(res.combinedProducts.find(p => p.category === "newlyReleased"));
			setCatProducts(res.combinedProducts.find(p => p.category === "catProducts"));
		});
	}, []);

	// Get products recently viewed by a user
	useEffect(() => {
		fetchDataFromApi(`/api/product/recentlyViewed`)
		.then((res) => {
			setRecentlyViewed(res);
		});
	}, []);

	// Get recommended products
	useEffect(() => {
		fetchDataFromApi(`/api/product/recommended`)
		.then((res) => {
			setRecommendedProducts(res);
		});
	}, []);

	// Get recommended collaboritive products
	useEffect(() => {
		fetchDataFromApi(`/api/product/recommendedCollaborative`)
		.then((res) => {
			setRecommendedCollaborative(res);
		});
	}, []);

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

		if (accessToken !== "" && accessToken !== undefined && accessToken !== null) {

			setIsLogin(true);

			const userData = JSON.parse(localStorage.getItem("user"));

			setUserData(userData);
		}else {
			setIsLogin(false);
		}
	}, [isLogin]);

	useEffect(() => {
		window.scrollTo(0,0);
		fetchCategory();
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
					category?.children?.map((subCat) => {
						subCatArray.push(subCat);
					});
				}
			});

			setSubCategoryData(subCatArray);
			setProgress(100);
		})
	}
	
	const getWishListData = () => {
		fetchDataFromApi(`/api/wishList`).then((res) => {
			setWishlist(res.wishlist);
		})
	}

	const addToWishlist = async (product) => {

		postDataToApi(`/api/wishlist/add`, { productId: product._id}).then((res) => {
			if (!res) {
				const newWishlist = [...wishlist, { ...product}];
				setWishlist(newWishlist);
				localStorage.setItem("wishlist", JSON.stringify(newWishlist));
			}else {
				setWishlist(res.wishlist);
				setAlertBox({
					open: true,
					error: false,
					msg: res.msg
				});

				getWishListData()
			}
		})
    };

	const removeFromWishlist = async (productId) => {

		deleteDataFromApi(`/api/wishlist/remove/${productId}`).then((res) => {
			if (!res) {
				const newWishlist = cart.filter(item => item._id !== productId);
				setWishlist(newWishlist);
				localStorage.setItem("wishlist", JSON.stringify(newWishlist));
			} else {
				setAlertBox({
					open: true,
					error: false,
					msg: "Item deleted successfully!"
				});
				getWishListData()
			}
		})
    };

	const isInWishlist = (productId) => {
		return wishlist?.items?.some(item => item?.product?._id === productId);
	}


	// Fetch cart data
    useEffect(() => {
		fetchCartData()
    }, []);

	const fetchCartData = () =>{
		
		fetchDataFromApi(`/api/cart`).then((res) => {
			if (!res) {
				const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
                setCart(storedCart);
			} else {
                setCart(res.cart || []);
			}
        });
	}

	const addToCart = async (product, quantity = 1) => {

		postDataToApi(`/api/cart/add`, { productId: product._id, quantity }).then((res) => {
			if (!res) {
				const newCart = [...cart, { ...product, quantity }];
				setCart(newCart);
				localStorage.setItem("cart", JSON.stringify(newCart));
			}else {
				setCart(res.cart);
				setAlertBox({
					open: true,
					error: false,
					msg: res.msg
				});

				fetchCartData()
			}
		})
    };

	const removeFromCart = async (productId) => {

		deleteDataFromApi(`/api/cart/remove/${productId}`).then((res) => {
			if (!res) {
				const newCart = cart.filter(item => item._id !== productId);
				setCart(newCart);
				localStorage.setItem("cart", JSON.stringify(newCart));
			} else {
				setAlertBox({
					open: true,
					error: false,
					msg: "Item deleted successfully!"
				});
				fetchCartData()
			}
		})
    };

	const updateQuantity = async (itemId, quantity) => {

		updateDataToApi(`/api/cart/update/${itemId}`, { quantity }).then((res) => {
			if (!res) {
				setCart(cart.map(item => item._id === itemId ? { ...item, quantity } : item));
				localStorage.setItem("cart", JSON.stringify(cart));
			} else {
				setAlertBox({
					open: true,
					error: false,
					msg: "Cart quantity updated."
				});

				fetchCartData()
			}
		})
    };

	const isInCart = (productId) => {
		return cart?.items?.some(item => item?.product?._id === productId);
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
		fetchCategory,
		addingToCart,
		setAddingToCart,
		searchedItems,
		setSearchedItems,
		recentlyViewed,
		newArrivals,
		mostPopular,
		setCatProducts,
		catProducts,
		setRecommendedProducts,
		recommendedProducts,
		setRecommendedCollaborative,
		recommendedCollaborative,
		cart, 
		addToCart, 
		removeFromCart, 
		updateQuantity,
		isInCart,
		wishlist,
		addToWishlist, 
		removeFromWishlist, 
		isInWishlist

	}

	
	const user = userData

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
					// headerFooterDisplay && <Header />
					headerFooterDisplay && <Header2 />
				}
				<Routes>
					<Route exact={true} path="/" element={<Home />} />
					<Route exact={true} path="/product/category/:id" element={<ProductListing />} />
					<Route exact={true} path="/product/subCat/:id" element={<ProductListing />} />
					<Route exact={true} path="/product/:id" element={<ProductDetails user={user}  />} />
					<Route exact={true} path="*" element={<NotFound />} />
					{/* <Route exact={true} path="/product-details" element={<ProductDetails />} /> */}
					<Route exact={true} path="/wishList" element={<WishList />} />
					<Route exact={true} path="/login" element={<Login />} />
					<Route exact={true} path="/signup" element={<Signup />} />
					<Route exact={true} path="/search/:query" element={<SearchPage />} />


					 {/* Protected Routes */}
					<Route path="/profile" element={
						<PrivateRoute>
							<Profile />
						</PrivateRoute>
					} />

					<Route path="/cart" element={
						<PrivateRoute>
							<Cart user={user} />
						</PrivateRoute>
					} />

					<Route path="/checkout" element={
						<PrivateRoute>
							<Checkout user={user} />
						</PrivateRoute>
					} />

					<Route path="/fulfillment" element={
						<PrivateRoute>
							<ThankYouPage user={user} />
						</PrivateRoute>
					} />
					<Route path="/orders" element={
						<PrivateRoute>
							<Orders user={user} />
						</PrivateRoute>
					} />

					<Route path="/wishlist" element={
						<PrivateRoute>
							<WishList user={user} />
						</PrivateRoute>
					} />

					
					<Route path="/transactions" element={
						<PrivateRoute>
							<Transactions user={user} />
						</PrivateRoute>
					} />
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

