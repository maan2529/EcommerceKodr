const Payment = require("../model/payment.model.js");
const productModel = require('../model/product.model.js')
const razorpay = require('../config/razorpay.config.js')
const createPayment = async (req, res) => {

    const { productId } = req.params
    try {

        const product = await productModel.findById(productId)
        console.log({ product })
        const order = await razorpay.orders.create({
            amount: product.price.amount * 100 || 0,
            currency: product.price.currency || 'INR'
        });
        

        const newPayment = await Payment.create({
            orderId: order.id,
            amount: order.amount * 100,
            currency: order.currency || 'INR',
            product: product._id,
            user: req.user._id,
            status: 'pending',
        });
       
        res.status(201).json({
            message: "create payment successfully",
            success: true,
            payment: newPayment
        })

    } catch (error) {
        res.status(500).send('Error creating order');
    }
};

const verifyController = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET

    try {
        const { validatePaymentVerification } = require('../../node_modules/razorpay/dist/utils/razorpay-utils.js')

        const result = validatePaymentVerification({ "order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
        console.log("result", result)

        if (result) {
            await Payment.findOneAndUpdate(
                { orderId: razorpayOrderId },   // filter
                {
                    $set: {
                        paymentId: razorpayPaymentId,
                        signature: signature,
                        status: "completed",
                    },
                },
                { new: true } // updated document return karega
            );

            res.json({ status: 'success' });
        } else {
            res.status(400).send('Invalid signature');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error verifying payment');
    }
}

module.exports = { createPayment, verifyController }