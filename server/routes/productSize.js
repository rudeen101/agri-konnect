const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("testing size route");
});

module.exports = router;