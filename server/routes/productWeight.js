const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.status(404).json({msg: "No data found!"})
    console.log("testing weight route");
});

module.exports = router;