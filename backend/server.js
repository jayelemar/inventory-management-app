const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require('./config/connectDB')

const app = express();
connectDB();
const PORT  = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log(`Serveer is running on port ${PORT}`);
})


