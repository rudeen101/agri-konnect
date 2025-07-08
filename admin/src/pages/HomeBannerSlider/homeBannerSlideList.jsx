import React, { useState, useContext, useEffect } from "react";
import { Button, Pagination } from "@mui/material";
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";
import DataTable from "../../components/listingTable/DataTable";

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

                            <Link to={'/homeBannerSlide/add'}><Button className="addCategory Btn btn-g ml-3 pl-3 pr-3">Add Slide</Button></Link>

                        </div>
                     

                </div>

                <div className="card shadow border-0 p-3 ">
                    <div className="table-responsive homeSliderBanner">
                        <DataTable thData={["IMAGE", "TITLE", "SUB TITLE"]} tableData={homeSliderBannerData} searchPlaceholder="Search by Title" filterData={[]} filterHeader="Category" action={true} isEditable={true} onDelete={deleteHomeBannerSlide}></DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeBannerSlideList;