import React from "react";

const HeroSection = () => {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1>Welcome back, Rudeen!</h1>
                <p>Let's get the ball rolling...</p>
                <div className="hero-buttons">
                    <button className="btn btn-secondary">
                        <i className="fas fa-calendar-alt"></i> Home
                    </button>
                    <button className="btn btn-secondary">
                        <i className="fas fa-calendar-alt"></i> Add New Course
                    </button>
                </div>
            </div>
            <img src="https://cdn.pixabay.com/photo/2017/05/10/19/29/robot-2301646_1280.png" className="hero-pattern" alt="Pattern" />
        </div>
    )
}

export default HeroSection;