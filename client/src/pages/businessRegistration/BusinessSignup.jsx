import React, { useState, useContext, useEffect } from "react";
import "./businessSignup.css";
import logo from "../../assets/images/logo3.png";
import { MyContext } from "../../App";
import { FaEye, FaGoogle, FaLock } from "react-icons/fa";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { Button, CircularProgress } from "@mui/material";
import {postDataToApi} from "../../utils/apiCalls";
import { Link, useNavigate } from "react-router-dom";
import { MdContactPhone } from "react-icons/md";
import Cookies from 'js-cookie'
import { fetchDataFromApi } from "../../utils/apiCalls";
import { MdBusinessCenter } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";


const BusinessSignup = () =>{

    const [inputIndex, setInputIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        businessName: "",
        address: "",
        contact: "",
        businessType: "",
        products: "",
      });

    const context = useContext(MyContext);

    const changeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value

        }));
    }

    const signup = async (e) => {
        e.preventDefault()

        if (formFields.contact === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Enter email or phone number"
            });

            return false;
        }
    
        if (formFields.businessName === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Enter business name."
            });

            return false;
        }
        
        if (formFields.address === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Enter address"
            });

            return false;
        }
        if (formFields.businessType === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Enter business Type."
            });

            return false;
        }
        if (formFields.products === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Enter products."
            });

            return false;
        }

        try {
            const res = await postDataToApi("/api/seller/signup", formFields);

    
            context.setAlertBox({
                open: true,
                error: false,
                msg: res.message
            })

            setTimeout(() => {
                setInputIndex(true);
                setIsLoading(false);
                window.location.href = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5175/dashboard";
            }, 200);
        } catch (error) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Regstration Failed!"
            })
            console.error("Login failed:", error.response?.data?.error || error.message);

        }

    }

    const focusInput = (index) => {
        setInputIndex(index);
    }


    return(
        <>
            {/* <img src={backgroundPattern} className="loginBackgroundPattern" alt="Bacground cover image" /> */}
            <section className="loginSection">
                <div className="loginBox">
                    <div className="headerContainer">
                        <img src={logo} alt="" />
                        <h4>Join Agri-Konnect</h4>
                        <p>Sell your agricultural products with ease!</p>
                    </div>

                    <div className="wrapper mt-3 card border p-4">
                        <form action="" onSubmit={signup}>
                            <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus'}`}>
                                    <span className="icon"><MdBusinessCenter /></span>
                                    <input type="text" className="form-control" placeholder="Enter your business name" name="businessName" onChange={changeInput} onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} />
                            </div>
                            <div className={`form-group mb-3 position-relative ${inputIndex === 1 && 'focus'}`}>
                                    <span className="icon"><MdContactPhone /></span>
                                    <input type="text" className="form-control" placeholder="Enter phone number or email" name="contact" onChange={changeInput} onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} />
                            </div>

                            <div className={`form-group mb-3 position-relative ${inputIndex === 2 && 'focus'}`}>
                                    <span className="icon"><AiOutlineProduct /></span>
                                    <input type="text" className="form-control" placeholder="List product(s) (comma separated)" name="products" onChange={changeInput} onFocus={() => focusInput(2)} onBlur={() => setInputIndex(null)} />
                            </div>

                            <div className={`form-group ${inputIndex === 3 && 'focus'}`}>
                                {/* <label>Business Type</label> */}
                                <select name="businessType"  value={formFields.businessType} onChange={changeInput}>
                                    <option value="">Select Business Type</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Wholesaler">Wholesaler</option>
                                    <option value="Retailer">Retailer</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <textarea
                                    name="address"
                                    value={formFields.address}
                                    onChange={changeInput}
                                    rows="3"
                                    placeholder="Enter your farm or business location"
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <Button type="submit" className="btn-blue btn-large w-100 btn-big">
                                    { isLoading === true ? <CircularProgress /> : "Register Now"}
                                </Button>
                            </div>
                        </form>
                    </div>

                </div>
            </section>
        </>
    )
}

export default BusinessSignup;