import React from "react";
import "./style.css"; // External CSS file
import heroImage from "../../assets/images/banner-img.jpg"
import { Link } from "react-router-dom";

const HeroSection = ({headline, subHeadline, btnText}) => {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left Section: Image */}
        <div className="hero-image">
          <img src={heroImage} alt="Agri-Konnect Sellers" />
        </div>

        {/* Right Section: Text */}
        <div className="hero-text">
          <h1>{headline}</h1>
          <p> {subHeadline} </p>
          <Link className="hero-btn" to={"/business/signup"}>Start Selling Today</Link> &nbsp;
          <Link className="hero-btn" to={"/seller/guide"}>Seller Guide</Link>
          {/* <a href="/register" >
            {btnText}
          </a> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
