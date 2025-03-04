import React, { useState, useContext, useEffect } from "react";
import "./admin.css";

import { Button, Pagination, Rating } from "@mui/material";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";
import { IoMdCloseCircle } from "react-icons/io";


const AdminList = () =>{
    const [role, setRole] = useState("");
    const [allUsers, setAllUsers] = useState([]);

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHiddenSidebarAndHeader(false)
    });   


    useEffect(() => {
        window.scrollTo(0,0);

        context.setProgress(40);

        fetchDataFromApi('/api/admin/users').then((res) => {
            const filteredUsers = res.allUsers.filter(user => user._id !== context?.userData?.userId);
            setAllUsers(filteredUsers);
            context.setProgress(100)
        });


    }, []);


    const deleteRole = (userId, roleToRemove) => {
        console.log(roleToRemove);
        // updateDataToApi(`/api/admin/removeRole/${context?.userData?.userId}/${updateUserId}}`, [roleToRemove]).then((res) => {
        updateDataToApi(`/api/admin/removeRole/${userId}`, {roleToRemove}).then((res) => {
         
            fetchDataFromApi('/api/admin/users').then((res) => {
                const filteredUsers = res.allUsers.filter(user => user._id !== context.userData.userId);
                setAllUsers(filteredUsers);
                context.setProgress(100)
            });
        });
    }


    const handleChangeRole = (event) => {
        setRole(event.target.value);

    }

    const selectRole = (role) => {
        formFields.role = role
    }

    const deleteUser = (userId) => {
        context.setProgress(40)

        deleteDataFromApi(`/api/auth/user/delete/${userId}`).then((res) => {
            console.log("deleteData", res);

            fetchDataFromApi('/api/admin/users').then((res) => {
                const filteredUsers = res.allUsers.filter(user => user._id !== context.userData.userId);
                setAllUsers(filteredUsers);
                context.setProgress(100)
            });
            context.setProgress(100)
        });
    }

    return(
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                        <h5 className="mb-0">All Users</h5>

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
                            label="All Users"
                            />
                        </Breadcrumbs>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    {/* <h3 className="hd">Product List</h3> */}

                    <div className="row cardFilters mt-3">
                        <div className="col-md-6">
                            <h6 className="">SHOW BY</h6>
                            <FormControl size="small" className="w-100">
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
                            </FormControl>
                        </div>
                    
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>UID</th>
                                    <th style={{width: "200px"}}>Name</th>
                                    <th>Contact</th>
                                    <th>Role</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    allUsers?.length !== 0 && 
                                    allUsers?.map((user, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{user._id}</td>
                                               
                                                <td>{user?.name}</td>
                                                
                                                <td>{user?.contact}</td>
                                                
                                                <td className="d-flex flex-gap-20">
                                                        {
                                                            user?.length !== 0 && user?.roles?.map((role, index) => {
                                                                return(
                                                                    <div className="subCatContainer">
                                                                        <div className="subCategory card role" key={index}>
                                                                            <span>{role}</span>
                                                                            <IoMdCloseCircle className="deleteIcon cursor" color="error" onClick={() => deleteRole(user?._id, role)}/>

                                                                        </div>
                                                                    </div>
                                                                )
                                                            }) 
                                                        }
                                                    </td>

                                                <td style={{"width": "300px"}}>
                                                    <div className="actions d-flex align-items-center">
                                                        {/* <Link to={`/product/details/${product._id}`}>
                                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                                        </Link>          */}


                                                        {/* <Link to={`/admin/edit/${user?._id}`}>
                                                            <Button className="success" color="sucess"><FaPencilAlt /></Button>
                                                        </Link> */}
                                                        
                                                        <Button className="error" color="error" onClick={() => deleteUser(user._id)}><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )

                                    })
                                }
                           
                            
                            </tbody>
                        </table>

                        <div className="d-flex tableFooter">
                            <p>showing <b>12 </b> of  <b>60 </b>results</p>
                            <Pagination count={10} color="primary" className="pagination" showFirstButton showLastButton />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminList;