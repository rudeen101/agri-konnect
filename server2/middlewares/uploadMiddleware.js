import dotenv from "dotenv";
import express from "express";
import multer from 'multer';
import fs from "fs"
import cloudinary from "cloudinary";


var imagesArray = [];


cloudinary.v2.config({ 
    cloud_name: process.env.cloudinary_config_cloud_name,
    api_key: process.env.cloudinary_config_api_key,
    api_secret: process.env.cloudinary_config_api_secret,
    secure: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${uniqueSuffix}_${file.originalname}`);
    }
})

const upload = multer({ storage: storage })

export default upload;
