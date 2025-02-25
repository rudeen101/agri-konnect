// src/components/PrivateRoute.jsx
import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { MyContext } from '../../App';

const PrivateRoute = ({ children }) => {
	const isLogin = JSON.parse(localStorage.getItem("isLogin"));
	console.log(isLogin)

	return isLogin ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
