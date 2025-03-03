import React, {useState, useContext, useEffect, useRef} from "react";
import HomeSlider from "./slider/homeSlider";
import CartSlider from "../../components/cartSlider/cartSlider";
import Banner from "../../components/banner/banner";
import "./style.css";
import ProductCardBanner from "../../components/product/productBanner";
import bannerImg from "../../assets/images/images3.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image from "../../assets/images/fruits-vegetables .png"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { MyContext } from "../../App";
import HomeBannerSlider from "../../components/homeBannerSlder/homeBannerSlider";
import { fetchDataFromApi } from "../../utils/apiCalls";
import Category from "../../components/categories/category";
import HomeProductCard from "../../components/product/homeProductCard";
import ProductSliderContainer from "../../components/sliderContainer/SliderContainer";
import ProductInspirations from "../../components/productInspiration/ProductInspiration";
import ProductListingCard from "../../components/productListingCard/ProductListingCard";

const Home = () => {

    const [categories, setCategories] = useState('');
    const [value, setValue] = useState(0);
    const [selectedCat, setSelectedCat] = useState("");
    const [selectedCatId, setSelectedCatId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [productData, setProductData] = useState([]);
    const [homeSliderBannerData, setHomeSliderBannerData] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [topSeller, setTopSeller] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [mostPopular, setMostPopular] = useState([]);
    const [newArrival, setNewArrival] = useState([]);


    const productRow = useRef();


    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const context = useContext(MyContext)

    const bannerSlider ={
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        fade: false,
        arrows: true
    }; 

    useEffect(() => {
        if (context.categoryData?.categoryList?.length > 0){
            setCategories(context.categoryData?.categoryList);
        }
    }, [context.categoryData]);

    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem("user"));

    //     fetchDataFromApi(`/api/product/homepage`)
    //     .then((res) => {

    //         setMostPopular(res.combinedProducts.find(p => p.category === "mostPopular"));
    //         setNewArrival(res.combinedProducts.find(p => p.category === "newlyReleased"));
    //         setRecentlyViewed(res.combinedProducts.find(p => p.category === "recentlyViewed"));

    //         setIsLoading(false);
    //     });
    // }, []);

    // useEffect(() => {

    //     // if (selectedCat !== undefined) {
    //         setIsLoading(true);
    //         // // const location = localStorage.getItem("location");
    //         // console.log("cat-",context.categoryData?.categoryList)

    //         fetchDataFromApi(`/api/product?catId=${context.categoryData?.categoryList?.[0]?._id}`)
    //         .then((res) => {
    //             console.log("--*",res)
                // setFilterData(res.products);
    //             setIsLoading(false);
    //         });
    //     // }
    // }, [context.categoryData]);

    useEffect(() => {
        window.scrollTo(0, 0);

        // fetchDataFromApi(`/api/product/filter?isFearured=${true}`)
        // .then((res) => {
        //     setFeaturedProducts(res);
        // });

      
        fetchDataFromApi("/api/homeSliderBanner/")
        .then((res) => {
            console.log("HomeBanner", res);
            setHomeSliderBannerData(res.homeSliderBanner);
        });
        
    }, []);


    const filterProducts = (catId) => {
        setIsLoading(true);
        // const location = localStorage.getItem("location");

        // fetchDataFromApi(`/api.products?catId=${catId}?page=1&perPage=100`)
        fetchDataFromApi(`/api/product?catId=${catId}`)
        .then((res) => {
            // setFilterData(res.products);
            setIsLoading(false);
        });
    }

    return(
        <>
            {/* {
                homeSliderBanner?.data?.length > 0 &&  <HomeSlider data={homeSliderBanner} />
            } */}
            {
                homeSliderBannerData?.length > 0 &&  <HomeBannerSlider sliderData={homeSliderBannerData} />
            }
           
            {/* <CartSlider /> */}

            <div className="categories">
                <div className="container-fluid">
                    <div className="categoryRow mt-4">
                        { 
                            context.categoryData?.categoryList?.map((category, index) => (
                                <div className="d-flex">
                                    <Category catData={category} key={index}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
                
      
            {/* Popular Product */}
            {
                context?.mostPopular?.products?.length !== 0 &&
                <section className="homeProducts homeProductsSection2 pt-0">   
                    <ProductSliderContainer products={context?.mostPopular?.products} title={"Most Popular Items"}></ProductSliderContainer>
                </section>
            }
        

            {/* Newly Released Product */}  
            {
                context?.newArrivals?.products?.length !== 0 &&
                <section className="homeProducts homeProductsSection2 pt-0">
                    <ProductSliderContainer products={context?.newArrivals?.products} title={"New Arrivals"}></ProductSliderContainer>
                </section>
            }                     
      

            {/* Category section */}                       
            <div className="categories">
                <div className="container-fluid">
                    
                    <div className="categoryRow ">
                        { 
                            context.categoryData?.categoryList?.map((category, index) => {

                                return (
                                    <Category catData={category} key={index} />
                                );
                            })
                        }
                    </div>
                </div>
            </div>

            {/* User recently viewed products */}                       
            <section className="homeProducts homeProductsSection2 pt-0">
                {
                    context?.recentlyViewed?.length !== 0 &&
                    <section className="homeProducts homeProductsSection2 pt-0">
                        <ProductSliderContainer products={context?.recentlyViewed} title={"Recently Viewed Items"}></ProductSliderContainer>
                    </section>
                }     
            </section>

            {/* Recommended products */}                       
            <section className="homeProducts homeProductsSection2 pt-0">
                {
                    context?.recommendedProducts?.length !== 0 &&
                    <section className="homeProducts homeProductsSection2 pt-0">
                        <ProductSliderContainer products={context?.recommendedProducts} title={"Recommended for you"}></ProductSliderContainer>
                    </section>
                }     
            </section>

            {/* Top Fresh Produce Items */} 

            <section className="homeProducts homeProductsSection2 pt-0">
                {
                    context?.catProducts?.products?.length !== 0 && context?.catProducts?.products?.map((category, index) => (
                        <>
                            {
                                category?.products?.length !== 0 &&
                                <section className="homeProducts homeProductsSection2 pt-0">
                                    <ProductSliderContainer products={category?.products} title={category?.category}></ProductSliderContainer>
                                </section>
    
                            }
                        </>
                    ))
                }   
            </section>


            {/*  products inspiration */}                       
                       <section className="homeProducts homeProductsSection2 pt-0">
                {
                    context?.recommendedCollaborative?.length !== 0 &&
                    <section className="homeProducts homeProductsSection2 pt-0">
                        <ProductInspirations products={context?.recommendedCollaborative}></ProductInspirations>
                    </section>
                }     
            </section>

        </>
      
    )
}

export default Home ;  