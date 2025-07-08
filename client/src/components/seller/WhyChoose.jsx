import React from "react";
import "./style.css"; // External CSS
import benefitsImage from "../../assets/images/image1.jpg"; // Replace with actual image

const WhyChoose = () => {
  return (
    <section className="why-choose">
      <div className="why-choose-container">
        {/* Left: Image */}
        <div className="why-choose-image">
          <img src={benefitsImage} alt="Why Choose Agri-Konnect" />
        </div>

        {/* Right: Text */}
        <div className="why-choose-text">
          <h2>Why Choose Agri-Konnect?</h2>
          <ul>
            <li><strong>Wide Market Reach </strong> &nbsp;  – Sell to thousands of buyers across regions.</li>
            <li><strong>Secure Payments</strong>&nbsp;  – Get paid quickly and securely for every sale.</li>
            <li><strong>Easy Listing</strong>&nbsp; –  Upload and manage your products effortlessly.</li>
            <li><strong>Business Growth</strong>&nbsp; – Access valuable insights and tools to scale.</li>
            <li><strong>24/7 Support</strong>&nbsp; – Get dedicated assistance whenever you need it.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
