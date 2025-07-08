import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
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
import Header2 from './components/header/Header';
import PrivateRoute from './components/privateRoute/privateRoute';
import WishList from './pages/wishList/wishList';
import Checkout from './pages/checkout/Chackout';
import ThankYouPage from './pages/thankYou/ThankYouPage';
import { deleteDataFromApi, fetchDataFromApi, postDataToApi, updateDataToApi } from './utils/apiCalls';
import Seller from './pages/seller/Seller';
import SellerGuide from './pages/sellerGuide/SellerGuide';
import BusinessSignup from './pages/businessRegistration/BusinessSignup';
import FilterListing from './pages/productListing/filterListing';

const MyContext = createContext();

const App = () => {

	const [categoryData, setCategoryData] = useState([]);
	const [subCategoryData, setSubCategoryData] = useState([]);
	const [progress, setProgress] = useState(0);
	const [isLogin, setIsLogin] = useState(false);
	const [selectedCounty, setSelectedCounty] = useState("");
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
	const [featured, setFeatured] = useState([]);
	const [topSelling, setTopSelling] = useState([]);
	const [catProducts, setCatProducts] = useState([]);
	const [wishlist, setWishlist] = useState({ items: [] });
	const [cart, setCart] = useState({ items: [] });


	useEffect(() => {
		const checkAuth = async () => {
			const res = await fetchDataFromApi('/api/auth/me');

			if (res.userId) {
				const storedUser = localStorage.getItem("user");
				const userLogin = localStorage.getItem("isLogin");
				
				if (storedUser && userLogin) {
					setIsLogin(true);
					setUserData(JSON.parse(storedUser));
				}
			
			} else {
				isLogin(false);
				setUserData(null);
			} 
		};

		checkAuth();
	}, []);

	useEffect(() => {
		window.scrollTo(0,0);

		getCombineProducts()
		getRecentlyViewedProducts()
		getRecommendedProducts()
		getInspirationalProducts();

		getCategory();
		getWishListData()
		getCartData()

	}, [isLogin]);

	useEffect(() => {
		if (cart) {
			localStorage.setItem("cart", JSON.stringify(cart));
		}
    }, [cart]);

	const getCombineProducts = async () => {
        const data = await fetchDataFromApi(`/api/product/homepage`);
		
        if (data) {
            setMostPopular(data.combinedProducts.find(p => p.category === "mostPopular"));
            setTopSelling(data.combinedProducts.find(p => p.category === "topSelling"));
            setFeatured(data.combinedProducts.find(p => p.category === "featured"));
			setNewArrival(data.combinedProducts.find(p => p.category === "newlyReleased"));
			setCatProducts(data.combinedProducts.find(p => p.category === "catProducts"));
        } 
    };

	// Get products recently viewed by a user
	const getRecentlyViewedProducts = async () => {
		
		const data = await fetchDataFromApi(`/api/product/recentlyViewed`);
		if (data) {
			setRecentlyViewed(data);
		}
	}

	// Get recommended products
	const getRecommendedProducts = async () => {

		const data = await fetchDataFromApi(`/api/product/recommended`);
		if(data) {
			setRecommendedProducts(data);
		} 
	}

	const getInspirationalProducts = async () => {
		const userData = JSON.parse(localStorage.getItem("user"));
		const userId = userData?.userId

		const data = await fetchDataFromApi(`/api/product/recommendedCollaborative/${userId}`);
		if (data) {
			setRecommendedCollaborative(data);
		}
	}

	//get and set cateory and sub category
	const getCategory = async () => {
		
		const data = await fetchDataFromApi('/api/category')
		if (data) {
			setProgress(30);
			setCategoryData(data);
			const subCatArray = [];

			data.categoryList?.length !== 0 && data.categoryList?.map((category) => {
				if(category?.children.length !== 0){
					category?.children?.map((subCat) => {
						subCatArray.push(subCat);
					});
				}
			});

			setSubCategoryData(subCatArray);
			setProgress(100);

		} 
	}
	
	const getWishListData = async () => {

		const data = await fetchDataFromApi(`/api/wishlist`);
		if (data) {
			setWishlist(data.wishlist);

		} else {
			const storedWishlistItem = JSON.parse(localStorage.getItem("wishlist")) || [];
			setWishlist(storedWishlistItem);
		}
	}

	const addToWishlist = async (product) => {
		try {
			const data = await postDataToApi(`/api/wishlist/add`, { productId: product._id})

			setWishlist(data.wishlist);
			setAlertBox({
				open: true,
				error: false,
				msg: "Item added to wishlist!"
			});
			getWishListData()

		} catch (error) {

			// Get the existing wishlist from local storage or initialize as an empty array
			const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || { items: [] };

			// Check if the product is already in the wishlist
			const isAlreadyInWishlist = storedWishlist.items.some(item => item.product._id === product._id);

			if (!isAlreadyInWishlist) {
				// Append the new product to the existing list
				const updatedWishlist = {
					items: [...storedWishlist.items, { product }]
				};

				// Update local storage
				localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

				// Update state
				setWishlist(updatedWishlist);
			} else {
				setAlertBox({
					open: true,
					error: false,
					msg: "Product is already in the wishlist."
				})
			}
		}
    };

	const removeFromWishlist = async (productId) => {

		const data = await deleteDataFromApi(`/api/wishlist/remove/${productId}`);
		if (data) {
			setAlertBox({
				open: true,
				error: false,
				msg: "Item deleted successfully!"
			});
			getWishListData()

		} else {

			// Get the existing wishlist from local storage
			const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || { items: [] };

			// Filter out the product that matches the given productId
			const updatedItems = storedWishlist.items.filter(item => item.product._id !== productId);

			// Update the wishlist in the correct format
			const updatedWishlist = { items: updatedItems };

			// Update local storage
			localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

			// Update React state
			setWishlist(updatedWishlist);
		}
    };

	const isInWishlist = (productId) => {
		return wishlist?.items?.some(item => item?.product?._id === productId);
	}

	const getCartData = async () =>{
		
		const data = await fetchDataFromApi(`/api/cart`)
		if (data) {
			setCart(data.cart);

		} else {
			const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
			setCart(storedCart);
		}
	}

	const addToCart = async (product, quantity = 1) => {

		try {
			const data = await postDataToApi(`/api/cart/add`, { productId: product._id, quantity })
			setCart(data.cart);
			setAlertBox({
				open: true,
				error: false,
				msg: "Item added to cart."
			});

			getCartData()
		} catch (error) {

			// Get the existing cart from local storage or initialize as an empty array
			const storedCartData = JSON.parse(localStorage.getItem("cart")) || { items: [] };

			// Check if the product is already in the cart
			const isAlreadyInCart = storedCartData.items.some(item => item.product._id === product._id);

			if (!isAlreadyInCart) {
				// Append the new product to the existing cart list
				const updatedCart = {
					items: [...storedCartData.items, { product, quantity }]
				};

				// Update local storage
				localStorage.setItem("cart", JSON.stringify(updatedCart));

				// Update state
				setCart(updatedCart);
				getCartData()

			} else {
				setAlertBox({
					open: true,
					error: false,
					msg: "Product is already in the Cart."
				})
			}
		}
    };

	const removeFromCart = async (productId) => {

		const data = await deleteDataFromApi(`/api/cart/remove/${productId}`);
		if (data) {
			setAlertBox({
				open: true,
				error: false,
				msg: "Item deleted successfully!"
			});
			getCartData()

		} else {
			const newCart = cart.items.filter(item => item._id !== productId);
			setCart(newCart);
			localStorage.setItem("cart", JSON.stringify(newCart));
			getCartData()
		}
    };

	const updateQuantity = async (itemId, quantity) => {

		updateDataToApi(`/api/cart/update/${itemId}`, { quantity }).then((res) => {
			if (res.error) {
				setCart(prevCart => {
					
					if (!prevCart || !prevCart.items) return prevCart;
					
					const updatedCart = {
						...prevCart,
						items: prevCart.items.map(item => 
							item.product._id === itemId 
								? { ...item, quantity: item.quantity + 1 } 
								: item
						)
					};
				
					return updatedCart;
				});
				// getCartData()

			} else {
				setAlertBox({
					open: true,
					error: false,
					msg: "Cart quantity updated."
				});

				getCartData()
			}
		})
    };

	const isInCart = (productId) => {
		return cart?.items?.some(item => item?.product?._id === productId);
	}

	const login = (userData) => {
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("user", JSON.stringify(userData));

        setIsLogin(true);
        setUserData(userData);
    };

	const logout = async () => {
		try {
			await postDataToApi('/api/auth/logout', {});
			localStorage.removeItem("isLogin");
			localStorage.removeItem("user");

			setIsLogin(false);
		} catch (error) {
			setIsLogin(false);
			setUserData([]);
		}
	};

	// const signup = async (userData) => {
	// 	try {
	// 		await postDataToApi.post("/api/auth/signup", userData);
	// 		// window.location.href = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5175/dashboard"; // Redirect after signup
	// 	} catch (error) {
	// 		console.error("Signup failed:", error.response?.data?.error || error.message);
	// 	}
	// };

	// Close alert box
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setAlertBox({
			open: false
		})
	}

	const values = {
		login,
		// signup,
		logout,
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
		getCategory,
		addingToCart,
		setAddingToCart,
		searchedItems,
		setSearchedItems,
		getRecentlyViewedProducts,
		recentlyViewed,
		newArrivals,
		mostPopular,
		topSelling,
		featured,
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
					// headerFooterDisplay && <Header />
					headerFooterDisplay && <Header2 />
				}
				<Routes>
					<Route exact={true} path="/" element={<Home />} />
					<Route exact={true} path="/seller" element={<Seller />} />
					<Route exact={true} path="/seller/guide" element={<SellerGuide />} />
					<Route exact={true} path="/product/category/:id" element={<ProductListing />} />
					<Route exact={true} path="/product/subCat/:id" element={<ProductListing />} />
					<Route exact={true} path="/product/filter" element={<FilterListing />} />
					<Route exact={true} path="/product/:id" element={<ProductDetails user={user}  />} />
					<Route exact={true} path="*" element={<NotFound />} />
					{/* <Route exact={true} path="/product-details" element={<ProductDetails />} /> */}
					<Route exact={true} path="/wishList" element={<WishList />} />
					<Route exact={true} path="/login" element={<Login />} />
					<Route exact={true} path="/signup" element={<Signup />} />
					<Route exact={true} path="/search/:query" element={<SearchPage />} />

					<Route path="/cart" element={
						// <PrivateRoute>
							<Cart user={user} />
						// </PrivateRoute>
					} />

					<Route path="/checkout" element={
						// <PrivateRoute>
							<Checkout user={user} />
						// </PrivateRoute>
					} />

					<Route path="/fulfillment" element={
						// <PrivateRoute>
							<ThankYouPage user={user} />
						// </PrivateRoute>
					} />

					<Route path="/wishlist" element={
						// <PrivateRoute>
							<WishList user={user} />
						// </PrivateRoute>
					} />

					<Route path="/business/signup" element={
						<PrivateRoute>
							<BusinessSignup user={user} />
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

