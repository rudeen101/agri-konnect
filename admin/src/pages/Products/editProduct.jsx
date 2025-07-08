import React, { useState, useContext, useEffect } from "react";
import "./products.css";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';

import { MyContext } from "../../App";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, Rating, CircularProgress } from "@mui/material/";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import MultiSelectTags from "../../components/multiSelect/MultiSelect";

import MultipleFileUpload from "../../components/fileUploader/fileIploader";

import image from "../../assets/images/quality.png"

import Avatar from "../../assets/images/rudeen.jpg";
import UserAvatarImg from "../../components/userAvatarImg/userAvatarImg";
import { FaReply } from "react-icons/fa";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi, uploadImage, deleteImages } from "../../utils/apiCalls";
import { IoMdClose } from "react-icons/io";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams, useNavigate } from "react-router-dom";


const EditProduct = () =>{
    const [categoryVal, setCategoryVal] = useState('');
    const [subCategoryVal, setSubCategoryVal] = useState('');
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [currentProduct, setCurrentProduct] = useState([]);
    

    const [tagName, setTagName] = useState([]);
    const [tagData, setTagData] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
  
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const formData = new FormData();


    const context = useContext(MyContext);
    const {id} = useParams();
    const history = useNavigate();
    

    let img_arr = [];
    let uniqueArray = [];
    let selectedImages = [];

    const [formFields, setFormFields] = useState({
        name: currentProduct?.name,
        subCat: "",
        description: "",
        brand: "",
        price: null,
        oldPrice: null,
        countInStock: 0,
        subCatId: "",
        catName: "",
        catId: "",
        category: "",
        discount: null,
        packagingType: [],
        location: "",
        tags: [],
        minOrder: 0,
        estimatedDeliveryDate: ""
    });

    useEffect(() => {
        window.scrollTo(0,0);
        fetchDataFromApi(`/api/product/details/${id}`).then((res) =>{
            setPreviews(res.images);

            formFields.name = res.name
            formFields.subCat = res.subCat
            formFields.description = res.description
            formFields.brand = res.brand
            formFields.price = res.price
            formFields.oldPrice = res.oldPrice
            formFields.countInStock = res.countInStock
            formFields.subCatId = res.subCatId
            formFields.catName = res.catName
            formFields.catId = res.catId
            formFields.category = res.category
            formFields.rating = res.rating
            formFields.isFeatured = res.isFeatured
            formFields.discount = res.discount
            // formFields.size: [],
            formFields.productWeight = res.productWeight
            formFields.packagingType = res.packagingType
            formFields.location = res.location
            formFields.tags = res.tags

            setPreviews(res?.images);

            // setCurrentProduct(res);

        // fetchDataFromApi(`/api/product?subCatId=${res?.subCatId}`).then((res) =>{
        //     const filteredData = res?.products.filter(item => item.id !==  id);
        //     setSelectedProductData(filteredData);
        // });   
    });

        // getAllReviews(id);
        // checkWishList(id)

    }, [id]);

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
        window.scrollTo(0,0);

        // setSubCategoryData(context.categoryData);

        fetchDataFromApi('/api/imageUpload').then((res) => {
            res?.map((item) => {
                item?.images?.map((img) => {
                    deleteImages(`/api/imageUpload/deleteImage?img=${img}`).then((res => {
                        deleteData('/api/imageUpload/deleteAllImages');
                    }));
                })
            })
        });

        // fetchDataFromApi('/api/productWeight').then((res) => {
        //     console.log("res", res)
        //     setProductWeight(res)
        // });

        // fetchDataFromApi('/api/productSize').then((res) => {
        //     setProductSize(res)
        // });
   
    }, []);


    const selectCategory  = (catName, catId) => {
        formFields.catName = catName;
        formFields.category = catId;
        formFields.catId = catId;

        setTagName([])

        fetchDataFromApi(`/api/tag/category/${catId}`).then((res) => {
            context.setProgress(30)
            setTagData(res.tags);
            context.setProgress(100)
        });
    }

    const selectSubCategory = (subCatName, subCatId)=> {
        setFormFields(() => ({
            ...formFields,
            subCat: subCatName,
            subCatId: subCatId
        }));
    }

    const handleChangeCategory  = (event) => {
        setCategoryVal(event.target.value);
    }

    const handleChangeSubCategory  = (event) => {
        setSubCategoryVal(event.target.value);
    }

    const handleChangeProductWeight  = (event) => {
        (event.target.value);

        const {
            target: {value}
        } = event;

        setProductWeight(
            typeof value === 'string' ? value.split(',') : value
        );

        formFields.productWeight = value
    }

    const handleChangeProductSize  = (event) => {
        (event.target.value);

        const {
            target: {value}
        } = event;

        setProductSize(
            typeof value === 'string' ? value.split(',') : value
        );

        formFields.productSize = value
    }

    const handleChangeIsFeatured  = (event) => {
        setIsFeaturedVal(event.target.value);

        setFormFields(() => ({
            ...formFields,
            isFeatured: event.target.value
        }))
    }

    const handleChangeTag = (event) => {
        const {
          target: { value },
        } = event;
        setTagName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const inputChange = (e)=> {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }));
    }
   
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


    const editProduct = (e) => {
        e.preventDefault();
        const appendedArray = [...previews, ...uniqueArray];

        img_arr = [];

        formFields.slug = formFields.name;
        formFields.description = formFields.description;
        formFields.images = appendedArray;
   
        if (formFields.name ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Please add produdct name",
                error: true
            });
            setIsLoading(false);
            return false
        }

        if (formFields.description ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Please add produdct description",
                error: true
            });
            return false
        }

        if (formFields.location ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Please add produdct location",
                error: true
            });
            return false
        }

        if (formFields.category === "") {
            context.setAlertBox({
                open: true,
                msg: "Please select produdct category",
                error: true
            });
            return false
        }

        if (formFields.price ===  null) {
            context.setAlertBox({
                open: true,
                msg: "Please add produdct price",
                error: true
            });
            return false
        }

        if (formFields.oldPrice ===  null) {
            context.setAlertBox({
                open: true,
                msg: "Please add produdct oldPrice",
                error: true
            });
            return false
        }

        if (formFields.isFeatured === null) {
            context.setAlertBox({
                open: true,
                msg: "Please select is product featued or not",
                error: true
            });
            return false
        }

        if (formFields.countInStock === null) {
            context.setAlertBox({
                open: true,
                msg: "Please add produdct number in stock",
                error: true
            });
            return false
        }

        if (formFields.brand ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Please add product brand",
                error: true
            });
            return false
        }

        if (formFields.discount === null) {
            context.setAlertBox({
                open: true,
                msg: "Please select the product discount",
                error: true
            });
            return false
        }

        if (formFields.productWeight ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Please add produdct weight/size",
                error: true
            });
            return false
        }

        if (formFields.packagingType ===  "") {
            context.setAlertBox({
                open: true,
                msg: "Please add produdct weight/size",
                error: true
            });
            return false
        }

        if (formFields.rating === 0) {
            context.setAlertBox({
                open: true,
                msg: "Please select produdct rating",
                error: true
            });
            return false
        }
        
        if (previews.length === 0) {
            context.setAlertBox({
                open: true,
                msg: "Please add produdct image(s)",
                error: true
            });
            return false
        }


        setIsLoading(true);

        updateDataToApi(`/api/product/${id}`, formFields).then((res) => {
            context.setAlertBox({
                open: true,
                msg: "Product updated successfully!",
                error: false
            });
            setIsLoading(false)

            // context.fetchCategory();

            deleteData('/api/imageUpload/deleteAllImages');

            history('/product/listing')
        }).catch((error)=>{
            console.log("-------",error)
        });
    }


    const handleTagsSelected = (selectedTagIds, selectedTags) => {
        formFields.tags = selectedTagIds;
        setSelectedTags(selectedTags);
    };


    return (
        <>
            <div className="rightContent w-100">
                <div className="card dashboardHeader shadow border-0 w-100 d-flex justify-content-between flex-row">
                    <h5 className="mb-0">Edit View</h5>

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
                        label="Edit Product"
                        />
                    </Breadcrumbs>
                </div>
                
                <form className="form w-100" onSubmit={editProduct}>
                    <div className="row">
                        <div className="">
                            <div className="card p-4">
                                <h5>Basic Information</h5>

                                <div className="form-group">
                                    <h6>PRODUCT NAME</h6>
                                    <input 
                                        type="text"
                                        name="name"
                                        value={formFields.name}
                                        onChange={inputChange}  
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>Desciption</h6>
                                    <textarea 
                                        rows={10} 
                                        cols={10} 
                                        name="description"
                                        value={formFields.description}
                                        onChange={inputChange} 
                                    />
                                </div>

                                <div className="form-group">
                                    <h6>LOCATION</h6>
                                    <textarea 
                                        rows={5} 
                                        cols={5} 
                                        name="location"
                                        value={formFields.location}
                                        onChange={inputChange} 
                                    />
                                </div>
   

                                                

                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>CATEGORY</h6>
                                            <Select
                                                 value={formFields.catName}
                                                onChange={handleChangeCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className="w-100"
                                                >
                                                {
                                                    context.categoryData?.categoryList?.length !== 0 &&
                                                    context.categoryData?.categoryList?.map((cat, index) => {
                                                        return (
                                                            <MenuItem 
                                                                value={formFields.catName}
                                                                className="text-capitalize"
                                                                key={index}
                                                                onClick={() => {selectCategory(cat.name, cat._id)}}
                                                            >
                                                                {cat.name}
                                                            </MenuItem>

                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>SUB CATEGORY</h6>
                                            <Select
                                                value={formFields.subCat}
                                                onChange={handleChangeSubCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className="w-100"
                                                >
                                                                                              
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
                                    <div className="col">
                                        <div className="col">
                                            <div className="form-group">
                                                <h6>SELECT TAGS</h6>
                                                {
                                                    <MultiSelectTags tags={tagData} onTagsSelected={handleTagsSelected} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                <div className="col">
                                        <div className="form-group">
                                            <h6>PRICE</h6>
                                            <input 
                                                type="number" 
                                                name="price"
                                                value={formFields.price}
                                                onChange={inputChange} 
                                            />
                                            
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>OLD PRICE</h6>
                                            <input 
                                                type="number" 
                                                name="oldPrice"
                                                value={formFields.oldPrice}
                                                onChange={inputChange} 
                                            />
                                        </div>
                                    </div>

                                 

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT STOCK</h6>
                                            <input 
                                                type="number"
                                                name="countInStock"
                                                value={formFields.countInStock}
                                                onChange={inputChange} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                       
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>BRAND</h6>
                                            <input 
                                                type="text"
                                                name="brand"
                                                value={formFields.brand}
                                                onChange={inputChange} 
                                             />
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRODUCT WEIGHT</h6>
                                            <input 
                                                type="text"
                                                name="productWeight"
                                                value={formFields.productWeight}
                                                onChange={inputChange} 
                                            />
                                        </div> 
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PACKAGING TYPE</h6>
                                            <input 
                                                type="text"
                                                name="packagingType"
                                                value={formFields.packagingType}
                                                onChange={inputChange} 
                                            />
                                        </div> 
                                    </div>
                                  
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>MINIMUM ORDER</h6>
                                            <input 
                                                type="number"
                                                name="minOrder"
                                                value={formFields.minOrder}
                                                onChange={inputChange} 
                                            />
                                        </div> 
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <h6>DELIVERY DAYS</h6>
                                            <input 
                                                type="number"
                                                name="estimatedDeliveryDate"
                                                value={formFields.estimatedDeliveryDate}
                                                onChange={inputChange} 
                                            />
                                        </div> 
                                    </div>
                                </div>

                                <div className="card p-4 mt-0">
                                    <div className="imagesUploadSection">
                                        <h5>Media And Published</h5>
                                    </div>

                                    {/* <MultipleFileUpload></MultipleFileUpload> */}

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

export default EditProduct;