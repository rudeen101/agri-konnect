import React, { useState } from "react";
import "./style.css"; // External CSS

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      alert("Please enter a valid email address.");
      return;
    }
    alert(`Thank you for subscribing, ${email}!`);
    setEmail("");
  };

  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <div className="newsletter-text">
          <h2>Get Helpful Tips on Building Your Brand</h2>
          <p>Subscribe to our newsletter and receive expert insights, marketing tips, and business strategies to grow your agri-business with Agri-Konnect.</p>
        </div>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
