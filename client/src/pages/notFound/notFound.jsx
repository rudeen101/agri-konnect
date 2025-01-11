import React from "react";
import "./notFound.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";


const NotFound = () => {
    return (
        <section>
            <div className="container-fluid notFound" >
                <div className="box">
                    <img src="" alt="" />
                    <br /><br />

                    <h1 className="code">404</h1>
                    <h1>Page Not Found</h1>
                    <p>
                        The link you clicked may broken oo the page may have been removed.
                        Visit the Homepae of Contact us about the problem
                    </p>
                    <br />
                    
                    <div className="d-flex justify-content-center">
                        <Link to={"/"}>
                            <Button className="btn-g btn-lg m-auto"> Back to Home Page</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NotFound;