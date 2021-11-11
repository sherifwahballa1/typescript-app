import { body } from 'express-validator';

export const registerValidators = [
  body('name')
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .isString()
    .trim()
    .matches(/^[a-zA-Z-0-9 ]+$/)
    .withMessage('Name is invalid')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),

  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is invalid'),

  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isString()
    .trim()
    .matches(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .withMessage('Password must be at least a minimum of 8 characters long with 1 small letter, 1 capital letter, 1 number and 1 special character')
    .isLength({ min: 8 })
    .withMessage('Password length must be between more than 7 characters'),

  body('country')
    .not()
    .isEmpty()
    .withMessage('Country is required')
    .isString()
    .trim()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage('Country is invalid')
];

export const otpValidation = [
  body('otp')
    .not()
    .isEmpty()
    .withMessage('OTP is required')
    .isString()
    .trim()
    .matches(/[0-9]{6}/)
    .withMessage('OTP is invalid')
    .isLength({ min: 6, max: 6})
    .withMessage('OTP is invalid'),
]
