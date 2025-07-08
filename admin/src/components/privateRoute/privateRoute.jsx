// src/components/PrivateRoute.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi } from '../../utils/apiCalls';

const PrivateRoute = ({ children }) => {
 	 const [isAuthenticated, setIsAuthenticated] = useState(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await fetchDataFromApi('/api/auth/me');
				console.log(res);

				if (res.userId) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
				}
			} catch (error) {
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	if (loading) return <p style={{ "backgroundColor": 'blue' }}>Loading...</p>;

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    return children;
};

export default PrivateRoute;
