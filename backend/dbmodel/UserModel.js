import mongoose from "mongoose";

const UserSchema=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  twoFactorEnabled:{
    type:Boolean,
    default:false
  },
  VerificationCode:{
    type:String
  },
  VerificationCodeExpires:Date,
  resetpasswordexpire:Date,
  resetpasswordtoken:String
},{timestamps:true})

const User=mongoose.model('User',UserSchema);

export default User