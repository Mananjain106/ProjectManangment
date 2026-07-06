import { Router } from "express";
 import { validate } from "../middlewares/validator.midlewares.js";
import { 
    registerUser,
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken, 
    forgotPassword ,
    resetPassword, 
    changeCurrentPassword,
 } from "../controller/auth.controller.js";
import {
    UserRegisterValidator,
     UserLoginValidator,
     userchangePasswordValidator,
     userForgotPasswordValidator,
      userResetPasswordValidator
} from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.midlewares.js";


const router = Router();

// public routes
router.route("/register").post(UserRegisterValidator(),
validate, registerUser);

router.route("/login").post(UserLoginValidator(), validate, login);

router.route("/verify-email/:verificationToken").get(verifyEmail);


router.route("/refresh-token").post(refreshAccessToken);

router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPassword);

router.route("/reset-password/:resetToken").post(userResetPasswordValidator(), validate, resetPassword);



// secure route 

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, userchangePasswordValidator(), validate, changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);


export default router;

