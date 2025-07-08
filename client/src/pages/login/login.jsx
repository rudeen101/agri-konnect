import React, { useState, useContext, useEffect } from "react";
import "./login.css";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { MdContactPhone } from "react-icons/md";
import { fetchDataFromApi, postDataToApi } from "../../utils/apiCalls";
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Button, Checkbox, CircularProgress } from '@mui/material';
import logo from '../../assets/images/logo2.jpg'; // Update with your logo path

// import React, { useState, useContext, useEffect } from "react";
// import "./login.css";
// import logo from "../../assets/images/logo3.png";
// import { MyContext } from "../../App";
// import { FaEye, FaGoogle, FaLock } from "react-icons/fa";
// import { IoMdEyeOff, IoMdEye } from "react-icons/io";
// import { Button, CircularProgress } from "@mui/material";
// import {postDataToApi} from "../../utils/apiCalls";
// import { Link, useNavigate } from "react-router-dom";
// import { MdContactPhone } from "react-icons/md";
// import Cookies from 'js-cookie'
// import { fetchDataFromApi } from "../../utils/apiCalls";


// const Login = () =>{

//     const [inputIndex, setInputIndex] = useState(0);
//     const [isShowPassword, setIsShowPassword] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [formFields, setFormFields] = useState({
//         contact: '',
//         password: '',
//     });

    // const context = useContext(MyContext);
    // const navigate = useNavigate()

    // // check if user exist and redirect to the dashboard
    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const params = new URLSearchParams(window.location.search);
    //             const redirect = params.get("redirect");
    //             const res = await fetchDataFromApi(`/api/auth/me`);

    //             if (res && redirect === "dashboard") {
    //                 window.location.href = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5175/dashboard";
    //             }

                
    //         } catch (err) {
    //             console.log(err);
    //         } 
    //     };

    //     checkAuth();
    // }, []);


//     const changeInput = (e) => {
//         setFormFields(() => ({
//             ...formFields,
//             [e.target.name]: e.target.value

//         }));
//     }

    // const signIn = async (e) => {
    //     e.preventDefault()

    //     if (formFields.contact === "") {
    //         context.setAlertBox({
    //             open: true,
    //             error: true,
    //             msg: "Enter email or phone number"
    //         });

    //         return false;
    //     }
    
    //     if (formFields.password === "") {
    //         context.setAlertBox({
    //             open: true,
    //             error: true,
    //             msg: "Enter password"
    //         });

    //         return false;
    //     }

    //     try {
    //         const res = await postDataToApi("/api/auth/signin", formFields);
    //         const userData = {
    //             username: res?.user?.username,
    //             contact: res?.user?.contact,
    //             userId: res?.user?.userId
    //         };

    //         context?.login(userData)

    //         setTimeout(() => {
    //             setInputIndex(true);
    //             setIsLoading(false);
    //             navigate("/");
    //         }, 200);
    //     } catch (error) {
    //         console.error("Login failed:", error.response?.data?.error || error.message);
    //     }

    // }

//     const focusInput = (index) => {
//         setInputIndex(index);
//     }

const SigninForm = () => {
	const [formFields, setFormFields] = useState({
		contact: '',
		password: '',
		// rememberMe: false
	});
  
	const [showPassword, setShowPassword] = useState(false);
	const [activeField, setActiveField] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);
    const navigate = useNavigate()

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormFields(prev => ({ 
			...prev, 
			[name]: type === 'checkbox' ? checked : value 
		}));
	};

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   // Handle form submission logic here
  //   console.log('Form submitted:', formData);
  //   setTimeout(() => setIsLoading(false), 1500);
  // };

	
    // check if user exist and redirect to the dashboard
    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const params = new URLSearchParams(window.location.search);
    //             const redirect = params.get("redirect");
    //             const res = await fetchDataFromApi(`/api/auth/me`);

    //             if (res && redirect === "dashboard") {
    //                 window.location.href = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5175/dashboard";
    //             }
                
    //         } catch (err) {
    //             console.log(err);
    //         } 
    //     };

    //     checkAuth();
    // }, []);


	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true);


		if (formFields.contact === "") {
			context.setAlertBox({
				open: true,
				error: true,
				msg: "Enter email or phone number"
			});

			return false;
		}

		if (formFields.password === "") {
			context.setAlertBox({
				open: true,
				error: true,
				msg: "Enter password"
			});

			return false;
		}

		try {
			const res = await postDataToApi("/api/auth/signin", formFields);
			const userData = {
				username: res?.user?.username,
				contact: res?.user?.contact,
				userId: res?.user?.userId
			};

			context?.login(userData)

			setTimeout(() => {
				setIsLoading(false);
				navigate("/");
			}, 200);
		} catch (error) {
			console.error("Login failed:", error.response?.data?.error || error.message);
		}

	}

	return (
	<div className="auth-container">
		<div className="auth-card">
		{/* Header */}
		<div className="auth-header">
			<img src={logo} alt="Company Logo" className="auth-logo" />
			<h2>Welcome Back</h2>
			<p>Sign in to continue to your account</p>
		</div>

		{/* Signin Form */}
		<form onSubmit={handleSubmit} className="auth-form">
			{/* Email */}
			<div className={`form-group ${activeField === 0 ? 'active' : ''}`}>
			<FaEnvelope className="input-icon" />
			<input
				type="contact"
				name="contact"
				placeholder="Enter email or phone number"
				value={formFields.email}
				onChange={handleChange}
				onFocus={() => setActiveField(0)}
				onBlur={() => setActiveField(null)}
				required
				autoComplete="username"
			/>
			</div>

			{/* Password */}
			<div className={`form-group ${activeField === 1 ? 'active' : ''}`}>
			<FaLock className="input-icon" />
			<input
				type={showPassword ? 'text' : 'password'}
				name="password"
				placeholder="Enter password"
				value={formFields.password}
				onChange={handleChange}
				onFocus={() => setActiveField(1)}
				onBlur={() => setActiveField(null)}
				required
				autoComplete="current-password"
			/>
			<button
				type="button"
				className="password-toggle"
				onClick={() => setShowPassword(!showPassword)}
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? <IoMdEyeOff /> : <IoMdEye />}
			</button>
			</div>

			{/* Remember Me & Forgot Password */}
			<div className="form-options">
			<div className="remember-me">
				<Checkbox
				name="rememberMe"
				checked={formFields.rememberMe}
				onChange={handleChange}
				color="primary"
				size="small"
				/>
				<span>Remember me</span>
			</div>
			<Link to="/forgot-password" className="forgot-password">
				Forgot password?
			</Link>
			</div>

			{/* Submit Button */}
			<Button
			type="submit"
			variant="contained"
			className="submit-btn"
			disabled={isLoading}
			fullWidth
			>
			{isLoading ? (
				<>
				<CircularProgress size={24} style={{ color: 'white', marginRight: '10px' }} />
				Signing In...
				</>
			) : (
				'Sign In'
			)}
			</Button>

			{/* Social Login Options (optional) */}
			<div className="social-login">
			<div className="divider">
				<span>Or continue with</span>
			</div>
			<div className="social-buttons">
				<button type="button" className="social-btn google">
				<img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
				</button>
				<button type="button" className="social-btn facebook">
				<img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" />
				</button>
			</div>
			</div>
		</form>

		{/* Signup Link */}
		<div className="auth-footer">
			Don't have an account? <Link to="/signup">Sign Up</Link>
		</div>
		</div>
	</div>
	);
};

export default SigninForm;