import React, { useState, useContext, useEffect } from "react";
import "./login.css";
import logo from "../../assets/images/logo.png";
import { MyContext } from "../../App";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { FaEye, FaGoogle, FaLock } from "react-icons/fa";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { Button, CircularProgress } from "@mui/material";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";
import { Link, useNavigate } from "react-router-dom";



import backgroundPattern from "../../assets/images/background-pattern.jpg"

const Login = () =>{
    const { login, setAlertBox } = useContext(MyContext);
    const [inputIndex, setInputIndex] = useState(0);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        contact: '',
        password: '',
    });

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value

        }));
    }
    
    const signIn = async (e) => {
        e.preventDefault();

        if (!formFields.contact || !formFields.password) {
            setAlertBox({ open: true, error: true, msg: "Please enter all fields" });
            return;
        }
  
        setIsLoading(true);

        try {
            const res = await postDataToApi("/api/admin/signin", formFields);
            console.log(res)
            return

            const userData = {
                username: res?.user?.username,
                contact: res?.user?.contact,
                userId: res?.user?.userId
            };

            context.login(userData)

            setTimeout(() => {
                setInputIndex(true);
                setIsLoading(false);
                window.location.href = "/"; // Redirect to login on failure
            }, 200);

        } catch (error) {
            console.error("Login failed:", error.response?.data?.error || error.message);
        }

        setIsLoading(false);

    };

    const focusInput = (index) => {
        setInputIndex(index);
    }

    return(
        <>
            <img src={backgroundPattern} className="loginBackgroundPattern" alt="Bacground cover image" />
            <section className="loginSection">
                <div className="loginBox">
                    <div className="logo text-center">
                        <img src={logo} width="150px" alt="site logo" />
                    </div>

                    <div className="wrapper mt-3 card border p-4">
                        <form action="" onSubmit={signIn}>
                            <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus'}`}>
                                    <span className="icon"><MailOutlinedIcon /></span>
                                    <input type="text" className="form-control" placeholder="Enter your email or phone number" name="contact" onChange={changeInput} onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} />
                            </div>

                           <div className={`form-group mb-4 position-relative ${inputIndex === 1 && 'focus'}`}>
                                <span className="icon"><FaLock /></span>
                                <input type={`${isShowPassword === true ? 'text' : 'password'}`} className="form-control" placeholder="Enter your password" name="password" onChange={changeInput} onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} />

                                <span className="toggleShowPassword" onClick={() => setIsShowPassword(!isShowPassword)}>
                                    {
                                        isShowPassword === true ? <IoMdEyeOff></IoMdEyeOff> : <IoMdEye></IoMdEye>
                                    }
                                </span>
                            </div>

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

                </div>
            </section>
        </>
  
    )
}

export default Login;