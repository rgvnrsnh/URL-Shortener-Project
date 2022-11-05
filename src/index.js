const express = require("express");
const { appendFile } = require("fs");
const mongoose = require("mongoose");
const router = require("../routes/routes");
const redis = require("redis");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(router);


mongoose.connect("mongodb://localhost:27017/UrlShortener", {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => {
    console.log("connection established successfully");
}).catch(() => {
    console.log("connection failed");
});



app.get("/", router);

app.listen(port, (req, res) => {
    console.log(`listening at port ${port}`);
})

