import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams} from "react-router-dom";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Button, CircularProgress } from "@mui/material";
import ImageUpload from "../../components/imageUpload/ImageUpload";

import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";

import MultipleFileUpload from "../../components/fileUploader/fileIploader";

import image from "../../assets/images/quality.png"
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi, uploadImage, deleteImages } from "../../utils/apiCalls";


import { IoMdClose } from "react-icons/io";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MyContext } from "../../App";
// import { uploadImage } from "../../utils/api";
// import { deleteImages } from "../../utils/api";
// import { deleteData, postData } from "../../utils/api";



const EditHomeBannerSlide = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [sliderData, setSliderData] = useState([]);
    const [formFields, setFormFields] = useState({
        imageUrl: "",
        title: "",
        subtitle: "",
        ctaText: "",
        ctaUrl: "",
        alt: ""
    });

    const [previews, setPreviews] = useState([])

    const context = useContext(MyContext);
    const { id } = useParams();
    
    const formData = new FormData();

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        fetchDataFromApi("/api/imageUpload").then((res) => {
            res?.map((item) => {
                item?.images?.map((img) => {
                    deleteImages(`/api/homeSliderBanner/deleteImage?img=${img}`).then((res) => {
                        deleteDataFromApi('/api/imageUpload/deleteAllImages');
                    });
                });
            });
        });

        fetchDataFromApi(`/api/homeSliderBanner/${id}`).then((res) => {
            context.setProgress(20);  
            setSliderData(res?.homeSliderBanner);
            setPreviews([res?.imageUrl]);
            setFormFields({
                imageUrl: res?.imageUrl,
                title: res?.title,
                subtitle: res?.subtitle,
                ctaText: res?.ctaText,
                ctaUrl: res?.ctaUrl,
                alt: res?.alt
            });
            context.setProgress(100);
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
                const file = files[i];

                // ✅ Corrected Condition (Properly Check Image Type)
                if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/webp')) {
                    selectedImages.push(file);
                    formData.append("images", file); // ✅ Append each file to FormData
                } 
                else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "Please select a valid JPG or PNG image file"
                    });
                    return false;
                }
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
        deleteImages(`/api/homeSliderBanner/deleteImage?img=${imgUrl}`).then((res) => {
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

    const editSlide = (e) => {
        e.preventDefault();

        const appendedArray = [...previews, ...uniqueArray];
        console.log(formFields);

        // return

        img_arr = [];

        formFields.imageUrl = appendedArray[0];

        if (formFields.imageUrl ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Please add banner image",
                error: true
            });
            return false
        }

        if (formFields.title ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Please add banner title.",
                error: true
            });
            return false
        }
   
        setIsLoading(true);

        updateDataToApi(`/api/homeSliderBanner/${id}`, formFields).then((res) => {
            setIsLoading(false)

            deleteDataFromApi('/api/imageUpload/deleteAllImages');

            navigate('/homeBannerSlide/list');
        });
    } 
    
   

    return (
        <>
            <div className="rightContent w-100">
                <div className="card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
                    <h5 className="mb-0">Add Home Slide</h5>

                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Home Slide"
                        />

                        <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Add Home Slide"
                        />
                    </Breadcrumbs>
                </div>
                
                <form className="form w-100" onSubmit={editSlide}>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="">
                                <div className="card p-4 mt-0">
                                    <div className="form-group">
                                        <h6>Title</h6>
                                        <input type="text"
                                            name="title" 
                                            value={formFields.title} 
                                            onChange={changeInput}   
                                        />
                                    </div>

                                    <div className="form-group">
                                        <h6>Sub Title</h6>
                                        <input type="text"
                                            name="subtitle" 
                                            value={formFields.subtitle} 
                                            onChange={changeInput}   
                                        />                                    
                                    </div>

                                    <div className="form-group">
                                        <h6>Call to Action Text</h6>
                                        <input type="text"
                                            name="ctaText" 
                                            value={formFields.ctaText} 
                                            onChange={changeInput}   
                                        />                                    
                                    </div>

                                    <div className="form-group">
                                        <h6>Call to Action URL </h6>
                                        <input type="text"
                                            name="ctaUrl" 
                                            value={formFields.ctaUrl} 
                                            onChange={changeInput}   
                                        />                                    
                                    </div>

                                    <div className="form-group">
                                        <h6>Image Alt Text (Optional)</h6>
                                        <input type="text"
                                            name="alt" 
                                            value={formFields.alt} 
                                            onChange={changeInput}   
                                        />  
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
                                
                                    {/* <ImageUpload></ImageUpload> */}
                                </div>

                                
                            </div>
                        </div>
                       
                    </div>
                </form>

               
            </div>

          
        </>
    );
}

export default EditHomeBannerSlide;