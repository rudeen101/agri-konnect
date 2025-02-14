import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Button, CircularProgress } from "@mui/material";


import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";

import MultipleFileUpload from "../../components/fileUploader/fileIploader";

import image from "../../assets/images/quality.png"

import { IoMdClose } from "react-icons/io";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MyContext } from "../../App";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";


const AddAdmin = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categoryValue, setCategoryValue] = useState('');
    const [catData, setCatData] = useState([]);
    const [role, setRole] = useState("");
    const [user, setUser] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const [formFields, setFormFields] = useState({
        role: [],
    });

    const context = useContext(MyContext);
    const navigate = useNavigate();

    // useEffect(() => {


    //     fetchDataFromApi('/api/admin/users').then((res) => {
    //         const filteredUsers = res.allUsers.filter(user => user._id !== context?.userData?.userId);
    //         setAllUsers(filteredUsers);
    //     });

    // }, []);

    // Fetch Users (GET)
    useEffect(() => {
        window.scrollTo(0,0);
        context.setProgress(40);

        fetchDataFromApi("/api/admin/users")
            .then((res) => {
                if (res.allUsers) {
                    console.log("users", res.allUsers)
                    const filteredUsers = res.allUsers.filter(user => user._id !== context?.userData?.userId);
                    setAllUsers(filteredUsers);
                }
                context.setProgress(100);
            })
            .catch((err) => console.error("Fetch Error:", err));
    }, []);


    const addAdmin = (e) => {
        e.preventDefault();

        try {
            if (selectedUser === "") {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Select a user!"
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

            setIsLoading(true);
            updateDataToApi(`/api/admin/updateRole/${selectedUser}`, formFields).then((res) => {
                if (!res.error) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Role updated successfully"
                    });

                    setTimeout(() => {
                        navigate("/admin/list");
                    }, 2000);
                }else {   
                    setIsLoading(false);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "Failed updating admin role. Try again!"
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

    const handleChangeUser = (event) => {
        setUser(event.target.value);
    }

    const selectRole = (role) => {
        formFields.role = [role];
    }

    const selectUser = (userId) => {
        setSelectedUser(userId);
    }

    return (
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
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
                                        <h6>All Users</h6>
                                        <Select
                                            value={user}
                                            onChange={handleChangeUser}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className="w-100"
                                            >

                                            <MenuItem value="">
                                                <em value={null}>Select User</em>
                                            </MenuItem>

                                            {
                                                allUsers?.length !== 0 && allUsers?.map((user, index) => {
                                                    return (
                                                        <MenuItem 
                                                            value={user?.name}
                                                            className="text-capitalize"
                                                            onClick={() => selectUser(user?._id)}
                                                            key={index}
                                                        >
                                                            {user?.name}
                                                        </MenuItem>
                                                    )
                                                })

                                            }

                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <h6>User Roles</h6>
                                        <Select
                                            value={role}
                                            onChange={handleChangeRole}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className="w-50"
                                            >
                                            <MenuItem value="">
                                                <em value={null}>Choose Role</em>
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