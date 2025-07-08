admin-dashboard/
├── public/                   # Static files
│   ├── images/               # Global images
│   ├── favicon.ico           # Favicon
│   └── index.html            # Main HTML file
│
├── src/                      # Application source code
│   ├── assets/               # Static assets
│   │   ├── fonts/            # Font files
│   │   ├── icons/            # SVG icons
│   │   └── scss/             # Global styles
│   │       ├── base/         # Base styles
│   │       ├── components/   # Component styles
│   │       ├── layout/       # Layout styles
│   │       ├── themes/       # Theme files
│   │       ├── utils/        # Mixins, variables
│   │       └── main.scss    # Main SCSS file
│   │
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Common components (buttons, cards, etc.)
│   │   ├── layout/           # Layout components (header, sidebar, footer)
│   │   ├── ui/               # UI elements (modals, tooltips, etc.)
│   │   └── index.js          # Component exports
│   │
│   ├── config/               # Configuration files
│   │   ├── routes.js         # Route configuration
│   │   ├── theme.js          # Theme configuration
│   │   └── settings.js       # App settings
│   │
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.js    # Authentication context
│   │   └── ThemeContext.js   # Theme context
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js        # Auth hook
│   │   └── useTheme.js       # Theme hook
│   │
│   ├── pages/                # Page components
│   │   ├── Dashboard/        # Dashboard page
│   │   ├── Users/            # User management
│   │   │   ├── List/         # User list
│   │   │   ├── Create/       # User creation
│   │   │   └── Edit/         # User editing
│   │   ├── Products/         # Product management
│   │   ├── Settings/         # App settings
│   │   └── Auth/             # Authentication pages
│   │       ├── Login.js      # Login page
│   │       └── ForgotPassword.js
│   │
│   ├── services/             # API services
│   │   ├── auth.js           # Auth API calls
│   │   ├── users.js          # User API calls
│   │   └── api.js            # Base API config
│   │
│   ├── store/                # State management (Redux, Zustand, etc.)
│   │   ├── slices/           # Redux slices
│   │   ├── actions/          # Redux actions
│   │   └── store.js          # Store configuration
│   │
│   ├── utils/                # Utility functions
│   │   ├── helpers.js        # Helper functions
│   │   ├── validators.js     # Form validators
│   │   └── constants.js      # App constants
│   │
│   ├── App.js                # Main App component
│   ├── index.js              # Application entry point
│   └── setupTests.js         # Test setup
│
├── .env                      # Environment variables
├── .env.development          # Dev environment variables
├── .env.production           # Production environment variables
├── package.json              # Project dependencies
└── README.md                 # Project documentation


Backend

admin-dashboard-api/
├── config/
│   ├── database.js           # DB connection configuration
│   ├── passport.js           # Authentication strategies
│   ├── cloudinary.js         # File upload configuration
│   └── environment.js        # Environment variables validation
│
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── user.controller.js    # User management
│   ├── product.controller.js # Product management
│   ├── dashboard.controller.js # Dashboard stats
│   └── settings.controller.js # App settings
│
├── middlewares/
│   ├── auth.middleware.js    # Authentication middleware
│   ├── roles.middleware.js   # Role-based access control
│   ├── error.middleware.js   # Error handling
│   ├── validation.middleware.js # Request validation
│   └── logger.middleware.js  # Request logging
│
├── models/
│   ├── User.model.js         # User schema
│   ├── Product.model.js      # Product schema
│   ├── Order.model.js        # Order schema
│   ├── AuditLog.model.js     # Activity logging
│   └── index.js             # Model exports
│
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   ├── user.routes.js       # User management routes
│   ├── product.routes.js    # Product routes
│   ├── dashboard.routes.js  # Dashboard stats routes
│   └── index.js            # Combined routes
│
├── services/
│   ├── auth.service.js      # Auth business logic
│   ├── user.service.js      # User business logic
│   ├── product.service.js   # Product business logic
│   ├── email.service.js     # Email sending
│   ├── storage.service.js   # File upload service
│   └── analytics.service.js # Dashboard analytics
│
├── utils/
│   ├── apiFeatures.js       # Advanced query features
│   ├── errorResponse.js     # Custom error classes
│   ├── asyncHandler.js      # Async error handling
│   ├── logger.js            # Logging utility
│   ├── permissions.js       # Permission constants
│   └── validators.js        # Schema validators
│
├── public/                  # Static files
│   └── uploads/             # Uploaded files
│
├── scripts/                 # Database scripts/migrations
│   ├── seed.js              # Database seeding
│   └── migrate.js           # Database migrations
│
├── tests/
│   ├── integration/         # API endpoint tests
│   ├── unit/                # Unit tests
│   └── fixtures/            # Test data
│
├── .env                     # Environment variables
├── .eslintrc.js             # ESLint config
├── .prettierrc              # Prettier config
├── app.js                   # Express app setup
├── server.js                # Server entry point
└── package.json             # Dependencies


