import React from 'react';
import { useAuth } from '../context/AuthContext';

export const ShowTo = ({ 
    roles = [], 
    permissions = [], 
    anyPermission = false,
    children 
}) => {
    const { hasPermission, hasAnyPermission, hasRole, hasAnyRole, hasAllPermissions } = useAuth();

    // Check roles
    const roleAllowed = roles.length === 0 || hasAnyRole(...roles);

    // Check permissions
    let permissionAllowed = true;
    if (permissions.length > 0) {
        permissionAllowed = anyPermission
        ? hasAnyPermission(...permissions)
        : hasAllPermissions(...permissions);
    }

    return roleAllowed && permissionAllowed ? children : null;
};

export const HideFrom = ({ 
    roles = [], 
    permissions = [], 
    anyPermission = false,
    children 
}) => {
    const { hasPermission, hasAnyPermission, hasRole, hasAnyRole, hasAllPermissions } = useAuth();

    // Check roles
    const roleHidden = roles.length > 0 && hasAnyRole(...roles);

    // Check permissions
    let permissionHidden = false;
    if (permissions.length > 0) {
        permissionHidden = anyPermission
        ? hasAnyPermission(...permissions)
        : hasAllPermissions(...permissions);
    }

    return !roleHidden && !permissionHidden ? children : null;
};