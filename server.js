const express=require('express')
const dotenv=require('dotenv')
dotenv.config()
const payment=require('./routes/payment')
const userRoutes = require("./routes/UserRoutes");
const connectDB = require("./config/database");
const PORT=process.env.PORT
const app=express()
const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        return;
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
app.use(express.urlencoded())
app.use(express.json())
app.use('/payment',payment)

