import { Router } from "express";

import {signup, verifyEmail,resentOtp } from "../controllers/authController.js";

import { Otpratelimiting } from "../validators/rateLimiter.js";
const router=Router()

router.post('/signup/sign',signup)
router.post('/validate/verify-otp',Otpratelimiting,verifyEmail)
router.post('/validate/resend-otp',resentOtp)


export default router