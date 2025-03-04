import React, { useState, useContext, useEffect } from "react";
import "./tag.css";
import { MdDelete } from "react-icons/md";
import food from "../../assets/images/food.jpg"
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";
// import { deleteData } from "../../utils/api";


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
            console.log("Tags",res)
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
                <div className=" categoryHeaderContainer card shadow border-0 w-100 d-flex justify-content-between flex-row p-4">
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

                            <Link to={'/tag/add'}><Button className="addCategoryBtn btn-blue ml-3 pl-3 pr-3">Add Tag</Button></Link>

                        </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    
                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>TAG</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                               
                            <tbody>
                                {
                                    tagData?.tagData?.length !== 0 && tagData?.map((tag, index) => {
                                        return (
                                            <tr key={index}>
                                        
                                                <td>
                                                    {tag?.name}
                                                </td>
                                                <td>
                                                    {tag?.category.name}
                                                </td>
                                                <td>
                                                    {tag?.description}
                                                </td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        {/* <Link to={`/category/edit/${tagData?._id}`}>
                                                            <Button className="success" color="success"><FaPencilAlt /></Button>
                                                        </Link> */}

                                                        
                                                        <Button className="error" color="error" onClick={() => deleteTag(tag._id)}><MdDelete /></Button>
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

export default TagList;