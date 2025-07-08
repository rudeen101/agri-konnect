import React, { useState, useContext, useEffect } from "react";
import "./signup.css";
import logo from "../../assets/images/logo.png";
import { MyContext } from "../../App";
import { FaEye, FaGoogle, FaLock, FaUserCircle } from "react-icons/fa";
import { Button, CircularProgress } from "@mui/material";
import { IoMdEyeOff, IoMdEye, IoMdHome } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import backgroundPattern from "../../assets/images/background-pattern.jpg"
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";
import { MdContactPhone } from "react-icons/md";


const Signup = () =>{

    const [inputIndex, setInputIndex] = useState(0);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);  
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
		name: '',
		contact: '',
		password: '',
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

        try {
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

            setIsLoading(true);
            postDataToApi("/api/user/signup", formFields).then((res) => {
                if (res.error !== true) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Registered successfully"
                    });

                    setTimeout(() => {
                        setInputIndex(true);
                        history("/login");
                    }, 2000);
                }else {   
                    setIsLoading(false);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                }
            })
        } catch (error) {
            console.log(error);
        }
        

    }

    useEffect(()=> {
        context.setIsHiddenSidebarAndHeader(true);
    }, [])

    return(
        <>
            <img src={backgroundPattern} className="loginBackgroundPattern" alt="Bacground cover image" />
            <section className="loginSection signupSection">

                <div className="row">
                    <div className="col-md-8 d-flex alig-items-center flex-column justify-content-center signupContent">
                        <h1>Agri-Konnect - Linking Agri-businesses Directly to Farmers</h1>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis neque doloremque labore excepturi accusamus sit iure? Qui corrupti rerum ullam, sapiente, modi alias necessitatibus quibusdam porro distinctio, voluptatum esse itaque!
                        </p>

                        <div className="w-100 mt-4">
                            <Link to={'/'}>
                                <Button className="btn-blue btn-large btn-big"> <IoMdHome />Go To Home</Button>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="loginBox">
                            <div className="logo text-center">
                                <img src={logo} width="150px" alt="site logo" />
                            </div>

                            <div className="wrapper mt-3 card border p-4">
                                <form action="" onSubmit={submitForm}>
                                    <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus'}`}>
                                            <span className="icon"><FaUserCircle /></span>
                                            <input type="text" className="form-control" placeholder="Enter your full name" name="name" onChange={changeInput} onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} />
                                    </div>

                                    <div className={`form-group mb-3 position-relative ${inputIndex === 1 && 'focus'}`}>
                                            <span className="icon"><MdContactPhone /></span>
                                            <input type="text" className="form-control" placeholder="Enter email or phone number" name="contact" onChange={changeInput} onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} />
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
                                    <div className="form-group">
                                        <Button type="submit" className="btn-blue btn-large w-100 btn-big">
                                            { isLoading === true ? <CircularProgress /> : "Sign In"}
                                        </Button>
                                    </div>

                                    <div className="form-group text-center mb-0">
                                        <Link to={'./forget-password'} className="link">FORGET PASSWORD</Link>
                                        
                                        <div className="d-flex align-items-center justify-content-center or mt-3 mb-3    ">
                                            <span className="line"></span>
                                            <span className="text">or</span>
                                            <span className="line"></span>
                                        </div>

                                        <Button variant="outlined" className="w-100 btn-large btn-big loginWithGoogle"> <FaGoogle></FaGoogle> Sign In with Google</Button>
                                    </div>
                                </form>
                            </div>
 
                            <div className="wrapper mt-3 card border footer p-3 d-flex">
                                <span className="text-center">Don't have an acount?
                                    <Link to={'/login'} className="link color ml-3">Sign In</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
               
            </section>
        </>
  
    )
}

export default Signup;