import React, { useState, useContext, useEffect } from "react";
// import "./products.css";
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ListingTable from "../../components/listingTable/ProductListingTable";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";


const MyWishlist = () =>{
    const [wishlist, setWishlist] = useState([]);

    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0,0);
        context.setProgress(40);

        getWishlistData()
        context.setProgress(100)
    }, []);

    const getWishlistData = () => {
        fetchDataFromApi('/api/wishlist').then((res) => {
            setWishlist(res.wishlist.items)
        });
    }

    const deleteProduct = (itemId) => {
        context.setProgress(40);

        deleteDataFromApi(`/api/wishlist/remove/${itemId}`).then((res) => {
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Item deleted!"
            });

            getWishlistData()
        })
    }

    return(
        <>
            <div className="rightContent container-fluid w-100">
                <div className="card dashboardHeader shadow border-0 w-100 d-flex justify-content-between flex-row">
                        <h5 className="mb-0">Wishlist</h5>

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
                            label="Wishlist"
                            />
                        </Breadcrumbs>
                </div>
                <ListingTable thData={["PRODUCT", "CATEGORY", "PRICE", "STOCK", "DATE", "ACTION"]} tableData={wishlist} searchPlaceholder="Search by product" filterData={context?.categoryData?.categoryList} filterHeader="Category" onDelete={deleteProduct}></ListingTable>

            </div>
        </>
    )
}

export default MyWishlist;