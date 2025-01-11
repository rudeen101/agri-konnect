import React from "react";
import banner from "../../assets/images/Organic-fruits.png";
import "./banner.css"
import { Button } from "@mui/material";


const Banner = () =>{
    return(
        <div className="bannerSection">
            <div className="container-fluid">
                <div className="row bannerRow">
                    <div className="col">
                        <div className="row banner" style={{background: "#eee6d1"}}>
                            <div className="col-sm-6">
                                <div className="textContainer">
                                    <h5>The best Organic Products Online</h5>
                                    <Button className="btn-g mt-3">Shop Now</Button>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div className="ImageContainer">
                                    <img src={banner} className="transition w-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                    <div className="row banner" style={{background: "#f2e6e4"}}> 
                        <div className="col-sm-6">
                                <div className="textContainer">
                                    <h5>The best Organic Products Online</h5>
                                    <Button className="btn-g mt-3">Shop Now</Button>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div className="ImageContainer">
                                    <img src={banner} className="transition w-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row banner" style={{background: "#e5e9ef"}}>
                            <div className="col-sm-6">
                                <div className="textContainer">
                                    <h5>The best Organic Products Online</h5>
                                    <Button className="btn-g mt-3">Shop Now</Button>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div className="ImageContainer">
                                    <img src={banner} className="transition w-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner