const jwt = require("jsonwebtoken")
const userModel = require("../model/user.model")

const authSeller = async (req, res, next) => {

    const token = req.cookies.token
    console.log(token);


    if (!token) {
        return res.status(401).json({
            message: "unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);


        const user = await userModel.findOne({
            _id: decoded.id
        })

        console.log(user);


        if (user.role !== "seller") {
            return res.status(403).json({
                message: "you are not authorized to create product"
            })
        }
        req.seller = user
        next();
    } catch (err) {
        res.status(401).json({
            message: "unauthorized hemant"
        })
    }
}

const authUser = async (req, res, next) => {

    const token = req.cookies.token
    // console.log(token);


    if (!token) {
        return res.status(401).json({
            message: "unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded);


        const user = await userModel.findOne({
            _id: decoded.id
        })

        // console.log(user);


        if (!user) {
            res.status(403).json({
                message: "you are not authorized to create product"
            })
            return
        }
        req.user = user
        next();
    } catch (err) {
        res.status(401).json({
            message: "unauthorized hemant"
        })
    }
}

module.exports = { authSeller, authUser }