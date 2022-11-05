const express = require("express");
const controller = require("../controller/urlcontroller");
const { urlmodel } = require("../models/schema");

const router = new express.Router();

router.get("/", (req, res) => {
    res.status(203).send("connection testing successful");
});

router.post("/url/shorten", controller.setLongUrl);

router.get("/:urlcode", controller.redirectToLongUrl);

module.exports = router;