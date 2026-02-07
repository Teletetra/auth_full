import { catchAsync } from "../validators/catchAsync.js";
import crypto from 'crypto'
import UserModel from '../dbmodel/UserModel.js'
import User from "../dbmodel/UserModel.js";
import sanitize from "mongo-sanitize";
import { signupSchema } from "../validators/authValidators.js";
import {sendMail} from "../config/sendMail.js"
import bcrypt from 'bcrypt'
import { generateTokens } from "../config/generateToken.js";
export const signup=catchAsync(async(req,res,next)=>{
  const sanitizebod=sanitize(req.body)
  const validation=signupSchema.safeParse(sanitizebod)
  // parse return exception on failure so used safeParse which {success:false}
  if (!validation.success){
    // return res.status(400).json({
    //   message:"validation error"
    // })
    
    let firstErrorMessage="Validation Failed"
    let allErrors=[]
    const zodError = validation.error;

    if(zodError?.issues && Array.isArray(zodError.issues)){
      allErrors=zodError.issues.map((issue)=>({
        field:issue.path?issue.path.join("."):"unknown",
        message:issue.message|| "validation Error",
        code:issue.code,
      }))
      firstErrorMessage=allErrors[0]?.message||"Validation Error"
    
    }
    return res.status(400).json({
      message:firstErrorMessage,
      error:allErrors,
    })

  }
  const {name,email,password}=validation.data

  const existingUser=await UserModel.findOne({email})
  
  if (existingUser){
    return res.status(409).json({
      message:"user already exist"
    })
  }

  const hashedPassword= await bcrypt.hash(password,12)

  const otp=Math.floor(100000 + Math.random()*900000).toString()

  const otpExpires=Date.now()+15*60*1000

  const user=await User.create({
    name,email,password:hashedPassword,
    isVerified:false,
    VerificationCode:otp,
    resetpasswordtoken: undefined,
    resetpasswordexpire: undefined,
    otpExpires:otpExpires
  })

  await sendMail({
    to:email,
    subject:'Verify your account',
    text:`Your verification code is ${otp}. It expires in 10 minutes.`
  })
  res.status(201).json({
    message:"Signup successful. Please verify your email",
    email:user.email
  })
})


export const verifyEmail=catchAsync(async (req,res,next)=>{
  const {email,otp}=req.body

  const user=await User.findOne({email})

  if (!user){
    return res.status(404).json({message:"User not found"})
  }
  if (user.isVerified){
    return res.status(200).json({
      message:"user is verified already"})}
  if (user.VerificationCode!==otp){
    return res.status(400).json({message:"Invalid OTP code"})
    
  }

  if (user.VerificationCodeExpires < Date.now()) {
  return res.status(400).json({ message: "OTP expired" })}
  user.isVerified=true;
  user.VerificationCode=undefined
  user.VerificationCodeExpires=undefined
  const {accessToken,refreshToken}=generateTokens(user._id)
  res.cookie('refreshToken',refreshToken,{
    httpOnly:true,
    secure:process.env.NODE_ENV='production',
    sameSite:'Strict',
    maxAge:7*24*60*60*1000
  })  
  await user.save()
  
  res.status(200).json({
    message:"Email verified successfully"
  })
})

export const resentOtp=catchAsync(async (req,res,next)=>{
  const {email}=req.body
  const user=await User.findOne({email})
  console.log(`${user}`)
  if (!user){
    return res.status(404).json({message:"User not found"})
  }
  const otp=Math.floor(100000+Math.random()*900000).toString()
  const VerificationCodeExpires=Date.now()+10*60*1000
  
  user.VerificationCode=otp
  user.VerificationCodeExpires=VerificationCodeExpires
  await user.save()

  await sendMail({
    to:email,
    subject:"Your new verification code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`
  })

  res.status(200).json({message:"OTP sent"})
})

export const fuck=()=>{
  return "fucked ho gya bhai"
}