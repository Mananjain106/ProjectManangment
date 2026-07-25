import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { SubtaskTask } from "../models/subtasks.models.js";
import {ApiResponse} from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { createDeflateRaw } from "zlib";



const getTask = asyncHandler(async (req, res)=> {
    const {projectId} = req.params;
  const project =  await Project.findById(projectId)

if(!project){
    throw new ApiError(404,"Project not found");
 }
        await Task.find({
            project: new mongoose.Types.ObjectId(projectId),
        }).populate("assignedTo","avatar username fullname");
          return res
      .status(201)
      .json(
        new ApiResponse(
            201,
            project,
            "task fetched succesfully"
        )
      )


})


const createTask = asyncHandler(async (req, res)=> {
    const{title , description , assginedTo , status} = req.body;
    const {projectId} = req.params;
  const project =  await Project.findById(projectId)

if(!project){
    throw new ApiError(404,"Project not found");
 }
const files = req.files || []
const attachments = files.map((file) =>{
    return{
        url:`${process.env.SERVER_URL}/images/${file.originalname}`,
        MimeType: file.MimeType,
        size: file.size
    }
})

const task = Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assginedTo: assginedTo
    ? new mongoose.Types.ObjectId(assginedTo)
    : undefined,
    status,
    assginedBy : new mongoose.Types.ObjectId(req.user._id),
    attachments
})
  return res
      .status(201)
      .json(
        new ApiResponse(
            201,
            project,
            "task has been created"
        )
      )


});

const getTaskByID = asyncHandler(async (req, res)=> {
    const{taskId} = req.params ;
    const task = await Task.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(taskId),
            }
        },
        {
            $lookup:{
                from:"users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        _id : 1,
                        username : 1,
                        fullName: 1,
                        avatar : 1
                    },
                ],
            },
        },
        {
            $lookup:{
                from:"subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtask",
                pipeline:[
                    {
                        $lookup:{
                from:"users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline:[
                    {
                        $project:{
                            _id: 1,
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                }
            ]
                        }
                    },
                    {
                        $addFields:{
                            createdBy:{
                                $arrayElemAt:["$createdBy",0]
                            }
                        }
                    }
                ]
            },
        },
        {
        $addFields:{
            assginedTo:{
                $arrayElemAt: ["$assignedTo",0]
            }
        }
        },

    ]);
    if(!task || task.length === 0){
    throw new ApiError(200,"task not found");
 }
  return res
      .status(201)
      .json(
        new ApiResponse(
            201,
            project,
            "task has been fetched succesfully"
        )
      )
});

const updateTask = asyncHandler(async (req, res)=> {
    //test
})

const deleteTask = asyncHandler(async (req, res)=> {
    //test
})

const createSubTask = asyncHandler(async (req, res)=> {
    //test
})

const deleteSubTask = asyncHandler(async (req, res)=> {
    //test
})
const updateSubTask = asyncHandler(async (req, res)=> {
    //test
})

export{
    getTask,
    getTaskByID,
    createTask,
    createSubTask,
    updateTask,
    updateSubTask,
    deleteSubTask,
    deleteTask
}