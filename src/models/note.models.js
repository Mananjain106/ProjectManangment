import mongoose, {Schema, Types} from "mongoose";


const projectNoteSchema = new Schema({
    project:{
        types: Object.Types.ObjectId,
        ref:"Project",
        required:true,
    },
    createdBy:{
         types: Object.Types.ObjectId,
        ref:"User",
        required:true,
    },
    content:{
         types: String,
        required:true,
    },
},{timestamps:true})

export const projectNote = mongoose.model("projectNote",projectNoteSchema);