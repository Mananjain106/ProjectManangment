import { User } from "../models/user.models.js";
import {ApiResponse} from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail, emailVerificationMail } from "../utils/mail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const GenrateAcessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Internal server error");
  }
};

const registerUser = asyncHandler(async (req, res) => 
    {
const {username, fullname, email, password , role} = req.body;

const existingUser = await User.findOne({
    $or :[{username},{email}]
});
if (existingUser){
    throw new ApiError( 409, "User with this email or username already exists");
}
const user = await User.create({
    email,
    fullname,
    username,
    password,
    role,
    isEmailVerified: false,
})
   const{ unHashedToken, hashedToken, TokenExpiry}   =  user.generateTemporaryToken();

   user.emailVerificationToken = hashedToken;

   user.emailVerificationTokenExpiry = TokenExpiry;

   await user.save({validateBeforeSave:false});

   const verificationLink = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`;
   const mailgencontent = emailVerificationMail(user.username, verificationLink);
   await sendEmail({
    email: user?.email,
    subject: "Email Verification",
    mailgencontent: emailverificationMailgencontent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken }`
    ) ,
   });

const createdUser = await User.findById(user._id).select(
"-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
);

if(!createdUser){
    throw new ApiError(400, "User registration failed");
}


  return res.status(201).json(new ApiResponse(201, "User registered successfully", {user: createdUser}));
})

const login = asyncHandler(async (req, res) => {
const {email , password} = req.body;
if(!email){
    throw new ApiError(400, "Email is required");
}

const user = await User.findOne({
email
});
if(!user){
    throw new ApiError(404, "User not found");
}

const isPasswordCorrect = await user.isPasswordcorrect(password);

if(!isPasswordCorrect){
    throw new ApiError(401, "Invalid credentials");
}
 const {accessToken, refreshToken} = await GenrateAcessAndRefreshToken(user._id);

 const loggedInUser = await User.findById(user._id).select(
"-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
);

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

return res
.status(200)
.cookie("accessToken", accessToken, cookieOptions)
.cookie("refreshToken", refreshToken, cookieOptions)
.json(new ApiResponse
    (200, "User logged in successfully", {user: loggedInUser, accessToken})
);

})

const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
    req.user._id, 
{
    $set:{
        refreshToken:"",
    },
},
    {
        new: true,
    },
   );
   const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
   };

return res  
.status(200)
.clearCookie("accessToken", cookieOptions)
.clearCookie("refreshToken", cookieOptions)
.json(new ApiResponse(200, "User logged out successfully", null))
});


const getCurrentUser = asyncHandler(async (req, res) => {
return res
.status(200)
.json(
    new ApiResponse(200, "Current user fetched successfully", {user: req.user})
 );
})

const verifyEmail = asyncHandler(async (req, res) => {
const {verificationToken} = req.params;
    if(!verificationToken){
        throw new ApiError(400, "Verification token is required");
    }
    let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

   const user = await User.findOneAndUpdate({
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiry: {$gt: Date.now()},
    })
    if(!user){
        throw new ApiError(400, "Invalid or expired verification token");
    }
 user.emailVerificationToken = undefined;
 user.emailVerificationTokenExpiry = undefined;

    user.isEmailVerified = true;
    await user.save({validateBeforeSave: false});
return res
.status(200)
.json(new ApiResponse(
    200, "Email verified successfully", null
));

    
})

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user =   await User.findById(req.user?._id);
  if(!user){
    throw new ApiError(404, "User not found");
  }
  if(user.isEmailVerified){
    throw new ApiError(400, "Email is already verified");
  }
     const{ unHashedToken, hashedToken, TokenExpiry}   =  user.generateTemporaryToken();

   user.emailVerificationToken = hashedToken;

   user.emailVerificationTokenExpiry = TokenExpiry;

   await user.save({validateBeforeSave:false});

   const verificationLink = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`;
   const mailgencontent = emailVerificationMail(user.username, verificationLink);
   await sendEmail({
    email: user?.email,
    subject: "Email Verification",
    mailgencontent: emailverificationMailgencontent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken }`
    ) ,
   });
   return res
   .status(200)
   .json(new ApiResponse(200, "Email verification link sent successfully", null));



})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
if(!incomingRefreshToken){
    throw new ApiError(401, "Refresh token is required");
}
try {
const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

const user = await User.findById(decodedToken?._id)
if (!user){
    throw new ApiError(401, "Invalid refresh token");
}
if(incomingRefreshToken !== user.refreshToken){
    throw new ApiError(401, "Invalid refresh token");
}
const options = {
    httpOnly: true,
    secure: true,
}
const {accessToken, refreshToken: newRefreshToken} = await GenrateAcessAndRefreshToken(user._id);
 user.refreshToken = newRefreshToken;
 await user.save({validateBeforeSave: false});

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", newRefreshToken, options)
.json(new ApiResponse(200, "Access token refreshed successfully", {accessToken}));

}catch (error) {
    throw new ApiError(401, "Invalid refresh token");
}
})

const forgotPassword = asyncHandler(async (req, res) => {
const {email} = req.body;
if(!email){
    throw new ApiError(400, "Email is required");
}
const user =    await User.findOne({email});    
if(!user){
    throw new ApiError(404, "User not found");
}

const { unHashedToken, hashedToken, TokenExpiry } = user.generateTemporaryToken();

user.forgotPasswordToken = hashedToken;
user.forgotPasswordTokenExpiry = TokenExpiry;

await user.save({validateBeforeSave: false});

 await sendEmail({
    email: user?.email,
    subject: "Forgot Password",
    mailgencontent: forgotPasswordMailgencontent(
        user.username,
        `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
    ) ,
});
 return res
 .status(200)
 .json(new ApiResponse(200, "Forgot password link sent successfully", null));
})

const resetPassword = asyncHandler(async (req, res) => { 
    const {resetToken} = req.params;
    const {newPassword} = req.body;
    if(!resetToken){
        throw new ApiError(400, "Reset token is required");
    }
    let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    await User.findOneAndUpdate({
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: {$gt: Date.now()},
    })
    if(!user){
        throw new ApiError(400, "Invalid or expired reset token");
    }

user.forgotPasswordExpiry = undefined;
user.forgotPasswordToken = undefined;
 
user.password = newPassword;
await user.save({validateBeforeSave: false});
return res
.status(200)
.json(new ApiResponse(200, "Password reset successfully", null));

})


const changeCurrentPassword = asyncHandler(async (req, res) => { 
const {currentPassword, newPassword} = req.body;

const user = await User.findById(req.user._id);
if (!user) {
    throw new ApiError(404, "User not found");
}
const isPasswordValid = await user.isPasswordcorrect(currentPassword);
if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
}

user.password = newPassword;
await user.save({ validateBeforeSave: false });
return res
.status(200)
.json(new ApiResponse(200, "Password changed successfully", null));


})



export {
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
} ;