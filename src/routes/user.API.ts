import express from 'express';
import { SignUp } from '../controllers/user/signup';
import { validateRequest } from '../middlewares/validate-request';
import { registerValidators } from '../validators/user.validator';

const router = express.Router();

router.post('/signup', registerValidators, validateRequest, SignUp);

export { router as userRoutes };