const express = require('express');
const { createPayment, verifyController } = require('../controllers/payment.controller');
const { authUser } = require('../middlewares/auth.middleware');

const paymentRouter = express.Router();
paymentRouter.use(authUser)
paymentRouter.post('/create/:productId', createPayment)


paymentRouter.post('/verify', verifyController);

module.exports = paymentRouter