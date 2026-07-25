import mongoose, {Schema} from "mongoose";
import { AvaliableUserRoles , UserRolesEnum } from "../utils/constants.js";


const projectMemberSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    project:{
type: Schema.Types.ObjectId,
ref: "Project",
required: true,
    },
    role:{
        type: String,
        enum: AvaliableUserRoles,
        default: "user",
    },  
},{timestamps: true});

export const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema); 