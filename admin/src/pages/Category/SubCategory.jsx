import React, { useState, useContext, useEffect } from "react";
import "./category.css";
import { Button, Pagination } from "@mui/material";
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";
import { fetchDataFromApi, deleteDataFromApi } from "../../utils/apiCalls";
import SubCategoryListingTable from "../../components/listingTable/SubCategoryListingTable";



const SubCategory = () =>{
    const [categoryData, setCategoryData] = useState([]);
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);

        context.setProgress(20);
        fetchCategory();
    }, []);  
    
    
    const fetchCategory = () => {
		fetchDataFromApi('/api/category').then((res) => {
			context.setProgress(30)
			setCategoryData(res);
			context.setProgress(100)
		})
	}

    const deleteCategory = (id) => {
        deleteDataFromApi(`/api/category/${id}`).then((res) => {
            context.setProgress(100);
            fetchDataFromApi('/api/category').then((res) => {
                setCategoryData(res);
            });
        });
    }


    return(
        <>
            <div className="rightContent w-100">
                <div className=" categoryHeaderContainer dashboardHeader card shadow border-0 w-100 d-flex justify-content-between flex-row">
                        <h5 className="mb-0">Sub Category List</h5>
                        <div className="d-flex align-items-center">
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
                            label="Products"
                            />

                            <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Category"
                            // deleteIcon={<ExpandMoreIcon />}
                            />
                            </Breadcrumbs>

                            <Link to={'/subCategory/add'}><Button className="addCategory btn btn-g ml-3 pl-3 pr-3">Add Sub Category</Button></Link>

                        </div>
                     

                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <SubCategoryListingTable thData={["UID", "CATEGORY", "IS FEATURED", "SUB CATEGORY"]} tableData={context?.categoryData?.categoryList} searchPlaceholder="Search by category" filterData={[]} filterHeader="Category" onDelete={deleteCategory}></SubCategoryListingTable>
                </div>
            </div>
        </>
    )
}

export default SubCategory;