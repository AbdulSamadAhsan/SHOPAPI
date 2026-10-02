const getJwtSecret = require("../config/jwtSecret");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createUser=async(data={})=>{
    
const hashedPassword = await bcrypt.hash(
    data.password,
    12
);

 const user = new User({
        name: data.name.trim(),
        email: data.email,
        password:hashedPassword,
    
    });
  
   await user.validate();
    const existingProduct = await User.findOne({
        name: data.name.trim()
    });
    if (existingProduct) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }
  return user.save();


};
const loginUser = async (data = {}) => {
    if (!data || typeof data.email !== "string" || !data.email.trim() ||
        typeof data.password !== "string" || !data.password.trim()) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({ email: data.email.trim().toLowerCase() })
        .select("+password");
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

  const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is required");
    }



    
    // Use an explicit public profile so password hashes never reach the response.
    return {
        token,
        user: { _id: user.id, name: user.name, email: user.email, role: user.role }
    };
};

module.exports = {
    createUser,
    loginUser
};