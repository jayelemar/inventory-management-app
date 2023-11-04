const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require('./config/connectDB')
const userRoute = require("./routes/userRoute")
const errorHandler = require("./middleware/errorMiddleware")
const cookieParser = require("cookie-parser")

const app = express();

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/api/users", userRoute)


//Home Page Route
app.get("/", (req, res) => {
    res.send("Home page");
})
app.use(errorHandler);
connectDB();

const PORT  = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
