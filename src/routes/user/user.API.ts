import express from 'express';
import { SignUp, SendOtp, VerifyOtp, Profile } from '../../controllers/user';
import { validateRequest } from '../../middlewares/validator/validate-request';
import { registerValidators, otpValidation } from '../../validators/user.validator';
import { isAuthTemp } from '../../middlewares/auth/isAuthTemp';
import { isAuth } from '../../middlewares/auth/isAuth';
import tryCatchWrapper from '../../middlewares/tryCatch/tryCatchWrapper';


const router = express.Router();

router.post('/signup', registerValidators, validateRequest, tryCatchWrapper(SignUp));

router.get("/verification-code.json", isAuthTemp, tryCatchWrapper(SendOtp));

router.post("/verify.json", isAuthTemp, otpValidation, validateRequest, tryCatchWrapper(VerifyOtp));

router.get('/profile', isAuth(['user']), Profile);

export { router as userRoutes };