import mongoose, {Schema} from "mongoose";

const substaskSchema = new Schema({
titles:{
type:String,
required:true, 
trim: true,
},
tasks:{
type:Schema.Types.ObjectId,
ref : "Tasks",
required: true,
},
isCompleted:{
type:Boolean,
default:false,

},
createdBy:{
type:Schema.Types.ObjectId,
ref: "User",
required: true,
},


},{timestamps:true})

export const Subtask = mongoose.model("Substask",substaskSchema);