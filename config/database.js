const mongoose=require('mongoose')
  console.log(process.env.MONGO_URI)
const connectDb=async()=>{
  
    try {
       
        await mongoose.connect(process.env.MONGO_URI)
console.log("db connected")
    } catch (error) {
       throw Error (error.message);
 
    }
    }

    module.exports=connectDb