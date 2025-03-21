import React, { useState, useContext, useEffect } from "react";
import { Button, Pagination } from "@mui/material";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import food from "../../assets/images/food.jpg"
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from "react-router-dom";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";
// import { deleteData } from "../../utils/api";


const HomeBannerSlideList = () =>{
    const [homeSliderBannerData, setHomeSliderBannerData] = useState([]);
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);

        context.setProgress(20);
        
        fetchDataFromApi('/api/homeSliderBanner').then((res) => {
			context.setProgress(30)
			setHomeSliderBannerData(res.homeSliderBanner);
			context.setProgress(100)
		})
    }, []);  


    const deleteHomeBannerSlide = (id) => {
        console.log(id)
        deleteDataFromApi(`/api/homeSliderBanner/${id}`).then((res) => {
            context.setProgress(40);
            fetchDataFromApi('/api/homeSliderBanner').then((res) => {
                setHomeSliderBannerData(res.homeSliderBanner);
                context.setProgress(100);

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "Slide Deleted!"
                });
            });
        });
    }


    return(
        <>
            <div className="rightContent w-100">
                <div className=" categoryHeaderContainer card dashboardHeader shadow border-0 w-100 d-flex justify-content-between flex-row">
                        <h5 className="mb-0">Home Banner Slider List</h5>
                        <div className="d-flex align-items-center">
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
                            label="Home Banner Slider"
                            // deleteIcon={<ExpandMoreIcon />}
                            />
                            </Breadcrumbs>

                            <Link to={'/homeBannerSlide/add'}><Button className="addCategoryBtn btn-blue ml-3 pl-3 pr-3">Add Home Banner Slide</Button></Link>

                        </div>
                     

                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{width: '100px'}}>IMAGE</th>
                                    <th style={{width: '100px'}}>Title</th>
                                    <th style={{width: '100px'}}>Sub Title</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                               
                            <tbody>
                                {
                                    homeSliderBannerData?.length !== 0 && homeSliderBannerData?.map((slide, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center" style={{width: '100px', flex: '0 0 50px'}}>
                                                        <div className="img card shadow m-0">
                                                            <LazyLoadImage
                                                                alt={"image"}
                                                                effect="blur"
                                                                className="w-100"
                                                                src={slide?.imageUrl}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                     
                                                <td>
                                                   <div>{slide?.title}</div>
                                                </td>
                                                <td>
                                                   <div>{slide?.subtitle}</div>
                                                </td>

                                                                      
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Link to={`/homeBannerSlide/edit/${slide?._id}`}>
                                                            <Button className="success" color="success"><FaPencilAlt /></Button>
                                                        </Link>

                                                        
                                                        <Button className="error" color="error" onClick={() => deleteHomeBannerSlide(slide._id)}><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
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

export default HomeBannerSlideList;