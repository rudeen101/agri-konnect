import React, { useState, useContext, useEffect } from "react";
import DashboardBox from "../../components/dashboardBox/DashboardBox";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { Button, Pagination } from "@mui/material";
import { HiDotsVertical } from "react-icons/hi";
import { Chart } from "react-google-charts";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import food from "../../assets/images/food.jpg"
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
			setHomeSliderBannerData(res);
			context.setProgress(100)
		})
    }, []);  


    const deleteHomeBannerSlide = (id) => {
        deleteData(`/api/homeSliderBanner/${id}`).then((res) => {
            console.log(res);
            context.setProgress(100);
            fetchDataFromApi('/api/homeSliderBanner').then((res) => {
                setHomeSliderBannerData(res);
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
                <div className=" categoryHeaderContainer card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
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
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                               
                            <tbody>
                                {
                                    homeSliderBannerData?.data?.length !== 0 && homeSliderBannerData?.data?.map((slide, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center" style={{width: '100px', flex: '0 0 50px'}}>
                                                        <div className="img card shadow m-0">
                                                            <LazyLoadImage
                                                                alt={"image"}
                                                                effect="blur"
                                                                className="w-100"
                                                                src={slide?.images[0]}
                                                            />
                                                        </div>
                                                    </div>
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