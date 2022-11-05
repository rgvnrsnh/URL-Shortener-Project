const mongoose = require("mongoose");
const validurl = require("valid-url");

const urlschema = new mongoose.Schema(
    {
        urlCode: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        longUrl: {
            type: String,
            required: true,
            validate(url) {
                if (!validurl.isHttpsUri(url)) {
                    throw new eror("invalid url entered");
                }
            }
        },
        shortUrl: {
            type: String,
            required: true,
            unique: true
        },
    });


const url = new mongoose.model("URL", urlschema);

module.exports = { url };