import React, { useState, useContext, useEffect } from "react";
import "./admin.css";
import { MdOutlineRestore } from "react-icons/md";
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { fetchDataFromApi, postDataToApi, updateDataToApi } from "../../utils/apiCalls";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";


const DeletedUsers = () =>{
    const [role, setRole] = useState("");
    const [allUsers, setAllUsers] = useState([]);

    const context = useContext(MyContext);
    const navigate = useNavigate();
    

    useEffect(() => {
        context.setIsHiddenSidebarAndHeader(false)
    });   


    useEffect(() => {
        window.scrollTo(0,0);

        context.setProgress(40);

        fetchDataFromApi('/api/admin/users/deleted').then((res) => {
            const filteredUsers = res.deletedUsers.filter(user => user._id !== context?.userData?.userId);
            setAllUsers(filteredUsers);
            context.setProgress(100)
        });

    }, []);


    const deleteRole = (updateUserId, roleToRemove) => {
        updateDataToApi(`/api/admin/removeRole/${context?.userData?.userId}/${updateUserId}}`, [roleToRemove]).then((res) => {
         
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

    const restoreUser = (userId) => {
        context.setProgress(40)

        postDataToApi(`/api/auth/user/restore/${userId}`).then((res) => {
            context.setProgress(100)

            setTimeout(() => {
                navigate("/admin/list");
            }, 1000);
        });
    }

    return(
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                        <h5 className="mb-0">Deleted Users</h5>

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
                            label="Deleted Users"
                            />
                        </Breadcrumbs>
                </div>

                <div className="card shadow border-0 p-3 mt-4">

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
                                                                            <IoMdCloseCircle className="deleteIcon cursor" color="error" onClick={() => deleteRole(user?._id)}/>

                                                                        </div>
                                                                    </div>
                                                                )
                                                            }) 
                                                        }
                                                    </td>

                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                                                                  
                                                        <Button className="success restore" color="success" bg="success" onClick={() => restoreUser(user._id)}>
                                                        <MdOutlineRestore></MdOutlineRestore>
                                                        </Button> 
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

export default DeletedUsers;