import { User } from '../models/user.models.js';
import ApiError from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import jwt from 'jsonwebtoken';
export const verifyJWT = asyncHandler(async (request, response, next) => {
  const token = request.cookies?.accessToken || request.header
  ("Authorization")?.replace("Bearer ", "");
   if (!token) {
    throw new ApiError(401, "Unauthorized");
   }

   try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
    );
    if (!user) {
      throw new ApiError(401, "invalid token");
    }
    request.user = user;
    next();
   } catch (error) {
    throw new ApiError(401, "invalid token");
   }
})