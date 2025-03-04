import React, { useState, useContext, useEffect } from "react";
import "./category.css";
import { Button, Pagination } from "@mui/material";
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IoMdCloseCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";



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
                <div className=" categoryHeaderContainer card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
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

                            <Link to={'/subCategory/add'}><Button className="addCategoryBtn btn-blue ml-3 pl-3 pr-3">Add Sub Category</Button></Link>

                        </div>
                     

                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Sub Category List</h3>
                    
                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{width: '100px'}}>IMAGE</th>
                                    <th>CATEGORY</th>
                                    <th>ISFEATURED</th>
                                    <th>SUB CATEGORY</th>
                                </tr>
                            </thead>
                               
                            <tbody>
                                {
                                    categoryData?.categoryList?.length !== 0 && categoryData?.categoryList?.map((category, index) => {
                                        
                                        if (category?.children?.length !== 0) {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-flex align-items-center" style={{width: '50px', flex: '0 0 50px'}}>
                                                            <div className="img card shadow m-0">
                                                                <LazyLoadImage
                                                                    alt={"image"}
                                                                    effect="blur"
                                                                    className="w-100"
                                                                    src={category?.images[0]}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {category?.name}
                                                    </td>
                                                    <td>
                                                    {category?.isFeatured?.toString()}
                                                </td>
                                                    <td className="d-flex flex-gap-20">
                                                        {
                                                            category?.children?.length !== 0 && category?.children?.map((subCate, index) => {
                                                                return(
                                                                    <div className="subCatContainer">
                                                                        <div className="subCategory card" key={index}>
                                                                            <LazyLoadImage
                                                                                alt={"image"}
                                                                                effect="blur"
                                                                                className="img"
                                                                                src={subCate?.images[0]}
                                                                            />
                                                                            <span>{subCate.name}</span>
                                                                            <IoMdCloseCircle className="deleteIcon cursor" color="error" onClick={() => deleteCategory(subCate._id)}/>

                                                                        </div>
                                                                    </div>
                                                                )
                                                            }) 
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubCategory;