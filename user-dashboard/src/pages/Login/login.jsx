import React, { useState, useContext, useEffect } from "react";

const Login = () => {
    useEffect(() => {
        // Redirect to the client login page
        window.location.href = import.meta.env.VITE_APP_CLIENT_BASE_URL || "http://localhost:5173/login";
    }, []);

    return null; // Prevents the component from rendering anything
};

export default Login;