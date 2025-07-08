import React, { useState, useContext, useEffect } from "react";
import { Button } from "@mui/material";

import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";
import DataTable from "../../components/listingTable/DataTable";

const BannerList = () =>{
    const [bannerData, setBannerData] = useState([]);
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);

        context.setProgress(20);
        
        fetchDataFromApi('/api/banner').then((res) => {
			context.setProgress(30)
			setBannerData(res);
			context.setProgress(100)
		})
    }, []);  


    const deleteBanner = (id) => {
        deleteDataFromApi(`/api/banner/${id}`).then((res) => {
            context.setProgress(100);
            fetchDataFromApi('/api/banner').then((res) => {
                setBannerData(res);
                context.setProgress(100);

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "Banner Deleted!"
                });
            });
        });
    }


    return(
        <>
            <div className="rightContent w-100">
                <div className=" categoryHeaderContainer card  dashboardHeader shadow border-0 w-100 d-flex justify-content-between flex-row">
                    <h5 className="mb-0">Banner List</h5>
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
                        label="Banner"
                        // deleteIcon={<ExpandMoreIcon />}
                        />
                        </Breadcrumbs>

                        <Link to={'/banner/add'}><Button className="addCategory btn-g ml-3 pl-3 pr-3">Add Banner</Button></Link>

                    </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
              
                        <div className="table-responsive homeSliderBanner">
                            <DataTable thData={["IMAGE", "NAME"]} tableData={bannerData?.data} searchPlaceholder="Search by Title" filterData={[]} filterHeader="Category" action={true} isEditable={true} onDelete={deleteBanner}></DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BannerList;