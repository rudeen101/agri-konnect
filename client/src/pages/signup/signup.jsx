import React, { useState, useContext, useEffect } from "react";
import "./signup.css";
import { MyContext } from "../../App";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { FaEye, FaGoogle, FaLock, FaUserCircle } from "react-icons/fa";
import { Button, CircularProgress } from "@mui/material";
import { IoMdEyeOff, IoMdEye, IoMdHome } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import logo from "../../assets/images/logo3.png";
import { MdContactPhone } from "react-icons/md";


import Checkbox from "@mui/material/Checkbox";
// import backgroundPattern from "../../assets/images/background-pattern.jpg"
import {postDataToApi} from "../../utils/apiCalls";

const Signup = () =>{

    const [inputIndex, setInputIndex] = useState(0);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);  
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
		name: '',
		contact: '',
		confirmPassword: '',
	});

    const context = useContext(MyContext);	
    const history = useNavigate();

    const focusInput = (index) => {
        setInputIndex(index);
    }

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }));
    }

    const submitForm = (e) => {
        e.preventDefault()

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

        try {
            const response = postDataToApi("/api/auth/signup", formFields);
            context.signup(response.data);
            
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Registered successfully"
            });
        } catch (error) {
            console.error("Signup failed:", error.response?.data?.error || error.message);
        }
    }

    return(
        <>
            <section className="loginSection">
                <div className="loginBox">
                    <div className="headerContainer">
                        <img src={logo} alt="" />
                        <h4 className="hd">Signup</h4>
                    </div>

                    <div className="wrapper mt-3 card border p-4">
                        <form action="" onSubmit={submitForm}>
                            <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus'}`}>
                                    <span className="icon"><FaUserCircle /></span>
                                    <input type="text" className="form-control" placeholder="Enter your fullname" name="name" onChange={changeInput} onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} />
                            </div>

                            <div className={`form-group mb-3 position-relative ${inputIndex === 1 && 'focus'}`}>
                                    <span className="icon"><MdContactPhone /></span>
                                    <input type="text" className="form-control" placeholder="Enter your email or phone number" name="contact" onChange={changeInput} onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} />
                            </div>

                            <div className={`form-group mb-4 position-relative ${inputIndex === 2 && 'focus'}`}>
                                <span className="icon"><FaLock /></span>
                                <input type={`${isShowPassword === true ? 'text' : 'password'}`} className="form-control" placeholder="Enter your password" name="password" onChange={changeInput} onFocus={() => focusInput(2)} onBlur={() => setInputIndex(null)} />

                                <span className="toggleShowPassword" onClick={() => setIsShowPassword(!isShowPassword)}>
                                    {
                                        isShowPassword === true ? <IoMdEyeOff></IoMdEyeOff> : <IoMdEye></IoMdEye>
                                    }
                                </span>
                            </div>
                            <div className={`form-group mb-4 position-relative ${inputIndex === 2 && 'focus'}`}>
                                <span className="icon"><FaLock /></span>
                                <input type={`${isShowConfirmPassword === true ? 'text' : 'password'}`} className="form-control" placeholder="Confirm your password" name="confirmPassword" onChange={changeInput} onFocus={() => focusInput(3)} onBlur={() => setInputIndex(null)} />

                                <span className="toggleShowPassword" onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}>
                                    {
                                        isShowPassword === true ? <IoMdEyeOff></IoMdEyeOff> : <IoMdEye></IoMdEye>
                                    }
                                </span>
                            </div>
                            
                            <FormControlLabel control={<Checkbox />} label="I agree to all Terms & Conditions"></FormControlLabel>
                            <div className="form-group mt-3">
                                <Button type="submit" className="btn-blue btn-large w-100 btn-big">
                                    { isLoading === true ? <CircularProgress /> : "Register"}
                                </Button>
                            </div>

                        </form>
                    </div>

                    <div className="wrapper mt-3 card border footer p-3 d-flex">
                        <span className="text-center">Do have an acount? 
                            <Link to={'/login'} className="link color ml-3" style={{color: "#00a99d"}}>Signin</Link>
                        </span>
                    </div>

                </div>
            </section>
        </>
  
    )
}

export default Signup;