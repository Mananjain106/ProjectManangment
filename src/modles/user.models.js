import mongoose,{schema} from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new schema(
    {
        avatar:{
            type:String,
            localPath:String
        },
        default :{
          url:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png",
            localPath:""
        },
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            indexing:true

        },
        email:{
               type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,

        },
        fullname:{
            type:String,
            required:true,
            trim:true,
        },
        password:{
            type:String,
           required:   [true,"Password is required"],
        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String,
        },
        forgotPasswordToken:{
            type:String,
        },
        forgotPasswordTokenExpiry:{
            type:Date,
        },
        emailVerificationToken:{
            type:String,
        },
        emailVerificationTokenExpiry:{
            type:Date,
        },
    },
    {
        timestamps:true,
    }
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10) 
    next();
})

userSchema.methods.isPasswordcorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}

export default mongoose.model("User", userSchema)