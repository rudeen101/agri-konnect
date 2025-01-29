import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./category.css";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Button, CircularProgress } from "@mui/material";

import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";

import MultipleFileUpload from "../../components/fileUploader/fileIploader";

import image from "../../assets/images/quality.png"
import { fetchDataFromApi } from "../../utils/api";


import { IoMdClose } from "react-icons/io";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MyContext } from "../../App";
import {  } from "../../utils/api";
import { deleteImages, uploadImage, deleteData, postData } from "../../utils/api";



const AddCategory = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: "",
        images: [],
        color: "",
        slug: "",
        parentId: ""
    });

    const [previews, setPreviews] = useState([])

    const context = useContext(MyContext);

    const formData = new FormData();

    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi("/api/imageUpload").then((res) => {
            res?.map((item) => {
                item?.images?.map((img) => {
                    deleteImages(`/api/category/deleteImage?img=${img}`).then((res) => {
                        deleteData('/api/imageUpload/deleteAllImages');
                    });
                });
            });
        });
    }, []);

    const changeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        })
    }

    let img_arr = [];
    let uniqueArray = [];
    let selectedImages = [];
    
    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;

            setUploading(true);


            for (let i = 0; i < files.length; i++) {

                if (files[i] && files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png' || files[i].type === 'image/webp'){
                    const file = files[i];
                    selectedImages.push(file);
                    formData.append(`images`, file);
                }
                else{
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Please select a valid JPG or PNG image file'
                    });

                    return false;
                }

                formFields.images = selectedImages;
                
            }
        } catch (error) {
            console.log(error)
        }
     

        uploadImage(apiEndPoint, formData).then((res) => {
            fetchDataFromApi('/api/imageUpload').then((response) =>  {
                if (response !== undefined && response !== null && response !== response.length !== 0){
                    response.length !== 0 && response?.map((item) => {
                        item?.images.length !== 0 && item?.images?.map((img) => {
                            img_arr.push(img);
                        });
                    });
        
                    uniqueArray = img_arr.filter((item, index) => img_arr.indexOf(item) === index);
        
                    const appendedArray = [...uniqueArray]; 
                    
                    setPreviews(appendedArray);
                    setTimeout(() => {
                        setUploading(false);
                        img_arr = [];
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: 'Image Upoaded!'
                        });

                    }, 200);
                }
            })
          
    
        })
    }



    const removeImage = async (index, imgUrl) => {
        const imgIndex = previews.indexOf(imgUrl);
        deleteImages(`/api/category/deleteImage?img=${imgUrl}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Image Deleted!'
            });
        });

        if (imgIndex > -1) {
            previews.splice(index, 1);
        }
    }

    const addCategory = (e) => {
        e.preventDefault();
        const appendedArray = [...previews, ...uniqueArray];

        img_arr = [];

        formFields.slug = formFields.name;
        formFields.images = appendedArray;

        if (formFields.name !== "" && formFields.color !== "" && previews.length !== 0){
            setIsLoading(true);
            console.log("testing..",formFields);

            postData(`/api/category/create`, formFields).then((res) => {
                setIsLoading(false)
                context.fetchCategory();

                deleteData('/api/imageUpload/deleteAllImages');

                history('/category')
            });
        } 
        else {

        }
    }



    return (
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                    <h5 className="mb-0">Add Category</h5>

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
                        label="Category"
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Add Category"
                        />
                    </Breadcrumbs>
                </div>
                
                <form className="form w-100" onSubmit={addCategory}>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="">
                                <div className="card p-4 mt-0">

                                    <div className="form-group">
                                        <h6>Category Name</h6>
                                        <input type="text" name="name" onChange={changeInput}   />
                                    </div>

                                    <div className="form-group">
                                        <h6>Color</h6>
                                        <input type="text" name="color" onChange={changeInput} />
                                    </div>

                                    <div className="imgUploadBox d-flex align-items-center">
                                        {
                                            previews?.length !== 0 && previews?.map((img, index) => {
                                                return (
                                                    <div className="uploadBox" key={index}>
                                                        <span className="remove" onClick={() => removeImage(index, img)}>
                                                            <IoMdClose className="icon"/>
                                                        </span>
                                                        <div className="box">
                                                            <LazyLoadImage
                                                                alt={"image"}
                                                                efect="blur"
                                                                className="w-100 img"
                                                                src={img}
                                                            />
                                                        </div>
                                                
                                                    </div>
                                                )
                                            })
                                        }
                              

                                        <div className="uploadBox">

                                            {
                                                uploading === true ?
                                                <div className="pregressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                    <CircularProgress />
                                                    <span>Uploading...</span>
                                                </div>
                                                :
                                                <>
                                               
                                                    <label for="fileInput">
                                                        <div className="info">
                                                            <FaRegImages className="icon" />
                                                            <h6 className="mt-3">Upload Image</h6>
                                                        </div>
                                                    </label>

                                                    <input 
                                                        type="file"
                                                        multiple  
                                                        onChange={(e) => onChangeFile(e, '/api/category/upload')}
                                                        name="images"
                                                        id="fileInput"
                                                    />

                                                </>
                                            }
                                         
                                      
                                        </div>
                                    </div>

                                    {/* <MultipleFileUpload></MultipleFileUpload> */}
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

export default AddCategory;