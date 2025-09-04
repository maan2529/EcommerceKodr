require("dotenv").config(); // make sure .env variables are loaded
const app = require("./src/app/app");
const connectDB = require("./src/db/db")


connectDB()
app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})