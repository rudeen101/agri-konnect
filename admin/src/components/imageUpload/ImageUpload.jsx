import { useState } from "react";
import "./imageUpload.css";
import { useDropzone } from "react-dropzone";
// import { uploadImages, deleteImage } from "../utils/api";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi, uploadImage, deleteImages } from "../../utils/apiCalls";


let img_arr = [];
let uniqueArray = [];
let selectedImages = [];

const ImageUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const formData = new FormData();

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

    return (
        <div className="card p-4 mt-0">
            <div className="imagesUploadSection">
                <h5>Media And Published</h5>
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

            <Button type="submit" className="btn-blue btn-large w-100 btn-big   "> <FaCloudUploadAlt /> &nbsp; {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : "PUBLISH AND VIEW"} </Button>
        </div>
    )
}

export default ImageUpload;
