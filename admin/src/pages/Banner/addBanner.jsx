import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Button, CircularProgress } from "@mui/material";

import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";

import { fetchDataFromApi, postDataToApi, deleteDataFromApi, uploadImage, deleteImages } from "../../utils/apiCalls";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { IoMdClose } from "react-icons/io";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MyContext } from "../../App";


const AddBanner = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({
        images: [],
        name: "",
        catId: "",
        catName: "",
        subCatId: "",
        subCatName: "",
    });

    const [previews, setPreviews] = useState([]);
    const [bannerValue, setBannerValue] = useState();
    const [subCategoryData, setSubCategoryData] = useState([]);

    const context = useContext(MyContext);

    const formData = new FormData();

    const navigate = useNavigate();

    useEffect(() => {
        const subCatArray = [];

        context.categoryData?.categoryList?.length !== 0 && context.categoryData?.categoryList?.map((cat, index) => {
            if (cat?.children.length !== 0){
                cat?.children?.map((subCat) => {
                    subCatArray.push(subCat);
                })
            }
        })

        setSubCategoryData(subCatArray);

    }, [context.categoryData]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi("/api/imageUpload").then((res) => {
            res?.map((item) => {
                item?.images?.map((img) => {
                    deleteImages(`/api/banner/deleteImage?img=${img}`).then((res) => {
                        deleteDataFromApi('/api/imageUpload/deleteAllImages');
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

    const handleChangeCategory = (event) => {
        setCategoryValue(event.target.value);
    }

    const handleChangeSubCategory = (event) => {
        setSubCategoryValue(event.target.value);
    }

    const selectCategory = (catName, catId) => {
        formFields.catName = catName;
        formFields.catId = catId;
    }

    const selectSubCategory = (subCatName, subCatId) => {
        formFields.subCatName = subCatName;
        formFields.subCatId = subCatId;
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
        deleteImages(`/api/imageUpload/deleteImage?img=${imgUrl}`).then((res) => {
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

    const addBanner = (e) => {
        e.preventDefault();
        const appendedArray = [...previews, ...uniqueArray];

        img_arr = [];

        formFields.slug = formFields.name;
        formFields.images = appendedArray;


        if (formFields.catName !== "" && formFields.subCatName !== "" && formFields.name !== "" && previews.length !== 0){
            setIsLoading(true);

            postDataToApi(`/api/banner/create`, formFields).then((res) => {
                setIsLoading(false)
                context.fetchBanner();

                deleteDataFromApi('/api/imageUpload/deleteAllImages');

                navigate('/banner/list')
            });
        } 
        else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please provide all details."
            });
            return false;
        }
    }


    return (
        <>
            <div className="rightContent w-100">
                <div className="card dashboardHeader dashboardHeadershadow border-0 w-100 d-flex justify-content-between flex-row ">
                    <h5 className="mb-0">Add Banner</h5>

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
                        label="Banner"
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Add Banner"
                        />
                    </Breadcrumbs>
                </div>
                
                <form className="form w-100" onSubmit={addBanner}>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="">
                                <div className="card p-4 mt-0">

                                    {/* <div className="form-group">
                                        <h6>Category Name</h6>
                                        <input type="text" name="name" onChange={changeInput}   />
                                    </div> */}

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <h6>Category</h6>
                                                <Select
                                                    value={bannerValue}
                                                    onChange={handleChangeCategory}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    className="w-100"
                                                    >
                                                    <MenuItem value="">
                                                        <em value={null}>None</em>
                                                    </MenuItem>

                                                    {
                                                        context?.categoryData?.categoryList?.length !== 0 &&
                                                        context?.categoryData?.categoryList?.map((category, index) => {
                                                            return (
                                                                <MenuItem 
                                                                    key={index}
                                                                    value={category._id}
                                                                    className="text-capitalize"
                                                                    onClick={() => selectCategory(category.name, category._id)}
                                                                >
                                                                    {category.name}
                                                                </MenuItem>
                                                            )
                                                        })
                                                                                                
                                                    }
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <h6>Sub Category</h6>
                                                <Select
                                                    value={bannerValue}
                                                    onChange={handleChangeSubCategory}
                                                    displayEmpty
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    className="w-100"
                                                    >
                                                    <MenuItem value="">
                                                        <em value={null}>None</em>
                                                    </MenuItem>

                                                    {
                                                        subCategoryData?.length !== 0 &&
                                                        subCategoryData?.map((subCat, index) => {
                                                            return (
                                                                <MenuItem 
                                                                    value={subCat.name}
                                                                    className="text-capitalize"
                                                                    key={index}
                                                                    onClick={() => {selectSubCategory(subCat.name, subCat._id)}}
                                                                >
                                                                    {subCat.name}
                                                                </MenuItem>
                                                            )
                                                        })
                                                                                                
                                                    }
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <h6>Banner Name</h6>
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={formFields.name}
                                                onChange={changeInput} 
                                            />
                                            
                                        </div>
                                    </div>

                                

                                    <div className="imgUploadBox d-flex align-items-center">
                                        {
                                            previews?.length !== 0 && previews?.map((img, index) => {
                                                return (
                                                    <div className="uploadBox" key={index}>
                                                        <span className="remove" onClick={() => removeImage(index, img)}>
                                                            <IoMdClose />
                                                        </span>
                                                        <div className="box">
                                                            <LazyLoadImage
                                                                alt={"image"}
                                                                efect="blur"
                                                                className="w-100"
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
                                                        onChange={(e) => onChangeFile(e, '/api/imageUpload/upload')}
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

export default AddBanner;