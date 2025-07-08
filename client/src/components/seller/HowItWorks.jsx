import React from "react";
import "./style.css"; // External CSS
import processImage from "../../assets/images/image2.jpg"; // Replace with actual image
import { Link } from "react-router-dom";


const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="how-it-works-container">
        {/* Left: Text Content */}
        <div className="how-it-works-text">
          <h2>How Agri-Konnect Works</h2>
          <p>Sell your agricultural products easily in just a few steps</p>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <p><strong>Sign Up & Create Your Store</strong> – Register as a seller and set up your profile.</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p><strong>List Your Products</strong> – Add your agricultural produce with details and images.</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p><strong>Get Orders & Sell</strong> – Customers browse and buy directly from your store.</p>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <p><strong>Get Paid Fast</strong> – Secure transactions ensure you receive payments quickly.</p>
            </div>
            <Link to={"/seller/guide"}>
              <button className="btn btn-g">Read The Seller Guide</button>
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div className="how-it-works-image">
          <img src={processImage} alt="How Agri-Konnect Works" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
