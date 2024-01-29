const express = require('express');
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const router = require("./routes/user")

InitiateMongoServer();
const app = express();

const PORT = 4000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({message: "API working"})
})

app.use("/user", router);

app.listen(PORT, (req, res) => {
    console.log(`Server has started at PORT ${PORT}`)
})