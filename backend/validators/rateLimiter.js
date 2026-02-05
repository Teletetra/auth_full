import rateLimit from 'express-rate-limit'

export const Otpratelimiting=rateLimit({
  windowMs:10*60*1000,
  max:5,
  standardHeaders:true,
  legacyHeaders:false,
  message:{
    status:'error',
    message:'Too many otp verification attempts.'
  }
})