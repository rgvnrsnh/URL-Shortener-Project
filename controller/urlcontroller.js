const redis = require("redis");
const util = require("util");
const valid_url = require("valid-url");
const { url } = require("../models/schema");
const shortId = require("shortid");

/*
const client = redis.createClient(
    16422,
    "redis-16422.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
client.auth("imFcMvGFPUO59acsqCrzpJU84MNDbShd", function (err) {
    if (err) throw err;
});

client.on("connect", async function () {
    console.log("Connected to Redis..");
});

SET_ASYNC = util.promisify(client.set).bind(client);
GET_ASYNC = util.promisify(client.get).bind(client);
*/


const validationrequest = function (data) {
    return Object.keys(data).length > 0;
}


const urlvalidation = function (url) {
    return valid_url.isUri(url);
}


const setLongUrl = async function (req, res) {
    try {
        const data = req.body;
        const { longurl } = data;

        if (!validationrequest(data)) {
            return res.status(400).send({
                message: "provide valid request",
                status: false
            });
        }


        if (!urlvalidation(longurl)){
            return res.status(400).send({
                meesage: "provide valid url",
                status: false
            });
        }

        const findurl = await url.findOne({ longUrl: longurl });

        if (findurl) {
            return res.status(400).send({
                status: false,
                message: "url already shortened",
                data: findurl
            });
        }

    
        const fixUrl = "localhost:5000/";
        const urlCode = shortId.generate().toLowerCase();

        const shortUrl = fixUrl + urlCode;

        const saveddata = await url.create({
            longUrl: longurl,
            shortUrl: shortUrl,
            urlCode: urlCode
        });

        return res.status(203).send({
            status: true,
            message: "url shortened successfully",
            url: saveddata.shortUrl
        });
        

    }
    catch (error) {
        res.send(error);    
    }
}



const redirectToLongUrl = async function (req, res) {
    try {
        const { urlcode } = req.params;

        if (!shortId.isValid(urlcode)) {
            return res.status(400).send({
                status: false,
                message: "enter valid urlcode"
            });
        }

        const data = await url.findOne({ urlCode: urlcode });
        
        if (!Object.keys(data).length > 0 ) {
            return res.status(203).send({
                status: false,
                message: "this url doesn't exists"
            });
        }

        const longurl = data.longUrl;
        console.log(longurl);

        res.status(302).redirect(longurl);
    }
    catch (error) {
        console.error(error);  
    }

}


module.exports.setLongUrl = setLongUrl;
module.exports.redirectToLongUrl = redirectToLongUrl;