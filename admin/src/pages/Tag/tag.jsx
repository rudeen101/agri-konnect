import React, { useState, useContext, useEffect } from "react";
import "./tag.css";
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";
import { fetchDataFromApi, deleteDataFromApi } from "../../utils/apiCalls";
import { Button } from "@mui/material";
import DataTable from "../../components/listingTable/DataTable";

const TagList = () =>{
    const [tagData, setTagData] = useState([]);
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);

        context.setProgress(20);
        fetchTags();
    }, []);  
    
    
    const fetchTags = () => {
		fetchDataFromApi('/api/tag').then((res) => {
			context.setProgress(30)
			setTagData(res);
			context.setProgress(100)
		})
	}

    const deleteTag = (id) => {
        deleteDataFromApi(`/api/tag/${id}`).then((res) => {
            context.setProgress(100);
            fetchDataFromApi('/api/tag').then((res) => {
                setTagData(res);
            });
        });
    }


    return(
        <>
            <div className="rightContent w-100">

                <div className=" categoryHeaderContainer   card dashboardHeader shadow border-0 w-100 d-flex justify-content-between flex-row">
                <h3 className="hd">Tag List</h3>
                <div className="d-flex align-items-center">
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
                            label="Tags"
                            />

                            </Breadcrumbs>
                            <Link to={'/tag/add'}><Button className="addCategory btn btn-g ml-3 pl-3 pr-3">Add Tag</Button></Link>

                        </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    
                    <div className="table-responsive mt-3">
                        <div className="table-responsive homeSliderBanner">
                            <DataTable thData={["TAG", "CATEGORY", "DESCRIPTION"]} tableData={tagData} searchPlaceholder="Search by tag name" filterData={[]} filterHeader="Category" action={true} isEditable={false} onDelete={deleteTag}></DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TagList;