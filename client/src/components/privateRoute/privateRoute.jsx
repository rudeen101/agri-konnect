// src/components/PrivateRoute.jsx
import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { MyContext } from '../../App';


const PrivateRoute = ({ children }) => {
	const userLogin = JSON.parse(localStorage.getItem("isLogin"));
	
	return userLogin ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
