import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchDataFromApi } from '../../utils/apiCalls';

const ProtectedRoute = ({ 
  roles = [], 
  permissions = [], 
  anyPermission = false,
  redirectTo = '/login' 
}) => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null
  });

  const {setUser } = useAuth()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const user = await fetchDataFromApi("/api/v1/auth/verification");
        setAuthState({ user, loading: false, error: null });
		    setUser(user)
      } catch (error) {
        console.error("Auth verification failed:", error);
        setAuthState({ user: null, loading: false, error });
      }
    };

    verifyAuth();
  }, []);

  const { hasAnyRole, hasAnyPermission, hasAllPermissions } = useAuth();

  // Show loading state
  if (authState.loading) {
    return <div>Loading authentication...</div>;
  }

  // Redirect if no user
  if (!authState.user) {
    return <Navigate to={redirectTo} replace />;
  }

  // console.log(hasAnyRole(roles))
  // if (roles.length > 0 && !hasAnyRole(roles)) {
	// 	alert()

  //   return <Navigate to="/unauthorized" replace />;
  // }

  // Check permissions
  // if (permissions.length > 0) {
  //   const hasRequired = anyPermission
  //     ? hasAnyPermission(permissions)
  //     : hasAllPermissions(permissions);
    
  //   if (!hasRequired) return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;