import React, { useState, useContext, useEffect } from "react";
import "./products.css";
import { MyContext } from "../../App";
import StyledBreadcrumb from "../../components/styledBreadcrumb/styledBreadcrumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ListingTable from "../../components/listingTable/ProductListingTable";
import { fetchDataFromApi, postDataToApi, updateDataToApi, deleteDataFromApi } from "../../utils/apiCalls";


const ProductListing = () =>{
    const [productList, setProductList] = useState([]);
    const [page, setPage] = useState(1);
    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHiddenSidebarAndHeader(false)
    });   

    useEffect(() => {
        window.scrollTo(0,0);

        context.setProgress(40);

        fetchDataFromApi('/api/product?page=1&perPage=10').then((res) => {
            res?.products?.length !== 0 && res?.products !== undefined && setProductList(res);
            context.setProgress(100)
        });

        fetchDataFromApi('/api/product/get/count').then((res) => {
            setTotalProducts(res.productsCount);
        });

        fetchDataFromApi('/api/category/get/count').then((res) => {
            setTotalCategory(res.categoryCount)
        });

        fetchDataFromApi('/api/category/subCategory/get/count').then((res) => {
            setTotalSubCategory(res.categoryCount);
        });
      
    }, []);

    const deleteProduct = (productId) => {
        context.setProgress(40);

        deleteDataFromApi(`/api/product/${productId}`).then((res) => {
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Product deleted!"
            });

            fetchDataFromApi(`/api/product?page=${page}&perPage=10`).then((res) => {
                setProductList(res);
            });

            context.fetchCategory();
        })
    }

    return(
        <>
            <div className="rightContent container-fluid w-100">
                <div className="card dashboardHeader shadow border-0 w-100 d-flex justify-content-between flex-row">
                        <h5 className="mb-0">Product Listing</h5>

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
                            label="Product List"
                            />
                        </Breadcrumbs>
                </div>
                <ListingTable thData={["PRODUCT", "CATEGORY", "BRAND", "PRICE", "STOCK", "SALES", "ACTION"]} tableData={productList?.products} searchPlaceholder="Search by product" filterData={context?.categoryData?.categoryList} filterHeader="Category" onDelete={deleteProduct}></ListingTable>

            </div>
        </>
    )
}

export default ProductListing;