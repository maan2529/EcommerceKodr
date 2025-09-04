const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(" Database connected successfully");
    })
    .catch((err) => {
      console.error(" Database connection failed:", err.message);
    });
}

module.exports = connectDB;
