import jwt from "jsonwebtoken"

import User from "../models/User.js"

import { catchAsync } from "../validators/catchAsync.js"

export const isAuth=catchAsync(async(req,res,next)=>{
  const cookies=req.cookies

  if (!cookies?.jwt){
    return res.status(401).json({
      message:'Unauthorized: No Refresh Token'
    })
  }

  const refreshToken=cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err,decoded)=>{
      if (err) return res.status(403).json({message:"Forbidden:Invalid refresh token"})
      
      const foundUser=await User.findById(decoded.id).exec()

      if(!foundUser) return res.status(401).json({message:'Unauthorized:User not found'})

      const accessToken=jwt.sign({
        'UserInfo':{
          "id":foundUser._id,
        "roles":foundUser.role  
            }
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn:'15m'}
    )
    res.json({accessToken})
    }
  )

})
