import React, { useState, useContext, useEffect } from "react";
import "./signup.css";
import { MyContext } from "../../App";
// import { FaEye, FaGoogle, FaLock, FaUserCircle } from "react-icons/fa";
// import { Button, CircularProgress } from "@mui/material";
// import { IoMdEyeOff, IoMdEye, IoMdHome } from "react-icons/io";
// import { FaPhone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
// import FormControlLabel from "@mui/material/FormControlLabel";
import logo from "../../assets/images/logo3.png";
// import { MdContactPhone } from "react-icons/md";


// import Checkbox from "@mui/material/Checkbox";
// // import backgroundPattern from "../../assets/images/background-pattern.jpg"
import {postDataToApi} from "../../utils/apiCalls";



import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Button, Checkbox, CircularProgress } from '@mui/material';

const SignupForm = () => {
	const [formFields, setFormFields] = useState({
		name: '',
		contact: '',
		password: '',
		confirmPassword: ''
	});

  // const [formFields, setFormFields] = useState({
	// 	name: '',
	// 	contact: '',
	// 	confirmPassword: '',
	// });
  
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [activeField, setActiveField] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [acceptedTerms, setAcceptedTerms] = useState(false);

	const context = useContext(MyContext);	
    const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormFields(prev => ({ ...prev, [name]: value }));
	};

	// const handleSubmit = (e) => {
	// 	e.preventDefault();
	// 	setIsLoading(true);
	// 	// Handle form submission logic here
	// 	console.log('Form submitted:', formFields);
	// 	setTimeout(() => setIsLoading(false), 1500);
	// };

    const handleSubmit = async (e) => {
        e.preventDefault();
		setIsLoading(true);

        if (formFields.name === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Enter name"
            });

            return false;
        }

        if (formFields.contact === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Enter email"
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

        if (formFields.confirmPassword === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Enter confirmed password"
            });

            return false;
        }

        if (formFields.confirmPassword !== formFields.password) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "password and confirmed password don't match"
            });

            return false;
        }

        
		const response = await postDataToApi("/api/auth/signup", formFields);

		if (response) {
			context.setAlertBox({
				open: true,
				error: false,
				msg: "Account registered successfully"
			});
			
			setIsLoading(false);
			navigate("/login")
		} else {

			context.setAlertBox({
				open: true,
				error: true,
				msg: "Erro registering this account. Please make sure all information is provided"
			});
			setIsLoading(false);

		}

		
	
  
    }


	return (
		<div className="auth-container">
			<div className="auth-card">
			{/* Header */}
			<div className="auth-header">
				<img src={logo} alt="Company Logo" className="auth-logo" />
				<h2>Create Your Account</h2>
				<p>Join our community today</p>
			</div>

			{/* Signup Form */}
			<form onSubmit={handleSubmit} className="auth-form">
				{/* Full Name */}
				<div className={`form-group ${activeField === 0 ? 'active' : ''}`}>
				<FaUser className="input-icon" />
				<input
					type="text"
					name="name"
					placeholder="Enter your full name"
					value={formFields.name}
					onChange={handleChange}
					onFocus={() => setActiveField(0)}
					onBlur={() => setActiveField(null)}
					required
				/>
				</div>

				{/* Email */}
				<div className={`form-group ${activeField === 1 ? 'active' : ''}`}>
				<FaEnvelope className="input-icon" />
				<input
					type="contact"
					name="contact"
					placeholder="Enter your email or phone number"
					value={formFields.contact}
					onChange={handleChange}
					onFocus={() => setActiveField(1)}
					onBlur={() => setActiveField(null)}
					required
				/>
				</div>

				{/* Phone */}
				{/* <div className={`form-group ${activeField === 2 ? 'active' : ''}`}>
				<FaPhone className="input-icon" />
				<input
					type="tel"
					name="phone"
					placeholder="Phone Number"
					value={formFields.phone}
					onChange={handleChange}
					onFocus={() => setActiveField(2)}
					onBlur={() => setActiveField(null)}
				/>
				</div> */}

				{/* Password */}
				<div className={`form-group ${activeField === 3 ? 'active' : ''}`}>
				<FaLock className="input-icon" />
				<input
					type={showPassword ? 'text' : 'password'}
					name="password"
					placeholder="Password"
					value={formFields.password}
					onChange={handleChange}
					onFocus={() => setActiveField(3)}
					onBlur={() => setActiveField(null)}
					required
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

				{/* Confirm Password */}
				<div className={`form-group ${activeField === 4 ? 'active' : ''}`}>
				<FaLock className="input-icon" />
				<input
					type={showConfirmPassword ? 'text' : 'password'}
					name="confirmPassword"
					placeholder="Confirm Password"
					value={formFields.confirmPassword}
					onChange={handleChange}
					onFocus={() => setActiveField(4)}
					onBlur={() => setActiveField(null)}
					required
				/>
				<button
					type="button"
					className="password-toggle"
					onClick={() => setShowConfirmPassword(!showConfirmPassword)}
					aria-label={showConfirmPassword ? "Hide password" : "Show password"}
				>
					{showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
				</button>
				</div>

				{/* Terms and Conditions */}
				<div className="terms-group">
				<Checkbox
					checked={acceptedTerms}
					onChange={(e) => setAcceptedTerms(e.target.checked)}
					color="primary"
					required
				/>
				<span>
					I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
				</span>
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
					Creating Account...
					</>
				) : (
					'Sign Up'
				)}
				</Button>
			</form>

			{/* Login Link */}
			<div className="auth-footer">
				Already have an account? <Link to="/login">Log In</Link>
			</div>
			</div>
		</div>
	);
};

export default SignupForm;