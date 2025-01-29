const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');


app.use(cors());
app.options('*', cors());

//middleware
app.use(bodyParser.json())
app.use(express.json());

//Routes
const categoryRoutes = require("./routes/category");
const imageUploadRoutes = require("./routes/imageUpload");
// const imageUploadRoutes = require('./helper/imageUpload.js')
// const prouductWeightRoutes = require('./routes/productWeight.js')
// const prouductSizeRoutes = require('./routes/productSize.js')
const productRoutes = require('./routes/product.js');
const userRoutes = require("./routes/users.js");
const homeSliderBannerRoutes = require("./routes/homeSliderBanner.js");
const cartRoutes = require("./routes/cart.js");
const productReviewsRoutes = require("./routes/productReviews.js");
const bannerRoutes = require("./routes/banner.js");
const wishListRoutes = require("./routes/wishList.js");
const searchRoutes = require("./routes/search.js");
const tagRoutes = require("./routes/tag.js");

app.use("/upoads", express.static("uploads"));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/imageUpload`, imageUploadRoutes);
app.use(`/api/product`, productRoutes);
app.use(`/api/user`, userRoutes);
app.use(`/api/homeSliderBanner`, homeSliderBannerRoutes);
app.use(`/api/cart`, cartRoutes);
app.use(`/api/productReviews`, productReviewsRoutes);
app.use(`/api/banner`, bannerRoutes);
app.use(`/api/wishList`, wishListRoutes);
app.use(`/api/search`, searchRoutes);
app.use(`/api/tag`, tagRoutes);
// app.use(`/api/productWeight`, prouductWeightRoutes);
// app.use(`/api/productSize`, prouductSizeRoutes);

//Database
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('Database connected successfylly');

        //server
        app.listen(process.env.PORT, () => {
            console.log(`server is running http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
