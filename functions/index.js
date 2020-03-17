const functions = require("firebase-functions");
const express = require("express");
const requestIp = require("request-ip");

const app = express();

app.use(requestIp.mw());

app.get("/api/message", (req, res) => {
    res.send({ message: "Hello world!" });
});

app.get("/api/getIp", (req, res) => {
    var ip = req.clientIp;
    res.send({ message: ip });
});

exports.app = functions.https.onRequest(app);
