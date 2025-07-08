import React, { useState, useContext, useEffect } from "react";
import "./admin.css";

import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';

import { fetchDataFromApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";
import UserListingTable from "../../components/listingTable/UserListingTable";

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
                <div className="card  dashboardHeader shadow border-0 w-100 d-flex justify-content-between flex-row">
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
         
                    <div className="table-responsive homeSliderBanner">
                        <UserListingTable thData={["UID", "NAME", "CONTACT", "ROLE", "ACTION"]} tableData={allUsers} searchPlaceholder="Search by name"  onDeleteUser={deleteUser} onDeleteUserRole={deleteRole}></UserListingTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminList;