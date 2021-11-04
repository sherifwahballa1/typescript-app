import { body } from 'express-validator';

export const registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Email is invalid')
    .not()
    .isEmpty()
    .withMessage('Email is required'),
  body('password')
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
    .not()
    .isEmpty()
    .withMessage('Password is required'),
];