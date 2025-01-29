import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./tag.css";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Button, CircularProgress } from "@mui/material";


import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";

import MultipleFileUpload from "../../components/fileUploader/fileIploader";

import image from "../../assets/images/quality.png"
import { fetchDataFromApi } from "../../utils/api";


import { IoMdClose } from "react-icons/io";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MyContext } from "../../App";
import { deleteImages, uploadImage, deleteData, postData } from "../../utils/api";




const AddTag = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categoryValue, setCategoryValue] = useState('');
    const [catData, setCatData] = useState([]);

    const [formFields, setFormFields] = useState({
        name: "",
        description: "",
        catId: ""
    });


    const context = useContext(MyContext);
    const history = useNavigate();

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


    const addTag = (e) => {
        e.preventDefault();
        const formatedTag = formatTag(formFields.name);

        formFields.name = formatedTag;
        formFields.catId = formFields.catId;
        formFields.description = formFields.description;

        if (formFields.name !== "" && formFields.catId){
            setIsLoading(true);

            postData(`/api/tag/add`, formFields).then((res) => {
                setIsLoading(false)
                context.fetchTag();

                history('/tag/list')
            });
        } 
        else {

            context.setAlertBox({
                open: true,
                error: true,
                msg: "Make sure all information is provided"
            })
        }
    }

    function formatTag(tag) {
        if (!tag) return '';
    
        // Remove any non-alphanumeric characters (except spaces) and trim extra spaces
        const cleanedTag = tag.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    
        // Convert to PascalCase and prepend with '#'
        const formattedTag = '#' + cleanedTag
            .split(/\s+/) // Split by whitespace
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
            .join('');
    
        return formattedTag;
    }

    const handleChangeCategory = (event) => {
        setCategoryValue(event.target.value);
        setFormFields(() => ({
            ...formFields,
            name: event.target.value
        }));
    }

    const selectCategory = (categoryId) => {
        formFields.catId = categoryId
    }

    


    return (
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                    <h5 className="mb-0">Add Tag</h5>

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
                        label="Tag"
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Add Tag"
                        />
                    </Breadcrumbs>
                </div>
                
                <form className="form w-100" onSubmit={addTag}>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="">
                                <div className="card p-4 mt-0">

                                    <div className="form-group">
                                        <h6>Category</h6>
                                        <Select
                                            value={categoryValue}
                                            onChange={handleChangeCategory}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className="w-100"
                                            >
                                            <MenuItem value="">
                                                <em value={null}>None</em>
                                            </MenuItem>

                                            {
                                                catData?.categoryList?.length !== 0 &&
                                                catData?.categoryList?.map((category, index) => {
                                                    return (
                                                        <MenuItem 
                                                            key={index}
                                                            value={category._id}
                                                            className="text-capitalize"
                                                            onClick={() => selectCategory(category._id)}
                                                        >
                                                            {category.name}
                                                        </MenuItem>
                                                    )
                                                })
                                                                                           
                                            }
                                        </Select>
                                    </div>

                                    <div className="form-group">
                                        <h6>Tag Name</h6>
                                        <input type="text" name="name" onChange={changeInput}   />
                                    </div>

                                    
                                <div className="form-group">
                                    <h6>Tag Desciption (Optional)</h6>
                                    <textarea 
                                        rows={10} 
                                        cols={10} 
                                        name="description"
                                        value={formFields.description}
                                        onChange={changeInput} 
                                    />
                                </div>
    
                                    <Button type="submit" className="btn-blue btn-large w-100 btn-big mt-4"> <FaCloudUploadAlt /> &nbsp; {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : "PUBLISH AND VIEW"} </Button>
                                </div>

                                
                            </div>
                        </div>
                       
                    </div>
                </form>            
            </div>
        </>
    );
}

export default AddTag;