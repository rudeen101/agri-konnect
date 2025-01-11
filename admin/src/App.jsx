import './App.css';
import './responsive.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/dashboard';
import SearchBox from './components/searchbox/SearchBox';
import Login from './pages/Login/login';
import Signup from './pages/Signup/signup';
import ProductListing from './pages/Products/products';
import ProductDetails from './pages/Products/productDetails';
import ProductUpload from './pages/Products/addProducts';
import { createContext, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar/sidebar';
import { FaSignHanging } from 'react-icons/fa6';
import { fetchDataFromApi } from './utils/api';
import Category from './pages/Category/category';
import LoadingBar from 'react-top-loading-bar';
import AddCategory from './pages/Category/addCategory';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditCategory from './pages/Category/editCategory';
import SubCategory from './pages/Category/SubCategory';
import EditSubCategory from './pages/Category/editSubCategory';
import AddSubCategory from './pages/Category/addSubCategory';
import ProductSize from './pages/Products/productSize';
import AddProductSize from './pages/Products/addProductSize';
import EditProductSize from './pages/Products/editProductSize';
import ProductWeight from './pages/Products/productWeight';
import AddProductWeight from './pages/Products/addProductWeight';
import EditProductWeight from './pages/Products/editProductWeight';

const MyContext = createContext();


const App = () => {

	const [isToggleSidebar, setIsToggleSidebar] = useState(false);
	const [isOpenNav, setIsOpenNav] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const [userData, setUserData] = useState("");
	const [isHiddenSidebarAndHeader, setIsHiddenSidebarAndHeader] = useState(false);
	const [themeMode, setThemeMode] = useState(true);
	const [windowwidth, setWindowwidth] = useState(window.innerWidth);
	const [categoryData, setCategoryData] = useState([]);
	const [progress, setProgress] = useState(0);

	const [alertBox, setAlertBox] = useState({
		open: false,
		error: false,
		msg: ''
	});

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
			setWindowwidth(window.innerWidth);
		}

		window.addEventListener('resize', handleResize);

		fetchCategory();

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, []);

	const fetchCategory = () => {
		fetchDataFromApi('/api/category').then((res) => {
			setProgress(30);
			setCategoryData(res);
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
		isToggleSidebar,
		setIsToggleSidebar,
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
		categoryData,
		setCategoryData,
		userData,
		setUserData
		
	}
	console.log(userData);

	useEffect(() => {
		// alert(isToggleSidebar)
	}, [isToggleSidebar]);

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
					isHiddenSidebarAndHeader !== true &&
					<Header />
				}
				<div className="main d-flex">
					{
						isHiddenSidebarAndHeader !== true &&
						<>
							<div className={`sidebarOverlay d-none ${isOpenNav === true && 'show'}`} onClick={() => setIsOpenNav(false)}></div>
							<div className={`sidebarContainer ${isToggleSidebar === true ? 'toggle' : ""}
							${isOpenNav === true ? 'open' : ''}`}>
								<Sidebar />
							</div>
						</>
					
					}
				

					<div className={`content ${isHiddenSidebarAndHeader === true && 'full'} ${isToggleSidebar === true ? 'toggle' : ""}`}>
						<Routes>
							<Route exact={true} path="/" element={<Dashboard />} />
							<Route exact={true} path="/login" element={<Login />} />
							<Route exact={true} path="/signup" element={<Signup />} />

							<Route exact={true} path="/product/details" element={<ProductDetails />} />
							<Route exact={true} path="/product/upload" element={<ProductUpload />} />
							<Route exact={true} path="/product/listing" element={<ProductListing />} />

							<Route exact={true} path="/productSize" element={<ProductSize />} />
							<Route exact={true} path="/productSize/add" element={<AddProductSize />} />
							<Route exact={true} path="/productSize/edit/:id" element={<EditProductWeight />} />

							<Route exact={true} path="/productWeight" element={<ProductWeight />} />
							<Route exact={true} path="/productWeight/add" element={<AddProductWeight />} />
							<Route exact={true} path="/productWeight/edit/:id" element={<EditProductWeight />} />

							<Route exact={true} path="/category" element={<Category />} />
							<Route exact={true} path="/category/add" element={<AddCategory />} />
							<Route exact={true} path="/category/edit/:id" element={<EditCategory />} />

							<Route exact={true} path="/subCategory" element={<SubCategory />} />
							<Route exact={true} path="/subCategory/add" element={<AddSubCategory />} />
							<Route exact={true} path="/subCategory/edit/:id" element={<EditSubCategory />} />
						</Routes>
					</div>
				</div>
			</MyContext.Provider>
		</BrowserRouter>
	)
}


export default App
export {MyContext};
