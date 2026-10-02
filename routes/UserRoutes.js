const express = require('express');
const {
      registerUser,
    loginUser
   

} = require("../controllers/userController");
const router = express.Router();
router.post("/login",loginUser);
router.post("/register",registerUser)
module.exports=router;