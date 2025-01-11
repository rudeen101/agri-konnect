const User = require('../models/users');
const {ImageUpload} = require('../models/imageUpload');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require("fs");

var imagesArr = [];

const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
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


router.post('/upload', upload.array("images"), async (req, res) => {

    var imagesArr = [];

    try {
        
        for (let i = 0; i < req?.files?.length; i++) {
            const options =  {
                use_filename: true,
                unique_filename: false,
                overwrite: false
            }
        
            const imagesUpload = await cloudinary.uploader.upload(
                req.files[i].path,
                options,
                function (error, result) {
                    console.log(result)
                    imagesArr.push(result.secure_url);
                    console.log(`uploads/${req.files[i].filename}`)
                    fs.unlinkSync(`uploads/${req.files[i].filename}`);
                }
            );

            let imagesUploaded = new ImageUpload({
                images: imagesArr
            });

            imagesUploaded = await imagesUploaded.save();
            return res.status(200).json(imagesArr);
        }
    } catch (error) {
        console.log(error);
    }

}); 

router.post('/signup', async (req, res) => {
    const {name, email, phone, password, isAdmin} = req.body;
    console.log(req.body);

    try{
        const existingUserByEmail = await User.findOne({"email": email});
        const existingUserByPhone = await User.findOne({"phone": phone});

        if (existingUserByEmail || existingUserByPhone) {
            res.status(400).json({error: true, msg: "user already exist!"});
        }
        else {
            const hashPassword = await bcrypt.hash(password, 20);
            const result = await User.create({
                name: name,
                email: email,
                phone: phone,
                password: hashPassword,
                isAdmin:  isAdmin
            });

            const token = jwt.sign({
                email: result.email,
                id: result.id
            }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            res.status(200).json({
                user: result,
                token: token
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "ture", msg: "Something went wrong"});
    }
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    try{
        const existingUser = await User.findOne({"email": email});
 
        if (!existingUser) {
            res.status(404).json({error: true, msg: "user not found"});
        } else{
            const matchPassword = await bcrypt.compare(password, existingUser.password);

            if (!matchPassword) {
                return res.status(400).json({error: true, msg: "password wrong"});
            }
    
            const token = jwt.sign({
                email: existingUser.email,
                id: existingUser.id
            }, process.env.JSON_WEB_TOKEN_SECRET_KEY); 
    
            return res.status(200).send({
                user: existingUser,
                token: token,
                msg: "user login successfully!"
            });
        }



        // else {
        //     const hashPassword = await bcrypt.hash(password, 20);
        //     const result = await User.create({
        //         name: name,
        //         email: email,
        //         password: hashPassword,
        //         isAdmin: isAdmin
        //     });

            // const token = jwt.sign({
            //     email: result.email,
            //     id: result.id
            // }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            // res.status(200).json({
            //     user: result,
            //     token: token
            // })
        // }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "ture", msg: "Something went wrong"});
    }
});


module.exports = router;
