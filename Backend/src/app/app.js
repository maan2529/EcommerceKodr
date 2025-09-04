const express = require('express');
const authRoutes = require('../routes/auth.routes')
const cookieParser = require("cookie-parser");
const productRoutes = require('../routes/product.routes')
const cors = require("cors");
const app = express();

// const Payment = require('../models/Payment');
const paymentRouter = require('../routes/payment.route');


// ✅ Basic CORS setup (allow all origins)
app.use(cors({
  origin: "http://localhost:5173", // your React frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true                // allow cookies/headers
}));

app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/payment", paymentRouter)

module.exports = app