public/
└── uploads/
    ├── users/               # User-related uploads
    │   ├── avatars/         # Profile pictures
    │   ├── documents/       # User-submitted documents
    │   └── temp/           # Temporary uploads
    │
    ├── products/            # Product-related uploads
    │   ├── main/            # Primary product images
    │   ├── variants/        # Product variant images
    │   ├── galleries/       # Product galleries
    │   └── thumbnails/      # Auto-generated thumbnails
    │
    ├── content/             # CMS content uploads
    │   ├── images/          # Blog/post images
    │   ├── files/           # Downloadable files
    │   └── media/           # Videos/audio
    │
    ├── system/              # System-generated files
    │   ├── exports/         # Data exports
    │   ├── imports/         # Data import templates
    │   └── backups/         # System backups
    │
    └── temp/                # Temporary uploads
        ├── chunked/         # Chunked file uploads
        └── processing/      # Files being processed




# Advanced Query Middleware (`advancedResults`)

## 📖 Overview
A flexible Mongoose query builder middleware that standardizes:
- ✅ Filtering
- 🔍 Searching
- 🔄 Sorting
- 📶 Pagination
- 🎚️ Field selection

## 🚀 Installation
```javascript
import advancedResults from './middleware/advancedResults';
```

## 🛠️ Basic Usage
```javascript
// In your route file
router.get(
  '/products',
  advancedResults(Product, {
    populate: 'category',
    searchableFields: ['name', 'description']
  }),
  (req, res) => {
    res.status(200).json(res.advancedResults);
  }
);
```

## ⚙️ Configuration Options

| Option            | Type          | Default       | Description                          |
|-------------------|---------------|---------------|--------------------------------------|
| `populate`        | String/Array  | `''`          | Related documents to populate        |
| `searchableFields`| Array         | `[]`          | Fields to include in keyword search  |
| `defaultSort`     | String        | `'-createdAt'`| Default sort order                   |
| `baseFilter`      | Object        | `{}`          | Always-applied base filter           |

## 🔍 Query Parameters Cheat Sheet

### 🔹 Basic Filtering
```
GET /products?category=electronics&inStock=true
```
```javascript
// Equivalent query
Product.find({ category: 'electronics', inStock: true })
```

### 🔸 Comparison Operators
| Operator | Example                     | Meaning                  |
|----------|-----------------------------|--------------------------|
| `gt`     | `?price[gt]=100`            | Price > 100              |
| `gte`    | `?price[gte]=100`           | Price ≥ 100              |
| `lt`     | `?price[lt]=1000`           | Price < 1000             |
| `lte`    | `?price[lte]=1000`          | Price ≤ 1000             |
| `in`     | `?category[in]=laptops,phones` | In given categories    |

### 🔎 Keyword Search
```
GET /products?keyword=gaming
```
Searches all configured `searchableFields` with case-insensitive regex.

### � Field Selection
```
GET /products?select=name,price
```
```javascript
// Returns only name and price fields
Product.find().select('name price')
```

### 🔼🔼 Sorting
```
GET /products?sort=-price,createdAt
```
- `-price` = Descending by price
- `createdAt` = Ascending by creation date

### 📖 Pagination
```
GET /products?page=2&limit=10
```
**Response includes:**
```json
{
  "page": 2,
  "limit": 10,
  "total": 150,
  "pages": 15
}
```

## 📋 Response Format
```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10,
  "data": [
    // Your results here
  ]
}
```

## 🚨 Error Handling
Standard error response:
```json
{
  "success": false,
  "error": "Server Error"
}
```

## 💡 Pro Tips
1. Always index frequently queried fields
2. Limit `searchableFields` to text fields only
3. Set sensible `baseFilter` (e.g., `{ status: 'active' }`)
4. Avoid over-populating relationships
5. Set reasonable default pagination limits

## 🏗️ Example Implementation
```javascript
// productsController.js
const getProducts = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// productsRoutes.js
router.get(
  '/',
  advancedResults(Product, {
    populate: {
      path: 'category',
      select: 'name slug'
    },
    searchableFields: ['name', 'description', 'sku'],
    baseFilter: { isActive: true },
    defaultSort: '-createdAt'
  }),
  getProducts
);
```

## 📜 License
MIT
