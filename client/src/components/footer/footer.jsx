import React from "react";
import "./footer.css";
import icon from "../../assets/images/quality.png";
import logo from "../../assets/images/logo.png";
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
import Newsletter from "../newsletter/newsletter";
import image from "../../assets/images/fruits-vegetables .png"




const Footer = () =>{
    return (
        <>
            <div className="newsletterSection mt-5">
                <div className="container-fluid">
                    <div className="box d-flex align-items-center">
                        <div className="info">
                            <h3>Stay home and get daily <br/> needs from our shop</h3>
                            <p>Start your daily Shopping wth Nest Mart</p>
                            <br />
                            <Newsletter />
                        </div>

                        <div className="img">
                            <img src={image}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footerContainer">
                <div className="footerBoxes">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col">
                                <div className="box d-flex align-items-center w-100">
                                    <img src={icon} alt="box icon" />
                                    <div className="info">
                                        <h5>Best prices & offer</h5>
                                        <p>Order %50 or more</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="box d-flex align-items-center w-100">
                                    <img src={icon} alt="box icon" />
                                    <div className="info">
                                        <h5>Free delivery</h5>
                                        <p>Order %50 or more</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="box d-flex align-items-center w-100">
                                    <img src={icon} alt="box icon" />
                                    <div className="info">
                                        <h5>Get daily deal</h5>
                                        <p>Order %50 or more</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="box d-flex align-items-center w-100">
                                    <img src={icon} alt="box icon" />
                                    <div className="info">
                                        <h5>Wide assortmentr</h5>
                                        <p>Order %50 or more</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="box d-flex align-items-center w-100">
                                    <img src={icon} alt="box icon" />
                                    <div className="info">
                                        <h5>easy returns</h5>
                                        <p>Order %50 or more</p>
                                    </div>
                                </div>
                            </div>
                        
                        </div>
                    </div>
                </div>

                <footer>

                    <div className="container-fluid mt-4">
                        <div className="row">
                            <div className="col-md-3 part1">
                                <a href="#"><img src={logo} alt="Site logo" className="w-50" /></a>
                                <br /> 
                                <p className="description">Agri-Konnect, a digital platform that connects farmers directly with buyers, ensuring fair pricing and reliable access to fresh produce.</p>

                                <p className="address mt-4"><LocationOnOutlinedIcon /><strong>Address</strong>: Suakoko, bong County, Liberia</p>
                                {/* <p><HeadphonesOutlinedIcon /><strong>Call Us</strong>: (+231) 777-989-777</p> */}
                                <p className="address"><EmailOutlinedIcon /><strong>Email</strong>: exampleemail@gmail.com</p>
                                {/* <p><AccessTimeOutlinedIcon /><strong>Hours</strong>: 10:00 - 18:00, Mon - Sat</p> */}
                            </div>

                            <div className="col-md-6 part2" >
                                <div className="row">
                                    <div className="col">
                                        <h4>Company</h4>
                                        <ul className="footer-list mb-sm-5 mb-md-0 p-0">
                                            <li><a href="#">About us</a></li>
                                            <li><a href="#">Career & Learnings</a></li>
                                            <li><a href="#">Return & Refund policy</a></li>
                                            <li><a href="#">Terms &amp; Conditions</a></li>
                                            <li><a href="#">Contact Us</a></li>

                                        </ul>
                                    </div>
                                    <div className="col">
                                        <h4>Make money with us</h4>
                                        <ul className="footer-list mb-sm-5 mb-md-0 p-0">
                                            <li><a href="#">Start selling</a></li>
                                            <li><a href="#">Become a verified supplier</a></li>
                                            <li><a href="#">Become a sales agent</a></li>
                                            <li><a href="#">Advertise your products</a></li>
                                        </ul>
                                    </div>
                                    <div className="col">
                                        <h4>Get support</h4>
                                        <ul className="footer-list mb-sm-5 mb-md-0 p-0">
                                            <li><a href="#">Chat with us</a></li>
                                            <li><a href="#">Help Center</a></li>
                                            <li><a href="#">Privacy Policy</a></li>
                                            <li><a href="#">FAQ</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 part3" >
                                <h4 className="mb-3">Install App</h4>
                                
                                <p>From App Store or Google Play</p>

                                <div className="d-flex installAppContainer mt-1">
                                    <a href="#"><img src={googlePlay} alt="app store image" className="" /></a>
                                    <a href="#"><img src={appStore} alt="app store image" className="mx-2"/></a>
                                </div>

                                <br />
    
                                <p>Secure Payment Gateway</p>
                                <div className="d-flex paymentMethodContainer">
                                    <a href="#"><img src={mtnOrange} alt="app store image" className="w-100 h-60"/></a>
                                </div>
                        
                            
                            </div>
                        </div>

                        <hr />

                        <div className="row lastSection">
                            <div className="col-md-3">
                                <p>@ 2024, AgriKonnect All rights reserved</p>
                            </div>

                            <div className="col-md-6">
                                <div className="m-auto d-flex align-items-center">
                                    <div className="phone d-flex align-items-center ml-auto mx-5"> 
                                        <span><PhoneInTalkIcon className="phoneIcon"/></span>
                                        <div className="info ml-3">
                                            <h3 className="mb-0">+231 888 999</h3>
                                            <p className="mt-0 mb-0">WhatsApp Chat</p>
                                        </div>
                                    </div>

                                    <div className="phone d-flex align-items-center ml-auto mx-5"> 
                                        <span><PhoneInTalkIcon className="phoneIcon"/></span>
                                        <div className="info ml-3">
                                            <h3 className="mb-0">+231 888 999</h3>
                                            <p className="mt-0 mb-0">24/7 Support Center</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 part3">
                                <div className="d-flex align-items-center">
                                    <h5>Follow us:</h5>
                                    <ul className="list list-inline">
                                        <li className="list-inline-item">
                                            <a href="#"><FacebookOutlinedIcon /></a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#"><TwitterIcon /></a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#"><InstagramIcon /></a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#"><YouTubeIcon /></a>
                                        </li>
                                    </ul>
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