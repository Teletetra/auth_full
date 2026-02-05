import mongoose from "mongoose";

const connectDB=async ()=>{
  try {
    const conn=await mongoose.connect(process.env.MONGO_URI)
    console.log(`mongose connect:${mongoose.connection.host}`)
    // console.log(`heel${process.env.MONGO_URI}`)
    return conn
  }
  catch(error){
    console.error(`❌ Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB