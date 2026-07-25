import mongoose, {Schema} from "mongoose";
import { UserStatusEnum , AvaliableUserStatus } from "../utils/constants.js";


const taskSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description : string,
    project:{
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    assignedTo:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    assignedBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    status:{
        type: String,
        enum: AvaliableUserStatus,
        default: UserStatusEnum.ACTIVE,
    },
    attachments: {
        type: [{
            url:string,
            mimeType:string,
            size: Number
        }],
        default:[]
    },
},{timestamps: true});

export const Task = mongoose.model("Task", taskSchema);
