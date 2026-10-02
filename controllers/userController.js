const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require("../services/userServices");
const registerUser=async(req,res)=>{
   try{
  
  const user =await userService.createUser(req.body);
    delete user.password;
           return res.status(201).json({
            success: true,
            message: "User register successfully",
            data:user
        
        });
   }catch(error){
   
       if (error.name === "ValidationError") {
         
        const firstError = Object.values(error.errors)[0];
        
            return res.status(400).json({
                success: false,
                message: firstError.message
            });
        }
             return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
   }
}
const loginUser=async(req,res)=>{
    try{
        const result = await userService.loginUser(req.body);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: result.token,
            data: result.user
        });
    }catch(error){
        console.log(error.message)
        const status = error.statusCode || 500;
        return res.status(status).json({
            success: false,
            message: status === 500 ? "Internal server error" : error.message
        });
    }
}
module.exports = {
    registerUser,
    loginUser

  
};