import React, {useState, useContext, useEffect, useRef} from "react";
import HomeSlider from "./slider/index";
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


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { fetchDataFromApi } from "../../utils/api";
import Category from "../../components/categories/category";


const Home = () => {

    const [categories, setCategories] = useState('');
    const [value, setValue] = useState(0);
    const [selectedCat, setSelectedCat] = useState("");
    const [selectedCatId, setSelectedCatId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [filterData, setFilterData] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [productData, setProductData] = useState([]);
    const [homeSlider, setHomeSlider] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);

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
        slidesToShow: 6,
        slidesToScroll: 1,
        fade: false,
        arrows: true
    }; 

    const topSellerSlier ={
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

            fetchDataFromApi(`/api/product?catId=${context.categoryData?.categoryList?.[0]?._id}`)
            .then((res) => {
                setFilterData(res.products);
                setIsLoading(false);
            });

            // setSelectedCat(categories?.[0]?._id);
            // console.log("Data2", selectedCat);


        }
    }, [context.categoryData]);

    // useEffect(() => {

    //     // if (selectedCat !== undefined) {
    //         setIsLoading(true);
    //         // // const location = localStorage.getItem("location");
    //         // console.log("cat-",context.categoryData?.categoryList)

    //         fetchDataFromApi(`/api/product?catId=${context.categoryData?.categoryList?.[0]?._id}`)
    //         .then((res) => {
    //             console.log("--*",res)
    //             setFilterData(res.products);
    //             setIsLoading(false);
    //         });
    //     // }
    // }, [context.categoryData]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const location = localStorage.getItem("location");

        // fetchDataFromApi(`/api/product/featured?location=${location}`)
        // .then((res) => {
        //     setFeaturedProducts(res);
        // });

        // fetchDataFromApi(`/api/product?page=1&perPage=8`)
        // .then((res) => {
        //     setProductData(res);
        // });

        // fetchDataFromApi("/api/homeBanner")
        // .then((res) => {
        //     setHomeSlider(res);
        // });
        
    }, []);


    const filterProducts = (catId) => {
        setIsLoading(true);
        // const location = localStorage.getItem("location");

        // fetchDataFromApi(`/api.products?catId=${catId}?page=1&perPage=100`)
        fetchDataFromApi(`/api/product?catId=${catId}`)
        .then((res) => {
            setFilterData(res.products);
            setIsLoading(false);
        });
    }



    return(
        <>
            <HomeSlider />
            {/* <CartSlider /> */}

            <div className="categories">
                <div className="container-fluid">
                    <div className="categoryRow">
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
                            <h3 className="hd mb-0 mt-0">Featured Produce</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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
            
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Top Sellers</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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
            
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Most Popular Items</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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
            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Vegetables Market</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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

            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Fruits Market</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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
            

            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Tubers Market</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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

            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Grains Market</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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

            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Processed Food Market</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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

            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Farm Inputs Market</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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

            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">

                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Lifestocks Market</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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

            <section className="homeProducts homeProductsSection2 pt-0">
                <div className="container-fluid">
                    <div className="wrapper card">
                        <div className="productCardHeader">
                            <h3 className="hd mb-0 mt-0">Farm Machinery & Equipments Market</h3>

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
                                        filterData?.length !== 0 && filterData?.map((item, index) => {

                                            return (
                                                <div className="item"  key={index}>
                                                    <ProductCard data={item} />
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