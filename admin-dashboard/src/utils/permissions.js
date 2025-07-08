const PERMISSIONS = {
  // Buyer permissions
  BUYER: {
    VIEW_PROFILE: 'buyer:view_profile',
    EDIT_PROFILE: 'buyer:edit_profile',
    CREATE_ORDER: 'buyer:create_order',
    VIEW_ORDERS: 'buyer:view_orders',
    CANCEL_ORDER: 'buyer:cancel_order',
    MAKE_PAYMENT: 'buyer:make_payment',
    CREATE_REVIEW: 'buyer:create_review',
    REQUEST_RETURN: 'buyer:request_return'
  },

  // Seller permissions
  SELLER: {
    CREATE_PRODUCT: 'seller:create_product',
    EDIT_PRODUCT: 'seller:edit_product',
    DELETE_PRODUCT: 'seller:delete_product',
    MANAGE_INVENTORY: 'seller:manage_inventory',
    VIEW_SALES: 'seller:view_sales',
    UPDATE_ORDER_STATUS: 'seller:update_order_status',
    MANAGE_SHIPPING: 'seller:manage_shipping',
    VIEW_ANALYTICS: 'seller:view_analytics'
  },

  // Agent permissions
  AGENT: {
    PROCESS_ORDERS: 'agent:process_orders',
    VIEW_CUSTOMERS: 'agent:view_customers',
    UPDATE_ANY_ORDER: 'agent:update_any_order',
    MEDIATE_DISPUTES: 'agent:mediate_disputes',
    VIEW_COMMISSIONS: 'agent:view_commissions',
    APPROVE_RETURNS: 'agent:approve_returns',
    ISSUE_REFUNDS: 'agent:issue_refunds'
  },

  // Admin permissions
  ADMIN: {
    MANAGE_USERS: 'admin:manage_users',
    MANAGE_PRODUCTS: 'admin:manage_products',
    MANAGE_ORDERS: 'admin:manage_orders',
    MANAGE_CATEGORIES: 'admin:manage_categories',
    MANAGE_PROMOTIONS: 'admin:manage_promotions',
    VIEW_REPORTS: 'admin:view_reports',
    VIEW_SETTINGS: 'admin:view_settings',
    MANAGE_TAXES: 'admin:manage_taxes',
    MANAGE_SHIPPING: 'admin:manage_shipping'
  },

  // System permissions
  SYSTEM: {
    CONFIGURE_SYSTEM: 'system:configure',
    MANAGE_ROLES: 'system:manage_roles',
    MANAGE_PERMISSIONS: 'system:manage_permissions',
    ACCESS_DATABASE: 'system:access_database',
    VIEW_AUDIT_LOGS: 'system:view_audit_logs',
    MANAGE_PAYMENT_GATEWAYS: 'system:manage_payment_gateways',
    MANAGE_EMAIL_TEMPLATES: 'system:manage_email_templates'
  }
};

// Role definitions with permissions
const ROLES = {
  SUPER_ADMIN: {
    name: 'super_admin',
    description: 'Full system access',
    permissions: Object.values(PERMISSIONS).flatMap(group => Object.values(group))
  },
  ADMIN: {
    name: 'admin',
    description: 'Platform administrator',
    permissions: [
      ...Object.values(PERMISSIONS.BUYER),
      ...Object.values(PERMISSIONS.ADMIN)
    ]
  },
  AGENT: {
    name: 'agent',
    description: 'Sales and support agent',
    permissions: [
      ...Object.values(PERMISSIONS.BUYER),
      ...Object.values(PERMISSIONS.AGENT)
    ]
  },
  SELLER: {
    name: 'seller',
    description: 'Vendor/seller account',
    permissions: [
      ...Object.values(PERMISSIONS.BUYER),
      ...Object.values(PERMISSIONS.SELLER)
    ]
  },
  BUYER: {
    name: 'buyer',
    description: 'Standard customer account',
    permissions: Object.values(PERMISSIONS.BUYER)
  }
};

// Get permissions for a role
const getRolePermissions = (roleName) => {
  const roleKey = Object.keys(ROLES).find(key => 
    ROLES[key].name === roleName
  );
  return roleKey ? ROLES[roleKey].permissions : [];
};

// Permission check utilities
const hasPermission = (user, requiredPermission) => {
  if (!user || !user.roles) return false;
  
  // Super admin has all permissions
  if (user.roles.includes('super_admin')) return true;
  
  // Check direct permissions first
  if (user.permissions && user.permissions.includes(requiredPermission)) {
    return true;
  }
  
  // Check role-based permissions
  return user.roles.some(role => 
    getRolePermissions(role).includes(requiredPermission)
  );
};

const hasAnyPermission = (user, ...permissions) => {
  return permissions.some(perm => hasPermission(user, perm));
};

const hasAllPermissions = (user, ...permissions) => {
  return permissions.every(perm => hasPermission(user, perm));
};

export {
  PERMISSIONS,
  ROLES,
  getRolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
};