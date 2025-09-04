const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    currency: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        require: true
    },
    paymentId: {
        type: String
    },
    signature: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'fail'],
        default: 'pending',
    },
})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;