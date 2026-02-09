import { Router } from "express";

import {signup, verifyEmail,resentOtp } from "../controllers/authController.js";

import { Otpratelimiting } from "../validators/rateLimiter.js";
import { isAuth } from "../controllers/isAuthMid.js";


const router=Router()

router.post('/signup/sign',signup)
router.post('/validate/verify-otp',Otpratelimiting,verifyEmail)
router.post('/validate/resend-otp',resentOtp)

router.get('/refresh',isAuth)

export default router