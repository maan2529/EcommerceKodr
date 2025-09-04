const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model")

const productModel = require('../model/product.model')
async function createUser({
    username, email, fullName: { firstName, lastName }, password, role = "user"
}) {

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username }, { email }
        ]
    })

    if (isUserAlreadyExists) {
        throw new Error("user already exists")
    }


    const hash = await bcrypt.hash(password, 10)


    const user = await userModel.create({
        username,
        email,
        fullName: {
            firstName,
            lastName
        },
        password: hash,
        role: role
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    return { user, token }

}

async function registerUser(req, res) {

    const { email, fullName: { firstName, lastName }, username, password } = req.body
    try {

        const { user, token } = await createUser({
            email,
            fullName: {
                firstName,
                lastName
            },
            username,
            password
        })

        res.cookie('token', token)
        res.status(201).json({
            message: "user registered successfully",
            user: {
                username: user.username,
                fullName: user.fullName,
                _id: user._id,
                email: user.email
            }
        })

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

}

async function loginUser(req, res) {
    try {
        const { email, username, password } = req.body;

        // find user by username or email
        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        // compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is invalid" });
        }

        // generate jwt token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
        );

        // set cookie
        res.cookie("token", token);

        return res.status(200).json({
            message: "Login successful",
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

async function registerSeller(req, res) {

    const { username, email, fullName: { firstName, lastName }, password } = req.body
    console.log("Incoming body:", req.body);

    try {

        const { user: seller, token } = await createUser({
            username,
            email,
            fullName: {
                firstName,
                lastName
            },
            password,
            role: "seller"
        })

        res.cookie('token', token)
        res.status(201).json({
            message: "seller registered successfully",
            user: {
                username: seller.username,
                fullName: seller.fullName,
                _id: seller._id,
                email: seller.email
            }
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

}

async function getAllProducts(req, res) {

    const page = req.query.page ? parseInt(req.query.page) : 1;

    const products = await productModel.find()
    // .skip((page - 1) * 5).limit(5)

    res.status(200).json({
        message: "all products here",
        products
    })
}
async function getProduct(req, res) {

    const id = req.params.id;

    const product = await productModel.findOne({ _id: id })

    res.status(200).json({
        message: "all products here",
        product
    })
}

module.exports = {
    registerUser,
    loginUser,
    registerSeller,
    getProduct,
    getAllProducts
}