import {body, validationResult} from "express-validator";




export const validateRequest = (req, res, next) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json({
         errors: errors.array(),
      });
   }

   next();
};


export const validateRegisterUser = [
  body("email")
   .isEmail().withMessage("Please enter a valid email address"),
  body("contact")
   .notEmpty().withMessage("contact is required")
   .matches(/^\d{10}$/).withMessage("Please enter a valid contact number"),
  body("password")
   .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("fullname")
   .isLength({ min: 3 }).withMessage("Fullname must be at least 3 characters long"),
   body("isSeller")
   .isBoolean().withMessage("isSeller must be a boolean value"),

  validateRequest
]


export const  validateLoginUser = [
  body("email")
   .isEmail().withMessage("invalid email address"),
  body("password")
   .notEmpty().withMessage("Password is required"),
  validateRequest
]