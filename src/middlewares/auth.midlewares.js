import { User } from '../models/user.models.js';
import { ProjectMember } from '../models/projectmembers.models.js';
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
export const validateProjectPermission = (roles =[]) =>{
  asyncHandler(async(req, res, next)=>{
  const {projectId} =  req.params;
   if(!projectId){
    throw new ApiError(400,"projectId not found");
 }
const project = await ProjectMember.findOne({
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId)
    
 })
  if(!project){
    throw new ApiError(404,"project not found");
 }
  const givenRole = project?.role
req.user.role = givenRole 
if(!roles.includes(givenRole)){
    throw new ApiError(400,"You dont have permission to perform task");
 
 }
next()
  });
};