const express = require('express');
const productController = require("../controllers/product.controller")
const multer = require("multer")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', authMiddleware.authSeller,
    upload.array("images", 5),
    productController.createProduct)

router.get("/seller",
    authMiddleware.authSeller,
    productController.getSellerProducts
)
router.get("/",
    productController.getAllProducts
)
router.get('/:id',  productController.getProduct)



module.exports = router