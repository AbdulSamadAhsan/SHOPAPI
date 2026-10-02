const mongoose=require('mongoose')

const connectDb=async()=>{
  
    try {
       
        await mongoose.connect(process.env.MONGO_URI)

    } catch (error) {
       throw Error (error.message);
 
    }
    }

    module.exports=connectDb