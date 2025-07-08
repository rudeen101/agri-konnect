import { lazy } from 'react'; 

// src/config/routes.js
const routes = [
    // Regular routes (use MainLayout)
    {
        path: '/',
        component: lazy(() => import('../pages/Dashboard/AdmainDashboard'))
    },
    {
        path: '/products',
        component: lazy(() => import('../pages/Products/ProductList'))
    },
    {
        path: '/product/add',
        component: lazy(() => import('../../src/pages/Products/AddProduct'))
    },
    {
        path: '/product/edit',
        component: lazy(() => import('../../src/pages/Products/EditProduct'))
    },
    {
        path: '/categories',
        component: lazy(() => import('../../src/pages/Categories/Category'))
    },
    {
        path: '/category/edit',
        component: lazy(() => import('../../src/pages/Categories/EditCategory'))
    },
    {
        path: '/category/add',
        component: lazy(() => import('../../src/pages/Categories/AddCategory'))
    },
    {
        path: '/customers',
        component: lazy(() => import('../../src/pages/Customers/Customer'))
    },
    {
        path: '/orders',
        component: lazy(() => import('../pages/OrdersHistory/Orders'))
    },
    {
        path: '/transactions',
        component: lazy(() => import('../../src/pages/Transactions/Transactions'))
    },
    {
        path: '/user/profile/update',
        component: lazy(() => import('../../src/pages/Auth/ProfileUpdate'))
    },
    // Auth routes (use AuthLayout)
    {
        path: '/reset-password/:token',
        component: lazy(() => import('../../src/pages/Auth/ResetPassword')),
        noLayout: true
    },
    {
        path: '/login',
        component: lazy(() => import('../pages/Auth/LoginPage')),
        noLayout: true
    },
    {
        path: '/forgot-password',
        component: lazy(() => import('../../src/pages/Auth/ForgotPassword')),
        noLayout: true
    }
];

export default routes;