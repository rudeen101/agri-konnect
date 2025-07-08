import React, {useState, useContext, useEffect, useRef} from "react";
// import "./style.css";
import HeroSection from "../../components/seller/HeroSection";
import WhyChoose from "../../components/seller/WhyChoose";
import HowItWorks from "../../components/seller/HowItWorks";
import Services from "../../components/seller/Services";
import NewsLetter from "../../components/seller/NewsLetter";

const Seller = () => {

    return (
        <>
            <HeroSection headline="Grow Your Agri-Business with Agri-Konnect" subHeadline="Reach thousands of buyers, sell more produce, and get paid fast—
            all in one powerful platform." btnText="Start Selling Today"></HeroSection>

            <WhyChoose></WhyChoose>

            <HowItWorks></HowItWorks>

            <Services></Services>

        </>
    )
}

export default Seller;  