import React from "react";
import "./footer.css";
import icon from "../../assets/images/quality.png";
import logo from "../../assets/images/logo3.png";
import googlePlay from "../../assets/images/google-play.png";
import appStore from "../../assets/images/app-store.png";
import orangeMoney from "../../assets/images/orange-money.png";
import mtnMomo from "../../assets/images/mtn-momo.jpg";
import mtnOrange from "../../assets/images/mtn-orange.jpg";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import image from "../../assets/images/fruits-vegetables .png"
import Newsletter from "../seller/NewsLetter";
Newsletter




const Footer = () =>{
    return (
        <>
            <div className="footerContainer">
                {/* <Newsletter></Newsletter> */}

                <footer>
                    <div className="footer-container">
                        <div className="container-fluid">
                            <div className="row footer-main">
                            {/* Part 1 - Logo and Info */}
                            <div className="col-lg-3 col-md-6 col-sm-12 footer-part footer-part1">
                                <div className="footer-brand">
                                    <a href="#"><img src={logo} alt="Site logo" className="footer-logo" /></a>
                                </div>
                                <p className="footer-description">
                                    Agri-Konnect, a digital platform that connects farmers directly with buyers, ensuring fair pricing and reliable access to fresh produce.
                                </p>

                                <div className="footer-contact-info">
                                    <p className="address">
                                        <LocationOnOutlinedIcon className="footer-icon" />
                                        <span className="contact-text"><strong>Address</strong>: Oldest Congo, Tubman Boulevard, Opposite NVTI</span>
                                    </p>
                                    <p className="address">
                                        <EmailOutlinedIcon className="footer-icon" />
                                        <span className="contact-text"><strong>Email</strong>: agriKonnect231@gmail.com</span>
                                    </p>
                                </div>
                            </div>

                            {/* Part 2 - Navigation Links */}
                            <div className="col-lg-6 col-md-12 col-sm-12 footer-part footer-part2">
                                <div className="row">
                                    <div className="col-md-4 col-sm-6 col-6 footer-links">
                                        <h4 className="footer-heading">Company</h4>
                                        <ul className="footer-list">
                                        <li><a href="#" className="footer-link">About us</a></li>
                                        <li><a href="#" className="footer-link">Career & Learnings</a></li>
                                        <li><a href="#" className="footer-link">Return & Refund policy</a></li>
                                        <li><a href="#" className="footer-link">Terms & Conditions</a></li>
                                        <li><a href="#" className="footer-link">Contact Us</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-6 footer-links">
                                        <h4 className="footer-heading">Make money with us</h4>
                                        <ul className="footer-list">
                                        <li><a href="#" className="footer-link">Start selling</a></li>
                                        <li><a href="#" className="footer-link">Become a verified supplier</a></li>
                                        <li><a href="#" className="footer-link">Become a sales agent</a></li>
                                        <li><a href="#" className="footer-link">Advertise your products</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-6 footer-links">
                                        <h4 className="footer-heading">Get support</h4>
                                        <ul className="footer-list">
                                        <li><a href="#" className="footer-link">Chat with us</a></li>
                                        <li><a href="#" className="footer-link">Help Center</a></li>
                                        <li><a href="#" className="footer-link">Privacy Policy</a></li>
                                        <li><a href="#" className="footer-link">FAQ</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Part 3 - App and Payment */}
                            <div className="col-lg-3 col-md-6 col-sm-12 footer-part footer-part3">
                                <div className="footer-app-section">
                                <h4 className="footer-heading">Install App</h4>
                                <p className="footer-subtext">From App Store or Google Play</p>
                                <div className="footer-app-buttons">
                                    <a href="#" className="app-button-link">
                                    <img src={googlePlay} alt="Google Play" className="app-button-img" />
                                    </a>
                                    <a href="#" className="app-button-link">
                                    <img src={appStore} alt="App Store" className="app-button-img" />
                                    </a>
                                </div>
                                </div>

                                <div className="footer-payment-section">
                                <p className="footer-subtext">Secure Payment Gateway</p>
                                <div className="footer-payment-methods">
                                    <img src={mtnOrange} alt="Payment methods" className="payment-method-img" />
                                </div>
                                </div>
                            </div>
                            </div>

                            <div className="footer-divider"></div>

                            <div className="row footer-bottom">
                                <div className="col-lg-3 col-md-12 col-12 footer-copyright">
                                    <p>© 2025, AgriKonnect All rights reserved</p>
                                </div>

                            <div className="col-lg-6 col-md-8 col-12 footer-contact">
                                <div className="footer-phone-container">
                                <div className="footer-phone-item">
                                    <PhoneInTalkIcon className="footer-phone-icon" />
                                    <div className="footer-phone-info">
                                    <h5 className="footer-phone-number">(+231) 777-967-844</h5>
                                    <p className="footer-phone-label">WhatsApp Chat</p>
                                    </div>
                                </div>
                                <div className="footer-phone-item">
                                    <PhoneInTalkIcon className="footer-phone-icon" />
                                    <div className="footer-phone-info">
                                    <h5 className="footer-phone-number">(+231) 888-642-680</h5>
                                    <p className="footer-phone-label">24/7 Support Center</p>
                                    </div>
                                </div>
                                </div>
                            </div>

                            <div className="col-lg-3 col-md-4 col-12 footer-social">
                                <div className="footer-social-container">
                                <h5 className="footer-social-heading">Follow us:</h5>
                                <div className="footer-social-icons">
                                    <a href="#" className="social-icon-link"><FacebookOutlinedIcon className="social-icon" /></a>
                                    <a href="#" className="social-icon-link"><TwitterIcon className="social-icon" /></a>
                                    <a href="#" className="social-icon-link"><InstagramIcon className="social-icon" /></a>
                                    <a href="#" className="social-icon-link"><YouTubeIcon className="social-icon" /></a>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

             
                </footer>
            </div>
        </>
        
    )
}

export default Footer; 