import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmembers.models.js";
import {ApiResponse} from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { createDeflateRaw } from "zlib";


const getProject = asyncHandler(async (req,res) => {
 const project = await ProjectMember.aggregate([
    {
        $match: new mongoose.Types.ObjectId(req.user._id)
    },
    {
        $lookup:{
             from: "projects",
             localField: "projects",
            foreignField: "_id",
            as:    "projects",
            pipeline: [
                {
                    $lookup:{
                        from: "projectmembers",
                        localField: "_id",
                        foreignField: "projects",
                        as: "projectmembers"
                    }
                },
                {
                    $addFields:{
                        members:{
                            $size : "$projectmembers"
                        },
                    },
                },
                
            ],
        },
    },
    {
        $unwind: "$project"
    },
    {
        $project : {
            project:{
                _id:1,
                name: 1, 
                description: 1,
                members: 1,
                createdAt : 1,
                createdBy : 1,
            },
            role: 1,
            _id:0
        },
    }
 ]);

 return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            project,
            "Project fetched sucessfully"
        )
      )

 
})


const getProjectById = asyncHandler(async (req,res) => {
 const {projectId} = req.params
 const project = await Project.findById(projectId)
 if(!project){
    throw new ApiError(404,"Project not found");
 }

return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            project,
            "Project fecthed sucessfully"
        )
      )

})



const createProject = asyncHandler(async (req,res) => {
const{name,description} = req.body

    const Project =  await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
      });

      await ProjectMember.create({
        user : new mongoose.Types.ObjectId(req.user._id),
        project :new mongoose.Types.ObjectId(Project._id),
        role :UserRolesEnum.ADMIN
      })
      return res
      .status(201)
      .json(
        new ApiResponse(
            201,
            project,
            "Project has been created"
        )
      )
})




const updateProject = asyncHandler(async (req,res) => {
const {name,description} = req.body
const {projectId} = req.params 

const project = await Project.findByIdAndUpdate(
    projectId,
    {
        name,
        description
    },
    {new : true}
)

if(!project){
    throw new ApiError (404,"Project not found")
}
return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            project,
            "Project updated succesfully"
        )
      )

})



const deleteProject = asyncHandler(async (req,res) => {
 const {projectId} = req.params
 

 const project = await Project.findByIdAndDelete(projectId)

 if(!project){
    throw new ApiError (404,"Project not found")
}
return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            project,
            "Project deleted sucessfully"
        )
      )

})


const addMemberToProject = asyncHandler(async (req,res) => {
 const {email, role} = req.body
 const {projectId} = req.params
 const user = await User.findOne({email})
 if(!user){
    throw new ApiError(404,"User not found");
 }
 await ProjectMember.findByIdAndUpdate(
    {
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId)
    },{
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId),
        role: role
    },
    {
        new: true,
        upsert: true
    },
 )
 
 return res
      .status(201)
      .json(
        new ApiResponse(
            201,
            project,
            "Project Member added sucessfully"
        )
      )
});


const getProjectMember = asyncHandler(async (req,res) => {
 const {projectId} = req.params
 const project = await Project.findById(req.params);
  if(!project){
    throw new ApiError(404,"project not found");
 }

const ProjectMembers = await ProjectMember.aggregate([
    {
        $match:{
            project: new mongoose.Types.ObjectId(projectId)
        },
    },

    {
        $lookup:{
           from: "users",
           localField: "user",
           foreignField: "_id",
           as: "user",
           pipeline:[
            {
                $project:{
                    _id : 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                }
            }
           ]
        },
    },
{
$addFields:{
    user:{
        $arrayElemAt:["user",0]
    }
},
},
{
$project:{
     project: 1,
     user: 1,
     createdAt:1,
     updatedAt: 1,
     _id: 0
},
},
]);
return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            projectMember,
            "Project Member fetched"
        )
      )
}); 


const updateMemberRole = asyncHandler(async (req,res) => {
 const {projectId, userId} =req.params 
 const {newRole}= req.body
 if(!AvailableUserRole.includes(newRole)){
    throw new ApiError(400,"invalid role");
 
 }

  let projectMember = await ProjectMember.findOne({
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId)
    
  })
  if(!projectMember){
    throw new ApiError(400,"project member not found");
 
 }

 await ProjectMember.findByIdAndUpdate(
    projectMember._id,
    {
        role : newRole,

    },
    {new:true}
 )

 return res
      .status(201)
      .json(
        new ApiResponse(
            201,
            projectMember,
            "Project Member role updated sussesfully"
        )
      )
})



const deleteMember = asyncHandler(async (req,res) => {
 const {projectId, userId} =req.params 

  let projectMember = await ProjectMember.findOne({
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId)
    
  })
  if(!projectMember){
    throw new ApiError(400,"project member not found");
 
 }

 await ProjectMember.findByIdAndDelete(
    projectMember._id
 )

 return res
      .status(201)
      .json(
        new ApiResponse(
            201,
            projectMember,
            "Project Member deleted"
        )
      )
})


export{
    getProject,
    getProjectById,
    getProjectMember,
    deleteMember,
    deleteProject,
    updateMemberRole,
    updateProject,
    createProject,
    addMemberToProject
}