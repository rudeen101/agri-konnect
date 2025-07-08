import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Button, CircularProgress } from "@mui/material";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { fetchDataFromApi, postDataToApi } from "../../utils/apiCalls";


const AddAdmin = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const [catData, setCatData] = useState([]);
    const [role, setRole] = useState("");

    const [formFields, setFormFields] = useState({
        name: "",
        contact: "",
        password: "",
        confirmPassword:"",
        role: "",
    });


    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi("/api/category").then((res) => {
            context.setProgress(20);
            setCatData(res);
            context.setProgress(100);
        });

    }, []);

    const changeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        })
    }


    const addAdmin = (e) => {
        e.preventDefault();

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

            if (formFields.role === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Select Role"
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
            postDataToApi("/api/admin/create", formFields).then((res) => {
                if (!res.error) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Registered successfully"
                    });

                }else {   
                    setIsLoading(false);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "Failed creating account. Try again!"
                    });
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeRole = (event) => {
        setRole(event.target.value);

    }

    const selectRole = (role) => {
        formFields.role = role
    }

    return (
        <>
            <div className="rightContent w-100">
                <div className="card dashboardHeader shadow border-0 w-100 d-flex justify-content-between flex-row">
                    <h5 className="mb-0">Add Admin User</h5>

                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Home"
                        icon={<HomeIcon fontSize="small" />}
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Admin"
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Add Admin"
                        />
                    </Breadcrumbs>
                </div>
                
                <form className="form w-100" onSubmit={addAdmin}>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="">
                                <div className="card p-4 mt-0">

                                    
                                <div className="form-group">
                                        <h6>Fullname</h6>
                                        <input type="text" placeholder="Enter fullname" name="name" onChange={changeInput}   />
                                    </div>

                                    
                                    <div className="form-group">
                                        <h6>Email or Phone Number</h6>
                                        <input type="text" placeholder="Enter email or phone number" name="contact" onChange={changeInput}   />
                                    </div>

                                    
                                    <div className="form-group">
                                        <h6>Password</h6>
                                        <input type="password" placeholder="Enter password" name="password" onChange={changeInput}   />
                                    </div>

                                    <div className="form-group">
                                        <h6>Comfirm Password</h6>
                                        <input type="password" placeholder="Enter password again" name="confirmPassword" onChange={changeInput}   />
                                    </div>

                                    <div className="row">

                                    </div>

                                    <div className="form-group">
                                        <h6>Role</h6>
                                        <Select
                                            value={role}
                                            onChange={handleChangeRole}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className="w-50"
                                            >
                                            <MenuItem value="">
                                                <em value={null}>None</em>
                                            </MenuItem>
                                            <MenuItem 
                                                value={"superAdmin"}
                                                className="text-capitalize"
                                                onClick={() => selectRole("superAdmin")}
                                            >
                                                superAdmin
                                            </MenuItem>
                                            <MenuItem 
                                                value={"admin"}
                                                className="text-capitalize"
                                                onClick={() => selectRole("admin")}
                                            >
                                                admin
                                            </MenuItem>
                                            <MenuItem 
                                                value={"agent"}
                                                className="text-capitalize"
                                                onClick={() => selectRole("agent")}
                                            >
                                                agent
                                            </MenuItem>
                                            <MenuItem 
                                                value={"buyerAgent"}
                                                className="text-capitalize"
                                                onClick={() => selectRole("buyerAgent")}
                                            >
                                                buyerAgent
                                            </MenuItem>
                                            <MenuItem 
                                                value={"sellerAgent"}
                                                className="text-capitalize"
                                                onClick={() => selectRole("sellerAgent")}
                                            >
                                                sellerAgent
                                            </MenuItem>
                                        </Select>
                                    </div>


                                    <Button type="submit" className="btn-blue btn-large w-100 btn-big   "> <FaCloudUploadAlt /> &nbsp; {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : "PUBLISH AND VIEW"} </Button>
                                </div>

                                
                            </div>
                        </div>
                       
                    </div>
                </form>            
            </div>
        </>
    );
}

export default AddAdmin;