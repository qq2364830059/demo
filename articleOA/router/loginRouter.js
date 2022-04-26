const express = require("express");

const router = express.Router();

router.post("/reguser", (req, res) => {
    let reqData = req.body;
    console.log(reqData)
});



module.exports = router;