
const uploadFile = require("../services/storage.services");
const productModel = require("../model/product.model");

async function createProduct(req, res) {
    const price = req.body.price ? JSON.parse(req.body.price) : null;
    console.log(req.body);


    const seller = req.seller
    const { title, description, stock } = req.body;

    const files = await Promise.all(req.files.map(async (file) => {
        return await uploadFile(file.buffer)
    }))

    const product = await productModel.create({
        title: title,
        description: description,
        price: {
            amount: price?.amount,
            currency: price?.currency || "INR"
        },
        images: files.map(i => i.url),
        seller: seller._id,
        stock: parseInt(stock) || 0
    })

    res.status(201).json({
        message: "product created successfully",
        product
    })
}

async function getSellerProducts(req, res) {

    const seller = req.seller;

    const products = await productModel.find({
        seller: seller._id
    })

    res.status(200).json({
        message: "seller products fetched successfully",
        products
    })


}

async function getAllProducts(req, res) {

    const page = req.query.page ? parseInt(req.query.page) : 1;

    const products = await productModel.find().skip((page - 1) * 5).limit(5)

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
    createProduct,
    getSellerProducts,
    getAllProducts,
    getProduct
}