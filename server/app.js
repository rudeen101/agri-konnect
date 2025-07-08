
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimiter from "./config/rateLimit.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import './config/passport.js';
// import {errorHandler} from './middlewares/error.middleware.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//Routes  
import authRoutes from "./routes/auth.routes.js";
import imageRoutes from "./routes/image.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers for static files
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://*.cloudinary.com"],
      mediaSrc: ["'self'", "https://*.cloudinary.com"]
    }
  }
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175',
  // Add your production domains when ready
];

app.use(cors({
  origin: (origin, callback) => {
    console.log('Incoming Origin:', origin); // Log it for debug

    // Allow requests without origin (e.g., Postman, proxy)
    if (!origin) {
      return callback(null, true);
    }

    // Match origin against the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }

    // Reject if not allowed
    return callback(new Error(`Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}));
app.options('*', cors()); // Enable preflight for all routes

app.use(cookieParser());
app.use(rateLimiter);


app.get('/', (req, res) => {
  res.send('API is running');
});

// Static file serving with cache control
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
//   maxAge: '1y',
//   immutable: true,
//   setHeaders: (res, path) => {
//     if (path.endsWith('.pdf')) {
//       res.set('Content-Disposition', 'inline');
//     }
//   }
// }));

//  Route protection middleware
// app.use('/uploads/private', authenticateUser, (req, res, next) => {
//   // Verify user has access to the requested file
//   if (!checkFileAccess(req.user, req.path)) {
//     return res.status(403).send('Access denied');
//   }
//   next();
// }, express.static(path.join(__dirname, 'private-uploads')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/image', imageRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/order', orderRoutes);



app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Global Error Handler
// app.use(errorHandler);
export default app;