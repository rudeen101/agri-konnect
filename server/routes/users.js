const User = require('../models/users');
const {ImageUpload} = require('../models/imageUpload');
const { isAuthenticated } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const { verifyToken } = require('../middleware/auth');


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

/**
 * GET /api/user/profile
 * Returns the profile of the currently authenticated user.
 */

router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Exclude the password field from the returned user data.
        const user = await User.findById(req.user.userId).select('-password').lean();
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

//Get the user address
router.get('/address', verifyToken, async (req, res) => {
    try {
        // Exclude the password field from the returned user data.
        const userAddress = await User.findOne({ _id: req.user.id }, "addresses -_id");

    if (!userAddress) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ userAddress });
    } catch (err) {
        console.error("Error fetching address:", err);
        res.status(500).json({ error: 'Failed to fetch address' });
    }
});

/**
 * PUT /api/user/profile
 * Update profile details for the current user.
 */
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { username } = req.body;

        // You can add other fields as needed.
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { username },
            { new: true, runValidators: true}
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'Profile updated successfully', user: updatedUser });

    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

/**
 * PUT /api/user/password
 * Allows the user to update their password.
 * Requires both the current password and the new password.
 */
router.put('/password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new passwords are required' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error("Error updating password:", err);
        res.status(500).json({ error: 'Failed to update password' });
    }
});

/**
 * DELETE /api/user
 * Deletes the current user's account.
 */
router.delete('/', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.userId);
        res.json({ message: 'User account deleted successfully' });
    } catch (err) {
        console.error("Error deleting account:", err);
        res.status(500).json({ error: 'Failed to delete user account' });
    }
});

module.exports = router;






















// router.get('/:id', async (req, res) => {
//     const user = User.find(req.params.id);

//     if (!user) {
//         res.status(500).json({msg: "User not found!"})
//     } else{
//         res.status(200).send({
//             user: user    
//         });
//     }
// });

// router.get('/get/count', async (req, res) => {
//     const userCount = User.countDocuments();

//     if (!userCount) {
//         res.status(500).json({success: false})
//     }
   
//     res.send({
//         userCount: userCount
//     });

// });

// router.post('/upload', upload.array("images"), async (req, res) => {

//     imagesArr = [];

//     try {
        
//         for (let i = 0; i < req?.files?.length; i++) {
//             const options =  {
//                 use_filename: true,
//                 unique_filename: false,
//                 overwrite: false
//             }
        
//             const imagesUpload = await cloudinary.uploader.upload(
//                 req.files[i].path,
//                 options,
//                 function (error, result) {
//                     console.log(result)
//                     imagesArr.push(result.secure_url);
//                     console.log(`uploads/${req.files[i].filename}`)
//                     fs.unlinkSync(`uploads/${req.files[i].filename}`);
//                 }
//             );

//             let imagesUploaded = new ImageUpload({
//                 images: imagesArr
//             });

//             imagesUploaded = await imagesUploaded.save();
//             return res.status(200).json(imagesArr);
//         }
//     } catch (error) {
//         console.log(error);
//     }

// }); 

// router.put('/id', async (req, res) => {
//     const {name, phone, email} = req.body;
//     let newPassword;

//     const userExist = await User.findById(req.params.id);

//     if(req.body.password) {
//         newPassword = bcrypt.hashSync(req.body.password, 10)
//     } else {
//         newPassword = userExist.passwordHash;
//     }

//     const user = await User.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: name,
//             email: email,
//             phone: phone,
//             password: newPassword,
//             images: imagesArr
//         }
//     )

//     if (!user) {
//         return res.status(400).send("This user cannot be updated!");
//     }

//     res.status(200).send(user);
// });

// router.put('/changePassword/:id', async (req, res) => {
//     const {name, phone, email, password, newPassword, images} = req.body;

//     const userExist = await User.findOne({email: email});
//     if(!userExist) {
//         res.status(404).json({error: true, msg: "User not found!"});
//     }

//     const comparePassword = bcrypt.compare(password, userExist.hashedPassword);
//     if(!comparePassword) {
//         res.status(404).json({error: true, msg: "Current password not correct!"});
//     }

//     const user = await User.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: name,
//             email: email,
//             phone: phone,
//             password: newPassword,
//             images: imagesArr
//         },
//         {new: true}
//     )

//     if (!user) {
//         return res.status(400).json({error: true, msg:"This user password cannot be updated!"});
//     }

//     res.status(200).send(user);
// });

// router.delete('/deleteImage', async (req, res) => {
//     const imgUrl = req.query.img;

//     const urlArray = imgUrl.split('/');
//     const image = urlArray[urlArray.length-1];

//     const imageName = image.split(".")[0];

//     const result = await cloudinary.uploader.distory(imageName, (error, result) => {
//         console.log(error)
//     });

//     if (result) {
//         res.status(200).send(result);
//     }
// });

// router.delete('/:id', async (req, res) => {
//     User.findByIdAndDelete(req.params.id).then((user) => {
//         if (user){
//             return res.status(200).json({success: true, msg: "User deleted successfully!"});
//         } else{
//             return res.status(404).json({success: false, msg: "User not found"});
//         }
//     }).catch((error) => {
//         return res.status(500).json({success: false, error: error});
//     });
// });

// router.get('/get/count', async (req, res) => {
//     const userCount = User.countDocuments();

//     if (!userCount) {
//         res.status(500).json({success: false})
//     }
   
//     res.send({
//         userCount: userCount
//     });

// });



// module.exports = router;
