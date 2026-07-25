import { body } from "express-validator";
import {AvaliableUserRoles} from "../utils/constant.js"
const UserRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),

    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Fullname is required"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

const UserLoginValidator = () => {
  return [
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Email is not valid"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

const userchangePasswordValidator = () => {
  return [
    body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required"),

  ];
};
const userForgotPasswordValidator = () => {
  return [
    body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),

  ];
};

const userResetPasswordValidator = () => {
  return [
    body("newPassword")
    .notEmpty()
    .withMessage("New password is required"),

  ];
};
 
const createProjectValidator = () =>{
  return[
    body("name")
    .notEmpty()
      .withMessage("Name is required"),
      body("description")
      .optional()
  ]
}
const addMembertoProjectValidator=() =>{
return[
    body("email")
      .optional()
      .trim()
      .notEmpty
      .withMessage("email is required")
      .isEmail()
      .withMessage("Email is not valid"),
    body("role")
      .notEmpty
      .withMessage("Role is required")
      .isIn(AvaliableUserRoles)
      .withMessage("role is invalide"),

]
}

export { UserRegisterValidator,
   UserLoginValidator,
    userchangePasswordValidator,
    userForgotPasswordValidator ,
     userResetPasswordValidator,
    createProjectValidator,
    addMembertoProjectValidator
   };