import React, {useState, useContext, useEffect} from "react";
import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MyContext } from "../../App";
import HomeBannerSlider from "../../components/homeBannerSlder/homeBannerSlider";
import { fetchDataFromApi } from "../../utils/apiCalls";
import Category from "../../components/categories/category";
import ProductSliderContainer from "../../components/sliderContainer/SliderContainer";
import ProductInspirations from "../../components/productInspiration/ProductInspiration";

const Home = () => {

    const [categories, setCategories] = useState('');
    const [homeSliderBannerData, setHomeSliderBannerData] = useState([]);

    const context = useContext(MyContext)

    useEffect(() => {
        if (context.categoryData?.categoryList?.length > 0){
            setCategories(context.categoryData?.categoryList);
        }
    }, [context.categoryData]);

    useEffect(() => {
        window.scrollTo(0, 0);
     
        fetchDataFromApi("/api/homeSliderBanner/")
        .then((res) => {
            setHomeSliderBannerData(res.homeSliderBanner);
        });
        
    }, []);


    return(
        <>
            {
                homeSliderBannerData?.length > 0 &&  <HomeBannerSlider sliderData={homeSliderBannerData} />
            }
           
            {/* <CartSlider /> */}

            <div className="categories-container">
                <div className="categories-wrapper">
                    <div className="categories-grid">
                        {context.categoryData?.categoryList?.map((category, index) => (
                            <div className="category-item" key={index}>
                            <Category catData={category} />
                            </div>
                        ))}
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


            {/* display: grid;
            grid-template-columns: repeat(4, 1fr) !important */}

            {/* Category section */}                       
            <div className="categories-container">
                <div className="categories-wrapper">
                    <div className="categories-grid">
                        {context.categoryData?.categoryList?.map((category, index) => (
                            <div className="category-item" key={index}>
                            <Category catData={category} />
                            </div>
                        ))}
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
            <section className=" pt-0">
                {
                    context?.recommendedCollaborative?.length !== 0 &&
                    <section className=" pt-0">
                        <ProductInspirations products={context?.recommendedCollaborative}></ProductInspirations>
                    </section>
                }     
            </section>

        </>
      
    )
}

export default Home ;  