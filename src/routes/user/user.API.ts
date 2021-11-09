import express from 'express';
import { SignUp } from '../../controllers/user/signup';
import { Profile } from '../../controllers/user/profile';
import { validateRequest } from '../../middlewares/validate-request';
import { registerValidators } from '../../validators/user.validator';
import { isAuthTemp } from '../../middlewares/auth/isAuthTemp';
import tryCatchWrapper from '../../middlewares/tryCatch/tryCatchWrapper';

const router = express.Router();

router.post('/signup', registerValidators, validateRequest, tryCatchWrapper(SignUp));

router.get('/profile', isAuthTemp, Profile);

export { router as userRoutes };