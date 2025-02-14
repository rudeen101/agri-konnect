// src/components/PrivateRoute.jsx
import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { MyContext } from '../../App';


const PrivateRoute = ({ children }) => {
    const context = useContext(MyContext)

  return context.isLogin ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
