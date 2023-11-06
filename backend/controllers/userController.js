const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
};

const registerUser = asyncHandler( async (req, res) => {
        const { name, email, password } = req.body
        //Validation
        if( !name || !email || !password ) {
            res.status(400)
            throw new Error("Please fill in all required fields")
        }
        if ( password.length < 6 ){
            res.status(400)
            throw new Error("Password must be up to 6 characters")
        }
        // Check if user email already exist
        const userExist = await User.findOne({ email })
        if (userExist) {
            res.status(400)
            throw new Error("Email has already been registered")
        }
	


        // Create New User
        const user = await User.create({ 
            name,
            email,
            password,
        })

        // Generate Token
        const token = generateToken(user._id)

        // Send HTTP-only Cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),  // 1day
            sameSite: "none",
            secure: true,
        })

        if (user) {
            const { _id, name, email, photo, phone, bio } = user
            res.status(201).json({
                _id, name, email, photo, phone, bio, token,
            })
        } else {
            res.status(400)
            throw new Error("Invalid user data")
        }
    }
)

const loginUser = asyncHandler(  async (req, res) => {
    const {email, password } = req.body

    // validate req
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password")
    }

    //check if user exists
    const user = await User.findOne({ email })

    if (!user) {
        res.status(400);
        throw new Error("User not found, please signup")
    }

    // User exist, check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    // Generate Token
    const token = generateToken(user._id)

    // Send HTTP-only Cookie
    if (passwordIsCorrect) {
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),  // 1day
            sameSite: "none",
            secure: true,
        })
    }

    if(user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(200).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio, 
            token,
        })
    } else {
        res.status(400);
        throw new Error("Invalid email or password")
    }

});

const logoutUser = asyncHandler(async (req, res) => {
    // Expire the cookie to logout
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),  // expire now
        sameSite: "none",
        secure: true,
    })
    return res.status(200).json({ message: "Successfully Logout" })
});

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,

        })
    } else {
        res.status(400);
        throw new Error ("User not found.")
    }
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}
