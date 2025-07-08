import React, {useState, useContext, useEffect, useRef} from "react";
// import "./style.css
import Guide from "../../components/seller/Guide";
import HeroSection from "../../components/seller/HeroSection";
import Newsletter from "../../components/seller/NewsLetter";

const SellerGuide = () => {

    return(
        <>
            <HeroSection 
                headline="Start Selling & Grow Your Agri-Business with AgriKonnect" 
                subHeadline="Join hundreds of farmers and agribusinesses connecting with ready buyers. Sell smarter, grow faster!"
                btnText="Get Started"
            >
            </HeroSection>
            <Guide></Guide>
        </>
    )
}

export default SellerGuide;  