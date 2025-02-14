import React, {useState, useContext, useEffect, useRef} from "react";
import HomeSlider from "./slider/homeSlider";
import CartSlider from "../../components/cartSlider/cartSlider";
import Banner from "../../components/banner/banner";
import "./style.css";
import ProductCard from "../../components/product/product";
import ProductCardBanner from "../../components/product/productBanner";
import bannerImg from "../../assets/images/images3.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image from "../../assets/images/fruits-vegetables .png"
import TopProduct from "./topProduct/topProduct"
import Newsletter from "../../components/newsletter/newsletter";
import Footer from "../../components/footer/footer";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { MyContext } from "../../App";
import HomeBannerSlider from "../../components/homeBannerSlder/homeBannerSlider";


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { fetchDataFromApi } from "../../utils/api";
import Category from "../../components/categories/category";
import HomeProductCard from "../../components/product/homeProductCard";


const Home = () => {

    const [categories, setCategories] = useState('');
    const [value, setValue] = useState(0);
    const [selectedCat, setSelectedCat] = useState("");
    const [selectedCatId, setSelectedCatId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [productData, setProductData] = useState([]);
    const [homeSliderBanner, setHomeSliderBanner] = useState([]);
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

    const settings ={
        dots: false,
        infinite: true,
        // infinite: context.windowWidth < 992 ? false : true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        fade: false,
        arrows: true
    }; 

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

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        fetchDataFromApi(`/api/product/homepage`)
        .then((res) => {
            console.log("home data",res.combinedProducts)

            setMostPopular(res.combinedProducts.find(p => p.category === "mostPopular"));
            setNewArrival(res.combinedProducts.find(p => p.category === "newlyReleased"));
            setRecentlyViewed(res.combinedProducts.find(p => p.category === "recentlyViewed"));

            setIsLoading(false);
        });
    }, []);

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
            setHomeSliderBanner(res);
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
                homeSliderBanner?.data?.length > 0 &&  <HomeBannerSlider data={homeSliderBanner} />
            }
           
            {/* <CartSlider /> */}

            <div className="categories">
                <div className="container-fluid">
                    <br></br>
                    <div className="categoryRow mt-4">
                        { 
                            context.categoryData?.categoryList?.map((category, index) => {

                                return (
                                    <Category catData={category} />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
                
      
            {/* Popular Product */}
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Most Popular Items</h3>
                            {console.log("popular", mostPopular)}

                            <ul className="list list-inline mb-0 ml-auto filterTab">
                                <li className="list-inline-item">
                                    <a href="#" className="cursor">View All <NavigateNextIcon></NavigateNextIcon></a>
                                </li>
                            </ul>
                        </div>
                   
                        <div className="row">
                            <div className="col-md-12">
                                <Slider {...settings} className="productSlider">
                                    {
                                        mostPopular?.products?.length !== 0 && mostPopular.products?.map((product, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <HomeProductCard productData={product}></HomeProductCard>
                                                </div>
                                            )
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>    
                    </div>
                </div>    
            </section>

            {/* Newly Released Product */}                       
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">New Arrivals</h3>

                            <ul className="list list-inline mb-0 ml-auto filterTab">
                                <li className="list-inline-item">
                                    <a href="#" className="cursor">View All <NavigateNextIcon></NavigateNextIcon></a>
                                </li>
                            </ul>
                        </div>
                   
                        <div className="row">
                            <div className="col-md-12">
                                <Slider {...settings} className="productSlider">
                                    {
                                        newArrival?.products?.length !== 0 && newArrival.products?.map((product, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <HomeProductCard productData={product}></HomeProductCard>
                                                </div>
                                            )
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>    
                    </div>
                </div>    
            </section>

            {/* Category section */}                       
            <div className="categories">
                <div className="container-fluid">
                    
                    <div className="categoryRow ">
                        { 
                            context.categoryData?.categoryList?.map((category, index) => {

                                return (
                                    <Category catData={category} />
                                );
                            })
                        }
                    </div>
                </div>
            </div>

            {/* User recently viewed products */}                       
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Recently viewed Items</h3>

                            <ul className="list list-inline mb-0 ml-auto filterTab">
                                <li className="list-inline-item">
                                    <a href="#" className="cursor">View All <NavigateNextIcon></NavigateNextIcon></a>
                                </li>
                            </ul>
                        </div>
                
                        <div className="row">
                            <div className="col-md-12">
                                <Slider {...settings} className="productSlider">
                                    {
                                        newArrival?.products?.length !== 0 && newArrival.products?.map((product, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <HomeProductCard productData={product}></HomeProductCard>
                                                </div>
                                            )
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>    
                    </div>
                </div>    
            </section>

            {/* Top Fresh Produce Items */}                       
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Recommended Items for you</h3>

                            <ul className="list list-inline mb-0 ml-auto filterTab">
                                <li className="list-inline-item">
                                    <a href="#" className="cursor">View All <NavigateNextIcon></NavigateNextIcon></a>
                                </li>
                            </ul>
                        </div>
                
                        <div className="row">
                            <div className="col-md-12">
                                <Slider {...settings} className="productSlider">
                                    {
                                        newArrival?.products?.length !== 0 && newArrival.products?.map((product, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <HomeProductCard productData={product}></HomeProductCard>
                                                </div>
                                            )
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>    
                    </div>
                </div>    
            </section>
            
             {/* Slider with banner top fresh produce  */}   
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        {/* <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">New Arrivals</h3>

                            <ul className="list list-inline mb-0 ml-auto filterTab">
                                <li className="list-inline-item">
                                    <a href="#" className="cursor">View All <NavigateNextIcon></NavigateNextIcon></a>
                                </li>
                            </ul>
                        </div> */}
                   
                        <div className="row">
                            <div className="col-md-3 bannerCol">
                                <div className="item card">
                                <img src={image} alt="" />
                                </div>
                            </div>
                            <div className="col-md-9">
                                <Slider {...bannerSlider} className="productSlider">
                                    {
                                        newArrival?.products?.length !== 0 && newArrival.products?.map((product, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <HomeProductCard productData={product}></HomeProductCard>
                                                </div>
                                            )
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>    
                    </div>
                </div>    
            </section>

             {/* Slider with banner for farm inputs  */}   
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        {/* <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">New Arrivals</h3>

                            <ul className="list list-inline mb-0 ml-auto filterTab">
                                <li className="list-inline-item">
                                    <a href="#" className="cursor">View All <NavigateNextIcon></NavigateNextIcon></a>
                                </li>
                            </ul>
                        </div> */}
                   
                        <div className="row">
                            <div className="col-md-3 bannerCol">
                                <div className="item card">
                                <img src={image} alt="" />
                                </div>
                            </div>
                            <div className="col-md-9">
                                <Slider {...bannerSlider} className="productSlider">
                                    {
                                        newArrival?.products?.length !== 0 && newArrival.products?.map((product, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <HomeProductCard productData={product}></HomeProductCard>
                                                </div>
                                            )
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>    
                    </div>
                </div>    
            </section>

            {/* Lifestock */}                       
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Lifestock</h3>

                            <ul className="list list-inline mb-0 ml-auto filterTab">
                                <li className="list-inline-item">
                                    <a href="#" className="cursor">View All <NavigateNextIcon></NavigateNextIcon></a>
                                </li>
                            </ul>
                        </div>
                
                        <div className="row">
                            <div className="col-md-12">
                                <Slider {...settings} className="productSlider">
                                    {
                                        newArrival?.products?.length !== 0 && newArrival.products?.map((product, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <HomeProductCard productData={product}></HomeProductCard>
                                                </div>
                                            )
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>    
                    </div>
                </div>    
            </section>

            {/* Aquatic */}                       
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Aquatic</h3>

                            <ul className="list list-inline mb-0 ml-auto filterTab">
                                <li className="list-inline-item">
                                    <a href="#" className="cursor">View All <NavigateNextIcon></NavigateNextIcon></a>
                                </li>
                            </ul>
                        </div>
                
                        <div className="row">
                            <div className="col-md-12">
                                <Slider {...settings} className="productSlider">
                                    {
                                        newArrival?.products?.length !== 0 && newArrival.products?.map((product, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <HomeProductCard productData={product}></HomeProductCard>
                                                </div>
                                            )
                                        })
                                    }
                                </Slider>
                            </div>
                        </div>    
                    </div>
                </div>    
            </section>

            {/* Slider with banner for industrial Items  */}   
            <section className="homeProducts homeProductsSection2 pt-0">
            <div className="container-fluid">

                <div className="wrapper card">
                    {/* <div className="productCardHeader">
                        <h3 className="hd mb-0 mt-0">New Arrivals</h3>

                        <ul className="list list-inline mb-0 ml-auto filterTab">
                            <li className="list-inline-item">
                                <a href="#" className="cursor">View All <NavigateNextIcon></NavigateNextIcon></a>
                            </li>
                        </ul>
                    </div> */}
            
                    <div className="row">
                        <div className="col-md-3 bannerCol">
                            <div className="item card">
                            <img src={image} alt="" />
                            </div>
                        </div>
                        <div className="col-md-9">
                            <Slider {...bannerSlider} className="productSlider">
                                {
                                    newArrival?.products?.length !== 0 && newArrival.products?.map((product, index) => {

                                        return (
                                            <div className="item"  key={index}>
                                                <HomeProductCard productData={product}></HomeProductCard>
                                            </div>
                                        )
                                    })
                                }
                            </Slider>
                        </div>
                    </div>    
                </div>
            </div>    
            </section>
            

            
           

        </>
      
    )
}

export default Home ;  